const fs = require("fs");

// Find DataContext
let dcPath = "";
['src/context/DataContext.tsx', 'src/contexts/DataContext.tsx', 'src/context/DataProvider.tsx'].forEach(f => {
  try { fs.readFileSync(f); dcPath = f; } catch {}
});
console.log("DataContext at: " + dcPath);

let s = fs.readFileSync(dcPath, "utf8");
const lines = s.split("\n");
console.log("Lines: " + lines.length);

// Show loading/fetch related lines
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("loading") || lines[i].includes("fetch") || lines[i].includes("useEffect") || lines[i].includes("await") || lines[i].includes("Promise") || lines[i].includes("getAll") || lines[i].includes("onSnapshot")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// Also show the loading spinner component
let appPath = "";
['src/App.tsx', 'src/main.tsx'].forEach(f => {
  try {
    let content = fs.readFileSync(f, "utf8");
    if (content.includes("loading") || content.includes("spinner") || content.includes("Loading")) {
      console.log("\n=== " + f + " loading lines ===");
      content.split("\n").forEach((l, i) => {
        if (l.includes("loading") || l.includes("Loading") || l.includes("spinner") || l.includes("Suspense")) {
          console.log((i+1) + ": " + l.trimEnd());
        }
      });
    }
  } catch {}
});
