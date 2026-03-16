const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory && f !== 'node_modules' && f !== '.next') {
            walkDir(dirPath, callback);
        } else if (!isDirectory && (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.jsx'))) {
            callback(dirPath);
        }
    });
}

const rootApp = 'c:\\Antigravity\\app';

walkDir(rootApp, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.indexOf('src="/logo icon.png"') !== -1) {
        content = content.split('src="/logo icon.png"').join('src="/logo-icon.png"');
        changed = true;
        console.log(`Corrigido em: ${filePath}`);
    }

    if (content.indexOf('src="/logos/logo_icon.png"') !== -1) {
        content = content.split('src="/logos/logo_icon.png"').join('src="/logo-icon.png"');
        changed = true;
        console.log(`Corrigido logos/ em: ${filePath}`);
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
