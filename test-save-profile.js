const { POST } = require('./.next/server/app/api/save-profile/route.js');
async function test() {
  try {
    const req = {
      json: async () => ({ profile: { name: "Test Student", skills: ["Java", "SQL"], education: []}, gapAnalysis: {}, studyPlan: {} })
    };
    const res = await POST(req);
    console.log(await res.json());
  } catch (e) {
    console.error("FATAL ERROR", e);
  }
}
test();
