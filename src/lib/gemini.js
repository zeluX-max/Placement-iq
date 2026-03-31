import Groq from "groq-sdk";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { parseProfileFromPDF as parseProfileFromPDFLegacy } from "../../gemini_old.js";

let groqClient;

function getGroqClient() {
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return groqClient;
}

async function generateWithGroq(prompt) {
  const response = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4000,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  return response.choices[0].message.content;
}

export function safeParseJSON(text) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      console.error("No JSON object found.");
      return null;
    }

    return JSON.parse(text.slice(start, end + 1));
  } catch (err) {
    console.error("JSON parse failed:", err);
    return null;
  }
}

async function extractTextFromPDF(base64PDF) {
  const buffer = Buffer.from(base64PDF, "base64");
  const uint8 = new Uint8Array(buffer);
  const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;
  const allLines = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent({ normalizeWhitespace: true });
    const pageWidth = page.getViewport({ scale: 1 }).width;
    const items = content.items.filter((item) => item.str && item.str.trim());
    const lineMap = new Map();

    for (const item of items) {
      const y = Math.round(item.transform[5] / 3) * 3;
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y).push({ str: item.str, x: item.transform[4] });
    }

    const sortedYs = [...lineMap.keys()].sort((a, b) => b - a);
    const pageLines = [];

    if (detectTwoColumn(items, pageWidth)) {
      const midX = pageWidth * 0.48;
      const leftColumn = [];
      const rightColumn = [];

      for (const y of sortedYs) {
        const row = lineMap.get(y).sort((a, b) => a.x - b.x);
        const left = row.filter((item) => item.x < midX);
        const right = row.filter((item) => item.x >= midX);

        if (left.length) leftColumn.push(left.map((item) => item.str).join(" "));
        if (right.length)
          rightColumn.push(right.map((item) => item.str).join(" "));
      }

      pageLines.push(...leftColumn, ...rightColumn);
    } else {
      for (const y of sortedYs) {
        const row = lineMap.get(y).sort((a, b) => a.x - b.x);
        pageLines.push(row.map((item) => item.str).join(" "));
      }
    }

    allLines.push(...pageLines, "");
  }

  return allLines.join("\n");
}

function detectTwoColumn(items, pageWidth) {
  const midLeft = pageWidth * 0.35;
  const midRight = pageWidth * 0.65;
  const middleItems = items.filter(
    (item) => item.transform[4] >= midLeft && item.transform[4] <= midRight,
  );

  return middleItems.length < items.length * 0.1;
}

function normalize(text) {
  return text
    .replace(/\(cid:\d+\)/g, "• ")
    .replace(/\b([A-Z])\s(?=[A-Z]\b)/g, "$1")
    .replace(/[─━═■◆◇►▶]+/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^([A-Z][A-Z &/]{3,})\s*$/gm, (match) => match.trim().toLowerCase())
    .trim();
}

const ALL_SECTION_HEADINGS = [
  "education",
  "educational background",
  "academic background",
  "qualifications",
  "technical skills",
  "skills",
  "technologies",
  "tech stack",
  "core competencies",
  "areas of expertise",
  "key skills",
  "programming languages",
  "experience",
  "work experience",
  "internships",
  "internship",
  "professional experience",
  "industry experience",
  "projects",
  "academic projects",
  "personal projects",
  "key projects",
  "notable projects",
  "project experience",
  "certifications",
  "certificates",
  "courses",
  "online courses",
  "achievements",
  "awards & certifications",
  "awards",
  "positions of responsibility",
  "extracurricular",
  "activities",
  "publications",
  "research",
  "objective",
  "summary",
  "profile",
  "about",
];

function buildSectionBoundary() {
  const escaped = ALL_SECTION_HEADINGS.map((heading) =>
    heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  ).join("|");

  return new RegExp(`(?=\\n(?:${escaped})\\s*(?:\\n|:))`, "i");
}

const SECTION_BOUNDARY = buildSectionBoundary();

