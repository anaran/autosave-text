console.time("autosave_bg.js loading takes");
console.log("autosave_bg.js loads into", location.href);

(function() {
    try {
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
                    title: "review all autosaves",
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
                    title: "capture visible tab",
                    contexts: ["editable"]
                }, function() {
                    if (chrome.extension.lastError) {
                        console.log("lastError:" + chrome.extension.lastError.message);
                    }
                });
            }
        });
        chrome.contextMenus.onClicked.addListener(function(info, tab) {
            switch (info.menuItemId) {
                case reviewAllAutsosavesId:
                    {
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
                        //                        chrome.storage.sync.get(null, function(items) {
                        //                            if (chrome.runtime.lastError) {
                        //                                console.log(chrome.runtime.lastError.message);
                        //                            } else {
                        //                                window.alert(JSON.stringify(items));
                        //                            }
                        //                        });
                        break;
                    }
                case captureVisibleTabId:
                    {
                        chrome.tabs.captureVisibleTab(tab.windowId, {
                            format: "png"
                        }, function(dataUrl) {
                            console.log(dataUrl);
                            window.open(dataUrl);
                        });
                        break;
                    }
            }
        });
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log(sender.tab ?
                "message from a content script:" + sender.tab.url :
                "message from the extension");
            switch (Object.getOwnPropertyNames(request)[0]) {
                case "autosaveCount":
                    {
                        chrome.contextMenus.update(reviewAllAutsosavesId, {
                            title: "remove all " + request["autosaveCount"] + " autosaves"
                        });
                        sendResponse({
                            farewell: "goodbye"
                        });
                        break;
                    }
            }
        });
    } catch (exception) {
        window.alert('exception.message: ' + exception.message + '\n\n' + 'exception.stack: ' + exception.stack);
        console.log((new Date()).toJSON(), "exception:", exception);
    }
})();

console.timeEnd("autosave_bg.js loading takes");
console.log("autosave_bg.js is loaded at", (new Date()).toJSON());