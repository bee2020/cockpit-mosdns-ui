#!/bin/bash

sudo systemctl restart mosdns

sleep 1

sudo systemctl status mosdns
