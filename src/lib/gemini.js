
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import pdfParse from "pdf-parse";

// --- 1. SETUP BOTH CLIENTS ---

// Setup Groq
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Setup Gemini (Using a single key fors simplicity here, but you can add your rotation back if needed)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- 2. GROQ HELPER (For Analysis & Study Plan) ---

async function generateWithGroq(prompt) {
  const response = await groqClient.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4000, 
    temperature: 0.1,
    response_format: { type: "json_object" } 
  });
  return response.choices[0].message.content;
}

// --- 3. JSON PARSER ---

export function safeParseJSON(text) {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
      console.error("No JSON object found.");
      return null;
    }
    const clean = text.slice(start, end + 1);
    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON parse failed:", err);
    return null;
  }
}


// READ PDF
const ALL_SECTION_HEADINGS = [
  "education","educational background","academic background","qualifications",
  "technical skills","skills","technologies","tech stack","core competencies","areas of expertise",
  "experience","work experience","internships","internship","professional experience","industry experience",
  "projects","academic projects","personal projects","key projects","notable projects","project experience",
  "certifications","certificates","courses","online courses","achievements","awards & certifications","awards",
  "positions of responsibility","extracurricular","activities","publications","research",
  "objective","summary","profile","about",
];

function buildSectionBoundaryPattern() {
  const escaped = ALL_SECTION_HEADINGS
    .map(h => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  return new RegExp(`(?=\\n(?:${escaped})\\s*(?:\\n|:))`, "i");
}

const SECTION_BOUNDARY = buildSectionBoundaryPattern();

function normalize(text) {
  return text
    .replace(/\(cid:\d+\)/g, ' ')
    .replace(/\r\n/g,'\n')
    .replace(/[ \t]{2,}/g,' ')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}

function extractSection(text, headingVariants) {
  const headingPattern = headingVariants
    .map(h => h.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|");
  const startRegex = new RegExp(`(?:^|\\n)((?:${headingPattern})\\s*(?::|\\n))`,"i");
  const startMatch = startRegex.exec(text);
  if (!startMatch) return "";
  const contentStart = startMatch.index + startMatch[0].length;
  const rest = text.slice(contentStart);
  const endMatch = SECTION_BOUNDARY.exec(rest);
  return (endMatch ? rest.slice(0, endMatch.index) : rest).trim();
}

function extractCGPA(text) {
  const patterns = [
    /(?:cgpa|c\.g\.p\.a|gpa|g\.p\.a)[^\d]*(\d+\.\d+)/gi,
    /(\d+\.\d+)\s*\/\s*(?:10|4(?:\.0)?)\s*(?:cgpa|gpa)?/gi,
    /(?:score|marks)[^\d]*(\d+\.\d+)\s*\/\s*10/gi,
  ];
  const found = [];
  for (const p of patterns) {
    let m;
    while ((m = p.exec(text)) !== null) {
      const val = parseFloat(m[1]);
      if (val > 0 && val <= 10) found.push(val);
    }
  }
  if (!found.length) return null;
  return Math.max(...found);
}

const CURRENT_YEAR = new Date().getFullYear();

function extractYearOfStudy(text) {
  const explicitPatterns = [
    /\b(1st|2nd|3rd|4th|fifth|first|second|third|fourth)\s+year\b/i,
    /year\s*[:\-]?\s*(1st|2nd|3rd|4th|I{1,4}|[1-4])/i,
    /\b(fresher|freshman|sophomore|junior|senior)\b/i,
  ];
  for (const p of explicitPatterns) {
    const m = text.match(p);
    if (m) return m[1];
  }
  const rangeMatches = [...text.matchAll(/\b(20\d{2})\s*[-–—]\s*(20\d{2})\b/g)];
  for (const m of rangeMatches) {
    const start = parseInt(m[1]), end = parseInt(m[2]);
    if (start <= CURRENT_YEAR && end >= CURRENT_YEAR) {
      const n = CURRENT_YEAR - start + 1;
      return ["","1st","2nd","3rd","4th","5th"][n] || `${n}th`;
    }
  }
  const batchMatch = text.match(/(?:batch|graduating|passout)[^\d]*(20\d{2})/i);
  if (batchMatch) {
    const grad = parseInt(batchMatch[1]);
    const yearsLeft = grad - CURRENT_YEAR;
    if (yearsLeft >= 0 && yearsLeft <= 4) {
      const n = Math.max(1, 4 - yearsLeft);
      return ["","1st","2nd","3rd","4th"][n] || `${n}th`;
    }
  }
  return '';
}

const SKILL_KEYWORDS = [
  'javascript','typescript','python','java','c++','c#','ruby','go','golang',
  'rust','swift','kotlin','php','scala','matlab','perl','bash','shell',
  'react','vue','angular','svelte','nextjs','next.js','nuxt','html','css',
  'sass','scss','tailwind','bootstrap','jquery','redux','zustand','webpack','vite',
  'node.js','node','nodejs','express','fastapi','django','flask','spring','laravel',
  'rails','graphql','rest','grpc','websocket','fastify','hono',
  'mysql','postgresql','postgres','mongodb','sqlite','redis','firebase',
  'supabase','dynamodb','cassandra','oracle','elasticsearch','prisma',
  'aws','gcp','azure','docker','kubernetes','k8s','terraform','ansible',
  'jenkins','github actions','ci/cd','linux','nginx','apache',
  'tensorflow','pytorch','keras','scikit-learn','pandas','numpy','opencv',
  'langchain','openai','hugging face','nlp','machine learning','deep learning',
  'git','github','gitlab','bitbucket','jira','figma','postman','swagger',
  'vs code','intellij','xcode','android studio',
  'dsa','data structures','algorithms','os','operating systems',
  'dbms','database management','computer networks','cn','system design',
  'oops','object oriented','competitive programming',
];

function extractSkills(text) {
  const lower = text.toLowerCase();
  const found = new Set();
  for (const skill of SKILL_KEYWORDS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const pattern = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`,'i');
    if (pattern.test(lower)) found.add(skill);
  }
  const skillSection = extractSection(text, ['skills','technical skills','technologies','tech stack','core competencies','areas of expertise']);
  if (skillSection) {
    skillSection.split(/[,|•\n\t:\/]/)
      .map(s => s.trim().replace(/^[-*]\s*/,''))
      .filter(s => s.length > 1 && s.length < 50)
      .forEach(s => found.add(s));
  }
  return [...found];
}

function cleanLine(l) {
  return l.replace(/^[•\-*\d.)\s]+/, '').replace(/^\(cid:\d+\)\s*/, '').trim();
}

function splitIntoBlocks(section) {
  const lines = section.split('\n');
  const blocks = [];
  let current = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current.length) { blocks.push(current); current = []; }
      continue;
    }
    const isBullet = /^[•\-*\s]/.test(trimmed) || /^\(cid:/.test(trimmed);
    const isNewTitle = !isBullet && /^[A-Z]/.test(trimmed) && current.length > 0 && !(/^[•\-*]/.test(current[current.length-1]) || /^\(cid:/.test(current[current.length-1]));
    if (isNewTitle && current.length) {
      blocks.push(current);
      current = [trimmed];
    } else current.push(trimmed);
  }
  if (current.length) blocks.push(current);
  return blocks;
}

function extractProjects(text) {
  const section = extractSection(text, ['projects','academic projects','personal projects','key projects','notable projects','project experience']);
  if (!section) return [];
  return splitIntoBlocks(section).map(lines => {
    const clean = lines.map(cleanLine).filter(Boolean);
    if (!clean.length) return null;
    return { name: clean[0].replace(/\s*[|–\-]\s*.+$/,'').trim(), description: clean.slice(1).join(' ').trim() };
  }).filter(Boolean).slice(0,10);
}

function extractInternships(text) {
  const section = extractSection(text, ['internships','internship','work experience','experience','professional experience','industry experience']);
  if (!section) return [];
  return splitIntoBlocks(section).map(lines => {
    const clean = lines.map(cleanLine).filter(Boolean);
    if (!clean.length) return null;
    const firstLine = clean[0];
    const pipeMatch = firstLine.match(/^(.+?)\s*[|]\s*(.+?)(?:\s*[\(\[].*)?$/);
    if (pipeMatch) return { role: pipeMatch[1].trim(), company: pipeMatch[2].trim() };
    const dashMatch = firstLine.match(/^(.+?)\s*(?:–|-|—)\s*(.+?)(?:\s*[\(\[].*)?$/);
    if (dashMatch) return { role: dashMatch[1].trim(), company: dashMatch[2].trim() };
    const atMatch = firstLine.match(/^(.+?)\s+at\s+(.+?)(?:\s*[\(\[].*)?$/i);
    if (atMatch) return { role: atMatch[1].trim(), company: atMatch[2].trim() };
    return { company: firstLine, role: clean[1] || '' };
  }).filter(Boolean).slice(0,10);
}

function extractCertifications(text) {
  const section = extractSection(text, ['certifications','certificates','courses','online courses','achievements','awards & certifications','awards']);
  if (!section) return [];
  return section.split(/\n/).map(cleanLine).filter(l => l.length > 3).slice(0,20);
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
  for (const p of DEGREE_PATTERNS) {
    const m = text.match(p);
    if (m) return m[0].trim();
  }
  return '';
}

function extractEducation(text) {
  const section = extractSection(text, ['education','educational background','academic background','qualifications']);
  if (!section) return [];
  const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
  const isTable = /degree|institute|institution|university|college|year|cgpa/i.test(lines[0] || '');
  if (isTable) {
    return lines.slice(1).map(line => {
      const degree = extractDegree(line);
      const yearMatch = line.match(/\b(20\d{2})\b/);
      const cgpaMatch = line.match(/\b(\d+\.\d+)\s*\/\s*(?:10|4)/);
      const institution = line
        .replace(new RegExp(degree.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),'')
        .replace(/\b20\d{2}(?:\s*[-–]\s*20\d{2})?\b/,'')
        .replace(/\b\d+\.\d+\s*\/\s*(?:10|4(?:\.0)?)\b/,'')
        .replace(/\s{2,}/g,' ').trim();
      return { institution, degree, year: yearMatch?yearMatch[1]:'', cgpa: cgpaMatch?parseFloat(cgpaMatch[1]):null };
    }).filter(e => e.institution || e.degree);
  }
  const blocks = [];
  let current = [];
  for (const line of lines) {
    const deg = extractDegree(line);
    const hasYear = /\b20\d{2}\b/.test(line);
    if ((deg || hasYear) && current.length && !extractDegree(current[current.length-1])) {
      blocks.push(current);
      current = [line];
    } else current.push(line);
  }
  if (current.length) blocks.push(current);
  return blocks.map(bl => {
    const full = bl.join(' ');
    const degree = extractDegree(full);
    const yearMatch = full.match(/\b(20\d{2})\b/);
    const cgpaMatch = full.match(/\b(\d+\.\d+)\s*\/\s*(?:10|4)/);
    return { institution: bl[0].replace(/^[•\-*\d.)\s]+/,'').trim(), degree, year: yearMatch?yearMatch[1]:'', cgpa: cgpaMatch?parseFloat(cgpaMatch[1]):null };
  }).filter(Boolean).slice(0,6);
}

export async function parseProfileFromPDF(base64PDF) {
  const buffer = Buffer.from(base64PDF, "base64");
  const { text: rawText } = await pdfParse(buffer);
  const text = normalize(rawText);


  const profileData = {
    cgpa:           extractCGPA(text),
    yearOfStudy:    extractYearOfStudy(text),
    skills:         extractSkills(text),
    techStack:      extractSkills(text),
    projects:       extractProjects(text),
    internships:    extractInternships(text),
    certifications: extractCertifications(text),
    education:      extractEducation(text),
  };


  return JSON.stringify(profileData, null, 2);
}



// GAP ANALYSIS
export async function analyzeProfile(studentProfile, companies) {
  const slimCompanies = companies.map(c => ({
    name: c.name,
    role: c.role,
    difficulty: c.difficulty,
    minCGPA: c.minCGPA,
    avgPackage: c.avgPackage,
    requiredSkills: c.requiredSkills,
    rounds: c.rounds,
    topperTip: c.topperTip
  }));

  const text = await generateWithGroq(`
    IMPORTANT: Respond with ONLY a JSON object. No explanation, no markdown.
    You are a placement advisor for NIT Jalandhar.
    Student: ${JSON.stringify(studentProfile)}
    Companies: ${JSON.stringify(slimCompanies)}
    Return ONLY JSON, max 4 ready, 6 stretch, 2 future:
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

// STUDY PLAN: Uses Groq for speed and reasoning
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
// --- 5. LEGACY PROXY (For Interview Routes) ---
// This keeps interview-questions and interview-report from breaking
export const geminiModel = {
  generateContent: async (content) => {
    // Extract the text prompt, ignoring any complex Gemini-specific formatting
    const prompt = Array.isArray(content)
      ? content.map(c => c.text || '').join('\n')
      : content;
      
    // Route the prompt through our new Groq helper
    const text = await generateWithGroq(prompt);
    
    // Return it in the shape the old code expects: result.response.text()
    return { response: { text: () => text } };
  }
};
