#!/bin/bash

MOSDNS_FILE="mosdns-linux-amd64.zip"
MOSDNS_VERSION="v5.3.1"
MOSDNS_URL="https://github.com/IrineSistiana/mosdns/releases/download/$MOSDNS_VERSION/$MOSDNS_FILE"
MOSDNS_URL_V4="https://github.com/IrineSistiana/mosdns/releases/download/v4.5.3/$MOSDNS_FILE"

MSODNS_CONFIG="config.yaml"

yaml_args=$1

# 软件库升级
apt update
echo "软件库升级完成"

# 安装所需软件
apt install unzip wget curl  -y
echo "软件安装完成"

install_mosdns() {
    if test -f "/tmp/$MOSDNS_FILE"; then
        echo "/tmp/$MOSDNS_FILE 文件已下载"
    else
        wget -P /tmp/ $MOSDNS_URL
        echo "下载 /tmp/$MOSDNS_FILE 完成"
    fi
    sudo unzip -oq /tmp/$MOSDNS_FILE -d /tmp && sudo mv /tmp/mosdns /usr/local/bin
    echo "解压并设置 mosdns 完成"

    mosdns service stop
    mosdns service uninstall

    if test -f "/tmp/mosdnsv4.zip"; then
        echo "/tmp/mosdnsv4.zip 文件已下载"
    else
        wget -O /tmp/mosdnsv4.zip $MOSDNS_URL_V4
        echo "下载 /tmp/mosdnsv4.zip 完成"
    fi
    sudo unzip -oq /tmp/mosdnsv4.zip -d /tmp && sudo mv /tmp/mosdns /tmp/mosdnsv4
    sudo mv /tmp/mosdnsv4 /usr/local/bin
    sudo chmod +x /usr/local/bin/mosdnsv4
    echo "解压并设置 mosdnsv4 完成"
}

create_mosdns_file() {

    echo "config => $yaml_args"

    [ -d "/etc/mosdns" ] || mkdir -p "/etc/mosdns" && echo "文件夹 '/etc/mosdns' 创建."

    if [ ! -e "/etc/mosdns/config.yaml" ]; then
        touch /etc/mosdns/config.yaml
        echo "文件 '/etc/mosdns/config.yaml' 创建"
    else
        echo "文件 '/etc/mosdns/config.yaml' 已存在。"
    fi

    folder="/etc/mosdns/rule"
    folderFile=("$folder/whitelist.txt" "$folder/blocklist.txt" "$folder/greylist.txt" "$folder/ddnslist.txt" "$folder/hosts.txt" "$folder/redirect.txt" "$folder/local-ptr.txt" "$folder/cloudflare-cidr.txt")


    [ -d "$folder" ] || mkdir -p "$folder" && echo "文件夹 '$folder' 创建."

    for file in "${folderFile[@]}"; do
        [ -e "$file" ] || touch "$file" && echo "文件 '$file' 创建在 '$file'."
    done

}


install_mosdns
create_mosdns_file
. update_geo.sh

sudo mosdns service install -d /etc/mosdns -c config.yaml
