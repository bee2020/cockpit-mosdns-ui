#!/bin/bash

rm /tmp/geoip.dat
rm /tmp/geosite.dat

[ -d "/etc/mosdns/geo" ] || mkdir -p "/etc/mosdns/geo" && echo "文件夹 '/etc/mosdns/geo' 创建."
[ -d "/etc/mosdns/ads" ] || mkdir -p "/etc/mosdns/ads" && echo "文件夹 '/etc/mosdns/ads' 创建."

rm -f /etc/mosdns/geo/*
rm -f /etc/mosdns/ads/*

wget -P /tmp https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat
echo "geoip.dat 下载成功"

wget -P /tmp https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat
echo "geosite.dat 下载成功"

wget -P /etc/mosdns/ads https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-domains.txt
echo "anti-ad-domains.txt 下载成功"

wget -P /etc/mosdns/ads https://raw.githubusercontent.com/Cats-Team/AdRules/main/mosdns_adrules.txt
echo "mosdns_adrules.txt 下载成功"

wget -P /etc/mosdns/ads https://raw.githubusercontent.com/ookangzheng/dbl-oisd-nl/master/dbl_light.txt
echo "dbl_light.txt 下载成功"

wget -P /etc/mosdns/ads https://raw.githubusercontent.com/ookangzheng/dbl-oisd-nl/master/dbl.txt
echo "dbl.txt 下载成功"


/usr/local/bin/mosdnsv4 v2dat unpack-ip -o /etc/mosdns/geo /tmp/geoip.dat:cn
echo "geoip.dat:cn 配置成功"

/usr/local/bin/mosdnsv4 v2dat unpack-domain -o /etc/mosdns/ads /tmp/geosite.dat:category-ads-all
echo "geosite.dat:category-ads-all 配置成功"

/usr/local/bin/mosdnsv4 v2dat unpack-domain -o /etc/mosdns/geo /tmp/geosite.dat:apple
echo "geosite.dat:apple 配置成功"

/usr/local/bin/mosdnsv4 v2dat unpack-domain -o /etc/mosdns/geo /tmp/geosite.dat:cn
echo "geosite.dat:cn 配置成功"

/usr/local/bin/mosdnsv4 v2dat unpack-domain -o /etc/mosdns/geo /tmp/geosite.dat:geolocation-!cn
echo "geosite.dat:geolocation-!cn 配置成功"