function extractSection(text, variants) {
  const pattern = variants
    .map((heading) => heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const regex = new RegExp(`(?:^|\\n)((?:${pattern})\\s*(?::|\\n))`, "i");
  let match = regex.exec(text);

  if (!match) {
    for (const variant of variants) {
      const fuzzy = variant
        .split("")
        .map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("[^a-z]?");
      const fuzzyRegex = new RegExp(`(?:^|\\n)(${fuzzy}\\s*(?::|\\n))`, "i");
      match = fuzzyRegex.exec(text);
      if (match) break;
    }
  }

  if (!match) return "";

  const rest = text.slice(match.index + match[0].length);
  const endMatch = SECTION_BOUNDARY.exec(rest);
  return (endMatch ? rest.slice(0, endMatch.index) : rest).trim();
}

function extractCGPA(text) {
  const patterns = [
    /(?:cgpa|c\.g\.p\.a|gpa|g\.p\.a)[^\d]*(\d+\.\d+)/gi,
    /(\d+\.\d+)\s*\/\s*(?:10|4(?:\.0)?)\s*(?:cgpa|gpa)?/gi,
    /(?:score|marks)[^\d]*(\d+\.\d+)\s*\/\s*10/gi,
    /(\d+\.\d+)\s*(?:\/\s*(?:10|4(?:\.0)?))?(?=\s*[|\t]|\s*$)/gm,
  ];
  const found = [];

  for (const pattern of patterns) {
    let hit;
    while ((hit = pattern.exec(text)) !== null) {
      const value = parseFloat(hit[1]);
      if (value > 0 && value <= 10) found.push(value);
    }
  }

  return found.length ? Math.max(...found) : null;
}

const CURRENT_YEAR = new Date().getFullYear();

function extractYearOfStudy(text) {
  const explicitPatterns = [
    /\b(1st|2nd|3rd|4th|fifth|first|second|third|fourth)\s+year\b/i,
    /year\s*[:\-]?\s*(1st|2nd|3rd|4th|I{1,4}|[1-4])/i,
    /\b(fresher|freshman|sophomore|junior|senior)\b/i,
  ];

  for (const pattern of explicitPatterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }

  const ranges = [...text.matchAll(/\b(20\d{2})\s*[-–—]\s*(20\d{2})\b/g)];
  for (const match of ranges) {
    const start = parseInt(match[1], 10);
    const end = parseInt(match[2], 10);

    if (start <= CURRENT_YEAR && end >= CURRENT_YEAR) {
      const number = CURRENT_YEAR - start + 1;
      return ["", "1st", "2nd", "3rd", "4th", "5th"][number] || `${number}th`;
    }
  }

  const batchMatch = text.match(/(?:batch|graduating|passout)[^\d]*(20\d{2})/i);
  if (batchMatch) {
    const graduationYear = parseInt(batchMatch[1], 10);
    const yearsLeft = graduationYear - CURRENT_YEAR;

    if (yearsLeft >= 0 && yearsLeft <= 4) {
      const number = Math.max(1, 4 - yearsLeft);
      return ["", "1st", "2nd", "3rd", "4th"][number] || `${number}th`;
    }
  }

  return "";
}

const SKILL_DEFINITIONS = [
  { name: "javascript", pattern: /\bjavascript\b/i },
  { name: "typescript", pattern: /\btypescript\b/i },
  { name: "python", pattern: /\bpython\b/i },
  { name: "java", pattern: /\bjava\b(?!\s*script)/i },
  { name: "c++", pattern: /\bc\+\+/i },
  { name: "c#", pattern: /\bc#\b/i },
  { name: "ruby", pattern: /\bruby\b/i },
  {
    name: "golang",
    pattern: /\b(?:go|golang)\b/i,
    suppress: [
      "go to",
      "going",
      "good",
      "google",
      "goal",
      "got ",
      "go ahead",
      "let's go",
      "go back",
      "go through",
    ],
  },
  {
    name: "rust",
    pattern: /\brust\b/i,
    suppress: ["rustle", "rusty", "rust belt", "rust colored"],
  },
  {
    name: "swift",
    pattern: /\bswift\b/i,
    suppress: ["swiftly", "swift action", "swift response", "swift decision"],
  },
  { name: "kotlin", pattern: /\bkotlin\b/i },
  { name: "php", pattern: /\bphp\b/i },
  { name: "scala", pattern: /\bscala\b/i },
  { name: "matlab", pattern: /\bmatlab\b/i },
  { name: "bash", pattern: /\bbash\b/i },
  {
    name: "shell scripting",
    pattern: /\bshell\s*(?:scripting|script)?\b/i,
    suppress: [
      "shell company",
      "shell corp",
      "shell inc",
      "shell station",
      "petro",
    ],
  },
  {
    name: "react",
    pattern: /\breact(?:\.js|js)?\b/i,
    suppress: [
      "react to",
      "react well",
      "react positively",
      "reacted",
      "reacting",
    ],
  },
  { name: "vue", pattern: /\bvue(?:\.js|js)?\b/i },
  { name: "angular", pattern: /\bangular(?:js)?\b/i },
  { name: "svelte", pattern: /\bsvelte\b/i },
  { name: "next.js", pattern: /\bnext(?:\.js|js)\b/i },
  { name: "html", pattern: /\bhtml[45]?\b/i },
  { name: "css", pattern: /\bcss[23]?\b/i },
  { name: "tailwind css", pattern: /\btailwind(?:\s*css)?\b/i },
  { name: "bootstrap", pattern: /\bbootstrap\b/i },
  { name: "redux", pattern: /\bredux\b/i },
  { name: "webpack", pattern: /\bwebpack\b/i },
  { name: "node.js", pattern: /\bnode(?:\.js|js)\b/i },
  {
    name: "node.js",
    pattern: /\bnode\b/i,
    suppress: [
      "node-based",
      "node in ",
      "node of ",
      "node structure",
      "tree node",
      "graph node",
      "network node",
      "a node",
      "the node",
      "each node",
      "leaf node",
      "root node",
      "child node",
      "linked node",
    ],
  },
  {
    name: "express.js",
    pattern: /\bexpress(?:\.js|js)?\b/i,
    suppress: [
      "express train",
      "express delivery",
      "expressly",
      "express lane",
      "express your",
      "express concern",
      "express interest",
      "expressway",
    ],
  },
  { name: "fastapi", pattern: /\bfastapi\b/i },
  { name: "django", pattern: /\bdjango\b/i },
  {
    name: "flask",
    pattern: /\bflask\b/i,
    suppress: ["flask of", "a flask", "the flask", "glass flask", "erlenmeyer"],
  },
  { name: "spring boot", pattern: /\bspring\s*boot\b/i },
  {
    name: "spring",
    pattern: /\bspring\b/i,
    suppress: [
      "spring semester",
      "spring break",
      "spring 20",
      "spring of ",
      "this spring",
      "last spring",
      "spring cleaning",
      "spring loaded",
      "spring water",
      "off-spring",
      "offspring",
    ],
  },
  { name: "graphql", pattern: /\bgraphql\b/i },
  { name: "rest api", pattern: /\brest(?:ful)?\s*api\b/i },
  { name: "grpc", pattern: /\bgrpc\b/i },
  { name: "mysql", pattern: /\bmysql\b/i },
  { name: "postgresql", pattern: /\bpostgres(?:ql)?\b/i },
  { name: "mongodb", pattern: /\bmongodb\b/i },
  { name: "sqlite", pattern: /\bsqlite\b/i },
  { name: "redis", pattern: /\bredis\b/i },
  { name: "firebase", pattern: /\bfirebase\b/i },
  { name: "supabase", pattern: /\bsupabase\b/i },
  { name: "elasticsearch", pattern: /\belasticsearch\b/i },
  { name: "prisma", pattern: /\bprisma\b/i },
  { name: "dynamodb", pattern: /\bdynamodb\b/i },
  { name: "aws", pattern: /\baws\b/i },
  { name: "gcp", pattern: /\bgcp\b/i },
  { name: "azure", pattern: /\bazure\b/i },
  { name: "docker", pattern: /\bdocker\b/i },
  { name: "kubernetes", pattern: /\bkubernetes\b|\bk8s\b/i },
  { name: "terraform", pattern: /\bterraform\b/i },
  { name: "ci/cd", pattern: /\bci\/cd\b/i },
  { name: "linux", pattern: /\blinux\b/i },
  { name: "nginx", pattern: /\bnginx\b/i },
  { name: "github actions", pattern: /\bgithub\s+actions\b/i },
  { name: "tensorflow", pattern: /\btensorflow\b/i },
  { name: "pytorch", pattern: /\bpytorch\b/i },
  { name: "scikit-learn", pattern: /\bscikit[\s-]learn\b/i },
  { name: "pandas", pattern: /\bpandas\b/i },
  { name: "numpy", pattern: /\bnumpy\b/i },
  { name: "opencv", pattern: /\bopencv\b/i },
  { name: "machine learning", pattern: /\bmachine\s+learning\b/i },
  { name: "deep learning", pattern: /\bdeep\s+learning\b/i },
  { name: "nlp", pattern: /\bnlp\b|\bnatural\s+language\s+processing\b/i },
  { name: "langchain", pattern: /\blangchain\b/i },
  { name: "git", pattern: /\bgit\b(?!hub|lab)/i },
  { name: "github", pattern: /\bgithub\b/i },
  { name: "jira", pattern: /\bjira\b/i },
  { name: "figma", pattern: /\bfigma\b/i },
  { name: "postman", pattern: /\bpostman\b/i },
  {
    name: "data structures & algorithms",
    pattern: /\bdsa\b|\bdata\s+structures?\s+(?:and\s+)?algorithms?\b/i,
  },
  { name: "system design", pattern: /\bsystem\s+design\b/i },
  { name: "oops", pattern: /\boops?\b|\bobject[\s-]oriented\b/i },
  { name: "dbms", pattern: /\bdbms\b|\bdatabase\s+management\b/i },
  { name: "computer networks", pattern: /\bcomputer\s+networks?\b/i },
  { name: "operating systems", pattern: /\boperating\s+systems?\b/i },
  {
    name: "competitive programming",
    pattern: /\bcompetitive\s+programming\b/i,
  },
];

function isSuppressed(text, index, matchLength, suppressList = []) {
  if (!suppressList.length) return false;

  const window = text
    .slice(Math.max(0, index - 60), index + matchLength + 60)
    .toLowerCase();

  return suppressList.some((context) => window.includes(context.toLowerCase()));
}

function skillKey(skill) {
  return skill
    .toLowerCase()
    .replace(/\.js$/i, "")
    .replace(/[\s.-]+/g, " ")
    .trim();
}

function extractSkills(text) {
  const lower = text.toLowerCase();
  const found = new Map();

  for (const definition of SKILL_DEFINITIONS) {
    if (found.has(skillKey(definition.name))) continue;

    const regex = new RegExp(
      definition.pattern.source,
      (definition.pattern.flags || "i").includes("g")
        ? definition.pattern.flags
        : definition.pattern.flags + "g",
    );

    let match;
    while ((match = regex.exec(lower)) !== null) {
      if (!isSuppressed(lower, match.index, match[0].length, definition.suppress)) {
        found.set(skillKey(definition.name), definition.name);
        break;
      }
    }
  }

  const skillSection = extractSection(text, [
    "skills",
    "technical skills",
    "technologies",
    "tech stack",
    "core competencies",
    "areas of expertise",
    "key skills",
    "programming languages",
  ]);

  if (skillSection) {
    skillSection
      .split(/[,|•·\n\t:/●▪▸◦⋅]/)
      .map((skill) => skill.trim().replace(/^[-*•·▸]\s*/, ""))
      .filter((skill) => skill.length > 1 && skill.length < 50 && /[a-zA-Z]/.test(skill))
      .forEach((skill) => {
        const key = skillKey(skill);
        if (!found.has(key)) found.set(key, skill);
      });
  }

  return [...found.values()];
}

function cleanLine(line) {
  return line
    .replace(/^[•\-*·●▪▸◦⋅\d.)\s]+/, "")
    .replace(/^\(cid:\d+\)\s*/, "")
    .trim();
}

function splitIntoBlocks(section) {
  const lines = section.split("\n");
  const blocks = [];
  let current = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (current.length) {
        blocks.push(current);
        current = [];
      }
      continue;
    }

    const isBullet = /^[•\-*·●▪▸◦\s]/.test(trimmed) || /^\(cid:/.test(trimmed);
    const isNewTitle =
      !isBullet &&
      /^[A-Z]/.test(trimmed) &&
      current.length > 0 &&
      !/^[•\-*·●▪▸]/.test(current[current.length - 1]);

    if (isNewTitle) {
      blocks.push(current);
      current = [trimmed];
    } else {
      current.push(trimmed);
    }
  }

  if (current.length) blocks.push(current);
  return blocks;
}

