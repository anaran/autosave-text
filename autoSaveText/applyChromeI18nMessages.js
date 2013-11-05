(function () {
        // This generated function body is wrapped in (...)(); to execute on load.
        // This will only install the onreadystatechange event handler
        // to be run when the document load is complete.
        // Load this file into the associated HTML file by including
        // <script src="applyChromeI18nMessages.js"></script>
        // in its head element.
        try {
            document.addEventListener('readystatechange', function(event) {
                if (event.target.readyState !== 'complete') {
                    return;
                }
                (function() {
                    var nds = document.querySelectorAll('[i18n-content]');
                    for (i = 0, len = nds.length; i < len; i++) {
                        var value = nds[i].getAttribute('value');
                        var key = nds[i].getAttribute('i18n-content');
                        if (value === null) {
                            nds[i].innerText = chrome.i18n.getMessage(key);
                        } else {
                            nds[i].setAttribute('value', chrome.i18n.getMessage(key));
                        }
                    }
                })();
            }, false);
        } catch (exception) {
            window.alert('exception.stack: ' + exception.stack);
            console.log((new Date()).toJSON(), 'exception.stack:', exception.stack);
        }
    })();