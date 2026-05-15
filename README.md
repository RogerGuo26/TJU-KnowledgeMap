# TJU-KnowledgeMap 使用教程

这是项目内部传阅用的启动说明。按下面步骤操作，可以从 GitHub 下载项目，并用 Docker 一键启动后端和 Neo4j 数据库。

## 1. 需要先安装的软件

### 1.1 安装 Git

Git 用来从 GitHub 下载项目代码。

下载地址：

```text
https://git-scm.com/downloads
```

下载安装后，一路默认下一步即可。安装完成后，打开 PowerShell，输入：

```powershell
git --version
```

能看到版本号就说明安装成功。

### 1.2 安装 Docker Desktop

Docker 用来自动运行本项目需要的 Node 后端和 Neo4j 数据库，不需要手动安装 Node.js 或 Neo4j。

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

安装完成后，打开 PowerShell，输入：

```powershell
docker --version
docker compose version
```

能看到版本号就说明 Docker 安装成功。

## 2. 下载项目代码

找一个你想放项目的文件夹，例如桌面或 D 盘，然后在空白处右键打开 PowerShell。

输入：

```powershell
git clone https://github.com/RogerGuo26/TJU-KnowledgeMap.git
```

进入项目目录：

```powershell
cd TJU-KnowledgeMap
```

## 3. 启动项目

启动前确认 Docker Desktop 已经打开，并且处于运行状态。

在项目目录里执行：

```powershell
docker compose up --build
```

第一次启动会自动完成这些事情：

1. 下载 Node 和 Neo4j 的 Docker 镜像。
2. 构建后端 API 容器。
3. 创建 Neo4j 数据库容器。
4. 自动导入 `dumps/neo4j.dump` 数据。
5. 启动网站后端服务。

第一次启动会比较慢，看到日志继续滚动是正常的。等日志稳定后，就可以访问网站。

## 4. 访问地址和账号密码

### 4.1 项目网站

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

### 4.2 Neo4j 数据库后台

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

## 5. 停止项目

如果 PowerShell 窗口里还在运行 `docker compose up --build`，按：

```text
Ctrl + C
```

然后执行：

```powershell
docker compose down
```

这样会停止项目，但保留 Neo4j 数据。

## 6. 下次重新启动

以后再次进入项目目录后，只需要：

```powershell
docker compose up
```

如果修改过代码，建议用：

```powershell
docker compose up --build
```

## 7. 重新初始化数据库

如果想删除当前 Docker 里的 Neo4j 数据，并重新从 `dumps/neo4j.dump` 导入，执行：

```powershell
docker compose down -v
docker compose up --build
```

注意：`docker compose down -v` 会删除 Docker 里当前项目的 Neo4j 数据卷，然后下次启动时重新导入 dump。

## 8. 常见问题

### 8.1 Docker 打不开，提示 Virtualization

先打开任务管理器：

```text
性能 -> CPU -> 虚拟化
```

如果显示“已禁用”，需要进 BIOS 打开虚拟化。

如果已经显示“已启用”，用管理员 PowerShell 执行：

```powershell
wsl --install
```

然后重启电脑，再打开 Docker Desktop。

### 8.2 端口被占用

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

### 8.3 数据没有出现

先执行：

```powershell
docker compose down -v
docker compose up --build
```

这样会清空旧的 Docker 数据卷，并重新导入项目里的 `dumps/neo4j.dump`。

## 9. 给开发者的说明

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
