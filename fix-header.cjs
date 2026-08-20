const fs = require('fs');
const f = 'src/components/Header.tsx';
let c = fs.readFileSync(f, 'utf8');
const orig = c;

// Fix 1: change 'click' to 'mousedown' for outside-click - stops race with Link navigation
c = c.replace(/document\.addEventListener\('click',\s*handleClickOutside\)/g,
              "document.addEventListener('mousedown', handleClickOutside)");
c = c.replace(/document\.removeEventListener\('click',\s*handleClickOutside\)/g,
              "document.removeEventListener('mousedown', handleClickOutside)");

// Fix 2: close dropdown automatically when route changes
if (!c.includes('location.pathname]) {')) {
  c = c.replace(
    /const isMoreActive = moreLinks\.some/,
    `const isMoreActive = moreLinks.some`
  );
  // Add useEffect after moreRef declaration
  c = c.replace(
    "const moreRef = useRef<HTMLDivElement>(null);",
    `const moreRef = useRef<HTMLDivElement>(null);
  // Auto-close dropdown on navigation
  useEffect(() => { setMoreOpen(false); }, [location.pathname]);`
  );
}

// Fix 3: ensure dropdown links close menu on click
// Replace any dropdown Link without onClick handler
c = c.replace(
  /(<Link\s+key=\{l\.path\}\s+to=\{l\.path\})(\s*className)/g,
  '$1 onClick={() => setMoreOpen(false)}$2'
);

if (c !== orig) {
  fs.writeFileSync(f, c, 'utf8');
  console.log('GATI: Header.tsx u rregullua!');
} else {
  console.log('KUJDES: Asnjë ndryshim nuk u bë - shfaq header-output.txt');
}
