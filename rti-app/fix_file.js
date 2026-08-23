import fs from 'fs';
const file = 'c:/Users/royal/Desktop/Archieve/RTI-REMAKE-OPENAI/rti-app/src/pages/file.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/<div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">/g, 
'<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-200 pb-3 mb-3">');

c = c.replace(/<div className="flex justify-between items-center">/g, 
'<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">');

c = c.replace(/className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all \$\{/g, 
'className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm font-medium break-words whitespace-normal transition-all ${');

c = c.replace(/<span className="font-bold text-gray-700">Net Banking \/ Debit Card<\/span>/g, 
'<span className="font-bold text-gray-700 whitespace-normal text-left break-words">Net Banking / Debit Card</span>');

c = c.replace(/<span className="font-bold text-gray-700">Pay via UPI<\/span>/g, 
'<span className="font-bold text-gray-700 whitespace-normal text-left break-words">Pay via UPI</span>');

fs.writeFileSync(file, c, 'utf8');
