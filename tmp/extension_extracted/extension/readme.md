# 三层记忆系统 MCP Server v1.6.0

为 Trae IDE 提供基于 OpenClaw 三层记忆架构的持久化记忆系统。支持跨会话记忆、智能工具选择、开机自动加载等功能。

## ✨ 特性

- **三层记忆架构**：L1 核心事实、L2 情景记忆、L3 原始日志 + 学习反思层
- **MCP 协议集成**：提供标准 MCP 工具，可被 Builder with MCP 自动加载
- **智能工具管理**：自动记录工具功能状态，基于历史经验推荐最佳工具
- **记忆-执行关联**：将执行结果与记忆关联，防止重复错误
- **开机自启**：支持 Trae 项目级 MCP 自动运行
- **快照恢复**：自动保存系统状态，重启后无缝恢复上下文

## 📦 安装

### 环境要求
- Python 3.10+
- Trae IDE（建议最新版本）

### 1. 克隆/下载本项目
```bash
git clone https://github.com/yourusername/memory-mcp-server.git 
cd memory-mcp-server
```

### 2. 安装依赖
```bash
pip install -r requirements.txt
```

### 3. 配置 Trae 项目级 MCP
在项目根目录创建 `.trae/mcp.json` 文件，内容如下：

```json
{
  "mcpServers": {
    "memory-mcp": {
      "command": "python",
      "args": ["memory_mcp_simple.py"],
      "cwd": "${workspaceFolder}",
      "autoStart": true
    }
  }
}
```

或者使用虚拟环境中的 Python：

```json
{
  "mcpServers": {
    "memory-mcp": {
      "command": "${workspaceFolder}/.venv/Scripts/python.exe",
      "args": ["memory_mcp_simple.py"],
      "cwd": "${workspaceFolder}",
      "autoStart": true
    }
  }
}
```

### 4. 开启项目级 MCP
- 在 Trae IDE 中打开该项目
- 进入 MCP 设置，打开 "启用项目级 MCP" 开关
- 保存并重启 IDE（或重载窗口）

### 5. 验证
在 Builder with MCP 中发送：

```text
memory-mcp/get_memory_status
```

应返回系统状态报告。

## 🔧 可用工具

| 工具名 | 描述 | 参数 |
|--------|------|------|
| `get_memory_status` | 获取记忆系统当前状态 | 无 |
| `load_memory` | 加载记忆并注入上下文 | `{"force_reload": true}`（可选） |
| `select_tool` | 根据任务推荐最佳工具 | `{"task": "描述", "constraints": {...}}` |
| `record_execution` | 记录工具执行结果（供后续学习） | `{"tool": "名称", "result": "成功/失败", "notes": "..."}` |

## 🧠 记忆存储结构

```text
项目根目录/
├── .memory/               # L1+L2 记忆（核心事实、情景）
│   ├── YYYY-MM-DD.md      # 每日对话记录
│   └── important.md        # 长期重要事实
├── .ldr_memory/           # 统一索引、工具管理
│   ├── mechanisms.json     # 机制注册表
│   ├── tool_selection_rules.py
│   └── simple_startup_loader.py
├── learnings/              # L3 学习反思
│   └── *.md
├── memory_backup/          # 自动快照
└── memory_mcp_simple.py    # MCP 主服务
```

## 🚀 开机自动加载

系统启动时，MCP 服务会自动运行 `simple_startup_loader.py`，执行：

1. 检查所有必需文件
2. 加载工具管理规则
3. 根据历史经验标记工具状态（如"完整版"、"不推荐版"）
4. 注入启动上下文，使 AI 记住上次工作状态

## 📝 使用示例

### 示例 1：获取当前记忆状态

```text
memory-mcp/get_memory_status
```

### 示例 2：执行百度 POI 扫描（自动选择最佳工具）

```text
请使用记忆系统推荐的 POI 扫描工具，对郑州区域进行六边形扫描。
```

系统会自动调用 `select_tool`，选择功能完整的增强版扫描器，并返回扫描结果。

### 示例 3：强制重新加载记忆

```text
memory-mcp/load_memory {"force_reload": true}
```

## 🤝 贡献

欢迎提交 Issue 和 PR。请遵循 MIT 许可证。

## 📄 许可证

MIT