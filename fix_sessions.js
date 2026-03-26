const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

walkDir(path.join(__dirname, 'app/api'), function(filePath) {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    if (content.includes('JSON.parse(session.value)')) {
        
        // Ensure getSession import exists
        if (!content.includes('getSession')) {
            content = content.replace(/(import \{ NextResponse \} from "next\/server";\r?\n)/, '$1import { getSession } from "@/lib/auth";\n');
        }

        // 1. Replace the extraction logic
        content = content.replace(/const cookieStore = await cookies\(\);\s*const session = cookieStore\.get\("auth_session"\);/g, 'const session = await getSession();');
        content = content.replace(/const cookieStore = await cookies\(\);\s*const session = cookieStore\.get\('auth_session'\);/g, 'const session = await getSession();');

        // 2. Fix the line where JSON.parse is used
        content = content.replace(/const \{ id: userId \} = JSON\.parse\(session\.value\);/g, 'const { id: userId } = session;');
        content = content.replace(/const \{ id: userId, role \} = JSON\.parse\(session\.value\);/g, 'const { id: userId, role } = session;');
        content = content.replace(/const userData = JSON\.parse\(session\.value\);/g, 'const userData = session;');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed:', filePath);
        }
    }
});
