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
        }

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