#!/bin/bash

rm /tmp/geoip.dat
rm /tmp/geosite.dat

[ -d "/etc/mosdns/geo" ] || mkdir -p "/etc/mosdns/geo" && echo "文件夹 '/etc/mosdns/geo' 创建."
[ -d "/etc/mosdns/ads" ] || mkdir -p "/etc/mosdns/ads" && echo "文件夹 '/etc/mosdns/ads' 创建."

wget -P /tmp https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat
wget -P /tmp https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat
wget -P /etc/mosdns/ads https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-domains.txt
wget -P /etc/mosdns/ads https://raw.githubusercontent.com/Cats-Team/AdRules/main/mosdns_adrules.txt
wget -P /etc/mosdns/ads https://raw.githubusercontent.com/ookangzheng/dbl-oisd-nl/master/dbl_light.txt
wget -P /etc/mosdns/ads https://raw.githubusercontent.com/ookangzheng/dbl-oisd-nl/master/dbl.txt


/usr/local/bin/mosdnsv4 v2dat unpack-ip -o /etc/mosdns/geo /tmp/geoip.dat:cn

/usr/local/bin/mosdnsv4 v2dat unpack-domain -o /etc/mosdns/ads /tmp/geosite.dat:category-ads-all
/usr/local/bin/mosdnsv4 v2dat unpack-domain -o /etc/mosdns/geo /tmp/geosite.dat:apple
/usr/local/bin/mosdnsv4 v2dat unpack-domain -o /etc/mosdns/geo /tmp/geosite.dat:cn
/usr/local/bin/mosdnsv4 v2dat unpack-domain -o /etc/mosdns/geo /tmp/geosite.dat:geolocation-!cn

echo "geo 更新成功"