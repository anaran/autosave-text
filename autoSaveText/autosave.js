// Broken keys in canary Aura: {}[]\~@€µ
// Broken keys on Kuckuck: <>|
console.time("autosave.js loading takes");
//TODO Please note this one print output for readyState complete.
//document.onreadystatechange = function(event) {
//    console.time("autosave.js onreadystatechange");
//    console.log(event.target.readyState);
//    console.dirxml(document.querySelectorAll('[contenteditable]'));
//    console.dirxml(document.querySelectorAll('input[type=text]'));
//    console.timeEnd("autosave.js onreadystatechange");
//}
//	
// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
//TODO Please note this one never seems to get called, perhaps it is too late only this content script is loaded.
//document.addEventListener('DOMContentLoaded', function() { //$NON-NLS-0$
//    console.time("autosave.js DOMContentLoaded");
//    console.dirxml(document.querySelectorAll('[contenteditable]'));
//    console.dirxml(document.querySelectorAll('input[type=text]'));
//    console.timeEnd("autosave.js DOMContentLoaded");
//}, false);

//window.addEventListener('focus', function() { //$NON-NLS-0$
//    console.time("autosave.js focus");
//    console.dirxml(document.querySelectorAll('[contenteditable]'));
//    console.dirxml('event.target', event.target);
//    console.dirxml('event.relatedTarget', event.relatedTarget);
//    console.dirxml(document.querySelectorAll('input[type=text]'));
//    console.timeEnd("autosave.js focus");
//}, false);

(function() {
    chrome.contextMenus.removeAll(function() {
        if (chrome.extension.lastError) {
            toast("lastError:" + chrome.extension.lastError.message);
        }
    });
    var removeAllAusosavesId = chrome.contextMenus.create({
        id: "getSelectionId",
        type: "normal",
        title: "getSelection '%s'",
        contexts: ["editable"]
    }, function() {
        if (chrome.extension.lastError) {
            console.log("lastError:" + chrome.extension.lastError.message);
        }
    });
    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        });
        })();

