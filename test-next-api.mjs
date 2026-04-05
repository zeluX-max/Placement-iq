import { POST } from './.next/server/app/api/analyze/route.js';

async function test() {
  const req = {
    json: async () => ({ profile: { name: "Test Student", skills: ["Java", "SQL"], education: []} })
  };
  const res = await POST(req);
  console.log(await res.json());
}
test();
