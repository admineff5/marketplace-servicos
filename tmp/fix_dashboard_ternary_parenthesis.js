const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Ajustar o Ternário para ter Parênteses Protetores ( )
const searchTernary = `) : recentAppointments.length > 0 ? recentAppointments.map((apt: any) => (`;
const replaceTernary = `) : recentAppointments.length > 0 ? (\n                            recentAppointments.map((apt: any) => (`;

const searchEndMap = `                                </div>\n                            </div>) : (`;
const replaceEndMap = `                                </div>\n                            </div>\n                        ))) : (`;

if (content.indexOf(searchTernary) !== -1) {
    content = content.replace(searchTernary, replaceTernary);
    console.log("Início do Ternário protegido com (");
}

if (content.indexOf(searchEndMap) !== -1) {
    content = content.replace(searchEndMap, replaceEndMap);
    console.log("Fim do Ternário fechado com )");
} else {
    // Tentativa CRLF
    const searchEndMapCRLF = `                                </div>\r\n                            </div>) : (`;
    const replaceEndMapCRLF = `                                </div>\r\n                            </div>\r\n                        ))) : (`;
    if (content.indexOf(searchEndMapCRLF) !== -1) {
        content = content.replace(searchEndMapCRLF, replaceEndMapCRLF);
        console.log("Fim do Ternário fechado com ) via CRLF");
    }
}

fs.writeFileSync(path, content, 'utf8');
