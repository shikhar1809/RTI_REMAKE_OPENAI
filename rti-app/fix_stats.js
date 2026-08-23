import fs from 'fs';
const file = 'c:/Users/royal/Desktop/Archieve/RTI-REMAKE-OPENAI/rti-app/src/pages/stats.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/<div className="px-5 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between gap-4">/g, 
'<div className="px-5 py-4 bg-blue-50 border-b border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">');

c = c.replace(/<div className="flex bg-gray-200 p-1 rounded-lg">/g, 
'<div className="flex w-full sm:w-auto justify-between sm:justify-start bg-gray-200 p-1 rounded-lg">');

c = c.replace(/className={`flex items-center gap-1\.5 px-3 py-1\.5 rounded-md text-xs font-bold transition-all \$\{viewMode === "list"/g, 
'className={`flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "list"');

c = c.replace(/className={`flex items-center gap-1\.5 px-3 py-1\.5 rounded-md text-xs font-bold transition-all \$\{viewMode === "chart"/g, 
'className={`flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "chart"');

c = c.replace(/className={`flex items-center gap-1\.5 px-3 py-1\.5 rounded-md text-xs font-bold transition-all \$\{viewMode === "map"/g, 
'className={`flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "map"');

c = c.replace(/<div className="grid grid-cols-2 gap-3">/g, 
'<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">');

c = c.replace(/<div className="flex flex-wrap items-center justify-between gap-3 mt-1">/g, 
'<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">');

c = c.replace(/className="text-green-600 font-bold text-xs hover:text-green-800 transition-colors bg-green-50 px-3 py-1\.5 rounded-lg border border-green-200 hover:bg-green-100"/g, 
'className="w-full sm:w-auto text-center text-green-600 font-bold text-xs hover:text-green-800 transition-colors bg-green-50 px-3 py-2 sm:py-1.5 rounded-lg border border-green-200 hover:bg-green-100"');

fs.writeFileSync(file, c, 'utf8');
