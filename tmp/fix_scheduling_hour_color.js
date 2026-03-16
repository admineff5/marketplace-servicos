const fs = require('fs');
const path = 'c:\\Antigravity\\app\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const buttonOld = `className={\`px-4 py-2 rounded-lg text-sm font-bold border transition-all \${
                                      selectedTime === time
                                        ? "bg-primary border-primary text-black"
                                        : "bg-gray-50 dark:bg-black border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary/50"
                                    }\`}`;

const buttonNew = `className={\`px-4 py-2 rounded-lg text-sm font-bold border transition-all \${
                                      selectedTime === time
                                        ? "border-cyan-800 bg-cyan-800 text-white dark:border-primary dark:bg-primary dark:text-black"
                                        : "bg-gray-50 dark:bg-black border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary/50"
                                    }\`}`;

if (content.indexOf('selectedTime === time') !== -1) {
    const errorRegex = /selectedTime === time\s*\?\s*"bg-primary border-primary text-black"/;
    if (errorRegex.test(content)) {
         content = content.replace(errorRegex, 'selectedTime === time\n                                        ? "border-cyan-800 bg-cyan-800 text-white dark:border-primary dark:bg-primary dark:text-black"');
         console.log("Cor do botão de horário ajustada para Light Mode!");
         fs.writeFileSync(path, content, 'utf8');
    } else {
         console.log("Regex do botão de horário não deu match.");
    }
} else {
    console.log("selectedTime === time não encontrado no arquivo.");
}
