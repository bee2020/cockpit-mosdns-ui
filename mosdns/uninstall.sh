#!/bin/bash


rm /tmp/mosdnsv4.zip

rm /tmp/mosdns-linux-amd64.zip

mosdns service stop
mosdns service uninstall

sudo rm -r /etc/mosdns/

echo "卸载成功 所有 Mosdns 关联文件"