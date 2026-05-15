# TJU-KnowledgeMap 使用教程

这是项目内部传阅用的启动说明。目标是让没有开发经验的同事也能照着完成：安装 Git、安装 WSL、安装 Docker、下载项目、启动项目、访问 localhost 页面。

## 0. 先看这几个概念

本项目运行时需要两个东西：

```text
项目网站/API：运行在 http://localhost:3000
Neo4j 数据库：运行在 http://localhost:7474 和 neo4j://localhost:7687
```

不用手动安装 Node.js，也不用手动安装 Neo4j。Docker 会自动运行它们。

## 1. 打开 PowerShell

后面的命令都在 PowerShell 里输入。

普通 PowerShell 打开方式：

1. 点击 Windows 开始菜单。
2. 搜索 `PowerShell`。
3. 点击 `Windows PowerShell` 打开。

管理员 PowerShell 打开方式：

1. 点击 Windows 开始菜单。
2. 搜索 `PowerShell`。
3. 右键 `Windows PowerShell`。
4. 点击 `以管理员身份运行`。

注意：安装 WSL 或启用系统功能时，需要用管理员 PowerShell。普通启动项目时，用普通 PowerShell 就可以。

## 2. PowerShell 最基础命令

查看当前所在目录：

```powershell
pwd
```

查看当前目录下有哪些文件：

```powershell
dir
```

进入某个文件夹：

```powershell
cd 文件夹名
```

返回上一级目录：

```powershell
cd ..
```

进入桌面：

```powershell
cd "$HOME\Desktop"
```

进入 D 盘：

```powershell
D:
```

进入一个完整路径。路径里有空格或中文时，一定要加英文双引号：

```powershell
cd "D:\Projects\TJU-KnowledgeMap"
```

进入本项目目录的例子：

```powershell
cd "C:\Users\你的用户名\Desktop\TJU-KnowledgeMap"
```

提示：输入文件夹名前几个字母后，可以按 `Tab` 自动补全路径。

## 3. 安装 Git

Git 用来从 GitHub 下载项目代码。

下载地址：

```text
https://git-scm.com/downloads
```

安装方法：

1. 打开上面的地址。
2. 下载 Windows 版本。
3. 运行安装包。
4. 一路默认下一步即可。
5. 安装完成后重新打开 PowerShell。

检查是否安装成功：

```powershell
git --version
```

能看到版本号，就说明 Git 安装成功。

## 4. 安装或启用 WSL

Docker Desktop 在 Windows 上通常需要 WSL 2。很多电脑没有提前装 WSL，所以建议先检查。

### 4.1 检查电脑有没有 WSL

打开 PowerShell，输入：

```powershell
wsl --status
```

如果能看到 WSL 状态信息，说明已经有 WSL。

如果提示 `wsl 不是内部或外部命令`，或者提示没有安装 WSL，就继续下面的安装步骤。

### 4.2 安装 WSL

用管理员 PowerShell 执行：

```powershell
wsl --install
```

执行完成后，重启电脑。

重启后再打开 PowerShell，执行：

```powershell
wsl --status
```

如果能看到状态信息，就说明 WSL 已经安装。

### 4.3 如果 wsl --install 失败

