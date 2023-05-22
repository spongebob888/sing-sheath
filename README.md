# sing-sheath

A simple sing-box client that can't be simpler.

This project is powered by [sing-sword](https://github.com/zzzgydi/sing-sword) project.

## How to use

- Add an outbound
- Add an inbound. Both tun mode and mixed mode are supported. But tun mode requires admin/root privilege.
- Click restart. It will
  - add all the outbounds to a urltest outbound named **auto** .
  - add all the outbounds to a selector outbound named **selector-out** .
  - save the configuration.
  - check the configuration.
  - restart sing-box.
- Select an outbound from clash dashboard.

Remember, **every change you made requires a restart including switch on/off an inbound.**

## Reset
Click reset will reset the configuration to `sing-box-default.json` except that the outbounds are kept unchanged.

## Inbounds
Inbounds can be swiched on/off. And the default configuration for tun/mixed is read
from `sing-box-default.json`. If you want to change the default switch behavior. Change this file.

## Outbounds
Outbounds can be import from clipboard as outbound json or outbound json array.

## Core
The core is at `sing-sword/sing/core`. If the
directory doesn't exist. It will be created and a default sing-box core will be copied.

## Profile
You can select or create a profile by clicking the profile input button. By default
the created profile will be the same as current profile.

## How it works

sing-sheath is basicly a sing-box backend with a json editor. And when you click restart, sing-sheath will generate appropriate dns rule and add a selector outbound.

## First time start
At the first time start, it will creat sing-sword directory and copy default sing-box core there. Usually, after sing-box started, geodata will be downloaded automatically. But depending on internet connectivity and GFW behavior, it might fail and leave a empty geodata database file.
In this case, remove empty geodata and add a 
reliable proxy for geodata downloading.

## FAQ

### Tun Mode

Tun mode requires privilege to run.

#### On Windows

You should run as administrator.

#### On Linux

After first run. run the following command.

```
sudo setcap cap_net_bind_service,cap_net_admin=+ep ~/.config/sing-sword/sing/core/*
```

#### On MacOS

After first run.

```
sudo chown root:admin ~/.config/sing-sword/sing/core/*
sudo chmod +sx ~/.config/sing-sword/sing/core/*
```
