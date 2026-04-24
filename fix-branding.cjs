const fs = require("fs");

// FFK Kosovo logo URL (official logo used in the app)
const ffkLogoUrl = "https://d64gsuwffb70l.cloudfront.net/69b1c5d3aa33715dda5ad3a9_1773258315744_b173e8af.png";

// 1) Update index.html
let html = fs.readFileSync("index.html", "utf8");

// Change title
html = html.replace("<title>Kosovo Futsal Manager</title>", "<title>FFK FUTSALL</title>");

// Change favicon - use the FFK logo PNG instead of placeholder SVG
html = html.replace(
  '<link rel="icon" type="image/svg+xml" href="/placeholder.svg" />',
  '<link rel="icon" type="image/png" href="/ffk-logo-192.png" />'
);

// Change OG title
html = html.replace(
  'content="Kosovo Futsal Manager"',
  'content="FFK FUTSALL"'
);

// Change description
html = html.replace(
  'content="Manage and showcase official futsal statistics for Kosovo\'s leagues and competitions, with a user-friendly interface and instant updates."',
  'content="FFK FUTSALL - Platforma zyrtare e statistikave te futsallit ne Kosove"'
);

// Fix the second description too (og:description)
html = html.replace(
  'content="Manage and showcase official futsal statistics for Kosovo\'s leagues and competitions, with a user-friendly interface and instant updates."',
  'content="FFK FUTSALL - Platforma zyrtare e statistikave te futsallit ne Kosove"'
);

fs.writeFileSync("index.html", html, "utf8");
console.log("[OK] index.html updated: title=FFK FUTSALL, favicon=ffk-logo-192.png");

// 2) Update manifest.json
let manifest = JSON.parse(fs.readFileSync("public/manifest.json", "utf8"));
manifest.name = "FFK FUTSALL";
manifest.short_name = "FFK FUTSALL";
manifest.description = "FFK FUTSALL - Platforma zyrtare e statistikave te futsallit ne Kosove";
fs.writeFileSync("public/manifest.json", JSON.stringify(manifest, null, 2), "utf8");
console.log("[OK] manifest.json updated: name=FFK FUTSALL");

// 3) Check Header.tsx for app name
let header = fs.readFileSync("src/components/Header.tsx", "utf8");
if (header.includes("Kosovo Futsal Manager")) {
  header = header.replace(/Kosovo Futsal Manager/g, "FFK FUTSALL");
  fs.writeFileSync("src/components/Header.tsx", header, "utf8");
  console.log("[OK] Header.tsx updated");
}

// 4) Check Footer
let footer = fs.readFileSync("src/components/Footer.tsx", "utf8");
if (footer.includes("Kosovo Futsal Manager")) {
  footer = footer.replace(/Kosovo Futsal Manager/g, "FFK FUTSALL");
  fs.writeFileSync("src/components/Footer.tsx", footer, "utf8");
  console.log("[OK] Footer.tsx updated");
}

// 5) Check if there are other references
const files = [
  "src/App.tsx", "src/components/AppLayout.tsx", "src/context/DataContext.tsx"
];
files.forEach(f => {
  try {
    let content = fs.readFileSync(f, "utf8");
    if (content.includes("Kosovo Futsal Manager")) {
      content = content.replace(/Kosovo Futsal Manager/g, "FFK FUTSALL");
      fs.writeFileSync(f, content, "utf8");
      console.log("[OK] " + f + " updated");
    }
  } catch {}
});

console.log("\n[DONE] All references updated to FFK FUTSALL");
console.log("Favicon: /ffk-logo-192.png (FFK logo)");
