// Broken keys in canary Aura: {}[]\~@€µ
// Broken keys on Kuckuck: <>|
    (function() {
        console.time("autosave.js loading takes");
        console.log("autosave.js loads into", location.href);


        var key = "autosave,timeout";
        chrome.storage.sync.get(key, function(items) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
                // TODO Please note this hard-coded default is a last resort when no value has ever been set via the options page UI.
                autosaveTimeoutSeconds = 3;
                console.log("autosaveTimeoutSeconds not found in chrome.storage.sync, using", autosaveTimeoutSeconds);
            } else {
                autosaveTimeoutSeconds = items[key] ;
            }
        });

        // TODO Please note forgettig the event argument here causes nasty bug of document.event being used!
        var autosaveEventHandler = function(event) { //$NON-NLS-0$
            try {
                console.time("autosave.js keypress");
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
                        chrome.storage.sync.getBytesInUse(null, function(bytesUsed) {
                            console.log('bytesUsed', bytesUsed);
                        });
                        chrome.storage.sync.get(null, function(items) {
                            if (chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError.message, items);
                            } else {
                                console.log(items);
// TODO this includes other autosave settings like timeout, possible future disable on shrink parameter.
                                var count = Object.getOwnPropertyNames(items).length;
                                chrome.runtime.sendMessage({
                                    autosaveCount: count
                                }, function(response) {
                                    console.log("response from ", response);
                                });
                            }
                        });
                        chrome.storage.sync.get(thisAutosaveTimer.autosaveKey, function(items) {
                            if (chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError.message, items);
                                toast(chrome.runtime.lastError.message);
                            } else {
//                                console.log(items);
                                var text = thisAutosaveTimer.autosaveElement.innerText || thisAutosaveTimer.autosaveElement.value;
                                var key = thisAutosaveTimer.autosaveKey;
                                var autosaveValue = items[key];
                                if (autosaveValue === undefined || autosaveValue.length < text.length || window.confirm("text shrunk from " + autosaveValue.length + " to " + text.length + " characters" + "\n\nOverwrite autosave\n\n'" + autosaveValue + "'\n\n with new, shorter content?")) {
                                    //                    localStorage.setItem(key, text);
                                    var item = {};
                                    item[key] = text;
                                    chrome.storage.sync.set(item, function() {
                                        if (chrome.runtime.lastError) {
                                            console.log(chrome.runtime.lastError.message, item);
                                            toast(chrome.runtime.lastError.message);
                                        } else {
                                            toast("autosaved " + text.length + " characters to " + key);
                                        }
                                    });
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
                                    var autosaveKey = "autosave," + (new Date()).toJSON();
                    event.target.addEventListener('keypress', function(event) {
                        AutosaveTimer.setup(autosaveTimeoutSeconds, autosaveKey, event.target);
                    }, false);
                    event.target.dataset.autoSave = autosaveKey;
                }
                })();
                console.timeEnd("autosave.js keypress");
            } catch (exception) {
                window.alert('exception.message: ' + exception.message + '\n\n' + 'exception.stack: ' + exception.stack);
                toast('exception.message: ' + exception.message + '\n\n' + 'exception.stack: ' + exception.stack);
                console.log((new Date()).toJSON(), "exception:", exception);
            }
        }
        window.addEventListener('keypress', autosaveEventHandler, false);
        var iframeNodeList = document.querySelectorAll('iframe[src]');
        for (i = 0; i < iframeNodeList.length; i++) {
            var cw = iframeNodeList[i].contentWindow;
            if (cw) {
                //                cw.addEventListener('keypress', autosaveEventHandler, false);
            }
        }
        console.timeEnd("autosave.js loading takes");
        console.log("autosave.js is loaded at", (new Date()).toJSON());
    })();
document.onreadystatechange = function(evt) {
    if (evt.target.readyState !== "complete") {
        return;
    }
    console.log((new Date(event.eventtime)).toJSON(), event.type)
}