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

        yaml_syntax : {
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
                '/etc/mosdns/ads/geosite_category-ads-all.txt' : 'v2ray-geosite',
                '/etc/mosdns/ads/anti-ad-domains.txt' : 'anti-AD',
                '/etc/mosdns/ads/mosdns_adrules.txt' : 'Cats-Team/AdRules',
                '/etc/mosdns/ads/dbl_light.txt' : 'oisd (small)',
                '/etc/mosdns/ads/dbl.txt' : 'oisd (big)',
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

        initBootstrapDns : () => {
            let list_options = [];

            for(let key in mosdns.setting.bootstrapdns) {
                list_options.push('<option value="'+ key +'">'+ mosdns.setting.bootstrapdns[key] +'</option>');
            }

            document.querySelector('#bootstrapdns').innerHTML = list_options.join('');
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
                    btn.setAttribute('data-select', target.value);
                    dropdown.classList.remove('show');

                    if(oldHTML !== '请选择') {
                        return;
                    }

                    if(type === 'bootstrapdns') {
                        return;
                    }

                    let cloneNode = btngroup.cloneNode(true);
                    cloneNode.querySelector('button:first-child').innerHTML = '请选择';
                    cloneNode.querySelector('button:first-child').setAttribute('data-select', '');
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
                btn.setAttribute('data-select', target.getAttribute('data-value'));
                dropdown.classList.remove('show');
                if(oldHTML !== '请选择') {
                    return;
                }

                if(type === 'bootstrapdns') {
                    return;
                }

                let cloneNode = btngroup.cloneNode(true);
                cloneNode.querySelector('button:first-child').innerHTML = '请选择';
                cloneNode.querySelector('button:first-child').setAttribute('data-select', '');
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

            refreshcache : () => {
                let event = window.event || arguments.callee.caller.arguments,
                    target = event.currentTarget, data_target = target.getAttribute('data-target');

                target.setAttribute('disabled', 'disabled');

                mosdns.cockpitSpawn(["/bin/bash", "-c", "curl -X GET  http://localhost:9091/plugins/lazy_cache/flush"], (data) => {
                    console.log(data);
                    target.removeAttribute('disabled');
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
                    data_target = target.getAttribute('data-target');

                mosdns.removeClassList(card.parentNode.querySelectorAll('button.nav-link'), 'active');
                mosdns.removeClassList(card.parentNode.querySelectorAll('div.tab-pane'), 'active');

                card.querySelector('div[data-parent="'+data_target+'"]').classList.add('active');
                target.classList.add('active');
                
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
                let event = window.event || arguments.callee.caller.arguments,
                    target = event.currentTarget, config = jsyaml.load(mosdns.CodeMirror.getValue()),
                    mosdnsmessage = document.querySelector('#mosdnsmessage');

                mosdnsmessage.value = '';
                mosdnsmessage.style.height = '0px';

                target.setAttribute('disabled', 'disabled');

                config.plugins.find( item => item.tag === 'udp_server' ).args.listen = ':' + document.querySelector('#port').value;
                config.plugins.find( item => item.tag === 'tcp_server' ).args.listen = ':' + document.querySelector('#port').value;
                config.plugins.find( item => item.tag === 'modify_ttl' ).args[0].exec = 'ttl ' + document.querySelector('#ttlmin').value + '-' + document.querySelector('#ttlmax').value;
                
                config.log.level = document.querySelector('#loginfo').options[document.querySelector('#loginfo').selectedIndex].value;
                config.log.file = document.querySelector('#logfile').value;
                config.api.http = '0.0.0.0:' + document.querySelector('#apiPort').value;
                
                config.plugins.find(item => item['tag'] === 'fallback').args.primary = document.querySelector('#fallback').checked ? 'forward_remote_upstream' : 'query_is_non_local_ip';

                for(let i = 0, element, list_element = document.querySelectorAll('input.lazy_cache'); element = list_element[i]; i++) {
                    config.plugins.find( item => item.tag === 'lazy_cache' ).args[element.id] = element.value;
                }

                let concurrent = document.querySelector('#concurrent').value,
                    idle_timeout = document.querySelector('#idle_timeout').value,
                    enable_pipeline = document.querySelector('#enable_pipeline').checked,
                    insecure_skip_verify = document.querySelector('#insecure_skip_verify').checked,
                    adfilter = document.querySelector('#adfilter').checked,
                    bootstrapdns = document.querySelector('#bootstrapdns').options[document.querySelector('#bootstrapdns').selectedIndex].value,
                    map_dns = {};

                for(let i = 0, element, list_element = document.querySelectorAll('button.btn-dns'); element = list_element[i]; i++) {
                    let tag = element.getAttribute('data-tag');

                    if(!map_dns.hasOwnProperty(tag)){
                        map_dns[tag] = { upstreams : []};
                    }
                    if(element.getAttribute('data-select')){
                        map_dns[tag]['concurrent'] = parseInt(concurrent);
                        map_dns[tag]['upstreams'].push({
                            addr : element.getAttribute('data-select'),
                            bootstrap : bootstrapdns,
                            idle_timeout : parseInt(idle_timeout),
                            enable_pipeline : enable_pipeline,
                            insecure_skip_verify : insecure_skip_verify,
                        });
                    }
                }

                for(let key in map_dns) {
                    let index = config.plugins.findIndex(item => item['tag'] === key);
                    console.log(config.plugins[index]);
                    console.log(map_dns[key]);
                    if(index !== -1){
                        config.plugins[index]['args'] = map_dns[key];
                    }
                }

                console.log('map_dns', map_dns);
                console.log(config);

                cockpit.file("/etc/mosdns/config.yaml").replace(jsyaml.dump(config))
                .then(tag => {
                    console.log(tag);

                    mosdns.cockpitSpawnStream(["/bin/bash", "-c", `/usr/share/cockpit/mosdns/restart_mosdns.sh `], (data, type) => {
                        switch(type) {
                            case 'stream' :
                                mosdnsmessage.value = data;
                                document.querySelector('#mosdnsActive').checked = /Active:\s+active\s+\(running\)/.test(data);
                                break;
                            case 'then' :
                                
                            default :
                                console.log('default');
                                mosdnsmessage.style.height = mosdnsmessage.scrollHeight + 'px';
                                target.removeAttribute('disabled');
                                break;
                        }
                    });
                    
                })
                .catch(error => {
                    console.log(error);
                    target.removeAttribute('disabled');
                });

                

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
                    mosdns.getStatus('status', 'mosdns');
                });
            })
            .catch(error => {
                textarea.innerHTML += error;
                target.removeAttribute('disabled');
            });
            
        },

        readMosdnsFiles : () => {

            mosdns.getStatus('status','mosdns');

            for(let i = 0, filter, list_filter = document.querySelectorAll('#customFilter textarea'); filter = list_filter[i]; i++) {
                mosdns.cockpitFileRead(filter.getAttribute('data-file'), (result, tag) => {
                    if(result && !result.hasOwnProperty('message')) {
                        filter.innerHTML = result;
                    }
                });
            }

            mosdns.cockpitFileReadYAML('/etc/mosdns/config.yaml', (result, tag) => {

                console.log('cockpitFileReadYAML', result);

                if(result && result.hasOwnProperty('message')) {
                    return;
                }

                if(result === null) {
                    mosdns.CodeMirror.setValue(jsyaml.dump(JSON.parse(mosdns.default())));
                }

                mosdns.initConfigUI();

            });

        },

        initConfigUI : () => {
            let config = jsyaml.load(mosdns.CodeMirror.getValue());
            console.log('jsonArgs', config);

            try {
                
                let port = config.plugins.find(item => item['tag'] === 'udp_server'), 
                    list_dns = config.plugins.filter(item => item['type'] === 'forward'), 
                    lazy_cache = config.plugins.find(item => item['tag'] === 'lazy_cache'), 
                    adlist = config.plugins.find(item => item['tag'] === 'adlist'),
                    fallback = config.plugins.find(item => item['tag'] === 'fallback'),
                    modify_ttl = config.plugins.find(item => item['tag'] === 'modify_ttl');

                document.querySelector('#port').setAttribute('value', port['args']['listen'].replace(':', ''));
                document.querySelector('#loginfo option[value="'+ config['log']['level'] +'"]').setAttribute('selected', true);
                document.querySelector('#logfile').setAttribute('value', config['log']['file']);
                document.querySelector('#apiPort').value = config.api.http.slice(config.api.http.indexOf(':') + 1);

                let map_dsnEelement = {
                    china : {
                        term : 'chinadns', setting : mosdns.setting.chinadns,
                        element : () => {
                            return document.querySelector('#' + map_dsnEelement.china.term);
                        },
                    },
                    overseas : {
                        term : 'overseasdns', setting : mosdns.setting.overseasdns,
                        element : () => {
                            return document.querySelector('#' + map_dsnEelement.overseas.term);
                        },
                    },

                    single : {
                        concurrent : 2,                 //DNS 服务器并发数（默认 2）
                        idle_timeout : 30,               //空闲超时
                        enable_pipeline : false,        //TCP/DoT 使用 RFC 7766 新的 query pipelining 连接复用模式
                        insecure_skip_verify : false,   //禁用 TLS 服务器证书验证
                        fallback : false,               //防止 DNS 泄漏
                        modify_ttl : {                  
                            min : 0,                    //覆盖最小 TTL 值（默认 0）
                            max : 0,                    //覆盖最大 TTL 值（默认 0）
                        },
                        bootstrap : '119.29.29.29',     //Bootstrap DNS 服务器
                    },

                    adlist : [],

                };

                map_dsnEelement.single.fallback = fallback.args.primary === 'forward_remote_upstream' ? true : false;
                
                let match = modify_ttl.args[0].exec.match(/(\d+)-(\d+)/);
                
                map_dsnEelement.single.modify_ttl = match ? {
                    min : parseInt(match[1]),
                    max : parseInt(match[2]),
                } : map_dsnEelement.single.modify_ttl;

                for(let key in lazy_cache.args) {
                    document.querySelector('#' + key).value = lazy_cache.args[key];
                }
                

                for(let i = 0, dns; dns = list_dns[i]; i++) {

                    map_dsnEelement.single.concurrent = dns['args']['concurrent'];

                    switch (dns['tag']) {
                        case 'forward_local':
                            mosdns.matchElementDNS(dns['args']['upstreams'], map_dsnEelement.china, map_dsnEelement);
                            break;
                        case 'forward_remote':
                            mosdns.matchElementDNS(dns['args']['upstreams'], map_dsnEelement.overseas, map_dsnEelement);
                            break;
                    
                        default:
                            break;
                    }
                }

                console.log('adlist', adlist);
                for(let i = 0, file; file = adlist.args.files[i]; i++) {
                    if(file === '/etc/mosdns/rule/disable-ads.txt') {
                        break;
                    }
                    map_dsnEelement.adlist.push(file);
                }

                console.log('map_dsnEelement', map_dsnEelement);

                document.querySelector('#bootstrapdns option[value="'+ map_dsnEelement.single.bootstrap +'"]').setAttribute('selected', true);
                document.querySelector('#concurrent').value = map_dsnEelement.single.concurrent;
                document.querySelector('#idle_timeout').value = map_dsnEelement.single.idle_timeout;
                document.querySelector('#enable_pipeline').checked = map_dsnEelement.single.enable_pipeline;
                document.querySelector('#insecure_skip_verify').checked = map_dsnEelement.single.insecure_skip_verify;
                document.querySelector('#fallback').checked = map_dsnEelement.single.fallback;
                document.querySelector('#ttlmin').value = map_dsnEelement.single.modify_ttl.min;
                document.querySelector('#ttlmax').value = map_dsnEelement.single.modify_ttl.max;
                
                document.querySelector('#adfilter').setAttribute('checked', map_dsnEelement.adlist.length === 0 ? false : true);
                if(map_dsnEelement.adlist.length !== 0) {
                    document.querySelector('div[data-parent="adfilter"]').classList.remove('custom-hide');
                }
                //

                console.log('jsonArgs', config);
            } catch (error) {
                console.log(error);
            }
        },

        matchElementDNS : (list_dns, map_dns, map_dsnEelement) => {

            let fragment = document.createDocumentFragment(),
                findGroup = map_dns.element().querySelector('div.' + map_dns.term);

            for(let i = 0, dns; dns = list_dns[i]; i++) {
                let group = findGroup.cloneNode(true);
                group.querySelector('button.btn-secondary').innerHTML = map_dns.hasOwnProperty(dns['addr']) ? map_dns[dns['addr']] : dns['addr'];
                group.querySelector('button.btn-secondary').setAttribute('data-select', dns['addr']);
                fragment.appendChild(group);
                map_dsnEelement.single.bootstrap = dns['bootstrap'];
                map_dsnEelement.single.idle_timeout = dns['idle_timeout'];
                map_dsnEelement.single.enable_pipeline = dns['enable_pipeline'];
                map_dsnEelement.single.insecure_skip_verify = dns['insecure_skip_verify'];
            }

            map_dns.element().insertBefore(fragment, findGroup);

        },


        getStatus : (serviceType, serviceName, callBack) => {

            mosdns.cockpitSpawnStream(['systemctl', serviceType, serviceName], (result, type) => {

                let btnStatus = document.querySelector('#mosdnsstatus');

                console.log(serviceType, type, result);

                if(type === 'stream'){
                    let message = document.querySelector('#mosdnsmessage');
                    message.value = result;
                    setTimeout(() => {
                        message.style.height = message.scrollHeight + 'px';
                    }, 450);

                    document.querySelector('#mosdnsActive').checked = /Active:\s+active\s+\(running\)/.test(result);
                }
                if(typeof callBack === 'function' || callBack instanceof Function){
                    callBack();
                }
                btnStatus.classList.remove('custom-hide');
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

                let jsonArgs = jsyaml.load(mosdns.CodeMirror.getValue());

                console.log('jsonArgs', jsonArgs);

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

            cockpit.file(dirfile, mosdns.yaml_syntax).read()
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