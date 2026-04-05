require('dotenv').config({ path: '.env.local' });
const { analyzeProfile } = require('./src/lib/gemini.js');
const { companies } = require('./src/data/companies.js');

async function test() {
  try {
    const profile = { name: "Test" };
    console.log("Calling analyzeProfile...");
    await analyzeProfile(profile, companies);
    console.log("Success");
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
  }
}
test();
