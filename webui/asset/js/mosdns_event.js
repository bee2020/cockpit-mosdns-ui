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

        'btn' : {
            'base' : () => {
                let event = window.event || arguments.callee.caller.arguments,
                    target = event.currentTarget, data_target = target.getAttribute('data-target');

                for(let i = 0, element, list_element = document.querySelectorAll('button.nav-link'); element = list_element[i]; i++) {
                    element.classList.remove('active');
                }

                for(let i = 0, element, list_element = document.querySelectorAll('div.tab-pane'); element = list_element[i]; i++) {
                    element.classList.remove('active', 'show');
                }

                document.querySelector(data_target).classList.add('active', 'show');
                target.classList.add('active');
                console.log(event);
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