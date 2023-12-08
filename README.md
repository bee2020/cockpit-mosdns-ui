# Mosdns web UI Debian

## 必备文件

1, Cockpit is available in Debian since version 10 (Buster).

```shell
. /etc/os-release
echo "deb http://deb.debian.org/debian ${VERSION_CODENAME}-backports main" > \
    /etc/apt/sources.list.d/backports.list
apt update
```

2, Install or update the package:

```shell
apt install -t ${VERSION_CODENAME}-backports cockpit
```

3, Check cockpit status

```shell
systemctl status cockpit
```

## 插件配置

1, This means that, by default the following directories are searched for cockpit packages, and in this order:Cockpit 

* `~/.local/share/cockpit/`
* `/usr/local/share/cockpit/`
* `/usr/share/cockpit/`

```properties
/usr/share/cockpit/
    my-package/
        manifest.json
        file.html
        some.js
```

2, Copy mosdns directorie are /usr/share/cockpit


