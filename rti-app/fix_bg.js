import fs from 'fs';
const file = 'c:/Users/royal/Desktop/Archieve/RTI-REMAKE-OPENAI/rti-app/src/index.css';
let c = fs.readFileSync(file, 'utf8');

const oldCSS = `.bg-home-responsive::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background-image: url('/bg-mobile.png');
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
    background-attachment: fixed;
    opacity: 0.5;
  }`;

const newCSS = `.bg-home-responsive::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background-image: url('/bg-mobile.png');
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
    opacity: 0.5;
  }`;

if(c.includes('position: absolute;') && c.includes('background-attachment: fixed;')) {
  c = c.replace(oldCSS, newCSS);
  fs.writeFileSync(file, c, 'utf8');
  console.log('Fixed successfully');
} else {
  console.log('Could not find target CSS');
}