const ACTION_VERBS_RX =
  /^(?:built|developed|created|implemented|designed|wrote|worked|used|leveraged|utilized|achieved|deployed|integrated|improved|reduced|increased|automated|optimized|trained|fine-tuned|scraped|parsed|generated|analyzed|set\s+up|migrated|led|collaborated|contributed|researched|published|made|launched|released|shipped|refactored|added|fixed|tested)\b/i;

function isLikelyTitle(line) {
  const trimmed = line.trim();
  const words = trimmed.split(/\s+/);

  if (words.length > 8) return false;
  if (ACTION_VERBS_RX.test(trimmed)) return false;
  if (/\./.test(trimmed) && words.length > 4) return false;

  return true;
}

function extractProjectName(lines) {
  for (const line of lines.slice(0, 3)) {
    const clean = cleanLine(line);
    if (clean && isLikelyTitle(clean)) {
      return clean.replace(/\s*[|–—]\s*.+$/, "").trim();
    }
  }

  const pipeMatch = cleanLine(lines[0] || "").match(/^([^|]{2,60})\s*\|/);
  if (pipeMatch) return pipeMatch[1].trim();

  const colonMatch = cleanLine(lines[0] || "").match(/^([^:]{3,40}):\s+\S/);
  if (colonMatch) return colonMatch[1].trim();

  const firstLine = cleanLine(lines[0] || "");
  if (!firstLine) return "";

  const words = firstLine.split(/\s+/);
  return words.slice(0, 5).join(" ") + (words.length > 5 ? "…" : "");
}

