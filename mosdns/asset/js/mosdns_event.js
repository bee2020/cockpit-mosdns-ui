(function (global, factory) {

    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = global.document ? factory(global, true) : function(w){
            if(!w.document){
                throw new Error('mosdns ui requires a window with a document');
            }
            return factory(w);
        };
    }else{
        factory(global);
    }

})(typeof window !== 'undefined' ? window : this, function(window, noGlobal) {

    'use strict';

    var mosdns = {

        default : () => {
            return '{"log":{"level":"info","file":"/var/log/mosdns.log"},"api":{"http":"0.0.0.0:9091"},"include":[],"plugins":[{"tag":"geosite_cn","type":"domain_set","args":{"files":["/etc/mosdns/geo/geosite_cn.txt"]}},{"tag":"geoip_cn","type":"ip_set","args":{"files":["/etc/mosdns/geo/geoip_cn.txt"]}},{"tag":"geosite_apple","type":"domain_set","args":{"files":["/etc/mosdns/geo/geosite_apple.txt"]}},{"tag":"geosite_no_cn","type":"domain_set","args":{"files":["/etc/mosdns/geo/geosite_geolocation-!cn.txt"]}},{"tag":"whitelist","type":"domain_set","args":{"files":["/etc/mosdns/rule/whitelist.txt"]}},{"tag":"blocklist","type":"domain_set","args":{"files":["/etc/mosdns/rule/blocklist.txt"]}},{"tag":"greylist","type":"domain_set","args":{"files":["/etc/mosdns/rule/greylist.txt"]}},{"tag":"ddnslist","type":"domain_set","args":{"files":["/etc/mosdns/rule/ddnslist.txt"]}},{"tag":"hosts","type":"hosts","args":{"files":["/etc/mosdns/rule/hosts.txt"]}},{"tag":"redirect","type":"redirect","args":{"files":["/etc/mosdns/rule/redirect.txt"]}},{"tag":"adlist","type":"domain_set","args":{"files":["/etc/mosdns/geo/geosite_category-ads-all.txt"]}},{"tag":"local_ptr","type":"domain_set","args":{"files":["/etc/mosdns/rule/local-ptr.txt"]}},{"tag":"cloudflare_cidr","type":"ip_set","args":{"files":["/etc/mosdns/rule/cloudflare-cidr.txt"]}},{"tag":"lazy_cache","type":"cache","args":{"size":8000,"lazy_cache_ttl":86400,"dump_file":"/etc/mosdns/cache.dump","dump_interval":3600}},{"tag":"forward_xinfeng_udp","type":"forward","args":{"concurrent":2,"upstreams":[{"addr":"114.114.114.114"},{"addr":"114.114.115.115"}]}},{"tag":"forward_local","type":"forward","args":{"concurrent":2,"upstreams":[{"addr":"192.168.0.50","bootstrap":"119.29.29.29","enable_pipeline":false,"insecure_skip_verify":false,"idle_timeout":30}]}},{"tag":"forward_remote","type":"forward","args":{"concurrent":2,"upstreams":[{"addr":"192.168.0.50","bootstrap":"119.29.29.29","enable_pipeline":false,"insecure_skip_verify":false,"idle_timeout":30}]}},{"tag":"forward_remote_upstream","type":"sequence","args":[{"exec":"prefer_ipv4"},{"exec":"$forward_remote"}]},{"tag":"modify_ttl","type":"sequence","args":[{"exec":"ttl 0-0"}]},{"tag":"modify_ddns_ttl","type":"sequence","args":[{"exec":"ttl 5-5"}]},{"tag":"has_resp_sequence","type":"sequence","args":[{"matches":"qname $ddnslist","exec":"$modify_ddns_ttl"},{"matches":"!qname $ddnslist","exec":"$modify_ttl"},{"matches":"has_resp","exec":"accept"}]},{"tag":"query_is_non_local_ip","type":"sequence","args":[{"exec":"$forward_local"},{"matches":"!resp_ip $geoip_cn","exec":"drop_resp"}]},{"tag":"fallback","type":"fallback","args":{"primary":"forward_remote_upstream","secondary":"forward_remote_upstream","threshold":500,"always_standby":true}},{"tag":"apple_domain_fallback","type":"fallback","args":{"primary":"query_is_non_local_ip","secondary":"forward_xinfeng_udp","threshold":100,"always_standby":true}},{"tag":"query_is_apple_domain","type":"sequence","args":[{"matches":"!qname $geosite_apple","exec":"return"},{"exec":"$apple_domain_fallback"}]},{"tag":"query_is_ddns_domain","type":"sequence","args":[{"matches":"qname $ddnslist","exec":"$forward_local"}]},{"tag":"query_is_local_domain","type":"sequence","args":[{"matches":"qname $geosite_cn","exec":"$forward_local"}]},{"tag":"query_is_no_local_domain","type":"sequence","args":[{"matches":"qname $geosite_no_cn","exec":"$forward_remote_upstream"}]},{"tag":"query_is_whitelist_domain","type":"sequence","args":[{"matches":"qname $whitelist","exec":"$forward_local"}]},{"tag":"query_is_greylist_domain","type":"sequence","args":[{"matches":"qname $greylist","exec":"$forward_remote_upstream"}]},{"tag":"query_is_reject_domain","type":"sequence","args":[{"matches":"qname $blocklist","exec":"reject 3"},{"matches":"qname $adlist","exec":"reject 3"},{"matches":["qtype 12","qname $local_ptr"],"exec":"reject 3"},{"matches":"qtype 65","exec":"reject 3"}]},{"tag":"main_sequence","type":"sequence","args":[{"exec":"$hosts"},{"exec":"jump has_resp_sequence"},{"matches":["!qname $ddnslist","!qname $blocklist","!qname $adlist","!qname $local_ptr"],"exec":"$lazy_cache"},{"exec":"$redirect"},{"exec":"jump has_resp_sequence"},{"exec":"$query_is_ddns_domain"},{"exec":"jump has_resp_sequence"},{"exec":"$query_is_whitelist_domain"},{"exec":"jump has_resp_sequence"},{"exec":"$query_is_reject_domain"},{"exec":"jump has_resp_sequence"},{"exec":"$query_is_greylist_domain"},{"exec":"jump has_resp_sequence"},{"exec":"$query_is_local_domain"},{"exec":"jump has_resp_sequence"},{"exec":"$query_is_no_local_domain"},{"exec":"jump has_resp_sequence"},{"exec":"$fallback"}]},{"tag":"udp_server","type":"udp_server","args":{"entry":"main_sequence","listen":":5335"}},{"tag":"tcp_server","type":"tcp_server","args":{"entry":"main_sequence","listen":":5335"}}]}';
        },
            

        CodeMirror : {},

        initCodeMirror : () => {
            let codeMirror = CodeMirror.fromTextArea(document.querySelector('#configEdit'), {
                mode: "yaml",                       // 设置编辑器模式为 YAML
                lineNumbers: true,                  // 显示行号
                lineWrapping: true,                 // 自动换行
                styleActiveLine: true,              // 选中行高亮
                matchBrackets: true,                // 匹配括号
                autoCloseBrackets: true,
                lint: true,                         // 代码出错提醒
                indentUnit: 4,                      // 缩进配置（默认为2）
                autoRefresh: true,
                theme: "monokai",                   // 主题
                gutters: ["CodeMirror-lint-markers"], // 样式的宽度
            });
            mosdns.CodeMirror = codeMirror;
        },

        yaml : {
            syntax: {
                parse: (content) => {
                    return mosdns.CodeMirror.setValue(content);
                },
            }
        },

        setting : {
            chinadns : {
                '119.29.29.29' : '腾讯公共 DNS（119.29.29.29）',
                '119.28.28.28' : '腾讯公共 DNS（119.28.28.28）',
                '223.5.5.5' : '阿里云公共 DNS（223.5.5.5）',
                '223.6.6.6' : '阿里云公共 DNS（223.6.6.6）',
                '114.114.114.114' : '信风公共 DNS（114.114.114.114）',
                '114.114.115.115' : '信风公共 DNS（114.114.115.115）',
                '180.76.76.76' : '百度公共 DNS（180.76.76.76）',
                'https://doh.pub/dns-query' : '腾讯公共 DNS（DNS over HTTPS）',
                'https://dns.alidns.com/dns-query' : '阿里云公共 DNS（DNS over HTTPS）',
                'h3://dns.alidns.com/dns-query' : '阿里云公共 DNS（DNS over HTTPS/3）',
                'https://doh.360.cn/dns-query' : '百度公共 DNS（180.76.76.76）',
            },
    
            overseasdns : {
                'tls://1.1.1.1' : 'CloudFlare 公共 DNS（1.1.1.1）',
                'tls://1.0.0.1' : 'CloudFlare 公共 DNS（1.0.0.1）',
                'tls://8.8.8.8' : '谷歌公共 DNS（8.8.8.8）',
                'tls://9.9.9.9' : 'Quad9 公共 DNS（9.9.9.9）',
                'tls://149.112.112.112' : 'Quad9 公共 DNS（149.112.112.112）',
                'tls://208.67.222.222' : '思科公共 DNS（208.67.222.222）',
                'tls://208.67.220.220' : '思科公共 DNS（208.67.220.220）',
            },
    
            bootstrapdns : {
                '119.29.29.29' : '腾讯公共 DNS（119.29.29.29）',
                '119.28.28.28' : '腾讯公共 DNS（119.28.28.28）',
                '223.5.5.5' : '阿里云公共 DNS（223.5.5.5）',
                '223.6.6.6' : '阿里云公共 DNS（223.6.6.6）',
                '114.114.114.114' : '信风公共 DNS（114.114.114.114）',
                '114.114.115.115' : '信风公共 DNS（114.114.115.115）',
                '180.76.76.76' : '百度公共 DNS（180.76.76.76）',
                '8.8.8.8' : '谷歌公共 DNS（8.8.8.8）',
                '1.1.1.1' : 'CloudFlare 公共 DNS（1.1.1.1）',
            },

            adfilter : {
                'geosite.dat' : 'v2ray-geosite',
                'https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-domains.txt' : 'anti-AD',
                'https://raw.githubusercontent.com/Cats-Team/AdRules/main/mosdns_adrules.txt' : 'Cats-Team/AdRules',
                'https://raw.githubusercontent.com/ookangzheng/dbl-oisd-nl/master/dbl_light.txt' : 'oisd (small)',
                'https://raw.githubusercontent.com/ookangzheng/dbl-oisd-nl/master/dbl.txt' : 'oisd (big)',
            },
        },

        initDns : (element, type) => {

            let list_chinadns = [], map_dns = mosdns.setting.hasOwnProperty(type) ? mosdns.setting[type] : {};

            if(Object.keys(map_dns).length === 0) {
                return;
            }

            for(let key in map_dns) {
                list_chinadns.push(
                    '<a onclick="mosdnsui.btn.dns_select(\'' + type + '\')" data-value="' + key + '" class="dropdown-item" href="javascript:void(0);">' + map_dns[key] + '</a>'
                );
            }
            list_chinadns.push(
                '<div class="dropdown-divider"></div>'
            );
            list_chinadns.push(
                '<a class="dropdown-item" href="javascript:void(0);"><input onkeypress="mosdnsui.btn.dns_keyup(\'' + type + '\')" type="text" class="form-control" placeholder="-- 自定义 --"></a>'
            );

            element.innerHTML = list_chinadns.join('');

        },

        removeClassList : (list_element, removeClassName) => {
            for(let i = 0, dropdown; dropdown = list_element[i]; i++) {
                dropdown.classList.remove(removeClassName);
            }
        },

        btn : {

            dns : (type) => {
                let event = window.event || arguments.callee.caller.arguments,
                    target = event.currentTarget, 
                    dropdown = target.parentNode.querySelector('div.dropdown-menu'),
                    containsShow = dropdown.classList.contains('show');

                mosdns.removeClassList(document.querySelectorAll('div.dropdown-menu'), 'show');

                if(dropdown.children.length === 0){
                    mosdns.initDns(dropdown, type);
                }
                if(containsShow) {
                    dropdown.classList.remove('show');
                    return;
                }

                dropdown.classList.add('show');

            },

            dns_keyup : (type) => {
                let event = window.event || arguments.callee.caller.arguments,
                    charCode = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode),
                    target = event.currentTarget,  dropdown = target.parentNode.parentNode,
                    btn = dropdown.parentNode.querySelector('button:first-child'),
                    btngroup = btn.parentNode, col = btngroup.parentNode, oldHTML = btn.innerHTML;

                if(charCode == 13 || charCode == 3){

                    btn.innerHTML = target.value;
                    dropdown.classList.remove('show');

                    if(oldHTML !== '请选择') {
                        return;
                    }

                    if(type === 'bootstrap') {
                        return;
                    }

                    let cloneNode = btngroup.cloneNode(true);
                    cloneNode.querySelector('button:first-child').innerHTML = '请选择';
                    cloneNode.querySelector('input').value = '';
                    col.appendChild(cloneNode);    
                }
            },

            dns_select : (type) => {
                let event = window.event || arguments.callee.caller.arguments,
                    target = event.currentTarget,  dropdown = target.parentNode,
                    btn = target.parentNode.parentNode.querySelector('button:first-child'),
                    btngroup = btn.parentNode, col = btngroup.parentNode, 
                    oldHTML = btn.innerHTML;

                btn.innerHTML = target.innerHTML;
                dropdown.classList.remove('show');
                if(oldHTML !== '请选择') {
                    return;
                }

                if(type === 'bootstrap') {
                    return;
                }

                let cloneNode = btngroup.cloneNode(true);
                cloneNode.querySelector('button:first-child').innerHTML = '请选择';
                col.appendChild(cloneNode);    
            },

            dns_remove : () => {

                let event = window.event || arguments.callee.caller.arguments,
                    target = event.currentTarget, btn = target.parentNode.querySelector('button:first-child'),
                    list_group = target.parentNode.parentNode.querySelectorAll('div.btn-group');

                mosdns.removeClassList(document.querySelectorAll('div.dropdown-menu'), 'show');
                if(btn.innerHTML === '请选择' || list_group.length <= 1) {
                    return;
                }
                
                btn.parentNode.remove();
            },

            base : () => {
                let event = window.event || arguments.callee.caller.arguments,
                    target = event.currentTarget, data_target = target.getAttribute('data-target');

                mosdns.removeClassList(document.querySelectorAll('button.nav-link-main'), 'active');
                mosdns.removeClassList(document.querySelectorAll('div.tab-pane-main'), 'active');

                document.querySelector(data_target).classList.add('active');
                target.classList.add('active');

            },

            install : () => {
                let event = window.event || arguments.callee.caller.arguments,
                    target = event.currentTarget, textarea = document.querySelector('textarea[data-tag="install"]') ;

                target.setAttribute('disabled', 'disabled');

                textarea.innerHTML = '';

                mosdns.cockpitSpawnStream(["/bin/bash", "-c", `/usr/share/cockpit/mosdns/install.sh `], (data, type) => {
                    switch(type) {
                        case 'stream' :
                            textarea.innerHTML += data;
                            textarea.scrollTop = textarea.scrollHeight;
                            break;
                        case 'then' :
                            textarea.innerHTML += data;
                            textarea.scrollTop = textarea.scrollHeight;
                            mosdns.replaceConfig(target, textarea);
                            
                            break;
                        default :
                            textarea.innerHTML += data;
                            textarea.scrollTop = textarea.scrollHeight;
                            target.removeAttribute('disabled');
                            break;
                    }
                });
            },

            geoUpdate : () => {
                let event = window.event || arguments.callee.caller.arguments,
                    target = event.currentTarget, divider = document.querySelector('div[data-update="geo"]') ;

                target.setAttribute('disabled', 'disabled');

                divider.innerHTML = '';

                mosdns.cockpitSpawn(["/bin/bash", "-c", "/usr/share/cockpit/mosdns/update_geo.sh"], (data) => {
                    divider.innerHTML = data;
                    target.removeAttribute('disabled');
                });
            },

            card : () => {
                let event = window.event || arguments.callee.caller.arguments,
                    target = event.currentTarget, card = target.parentNode.parentNode.parentNode,
                    collapse = card.querySelector('div.collapse'), data_target = target.getAttribute('data-target'),
                    containsShow = target.classList.contains('active');

                console.log(card.querySelector('div.collapse'));

                mosdns.removeClassList(card.parentNode.querySelectorAll('button.nav-link'), 'active');
                mosdns.removeClassList(card.parentNode.querySelectorAll('div.tab-pane'), 'active');

                card.querySelector('div[data-parent="'+data_target+'"]').classList.add('active');

                if(containsShow) {
                    collapse.classList.remove('active');
                    return;
                }
                target.classList.toggle('active');
            },

            element_filter : () => {
                let event = window.event || arguments.callee.caller.arguments,
                    target = event.currentTarget, data_target = target.getAttribute('data-target'),
                    parent = document.querySelector('div[data-parent="'+ data_target +'"]');

                if(target.checked) {
                    parent.classList.remove('custom-hide');
                    return;
                }
                parent.classList.add('custom-hide');
                
            },

            save : () => {

            }
        },

        replaceConfig : (target, textarea) => {
            let yaml_args = mosdns.CodeMirror.getValue();
            cockpit.file("/etc/mosdns/config.yaml").replace(yaml_args)
            .then(tag => {
                textarea.innerHTML += tag + ' 配置文件写入成功 \r\n';
                mosdns.cockpitSpawn(['mosdns', 'service', 'start'], (result) => {
                    textarea.innerHTML += result + '启动成功 \r\n';
                    textarea.scrollTop = textarea.scrollHeight;
                    target.removeAttribute('disabled');
                    mosdns.getStatus('mosdns');
                });
            })
            .catch(error => {
                textarea.innerHTML += error;
                target.removeAttribute('disabled');
            });
            
        },

        readMosdnsFiles : () => {

            mosdns.getStatus('mosdns');

            for(let i = 0, filter, list_filter = document.querySelectorAll('#customFilter textarea'); filter = list_filter[i]; i++) {
                mosdns.cockpitFileRead(filter.getAttribute('data-file'), (result, tag) => {
                    if(result && !result.hasOwnProperty('message')) {
                        filter.innerHTML = result;
                    }
                });
            }

            mosdns.cockpitFileReadYAML('/etc/mosdns/config.yaml', (result, tag) => {

                if(result && result.hasOwnProperty('message')) {
                    return;
                }

                if(result === null) {
                    mosdns.CodeMirror.setValue(jsyaml.dump(JSON.parse(mosdns.default())));
                }

            });

        },

        getStatus : (serviceName) => {

            mosdns.cockpitSpawn(['systemctl', 'status', serviceName], (result) => {

                let btnStatus = document.querySelector('#mosdnsstatus');
                console.log('getStatus', result);

                if(result && result.hasOwnProperty('message')) {
                    btnStatus.innerHTML = result['exit_status'] + '-' + result['message'];
                    return;
                }

                let statusRegex = /Active:\s(.+?)\s/, match = result.match(statusRegex);
                let status = match ? match[1] : '无法提取的状态信息';

                btnStatus.innerHTML = status;

                if(status === 'active') {
                    document.querySelector('#mosdnsActive').setAttribute('checked',  true);
                }

            });
        },

        readCustomList : (dirfile, type) => {
            console.log(dirfile);
            mosdns.cockpitFileRead(dirfile, (result, tag) => {
                if(result && result.hasOwnProperty('message')) {
                    return;
                }

                document.querySelector('textarea[data-tag="'+ type +'"]').innerHTML = result;
            });
        },

        readConfig : (dirfile, type) => {
            console.log(dirfile);
            mosdns.cockpitFileReadYAML(dirfile, (result, tag) => {
                console.log('readConfig', tag, result);

                if(result && result.hasOwnProperty('message')) {
                    return;
                }

                if(result === null) {
                    mosdns.CodeMirror.setValue(jsyaml.dump(JSON.parse(mosdns.default())));
                }

            });
        },

        cockpitSpawn : (list_paramater, callBack) => {
            cockpit.spawn(list_paramater)
            .then(data => {
                callBack(data);
            })
            .fail(error => {
                callBack(error);
            });
        },

        cockpitSpawnStream : (list_paramater, callBack) => {
            cockpit.spawn(list_paramater)
            .stream(data => {
                callBack(data, 'stream');
            })
            .then(data => {
                callBack(data, 'then');
            })
            .fail(error => {
                callBack(error, 'fail');
            });
        },


        cockpitFileRead : (dirfile, callBack) => {
            cockpit.file(dirfile).read()
            .then((content, tag) => {
                callBack(content, tag);
            })
            .catch(error => {
                callBack(error);
            });
        },

        cockpitFileReadYAML : (dirfile, callBack) => {

            cockpit.file(dirfile, mosdns.yaml).read()
            .then((content, tag) => {
                callBack(content, tag);
            })
            .catch(error => {
                callBack(error);
            });
        },


        getservice : (serviceName) => {
            var apiUrl = '/cockpit/api/systemd/units/' + serviceName;
    
            console.log('cockpit', cockpit);
            
            let httpGet = cockpit.http().get(apiUrl);
            
            httpGet.response((status, headers) => {
                console.log(status);
                console.log(headers);
            }).then(data => {
                console.log('data', data);
            }).catch(error => {
                console.log('error', error);
            });
            
            console.log( httpGet );
        
            let http = cockpit.http(apiUrl, [
            
            ]);
            
            console.log('http', http);
            
            let request = http.request({
            'method' : 'GET'
            });
            
            console.log('request', request);
            
            request.response( (status, headers) => {
            console.log(status);
            console.log(headers);
            });
        },


    };

    if(typeof define === 'function' && define.amd) {
        define('mosdnsui', [], function() {
            return mosdns
        });
    }

    if(typeof noGlobal === 'undefined') {
        window.mosdnsui = mosdns;
    }

    return mosdns;

});