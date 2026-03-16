const fs = require('fs');
const path = 'c:\\Antigravity\\app\\dashboard\\produtos\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Corrigir Imagens Quebradas na Listagem (onError)
const cardImgOld = `<img src={produto.image} alt={produto.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />`;
const cardImgNew = `<img src={produto.image} alt={produto.name} onError={(e: any) => e.target.style.display = 'none'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />`;

if (content.indexOf(cardImgOld) !== -1) {
    content = content.replace(cardImgOld, cardImgNew);
    console.log("Fallback onError adicionado na listagem de produtos!");
}

// 2. Adicionar Drag & Drop na Dropzone do Modal
const dropzoneOld = `<div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111] overflow-hidden flex items-center justify-center shrink-0 shadow-sm relative group cursor-pointer">`;

const dropzoneNew = `<div 
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const file = e.dataTransfer.files[0];
                                        if (file && file.type.startsWith("image/")) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => setFormImage(event.target?.result as string);
                                            reader.readAsDataURL(file);
                                        } else {
                                            const url = e.dataTransfer.getData("text/plain");
                                            if (url && (url.startsWith("http") || url.startsWith("data:"))) {
                                                setFormImage(url);
                                            }
                                        }
                                    }}
                                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111] overflow-hidden flex items-center justify-center shrink-0 shadow-sm relative group cursor-pointer"
                                >`;

if (content.indexOf(dropzoneOld) !== -1) {
    content = content.replace(dropzoneOld, dropzoneNew);
    console.log("Drag & Drop adicionado na caixa de Foto do Produto!");
} else {
    console.log("Dropzone antiga não encontrada para colagem.");
}

fs.writeFileSync(path, content, 'utf8');
