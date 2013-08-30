// Broken keys in canary Aura: {}[]\~@€µ
// Broken keys on Kuckuck: <>|
(function() {
    try {
        console.time("autosave.js loading takes");
        console.log("autosave.js loads into", location.href);
        var autosaveTimeoutKey = "autosave,timeout";
        // TODO Please note this hard-coded default is a last resort when no value has ever been set via the options page UI.
        var autosaveTimeoutSeconds = 3;
        chrome.storage.sync.get(autosaveTimeoutKey, function(items) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
                console.log("autosaveTimeoutSeconds not found in chrome.storage.sync, using", autosaveTimeoutSeconds);
            } else {
                autosaveTimeoutSeconds = items[autosaveTimeoutKey];
            }
        });
        var disableLossKey = "autosave,disable,loss";
        // TODO Please note this hard-coded default is a last resort when no value has ever been set via the options page UI.
        var disableLossMaximum = 10;
        chrome.storage.sync.get(disableLossKey, function(items) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
                console.log("disableLossKey not found in chrome.storage.sync, using", disableLossMaximum);
            } else {
                disableLossMaximum = items[disableLossKey];
            }
        });
        // TODO Please note: Forgetting the event argument here causes nasty bug of document.event being used!
        var autosaveEventHandler = function(event) { //$NON-NLS-0$
            try {
                console.time("autosave.js keypress");
                //exception.stack: TypeError: Cannot call method 'inspect' of undefined
                //at autosaveEventHandler (chrome-extension://ddbcobcapggbhjcihdedihlennemenmm/autosave.js:32:37)
                // console._commandLineAPI.inspect(event.target);
                // TODO Please note Don't autosave password type            
                //                if (event.target.localName.toLowerCase() === 'input' && event.target.getAttribute('type') && event.target.getAttribute('type').toLowerCase() === 'password') {
                //                    console.log("not recording this for your protection", event.target);
                //                    toast("not recording this password for your protection");
                //                    return;
                //                }
                //                if (!event.target.isContentEditable && event.target.localName.toLowerCase() !== 'input') {
                //                    console.log("not recording this because it takes no input", event.target);
                //                    toast("not recording this " + event.target.localName + "because it takes no input");
                //                    return;
                //                }
                //                    if (!event.target.getAttribute('type') || event.target.getAttribute('type').toLowerCase() !== 'password'))) {
                //debugger;
                //            if (event.target.)
                //                console.dirxml(document.querySelectorAll('[contenteditable]'));
                //                console.dirxml('event.target', event.target);
                //                console.dirxml('event.relatedTarget', event.relatedTarget);
                //                console.dirxml(document.querySelectorAll('input[type=text]'));
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
                //        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                //            console.log(sender.tab ?
                //                "message from a content script:" + sender.tab.url :
                //                "message from the extension");
                //            if (request["autosaveCount"]) {
                //                chrome.contextMenus.update(removeAllAutsosavesId, {
                //                    title: "remove all " + request["autosaveCount"] + " autosaves"
                //                });
                //                sendResponse({
                //                    farewell: "goodbye"
                //                });
                //            }
                //        });
                //TODO Please note this is based on Example in
                //https://developer.mozilla.org/en-US/docs/Web/API/window.clearTimeout
                var AutosaveTimer = {
                    autosave: function() {
                        var thisAutosaveTimer = this;
                        chrome.storage.sync.get(thisAutosaveTimer.autosaveKey, function(items) {
                            if (chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError.message, items);
                                toast(chrome.runtime.lastError.message);
                            } else {
                                //                                console.log(items);
                                var text = thisAutosaveTimer.autosaveElement.innerText || thisAutosaveTimer.autosaveElement.value;
                                var key = thisAutosaveTimer.autosaveKey;
                                var autosaveValue = items[key];
                                if (autosaveValue === undefined || (autosaveValue.length - text.length) <= disableLossMaximum) {
                                    var item = {};
                                    item[key] = text;
                                    chrome.storage.sync.set(item, function() {
                                        if (chrome.runtime.lastError) {
                                            console.log(chrome.runtime.lastError.message, item);
                                            toast(chrome.runtime.lastError.message);
                                        } else {
                                            toast("autosaved " + text.length + " characters");
                                        }
                                    });
                                } else {
                                    toast("autosave temporarily disabled because input has " + text.length + " characters while autosave data has " + autosaveValue.length + " (" + (text.length - autosaveValue.length) + "characters)");
                                    //                                 || window.confirm("text shrunk from " + autosaveValue.length + " to " + text.length 
                                    //                                 + " characters" + "\n\nOverwrite autosave\n\n'" + autosaveValue + "'\n\n with new, shorter content?")
                                }
                            }
                        });
                        console.log("clearing auto-save timeout for", thisAutosaveTimer);
                        delete thisAutosaveTimer.timeoutID;
                    },
                    setup: function(autosaveTimeoutSeconds, autosaveKey, autosaveElement) {
                        this.cancel();
                        var self = this;
                        self.autosaveKey = autosaveKey;
                        self.autosaveElement = autosaveElement;
                        self.timeoutID = window.setTimeout(function() {
                            self.autosave();
                        }, autosaveTimeoutSeconds * 1000);
                        console.log("setup auto-save timeout for", this);
                    },
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
                        var autosaveKey = "autosave,text," + (new Date()).toJSON();
                        event.target.addEventListener('keypress', function(event) {
                            AutosaveTimer.setup(autosaveTimeoutSeconds, autosaveKey, event.target);
                        }, false);
                        event.target.dataset.autoSave = autosaveKey;
                    }
                })();
                console.timeEnd("autosave.js keypress");
            } catch (exception) {
                window.alert('exception.stack: ' + exception.stack);
                toast('exception.stack: ' + exception.stack);
                console.log((new Date()).toJSON(), "exception.stack:", exception.stack);
            }
        }
        //        var readWriteNodeList = document.querySelectorAll('*:read-write');
        //
