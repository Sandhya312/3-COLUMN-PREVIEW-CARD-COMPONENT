const fs = require("fs");
const path = require("path");

const KEYS_TO_KEEP = [
  "socialMediaProfiles",
  "contact",
  "website",
  "partOf",
  "foundedYear",
  "name",
  "domain",
  "shortDescription",
  "funded",
];

function filterObject(obj) {
  const filtered = {};
  for (const key of KEYS_TO_KEEP) {
    if (key in obj) {
      filtered[key] = obj[key];
    }
  }
  return filtered;
}

function main() {
  const inputPath = process.argv[2] || "raw-data.json";
  const outputPath = process.argv[3] || "filtered-data.json";

  const absInput = path.resolve(inputPath);
  const absOutput = path.resolve(outputPath);

  if (!fs.existsSync(absInput)) {
    console.error(`Input file not found: ${absInput}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(absInput, "utf-8");
  let data;

  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse JSON:", err.message);
    process.exit(1);
  }

  const items = Array.isArray(data) ? data : [data];
  const filtered = items.map(filterObject);

  fs.writeFileSync(absOutput, JSON.stringify(filtered, null, 2), "utf-8");
  console.log(
    `Filtered ${filtered.length} record(s) → ${absOutput}`
  );
}

main();
