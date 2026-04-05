import 'dotenv/config';
import { analyzeProfile } from './src/lib/gemini.js';
import { companies } from './src/data/companies.js';

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
