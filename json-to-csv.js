const fs = require("fs");
const path = require("path");

const CSV_COLUMNS = [
  "name",
  "domain",
  "foundedYear",
  "funded",
  "shortDescription",
  "partOf.id",
  "partOf.name",
  "website",
  "socialMediaProfiles.x",
  "socialMediaProfiles.linkedin",
  "socialMediaProfiles.facebook",
  "contact.emails",
  "contact.addresses",
];

function escapeCsv(value) {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function flattenRecord(obj) {
  const row = {};

  row["name"] = obj.name ?? "";
  row["domain"] = obj.domain ?? "";
  row["foundedYear"] = obj.foundedYear ?? "";
  row["funded"] = obj.funded ?? "";
  row["shortDescription"] = obj.shortDescription ?? "";

  row["partOf.id"] = obj.partOf?.id ?? "";
  row["partOf.name"] = obj.partOf?.name ?? "";

  const primarySite = (obj.website || []).find((w) => w.isPrimary === "Yes");
  row["website"] = primarySite?.url ?? (obj.website?.[0]?.url ?? "");

  row["socialMediaProfiles.x"] = obj.socialMediaProfiles?.x ?? "";
  row["socialMediaProfiles.linkedin"] = obj.socialMediaProfiles?.linkedin ?? "";
  row["socialMediaProfiles.facebook"] = obj.socialMediaProfiles?.facebook ?? "";

  row["contact.emails"] = (obj.contact?.emails || []).join(" | ");

  row["contact.addresses"] = (obj.contact?.addresses || [])
    .map((a) => a.addressText || "")
    .filter(Boolean)
    .join(" | ");

  return row;
}

function main() {
  const inputPath = process.argv[2] || "filtered-data.json";
  const outputPath = process.argv[3] || "output.csv";

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
  const rows = items.map(flattenRecord);

  const header = CSV_COLUMNS.map(escapeCsv).join(",");
  const lines = rows.map((row) =>
    CSV_COLUMNS.map((col) => escapeCsv(row[col])).join(",")
  );

  const csv = [header, ...lines].join("\n");
  fs.writeFileSync(absOutput, csv, "utf-8");
  console.log(`Converted ${items.length} record(s) → ${absOutput}`);
}

main();
