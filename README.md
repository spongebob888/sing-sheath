# sing-sheath
A simple sing-box client that can't be simpler.

This project is powered by [sing-sword](https://github.com/zzzgydi/sing-sword) project.
## How to use
* Add an outbound
* Add an inbound. Both tun mode and mixed mode are supported. But tun mode requires admin/root privilege.
* Click restart.
* Select an outbound from clash dashboard.

Remember, **every change you made requires a restart including switch on/off an inbound.**

## How it works
sing-sheath is basicly a sing-box backend with a json editor. And when you click restart, sing-sheath will generate appropriate dns rule and add a selector outbound.

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