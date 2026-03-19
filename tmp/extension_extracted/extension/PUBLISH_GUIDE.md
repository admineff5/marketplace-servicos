# 三层记忆系统 MCP Server v1.6.0 Open VSX 发布指南

## 🚀 一键发布流程

### 前置条件检查

1. **安装 Node.js** (版本 16+)
   ```bash
   node --version
   ```

2. **安装 VSCE 工具**
   ```bash
   npm install -g @vscode/vsce
   ```

3. **安装 OVSX 工具**
   ```bash
   npm install -g ovsx
   ```

4. **登录 Open VSX**
   ```bash
   ovsx login
   ```
   或者设置环境变量：
   ```bash
   set OVSX_PAT=your_personal_access_token
   ```

### 一键发布步骤

#### 步骤 1：打包 VSIX 文件
```bash
# Windows
package.bat

# Linux/macOS
chmod +x package.bat
./package.bat
```

#### 步骤 2：发布到 Open VSX
```bash
# Windows
openvsx-publish.bat

# Linux/macOS
chmod +x openvsx-publish.sh
./openvsx-publish.sh
```

## 🔧 手动发布流程

### 1. 验证配置
```bash
# 检查 package.json 配置
cat package.json | grep -E '"(name|version|publisher)"'
```

### 2. 打包 VSIX
```bash
vsce package
```

### 3. 验证 VSIX 文件
```bash
# 检查文件是否存在
ls -la *.vsix

# 检查文件大小
stat -f%z memory-mcp-server-anderson-1.6.0.vsix
```

### 4. 发布到 Open VSX
```bash
ovsx publish memory-mcp-server-anderson-1.6.0.vsix
```

### 5. 验证发布结果
```bash
ovsx get anderson-memory-tech.memory-mcp-server-anderson
```

## 🔐 令牌配置

### Open VSX Personal Access Token

1. **获取令牌**
   - 访问 https://open-vsx.org/user-settings/tokens
   - 创建新的 Personal Access Token
   - 复制令牌值

2. **配置令牌**
   ```bash
   # 方法1：环境变量
   export OVSX_PAT=your_token_here
   
   # 方法2：登录
   ovsx login
   # 输入用户名和令牌
   ```

3. **验证登录状态**
   ```bash
   ovsx whoami
   ```

## 📋 发布检查清单

### 发布前检查
- [ ] package.json 配置正确
- [ ] 所有必需文件存在
- [ ] VSIX 文件大小正常 (>1KB)
- [ ] Open VSX 登录状态正常
- [ ] 版本号唯一（未发布过）

### 发布后验证
- [ ] Open VSX 页面可访问
- [ ] 插件信息显示正确
- [ ] 下载链接有效
- [ ] 版本号正确显示

## 🐛 常见问题解决

### 错误："ovsx command not found"
```bash
npm install -g ovsx
```

### 错误："vsce command not found"
```bash
npm install -g @vscode/vsce
```

### 错误："Not logged in"
```bash
ovsx login
# 或设置环境变量
set OVSX_PAT=your_token_here
```

### 错误："Version already exists"
- 更新 package.json 中的版本号
- 重新打包和发布

### 错误："VSIX file not found"
- 确保已执行 `vsce package`
- 检查当前目录是否有 .vsix 文件

## 🌐 发布后操作

### 1. 更新 GitHub 仓库
```bash
git add .
git commit -m "Release v1.6.0 - Open VSX publication"
git push origin main
```

### 2. 创建 GitHub Release
- 在 GitHub 仓库页面创建新 Release
- 版本号：v1.6.0
- 上传 VSIX 文件
- 添加发布说明

### 3. 更新文档
- 更新 README.md 中的安装说明
- 添加 Open VSX 安装方式
- 更新版本历史

## 📊 发布信息

### 插件信息
- **名称**: memory-mcp-server-anderson
- **版本**: 1.6.0
- **发布者**: anderson-memory-tech
- **Open VSX URL**: https://open-vsx.org/extension/anderson-memory-tech/memory-mcp-server-anderson

### 文件清单
```
memory-mcp-server-v1.6.0/
├── package.json              # 插件配置
├── package.bat               # Windows打包脚本
├── openvsx-publish.bat       # Windows发布脚本
├── openvsx-publish.sh        # Linux/macOS发布脚本
├── PUBLISH_GUIDE.md          # 发布指南
└── [其他核心文件...]
```

## 🎯 一键发布命令总结

### Windows
```cmd
package.bat && openvsx-publish.bat
```

### Linux/macOS
```bash
chmod +x package.bat openvsx-publish.sh
./package.bat && ./openvsx-publish.sh
```

## 📞 技术支持

如果遇到问题：
1. 检查本指南中的常见问题解决
2. 查看 Open VSX 文档：https://github.com/eclipse/openvsx/wiki
3. 在 GitHub Issues 中提交问题

---

**祝您发布顺利！** 🚀