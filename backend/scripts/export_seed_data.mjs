import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../../data/seedData.js", import.meta.url), "utf8");
const context = {};
vm.runInNewContext(`${source}\n;globalThis.__seedData = SEED_DATA;`, context, { timeout: 1000 });
const data = context.__seedData;
data.themes = JSON.parse(await readFile(new URL("../../data/themes.json", import.meta.url), "utf8"));
for (const user of data.users ?? []) delete user.password;
if (process.argv.includes("--summary")) {
  process.stdout.write(JSON.stringify({
    organizations: (data.organizations ?? []).map(({ id, name }) => ({ id, name })),
    activity_organizers: [...new Set((data.activities ?? []).map(({ organizer }) => organizer))],
  }, null, 2));
  process.exit(0);
}
if (process.argv.includes("--shape")) {
  process.stdout.write(JSON.stringify(Object.fromEntries(Object.entries(data).map(([key, value]) => [key, Array.isArray(value) && value.length ? Object.keys(value[0]) : []])), null, 2));
  process.exit(0);
}
process.stdout.write(JSON.stringify(data));
