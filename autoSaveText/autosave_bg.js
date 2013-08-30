console.time("autosave_bg.js loading takes");
console.log("autosave_bg.js loads into", location.href);

(function() {
    try {
        var autosaveCommmandMap = {};
    chrome.commands.getAll(function (commands) {
        commands.forEach(function(value, index, object) {
        autosaveCommmandMap[value.name] = value.shortcut;
            });
        });
        
        
        // TODO Please note we first try a dummpy update of the menu be ID.
        // IF that fails, we probably have to create it.
        // Here is proof:
        //autosave_bg.js is loaded at 2013-08-27T19:07:09.440Z autosave_bg.js:89
        //lastError:Cannot find menu item with id removeAllAutosaves autosave_bg.js:11
        //lastError:Cannot find menu item with id captureVisibleTabId autosave_bg.js:27
        //autosave_bg.js loads into chrome-extension://ddbcobcapggbhjcihdedihlennemenmm/_generated_background_page.html autosave_bg.js:2
        //autosave_bg.js loading takes: 61.000ms autosave_bg.js:88
        //autosave_bg.js is loaded at 2013-08-27T19:07:46.810Z autosave_bg.js:89
        var reviewAllAutsosavesId = "reviewAllAutosaves";
        chrome.contextMenus.update(reviewAllAutsosavesId, {}, function() {
            if (chrome.extension.lastError) {
                console.log("lastError:" + chrome.extension.lastError.message);
                chrome.contextMenus.create({
                    id: reviewAllAutsosavesId,
                    type: "normal",
                    title: "Review all Autosaves                 " + autosaveCommmandMap["review-autosaves"] ,
                    contexts: ["editable"]
                }, function() {
                    if (chrome.extension.lastError) {
                        console.log("lastError:" + chrome.extension.lastError.message);
                    }
                });
            }
        });
        var captureVisibleTabId = "captureVisibleTabId";
        chrome.contextMenus.update(captureVisibleTabId, {}, function() {
            if (chrome.extension.lastError) {
                console.log("lastError:" + chrome.extension.lastError.message);
                chrome.contextMenus.create({
                    id: captureVisibleTabId,
                    type: "normal",
                    title: "Capture Visible Tab                        " + autosaveCommmandMap["capture-tab"] ,
                    contexts: ["editable"]
                }, function() {
                    if (chrome.extension.lastError) {
                        console.log("lastError:" + chrome.extension.lastError.message);
                    }
                });
            }
        });
        var manageExtensionId = "manageExtensionId";
        chrome.contextMenus.update(manageExtensionId, {}, function() {
            if (chrome.extension.lastError) {
                console.log("lastError:" + chrome.extension.lastError.message);
                chrome.contextMenus.create({
                    id: manageExtensionId,
                    type: "normal",
                    title: "Manage Autosave Text Extension" ,
                    contexts: ["all"]
                }, function() {
                    if (chrome.extension.lastError) {
                        console.log("lastError:" + chrome.extension.lastError.message);
                    }
                });
            }
        });
        //        chrome.runtime.sendMessage({
        //            autosaveCount: count
        //        }, function(response) {
        //            console.log("response from ", response);
        //        });
        var reviewAllAutsosaves = function(tab) {
            var optionsURL = chrome.extension.getURL("options.html");
            chrome.tabs.query({
                url: optionsURL
            }, function(tabArray) {
                console.log("chrome.tabs.query callback gets", tabArray);
                if (tabArray.length === 1) {
                    chrome.tabs.update(tabArray[0].id, {
                        active: true,
                        //                                    highlighted: true,
                        //                                    pinned: true
                        openerTabId: tab.id
                    });
                } else {
                    chrome.tabs.create({
                        url: optionsURL,
                        active: true,
                        //                                    highlighted: true,
                        //                                    pinned: true
                        openerTabId: tab.id
                    }, function(tabArray) {
                        console.log("chrome.tabs.create callback gets", tabArray);
                    });
                }
            });
        }
        var captureVisibleTab = function(tab) {
            chrome.tabs.captureVisibleTab(tab.windowId, {
                format: "png"
            }, function(dataUrl) {
                console.log(dataUrl);
                window.open(dataUrl);
            });
        }
        var manageExtension = function(tab) {
            var manageURL = "chrome://extensions/" + chrome.app.getDetails().id;
            chrome.tabs.query({
                url: manageURL
            }, function(tabArray) {
                console.log("chrome.tabs.query callback gets", tabArray);
                if (tabArray.length === 1) {
                    chrome.tabs.update(tabArray[0].id, {
                        active: true,
                        openerTabId: tab.id
                    });
                } else {
                    chrome.tabs.create({
                        url: manageURL,
                        active: true,
                        openerTabId: tab.id
                    }, function(tabArray) {
                        console.log("chrome.tabs.create callback gets", tabArray);
                    });
                }
            });
        }
        chrome.contextMenus.onClicked.addListener(function(info, tab) {
            chrome.storage.sync.getBytesInUse(null, function(bytesUsed) {
                console.log('bytesUsed', bytesUsed);
            });
        autosaveCommmandMap = {};
    chrome.commands.getAll(function (commands) {
        commands.forEach(function(value, index, object) {
        autosaveCommmandMap[value.name] = value.shortcut;
            });
        });
            switch (info.menuItemId) {
                case reviewAllAutsosavesId:
                    {
                        chrome.storage.sync.get(null, function(items) {
                            if (chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError.message, items);
                                toast(chrome.runtime.lastError.message);
                            } else {
                                console.log(items);
                                // TODO this includes other autosave settings like timeout, possible future disable on shrink parameter.
                                var count = Object.getOwnPropertyNames(items).filter(function(key) {
                                    return key.match(/^autosave,text,/);
                                }).length;
                                chrome.contextMenus.update(reviewAllAutsosavesId, {
                                    title: "Review all " + count + " Autosaves                 " + autosaveCommmandMap["review-autosaves"] 
                                });
//                                toast("Review all " + count + " Autosaves");
                                reviewAllAutsosaves(tab);
                            }
                        });
                        break;
                    }
                case captureVisibleTabId:
                    {
                        captureVisibleTab(tab);
                        break;
                    }
                case manageExtensionId:
                    {
                        manageExtension(tab);
                        break;
                    }
            }
        });
        //        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        //            console.log(sender.tab ?
        //                "message from a content script:" + sender.tab.url :
        //                "message from the extension");
        //            switch (Object.getOwnPropertyNames(request)[0]) {
        //                case "autosaveCount":
        //                    {
        //                        chrome.contextMenus.update(reviewAllAutsosavesId, {
        //                            title: "Review all " + request["autosaveCount"] + " Autosaves"
        //                        });
        //                        sendResponse({
        //                            farewell: "goodbye"
        //                        });
        //                        break;
        //                    }
        //            }
        //        });
        chrome.commands.onCommand.addListener(function(command) {
            console.log('onCommand event received for message: ', command);
            chrome.tabs.query({
                active: true,
                currentWindow: true,
                highlighted: true
            }, function(tabArray) {
                console.log("chrome.tabs.query callback gets", tabArray);
                if (tabArray.length === 1) {
                    switch (command) {
                        case "review-autosaves":
                            {
                                reviewAllAutsosaves(tabArray[0]);
                                break;
                            }
                        case "capture-tab":
                            {
                                captureVisibleTab(tabArray[0]);
                                break;
                            }
                    }
                } else {
                    //                console.log("chrome.tabs.query callback gets", tabArray);
                }
            });
        });
    } catch (exception) {
        window.alert('exception.message: ' + exception.message + '\n\n' + 'exception.stack: ' + exception.stack);
        console.log((new Date()).toJSON(), "exception:", exception);
    }
})();

console.timeEnd("autosave_bg.js loading takes");
console.log("autosave_bg.js is loaded at", (new Date()).toJSON());