function extractProjects(text) {
  const section = extractSection(text, [
    "projects",
    "academic projects",
    "personal projects",
    "key projects",
    "notable projects",
    "project experience",
  ]);

  if (!section) return [];

  return splitIntoBlocks(section)
    .map((lines) => {
      const cleaned = lines.map(cleanLine).filter(Boolean);
      if (!cleaned.length) return null;

      const name = extractProjectName(cleaned);
      const description = cleaned.filter((line) => line !== name).join(" ").trim();
      return name ? { name, description } : null;
    })
    .filter(Boolean)
    .slice(0, 10);
}

const COMPANY_SIGNALS =
  /\b(?:pvt|ltd|llc|inc|corp|technologies|tech|solutions|systems|labs?|studio|software|consulting|services|private\s+limited|limited|startup|ventures|group|foundation|institute|university|iit|nit|iiit|bits|college)\b/i;

const ROLE_SIGNALS =
  /\b(?:intern(?:ship)?|engineer|developer|analyst|designer|researcher|consultant|associate|trainee|lead|manager|architect|sde|swe|frontend|backend|fullstack|full[\s-]stack|data\s+scientist|ml\s+engineer|devops|qa|tester|programmer)\b/i;

function resolveRoleCompany(a, b) {
  const aIsRole = ROLE_SIGNALS.test(a);
  const bIsRole = ROLE_SIGNALS.test(b);
  const aIsCompany = COMPANY_SIGNALS.test(a);
  const bIsCompany = COMPANY_SIGNALS.test(b);

  if (aIsRole && !bIsRole) return { role: a, company: b };
  if (bIsRole && !aIsRole) return { role: b, company: a };
  if (aIsCompany && !bIsCompany) return { role: b, company: a };
  if (bIsCompany && !aIsCompany) return { role: a, company: b };

  return { role: a, company: b };
}