//                function filteredArrayFromNodeList(nl, filter) {
//                    for (var i = 0, len = nl.length, a = [];i < len;  i++) {
//                        if (filter(nl[i], i, nl)) {
//                            a.push(nl[i]);
//                        }
//                    }
//                    return a;
//                }
//        var filteredReadWriteArray = filteredArrayFromNodeList(readWriteNodeList, function(value, index, object) {
//            if (value.getAttribute('type') && value.getAttribute('type').toLowerCase() !== 'password') {
//                console.log(value);
//                //                        console.log(value.getAttribute('size'));
//                //                        console.log(value.getAttribute('maxlength'));
//                value.addEventListener('keypress', autosaveEventHandler, false);
//                return true;
//            } else {
//                return false;
//            }
//        });
        //        console.log(filteredReadWriteArray);
        var filter = function(value, index, object) {
            console.log(value);
            if (value.localName === 'input' && !value.type || value.type !== 'password' || value.isContentEditable) {
                console.log(value);
                if (value.dataset.autoSave === undefined) {
                    value.addEventListener('keypress', autosaveEventHandler, false);
                }
                return true;
//            } else {
//                var readWriteNodeList = value.querySelectorAll('*:read-write');
//                console.log("readWriteNodeList", readWriteNodeList);
//                return false;
            }
        };
        window.addEventListener('keypress', function(event) {
            console.log(event.target);
            if (filter(event.target)) {}
        }, false);
//        var iframes = document.querySelectorAll('iframe');
//        filteredArrayFromNodeList(iframes, function(value, index, object) {
//            value.contentWindow.addEventListener('click', function(event) {
//                console.log(event.target);
//                if (filter(event.target)) {}
//            }, false);
//        });
        console.timeEnd("autosave.js loading takes");
        console.log("autosave.js is loaded at", (new Date()).toJSON());
    } catch (exception) {
        window.alert('exception.stack: ' + exception.stack);
        toast('exception.stack: ' + exception.stack);
        console.log((new Date()).toJSON(), "exception.stack:", exception.stack);
    }
})();
//document.onreadystatechange = function(evt) {
//    if (evt.target.readyState !== "complete") {
//        return;
//    }
//    console.log((new Date(event.eventtime)).toJSON(), event.type)
//}