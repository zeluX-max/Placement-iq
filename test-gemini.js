async function test() {
  try {
    const { analyzeProfile } = await import('./src/lib/gemini.js');
    const { companies } = await import('./src/data/companies.js');
    const profile = { name: "Test Student", skills: ["Java", "SQL"], education: []};
    console.log("Calling analyzeProfile...");
    await analyzeProfile(profile, companies);
    console.log("Success");
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
  }
}
test();
