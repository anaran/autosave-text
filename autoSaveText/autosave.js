// Broken keys in canary Aura: {}[]\~@€µ
// Broken keys on Kuckuck: <>|
// Remove single line comments in Eclipse Orion:
// From:\n//.+(\s+)To:$1
(function() {
    try {
        console.time("autosave.js loading takes");
        console.log("autosave.js loads into", location.href);
        autosaveTimeoutKey = "autosave,timeout";
        var disableLossMaximumKey = "autosave,disable,loss";
        var minimumLengthKey = "autosave,minimum,length";
        var Settings = {};
        // TODO Please note this hard-coded default is a last resort when no value has ever been set via the options page UI.
        Settings[autosaveTimeoutKey] = 3;
        Settings[disableLossMaximumKey] = 10;
        Settings[minimumLengthKey] = 8;
        // TODO Please note this caters to the async chrome.storage interfaces!
        chrome.storage.sync.get(Object.getOwnPropertyNames(Settings), function(items) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message + " " + key);
            } else {
                var newSyncItem = {};
                Object.getOwnPropertyNames(Settings).forEach(function(value) {
                    if (items[value]) {
                        Settings[value] = items[value];
                    } else {
                        newSyncItem[value] = Settings[value];
                    }
                });
                if (Object.getOwnPropertyNames(newSyncItem).length) {
                    chrome.storage.sync.set(newSyncItem, function() {
                        if (chrome.runtime.lastError) {
                            console.log(chrome.runtime.lastError.message + " " + newSyncItem);
                            toast(chrome.runtime.lastError.message + " " + newSyncItem);
                        } else {
                            //                            toast("review initial value of " + newSyncItem + " in options page");
                        }
                    });
                }
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
                //                    console.log("not recording this for your protection" + event.target);
                //                    toast("not recording this password for your protection");
                //                    return;
                //                }
                //                if (!event.target.isContentEditable && event.target.localName.toLowerCase() !== 'input') {
                //                    console.log("not recording this because it takes no input" + event.target);
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
                            try {
                                if (chrome.runtime.lastError) {
                                    console.log(chrome.runtime.lastError.message, items);
                                    toast(chrome.runtime.lastError.message);
                                } else {
                                    //                                console.log(items);
                                    var text = thisAutosaveTimer.autosaveElement.textContent || thisAutosaveTimer.autosaveElement.value;
                                    var uri = location.href;
                                    //                                    var uri = thisAutosaveTimer.autosaveElement.baseURI;
                                    var key = thisAutosaveTimer.autosaveKey;
                                    // TODO Useless backward compatibility I should do away with.
                                    var autosaveValue = (items[key] instanceof Array) ? items[key][0] : items[key];
                                    if (text.length >= Settings[minimumLengthKey] && autosaveValue === undefined || autosaveValue !== undefined && (autosaveValue.length - text.length) <= Settings[disableLossMaximumKey]) {
                                        var item = {};
                                        item[key] = [text, uri];
                                        chrome.storage.sync.set(item, function() {
                                            if (chrome.runtime.lastError) {
                                                console.log(chrome.runtime.lastError.message, item);
                                                toast(chrome.runtime.lastError.message);
                                            } else {
                                                toast("autosaved " + text.length + " characters");
                                            }
                                        });
                                    } else {
                                        if (autosaveValue !== undefined && (autosaveValue.length - text.length) > Settings[disableLossMaximumKey]) {
                                            toast("autosave temporarily disabled because input has " + text.length + " characters while autosave data has " + autosaveValue.length + " (" + (text.length - autosaveValue.length) + "characters)");
                                        }
                                    }
                                }
                            } catch (exception) {
                                window.alert('exception.stack: ' + exception.stack);
                                toast('exception.stack: ' + exception.stack);
                                console.log((new Date()).toJSON(), "exception.stack:", exception.stack);
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
                            AutosaveTimer.setup(Settings[autosaveTimeoutKey], autosaveKey, event.target);
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
            if (value.localName === 'input' && !value.type || value.type && value.type !== 'password' || value.isContentEditable) {
                console.log(value);
                if (value.dataset.autoSave === undefined) {
                    value.addEventListener('keypress', autosaveEventHandler, false);
                }
                return true;
            }
        };
        window.addEventListener('keypress', function(event) {
            console.log(event.target);
            if (filter(event.target)) {}
        }, false);
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