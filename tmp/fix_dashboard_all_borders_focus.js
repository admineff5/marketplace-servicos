const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory && f !== 'node_modules' && f !== '.next') {
            walkDir(dirPath, callback);
        } else if (!isDirectory && (f.endsWith('.tsx') || f.endsWith('.ts'))) {
            callback(dirPath);
        }
    });
}

const rootApp = 'c:\\Antigravity\\app\\dashboard';

walkDir(rootApp, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Corrigir Focus Ring e Focus Border
    if (content.indexOf('focus:ring-primary') !== -1) {
        content = content.split('focus:ring-primary').join('focus:ring-cyan-600 dark:focus:ring-primary');
        changed = true;
    }
    if (content.indexOf('focus:border-primary') !== -1) {
        content = content.split('focus:border-primary').join('focus:border-cyan-600 dark:focus:border-primary');
        changed = true;
    }
    
    // 2. Corrigir Focus Ring com opacidade (/50)
    if (content.indexOf('focus:ring-primary/50') !== -1) {
        content = content.split('focus:ring-primary/50').join('focus:ring-cyan-600/50 dark:focus:ring-primary/50');
        changed = true;
    }

    // 3. Corrigir Hover Border de Cards e Inputs
    const borderClasses = ['hover:border-primary/50', 'hover:border-primary/20', 'hover:border-primary/30', 'hover:border-primary', 'border-primary/20', 'border-primary/30'];
    
    borderClasses.forEach(cls => {
        if (content.indexOf(cls) !== -1) {
            const opacity = cls.includes('/') ? cls.split('/')[1] : null;
            const darkCls = opacity ? `dark:${cls}` : `dark:${cls}`; // dark:hover:border-primary/50
            const lightCls = opacity ? `hover:border-cyan-600/${opacity}` : `hover:border-cyan-600`;
            
            if (cls === 'hover:border-primary/50') content = content.split(cls).join('hover:border-cyan-600/50 dark:hover:border-primary/50');
            if (cls === 'hover:border-primary/20') content = content.split(cls).join('hover:border-cyan-600/20 dark:hover:border-primary/20');
            if (cls === 'hover:border-primary/30') content = content.split(cls).join('hover:border-cyan-600/30 dark:hover:border-primary/30');
            if (cls === 'hover:border-primary') content = content.split(cls).join('hover:border-cyan-600 dark:hover:border-primary');
            if (cls === 'border-primary/20') content = content.split(cls).join('border-cyan-600/20 dark:border-primary/20');
            if (cls === 'border-primary/30') content = content.split(cls).join('border-cyan-600/30 dark:border-primary/30');
            
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Bordas/Focus corrigidos em: ${filePath}`);
    }
});