function parseExperienceBlock(lines) {
  const cleaned = lines.map(cleanLine).filter(Boolean);
  if (!cleaned.length) return null;

  const first = cleaned[0];
  const second = cleaned[1] || "";

  const pipeMatch = first.match(/^(.+?)\s*\|\s*(.+?)(?:\s*\|.*)?$/);
  if (pipeMatch) return resolveRoleCompany(pipeMatch[1].trim(), pipeMatch[2].trim());

  const atMatch = first.match(/^(.+?)\s+at\s+(.+?)(?:\s*[\(\[].*)?$/i);
  if (atMatch) return { role: atMatch[1].trim(), company: atMatch[2].trim() };

  const dashMatch = first.match(/^(.+?)\s*(?:–|—|-{1,2})\s*(.+?)(?:\s*[\(\[].*)?$/);
  if (dashMatch) return resolveRoleCompany(dashMatch[1].trim(), dashMatch[2].trim());

  if (second) {
    if (COMPANY_SIGNALS.test(first) && ROLE_SIGNALS.test(second)) {
      return { role: second, company: first };
    }

    if (ROLE_SIGNALS.test(first) && COMPANY_SIGNALS.test(second)) {
      return { role: first, company: second };
    }
  }

  const roleMatch = ROLE_SIGNALS.exec(first);
  const companyMatch = COMPANY_SIGNALS.exec(first);
  if (roleMatch && companyMatch) {
    if (roleMatch.index < companyMatch.index) {
      return {
        role: first.slice(0, companyMatch.index).trim(),
        company: first.slice(companyMatch.index).trim(),
      };
    }

    return {
      role: first.slice(roleMatch.index).trim(),
      company: first.slice(0, roleMatch.index).trim(),
    };
  }

  if (second) {
    return first.length <= second.length
      ? { role: first, company: second }
      : { role: second, company: first };
  }

  return { role: "", company: first };
}

function extractInternships(text) {
  const section = extractSection(text, [
    "internships",
    "internship",
    "work experience",
    "experience",
    "professional experience",
    "industry experience",
  ]);

  if (!section) return [];

  return splitIntoBlocks(section)
    .map((lines) => parseExperienceBlock(lines))
    .filter(Boolean)
    .slice(0, 10);
}

function extractCertifications(text) {
  const section = extractSection(text, [
    "certifications",
    "certificates",
    "courses",
    "online courses",
    "achievements",
    "awards & certifications",
    "awards",
  ]);

  if (!section) return [];

  return section.split("\n").map(cleanLine).filter((line) => line.length > 3).slice(0, 20);
}

const DEGREE_PATTERNS = [
  /\b(m\.?\s?tech(?:nology)?|master of technology)\b/i,
  /\b(m\.?\s?e\.?|master of engineering)\b/i,
  /\b(m\.?\s?sc|master of science)\b/i,
  /\b(m\.?\s?b\.?\s?a)\b/i,
  /\b(m\.?\s?c\.?\s?a)\b/i,
  /\b(b\.?\s?tech(?:nology)?|bachelor of technology)\b/i,
  /\b(b\.?\s?e\.?|bachelor of engineering)\b/i,
  /\b(b\.?\s?sc|bachelor of science)\b/i,
  /\b(b\.?\s?c\.?\s?a|bachelor of computer applications)\b/i,
  /\b(b\.?\s?b\.?\s?a)\b/i,
  /\b(ph\.?\s?d|doctor of philosophy)\b/i,
  /\b(diploma)\b/i,
  /\b(12th|class xii|higher secondary|hsc)\b/i,
  /\b(10th|class x|secondary|ssc|matriculation)\b/i,
];

function extractDegree(text) {
  for (const pattern of DEGREE_PATTERNS) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }

  return "";
}

function normalizeTableRows(text) {
  return text
    .split("\n")
    .map((line) => {
      const chunks = line.trim().split(/\s{2,}/);
      return chunks.length >= 3 ? chunks.join(" | ") : line;
    })
    .join("\n");
}

function extractEducation(text) {
  const section = extractSection(text, [
    "education",
    "educational background",
    "academic background",
    "qualifications",
  ]);

  if (!section) return [];

  const normalizedSection = normalizeTableRows(section);
  const lines = normalizedSection
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const isTable = /degree|institute|institution|university|college|year|cgpa/i.test(
    lines[0] || "",
  );

  if (isTable) {
    return lines
      .slice(1)
      .map((line) => {
        const degree = extractDegree(line);
        const yearMatch = line.match(/\b(20\d{2})\b/);
        const cgpaMatch = line.match(/\b(\d+\.\d+)\s*(?:\/\s*(?:10|4(?:\.0)?))?/);
        const cgpaValue = cgpaMatch ? parseFloat(cgpaMatch[1]) : null;
        const institution = line
          .replace(new RegExp(degree.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "")
          .replace(/\b20\d{2}(?:\s*[-–|]\s*20\d{2})?\b/, "")
          .replace(/\b\d+\.\d+\s*(?:\/\s*(?:10|4(?:\.0)?))?/, "")
          .replace(/[|]/g, " ")
          .replace(/\s{2,}/g, " ")
          .trim();

        return {
          institution,
          degree,
          year: yearMatch ? yearMatch[1] : "",
          cgpa: cgpaValue && cgpaValue <= 10 ? cgpaValue : null,
        };
      })
      .filter((entry) => entry.institution || entry.degree);
  }

  const blocks = [];
  let current = [];

  for (const line of lines) {
    const hasDegree = extractDegree(line);
    const hasYear = /\b20\d{2}\b/.test(line);

    if (hasDegree || hasYear) {
      if (current.length && !extractDegree(current[current.length - 1])) {
        blocks.push(current);
        current = [line];
        continue;
      }
    }

    current.push(line);
  }

  if (current.length) blocks.push(current);

  return blocks
    .map((block) => {
      const full = block.join(" ");
      const yearMatch = full.match(/\b(20\d{2})\b/);
      const cgpaMatch = full.match(/\b(\d+\.\d+)\s*(?:\/\s*(?:10|4(?:\.0)?))?/);
      const cgpaValue = cgpaMatch ? parseFloat(cgpaMatch[1]) : null;

      return {
        institution: block[0].replace(/^[•\-*\d.)\s]+/, "").trim(),
        degree: extractDegree(full),
        year: yearMatch ? yearMatch[1] : "",
        cgpa: cgpaValue && cgpaValue <= 10 ? cgpaValue : null,
      };
    })
    .filter(Boolean)
    .slice(0, 6);
}

function buildProfileData(text) {
  const skills = extractSkills(text);

  return {
    cgpa: extractCGPA(text),
    yearOfStudy: extractYearOfStudy(text),
    skills,
    techStack: skills,
    projects: extractProjects(text),
    internships: extractInternships(text),
    certifications: extractCertifications(text),
    education: extractEducation(text),
  };
}

function hasMeaningfulProfileData(profile) {
  const hasEducation = profile.education?.some(
    (entry) => entry.institution || entry.degree || entry.year || entry.cgpa,
  );
  const hasProjects = profile.projects?.some((project) => project.name || project.description);
  const hasInternships = profile.internships?.some(
    (entry) => entry.role || entry.company,
  );

  return Boolean(
    profile.cgpa !== null ||
      profile.yearOfStudy ||
      profile.skills?.length ||
      hasProjects ||
      hasInternships ||
      profile.certifications?.length ||
      hasEducation,
  );
}

export async function parseProfileFromPDF(base64PDF) {
  try {
    const rawText = await extractTextFromPDF(base64PDF);
    const text = normalize(rawText);

    if (!text || text.length < 40) {
      throw new Error("PDF.js extraction returned too little text.");
    }

    const profileData = buildProfileData(text);

    if (!hasMeaningfulProfileData(profileData)) {
      throw new Error("Structured parsing did not produce usable profile data.");
    }

    return JSON.stringify(profileData, null, 2);
  } catch (error) {
    console.warn("Primary PDF parser failed, falling back to legacy parser:", error);
    return parseProfileFromPDFLegacy(base64PDF);
  }
}

export async function analyzeProfile(studentProfile, companies) {
  const slimCompanies = companies.map((company) => ({
    name: company.name,
    role: company.role,
    difficulty: company.difficulty,
    minCGPA: company.minCGPA,
    avgPackage: company.avgPackage,
    requiredSkills: company.requiredSkills,
    rounds: company.rounds,
    topperTip: company.topperTip,
  }));

  const text = await generateWithGroq(`
    IMPORTANT: Respond with ONLY a JSON object. No explanation, no markdown.
    You are a placement advisor for NIT Jalandhar.
    Student: ${JSON.stringify(studentProfile)}
    Companies: ${JSON.stringify(slimCompanies)}
    Return ONLY JSON, max 4 ready, 5 stretch, 2 future:
    {
      "ready":[{"name":"","role":"","avgPackage":"","rounds":[],"topperTip":""}],
      "stretch":[{"name":"","role":"","avgPackage":"","missingSkills":[],"gapSize":"","topperTip":""}],
      "future":[{"name":"","role":"","avgPackage":"","missingSkills":[]}],
      "strengthSummary":"",
      "topSkillGaps":[],
      "urgentActions":[]
    }
  `);

  return safeParseJSON(text);
}

export async function generateStudyPlan(studentProfile, gapAnalysis) {
  const text = await generateWithGroq(`
    You are a placement coach for NIT Jalandhar.
    Student: ${JSON.stringify(studentProfile)}
    Gaps: ${JSON.stringify(gapAnalysis)}
    Return ONLY JSON, 4 weeks, 4 tasks each, under 10 words per task:

    For the "resource" field, use these exact roadmap.sh URLs based on the task topic:
    - Java/Spring: https://roadmap.sh/java
    - Python: https://roadmap.sh/python
    - JavaScript: https://roadmap.sh/javascript
    - React: https://roadmap.sh/react
    - Node.js: https://roadmap.sh/nodejs
    - SQL/Database: https://roadmap.sh/sql
    - DSA: https://roadmap.sh/datastructures-and-algorithms
    - System Design: https://roadmap.sh/system-design
    - DevOps: https://roadmap.sh/devops
    - Backend: https://roadmap.sh/backend
    - Frontend: https://roadmap.sh/frontend
    - Git: https://roadmap.sh/git-github
    - Docker: https://roadmap.sh/docker
    - AWS/Cloud: https://roadmap.sh/aws
    - Cybersecurity: https://roadmap.sh/cyber-security
    If no exact match, use https://roadmap.sh

    {
      "totalHours":0,
      "targetCompany":"",
      "weeks":[
        {
          "weekNumber":1,
          "theme":"",
          "dailyHours":0,
          "tasks":[{"days":"","task":"","resource":""}],
          "weeklyGoal":""
        }
      ],
      "prioritySkills":[]
    }
  `);

  return safeParseJSON(text);
}

export const geminiModel = {
  generateContent: async (content) => {
    const prompt = Array.isArray(content)
      ? content.map((chunk) => chunk.text || "").join("\n")
      : content;
    const text = await generateWithGroq(prompt);

    return { response: { text: () => text } };
  },
};
