import fs from 'fs';
const file = 'c:/Users/royal/Desktop/Archieve/RTI-REMAKE-OPENAI/rti-app/src/pages/about.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className="bg-white\/95 border-2 border-blue-300 shadow-md rounded-2xl p-8 mb-8"/g,
'className="bg-white/95 border-2 border-blue-300 shadow-md rounded-2xl p-5 md:p-8 mb-8"');

c = c.replace(/className="bg-white\/95 border-2 border-green-300 shadow-md rounded-2xl p-8 mb-8"/g,
'className="bg-white/95 border-2 border-green-300 shadow-md rounded-2xl p-5 md:p-8 mb-8"');

c = c.replace(/className="bg-white\/95 border-2 border-red-300 shadow-md rounded-2xl p-8"/g,
'className="bg-white/95 border-2 border-red-300 shadow-md rounded-2xl p-5 md:p-8"');

fs.writeFileSync(file, c, 'utf8');
