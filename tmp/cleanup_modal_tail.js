const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\agenda\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// O Modal sadiio que inserimos fecha com `)}`
// Depois dele, o arquivo de 453 linhas tinha o modal antigo solto
const markerCorrectModalBack = `                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}`;

const indexMarker = content.indexOf(markerCorrectModalBack);

if (indexMarker !== -1) {
    const before = content.substring(0, indexMarker + markerCorrectModalBack.length);
    
    // O final sadio do arquivo deve fechar a div principal e o componente AgendaPage:
    const correctTail = `\n            </div>\n        </div>\n    );\n}`;
    
    const result = before + correctTail;
    fs.writeFileSync(path, result, 'utf8');
    console.log("Rabo de modal antigo removido e fechamento re-estaelecido!");
} else {
    console.log("Modal correto não encontrado para limpeza de rabo!");
}
