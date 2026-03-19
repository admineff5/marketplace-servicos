@echo off
REM VSIX 打包脚本 (Windows版本)
REM 用于将三层记忆系统MCP服务器打包为VSIX文件

setlocal enabledelayedexpansion

REM 配置信息
set EXTENSION_NAME=memory-mcp-server-anderson
set VERSION=1.6.0
set PUBLISHER=anderson-memory-tech
set VSIX_FILE=%EXTENSION_NAME%-%VERSION%.vsix

REM 颜色定义
set RED=[ERROR]
set GREEN=[SUCCESS]
set YELLOW=[WARNING]
set BLUE=[INFO]

REM 日志函数
:log_info
echo %BLUE% %*
goto :eof

:log_success
echo %GREEN% %*
goto :eof

:log_warning
echo %YELLOW% %*
goto :eof

:log_error
echo %RED% %*
goto :eof

REM 检查前置条件
:check_prerequisites
call :log_info "检查前置条件..."

REM 检查 vsce 命令是否安装
vsce --version >nul 2>&1
if errorlevel 1 (
    call :log_error "vsce 命令未安装，请先安装：npm install -g @vscode/vsce"
    exit /b 1
)

REM 检查 package.json 是否存在
if not exist "package.json" (
    call :log_error "package.json 文件不存在"
    exit /b 1
)

call :log_success "前置条件检查通过"
goto :eof

REM 清理之前的打包文件
:clean_previous
call :log_info "清理之前的打包文件..."

if exist "*.vsix" (
    del *.vsix
    call :log_success "已清理之前的VSIX文件"
)

if exist ".vsix" (
    rmdir /s /q ".vsix"
    call :log_success "已清理临时目录"
)

goto :eof

REM 验证插件配置
:validate_config
call :log_info "验证插件配置..."

REM 检查关键文件是否存在
set REQUIRED_FILES=README.md LICENSE CHANGELOG.md memory_mcp_simple.py

for %%f in (%REQUIRED_FILES%) do (
    if not exist "%%f" (
        call :log_error "必需文件不存在: %%f"
        exit /b 1
    )
)

call :log_success "插件配置验证通过"
goto :eof

REM 执行打包
:package_extension
call :log_info "开始打包插件..."

REM 使用 vsce 打包
vsce package
if not errorlevel 1 (
    call :log_success "插件打包成功!"
    call :log_info "生成的VSIX文件: %VSIX_FILE%"
) else (
    call :log_error "插件打包失败"
    exit /b 1
)

goto :eof

REM 验证打包结果
:verify_package
call :log_info "验证打包结果..."

if not exist "%VSIX_FILE%" (
    call :log_error "VSIX文件未生成: %VSIX_FILE%"
    exit /b 1
)

REM 检查文件大小
for %%i in (%VSIX_FILE%) do set size=%%~zi
if !size! lss 1000 (
    call :log_warning "VSIX文件大小异常: !size! 字节"
) else (
    call :log_success "VSIX文件大小正常: !size! 字节"
)

call :log_success "打包验证通过"
goto :eof

REM 显示打包信息
:show_package_info
call :log_info "=== 打包信息汇总 ==="
echo 插件名称: %EXTENSION_NAME%
echo 版本号: %VERSION%
echo 发布者: %PUBLISHER%
echo VSIX文件: %VSIX_FILE%
echo 文件大小: !size! 字节
echo.
call :log_success "打包完成！"
call :log_info "下一步: 运行 openvsx-publish.bat 发布到 Open VSX"
goto :eof

REM 主函数
:main
call :log_info "开始 VSIX 打包流程..."
echo.

call :check_prerequisites
echo.

call :clean_previous
echo.

call :validate_config
echo.

call :package_extension
echo.

call :verify_package
echo.

call :show_package_info
goto :eof

REM 执行主函数
call :main

endlocal