用管理员 PowerShell 依次执行：

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
bcdedit /set hypervisorlaunchtype auto
wsl --update
```

然后重启电脑。

重启后再检查：

```powershell
wsl --status
```

## 5. 安装 Docker Desktop

Docker 用来自动运行本项目需要的 Node 后端和 Neo4j 数据库。

下载地址：

```text
https://www.docker.com/products/docker-desktop/
```

安装步骤：

1. 打开上面的 Docker 官网下载页。
2. 下载 Windows 版本的 Docker Desktop。
3. 运行安装包。
4. 安装过程中如果看到 WSL 2 相关选项，保持默认勾选。
5. 安装完成后重启电脑。
6. 打开 Docker Desktop。
7. 等左下角显示 Docker 正在运行。

检查 Docker 是否安装成功：

```powershell
docker --version
docker compose version
```

能看到版本号，就说明 Docker 安装成功。

## 6. 从 GitHub 下载项目

建议把项目放到桌面，方便找到。

打开普通 PowerShell，进入桌面：

```powershell
cd "$HOME\Desktop"
```

下载项目：

```powershell
git clone https://github.com/RogerGuo26/TJU-KnowledgeMap.git
```

进入项目目录：

```powershell
cd TJU-KnowledgeMap
```

确认当前目录里有项目文件：

```powershell
dir
```

如果能看到这些文件，就说明位置对了：

```text
docker-compose.yml
Dockerfile
README.md
package.json
dumps
```

## 7. 启动项目

先确认 Docker Desktop 已经打开，并且处于运行状态。

在项目目录里执行：

```powershell
docker compose up --build
```

第一次启动会自动完成这些事情：

1. 下载 Node 和 Neo4j 的 Docker 镜像。
2. 构建后端 API 容器。
3. 创建 Neo4j 数据库容器。
4. 自动导入 `dumps/neo4j.dump` 数据。
5. 启动项目网站和后端接口。

第一次启动会比较慢。看到日志一直滚动是正常的，不要急着关窗口。

## 8. 访问地址和账号密码

### 8.1 项目网站

访问地址：

```text
http://localhost:3000
```

账号密码：

```text
无需账号密码，直接打开即可使用。
```

后端测试接口：

```text
http://localhost:3000/api/hello
http://localhost:3000/api/test-db
```

### 8.2 Neo4j 数据库后台

访问地址：

```text
http://localhost:7474
```

登录信息：

```text
账号：neo4j
密码：localpassword
```

连接地址：

```text
neo4j://localhost:7687
```

## 9. 停止项目

如果 PowerShell 窗口里还在运行 `docker compose up --build`，先按：

```text
Ctrl + C
```

然后执行：

```powershell
docker compose down
```

这样会停止项目，但保留 Neo4j 数据。

## 10. 下次重新启动

以后再次使用项目时：

1. 打开 Docker Desktop。
2. 打开 PowerShell。
3. 进入项目目录。
4. 启动项目。

如果项目在桌面：

```powershell
cd "$HOME\Desktop\TJU-KnowledgeMap"
docker compose up
```

如果修改过代码，建议用：

```powershell
docker compose up --build
```

## 11. 重新初始化数据库

如果数据没有出现，或者想恢复到项目自带的初始数据，执行：

```powershell
docker compose down -v
docker compose up --build
```

注意：`docker compose down -v` 会删除 Docker 里当前项目的 Neo4j 数据卷。下次启动时，会重新从 `dumps/neo4j.dump` 导入数据。

## 12. 常见问题

### 12.1 Docker 提示 Virtualization support not detected

先打开任务管理器：

```text
性能 -> CPU -> 虚拟化
```

如果显示“已禁用”，需要进 BIOS 打开虚拟化。

如果已经显示“已启用”，用管理员 PowerShell 执行：

```powershell
wsl --install
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
bcdedit /set hypervisorlaunchtype auto
```

然后重启电脑，再打开 Docker Desktop。

### 12.2 cd 进入目录失败

如果路径里有空格或中文，要加英文双引号。

错误示例：

```powershell
cd C:\Users\admin\Desktop\TJU KnowledgeMap
```

正确示例：

```powershell
cd "C:\Users\admin\Desktop\TJU KnowledgeMap"
```

### 12.3 端口被占用

本项目默认使用：

```text
3000：项目网站和 API
7474：Neo4j 浏览器后台
7687：Neo4j 数据库连接
```

如果这些端口被其他软件占用，先关闭占用端口的软件，再重新执行：

```powershell
docker compose up --build
```

### 12.4 数据没有出现

执行：

```powershell
docker compose down -v
docker compose up --build
```

这样会清空旧的 Docker 数据卷，并重新导入项目里的 `dumps/neo4j.dump`。

### 12.5 命令前面的 PS C:\... 要不要复制

不要复制。

如果教程或别人截图里显示：

```text
PS C:\Users\admin>
```

那只是 PowerShell 当前路径提示，不是命令本身。只复制后面的命令。

## 13. 给开发者的说明

不要提交这些内容：

```text
.env
node_modules/
```

项目数据文件在：

```text
dumps/neo4j.dump
```

Docker 启动时会自动导入这个 dump 文件。