window.addEventListener('keypress', function() { //$NON-NLS-0$
    try {
        console.time("autosave.js keypress");
        console.dirxml(document.querySelectorAll('[contenteditable]'));
        console.dirxml('event.target', event.target);
        console.dirxml('event.relatedTarget', event.relatedTarget);
        console.dirxml(document.querySelectorAll('input[type=text]'));
        console.timeEnd("autosave.js keypress");
        if (false) {
            var gOldOnError = window.onerror;
            // Override previous handler.
            window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
                toast((new Date()).toJSON() + "\nwindow.onerror:" + JSON.stringify([errorMsg, url, lineNumber]) + '\n');
                if (gOldOnError)
                // Call previous handler.
                return gOldOnError(errorMsg, url, lineNumber);
                // Just let default handler run.
                return false;
            };
        }
        var ellipsis = "\u2026";
        //        if (event.target.readyState !== "complete") {
        //            return;
        //        }
        //TODO Please note this is based on Example in
        //https://developer.mozilla.org/en-US/docs/Web/API/window.clearTimeout
        var AutosaveTimer = {
            autosave: function() {
                var thisAutosaveTimer = this;
                chrome.storage.sync.getBytesInUse(null, function(bytesUsed) {
                    console.log('bytesUsed', bytesUsed);
                });
                chrome.storage.sync.get(null, function(items) {
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError.message);
                    } else 
                        console.log(items);
                    });
                chrome.storage.sync.get(thisAutosaveTimer.autosaveKey, function(items) {
                    if (chrome.runtime.lastError) {
                        toast(chrome.runtime.lastError.message);
                    } else {
                        console.log(items);
                        var text = thisAutosaveTimer.autosaveElement.innerText || thisAutosaveTimer.autosaveElement.value;
                        var key = thisAutosaveTimer.autosaveKey;
                        var autosaveValue = items[key];
                        if (autosaveValue === undefined || autosaveValue.length < text.length || window.confirm("text shrunk from " + autosaveValue.length + " to " + text.length + " characters" + "\n\nOverwrite autosave\n\n'" + autosaveValue + "'\n\n with new, shorter content?")) {
                            //                    localStorage.setItem(key, text);
                            var item = {};
                            item[key] = text;
                            chrome.storage.sync.set(item, function() {
                                if (chrome.runtime.lastError) {
                                    toast(chrome.runtime.lastError.message);
                                } else {
                                    toast((new Date()).toJSON() + " autosave " + key);
                                }
                            });
                        }
                    }
                });
                //                if (localStorage.getItem(this.autosaveKey) == null || localStorage.getItem(this.autosaveKey).length < text.length || window.confirm("text shrunk from " + localStorage.getItem(this.autosaveKey).length + " to " + text.length + " characters" + "\n\nOverwrite autosave\n\n'" + localStorage.getItem(this.autosaveKey) + "'\n\n with new, shorter content?")) {
                //                    localStorage.setItem(this.autosaveKey, text);
                //                    console.log("autosave", this);
                //                }
                console.log("clearing auto-save timeout for", thisAutosaveTimer);
                delete thisAutosaveTimer.timeoutID;
            },

            setup: function(timeoutMilliseconds, autosaveKey, autosaveElement) {
                                this.cancel();
                var self = this;
                self.autosaveKey = autosaveKey;
                self.autosaveElement = autosaveElement;
                self.timeoutID = window.setTimeout(function() {
                    self.autosave();
                }, timeoutMilliseconds);
                console.log("setup auto-save timeout for", this);
            },

//            set: function() {
//                this.timeoutID = window.setTimeout(function() {
//                    this.autosave();
//                }, this.timeoutMilliseconds);
//                console.log("set auto-save timeout for", this);
//            },

            cancel: function() {
                if (typeof this.timeoutID === "number") {
                    window.clearTimeout(this.timeoutID);
                    console.log("cancel autosave for", this);
                    delete this.timeoutID;
                }
            }
        };

        (function setupAutoSave() {
            if (event.target.dataset.autoSave === undefined) {
                var autosaveKey = "autosave:" + (new Date()).toJSON();
//                var at = AutosaveTimer.setup(3000, autosaveKey, event.target);
//                if (at === undefined) {
                if (false) {
                    console.log((new Date()).toJSON(), "AutosaveTimer.setup(", 3000, autosaveKey, event.target, ") returns undefined");
                } else {
                    event.target.addEventListener('keypress', function(event) {
                        AutosaveTimer.setup(3000, autosaveKey, event.target);
                    }, false);
                    event.target.dataset.autoSave = autosaveKey;
                }
            }
            //            var iframes = document.getElementsByTagName("iframe");
            //            var ce = document.querySelectorAll('[contenteditable]');
            //            var itt = document.querySelectorAll('input[type=text]');
            //            for (i = 0; i < ce.length; i++) {
            //                //                    at = AutosaveTimer.setup(3000, "autosave:" + (new Date()).toJSON() + ":" + i, ce[i]);
            //                ce[i].addEventListener('keypress', function(event) {
            //                    //                	at.cancel();
            //                }, false);
            //            }
            //            for (j = 0; j < itt.length; j++) {
            //                //                    at = AutosaveTimer.setup(3000, "autosave:" + (new Date()).toJSON() + ":" + j, itt[j]);
            //                itt[j].addEventListener('keypress', function(event) {
            //                    //                	at.cancel();
            //                }, false);
            //            }
            //            for (var i = 0; i < iframes.length; i++) {
            //                var iframe = iframes[i];
            //                if (iframe.src.match('https://plus.google.com/u/0/_/notifications/')) {
            //                    console.dirxml(iframe);
            //                    window.alert('cannot provide autosave feature inside Google+ notifications.\n\nPlease use "View Post" link at bottom of notifications.')
            //                }
            //            }
        })();
    } catch (exception) {
        window.alert((new Date()).toJSON() + ":\n" + "document.readyState:" + document.readyState + "\ndocument.URL:" + document.URL + "\ne.stack:" + exception.stack);
        toast((new Date()).toJSON() + "\nexception.stack:" + exception.stack + '\n');
    }
}, false);
// TODO End of onreadystatechanged function:
//};
console.timeEnd("autosave.js loading takes");
console.log("autosave.js is loaded at", (new Date()).toJSON());