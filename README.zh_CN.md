# sing-sheath
<a href="./README.zh_CN.md">中文</a>|
<a href="./README.md">English</a>

一个简单到不能再简单到 sing-box GUI客户端。

该项目基于 [sing-sword](https://github.com/zzzgydi/sing-sword) 。

## 如何使用

- 添加一个出站 (outbound)。
- 添加一个入站(inbound)。 同时支持Tun 模式 和 mixed 模式. Tun 模式需要特权（root/admin）。
- 点击 Restart. 会发生
  - 所有到出站会被添加到一个叫 **auto** 的 urltest 出站.
  - 所有到出站会被添加到一个叫 **selector-out** 的 selector 出站
  - json 配置文件将被保存。
  - 配置文件将被检查（check）。
  - sing-box 将重启。
- 从 dashboard 中选择一个出站。

注意， **json 编辑器中任何改变都需重启（restart）包括打开/关闭入站**

## 复位/Reset
点击复位(reset)会将配置文件复位（复位至`sing-box-default.json`），但是出站列表将被保留。

## 入站/Inbounds
入站可以通过开关打开或关闭。Tun/Mixed 入站的默认配置读取自`sing-box-default.json`。
如果想改变打开Tun/Mixed模式后的默认json配置，可以更改`sing-box-default.json`。

## 出站/Outbounds
出站可以通过剪切板导入，导入的格式支持json outbound格式和 json outbound 数组格式。
## 内核/Core
内核位于 `sing-sword/sing/core`. 如果该文件夹不存在，将会被创建，
默认内核文件也将被复制过去。

用户可以添加他们自己版本到sing-box内核到内核目录。

## 配置文件/Profile
可以在配置文件输入框搜索或创建新的配置文件。默认情况下，创建的配置文件和当前
配置文件相同。

## 工作原理

sing-sheath 可以认为是带有sing-box内核到json编辑器。当点击 Restart 按钮后，
sing-sheath 会生成合适 selector 出站和 urltest 出站并保存配置文件。

## 第一次启动
第一次启动时，sing-sheath 将会创建 sing-sword 目录，并复制sing-box内核到该目录。
通常，sing-box启动后，geodata 将会被自动下载。 但是取决与网络连通性和
GFW屏蔽情况，下载可能失败，留下一个空到geodata。如果这种情况发生，删除该空文件，
并添加一个能够穿透防火墙的出站协议。

注意, **首次启动可能需要一些时间下载geodata** 

## FAQ

### Tun Mode

Tun 模式需要特权。

#### Windows系统

使用管理员权限运行

#### On Linux

第一次启动后运行下述命令（可能需要将*替换为内核文件名）

```
sudo setcap cap_net_bind_service,cap_net_admin=+ep ~/.config/sing-sword/sing/core/*
```

#### On MacOS

第一次启动后运行下述命令（可能需要将*替换为内核文件名）

```
sudo chown root:admin ~/.config/sing-sword/sing/core/*
sudo chmod +sx ~/.config/sing-sword/sing/core/*
```
