console.time("autosave_bg.js loading takes");
console.log("autosave_bg.js loads into", location.href);

(function() {
    try {
            chrome.contextMenus.removeAll(function() {
                if (chrome.extension.lastError) {
                    toast("lastError:" + chrome.extension.lastError.message);
                }
            });
        var removeAllAutsosavesId = chrome.contextMenus.create({
            id: "removeAllAutosaves" + Date.now(),
            type: "normal",
            title: "remove all autosaves",
            contexts: ["editable"]
        }, function() {
            if (chrome.extension.lastError) {
                console.log("lastError:" + chrome.extension.lastError.message);
            }
        });
        var captureVisibleTabId = chrome.contextMenus.create({
            id: "captureVisibleTab" + Date.now(),
            type: "normal",
            title: "capture visible tab",
            contexts: ["editable"]
        }, function() {
            if (chrome.extension.lastError) {
                console.log("lastError:" + chrome.extension.lastError.message);
            }
        });
        chrome.contextMenus.onClicked.addListener(function(info, tab) {
            switch (info.menuItemId) {
                case removeAllAutsosavesId:
                    {
                        chrome.storage.sync.get(null, function(items) {
                            if (chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError.message);
                            } else {
                                window.alert(JSON.stringify(items));
                            }
                        });
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
        //        chrome.contextMenus.onClicked.addListener(function(info, tab) {
        //            chrome.storage.sync.get(null, function(items) {
        //                if (chrome.runtime.lastError) {
        //                    console.log(chrome.runtime.lastError.message);
        //                } else {
        ////                	window.alert(JSON.stringify(items));
        //                        var propsArray = Object.getOwnPropertyNames(items).sort();
        //                        var autosaves = document.body.lastChild.appendChild(document.createElement('div'));
        //						autosaves.className = 'autosaves';
        //						propsArray.forEach(function(value, index, object) {
        //							var autosave = document.createElement('pre');
        //						autosave.className = 'autosave';
        //						autosave.contentEditable = true;
        //							autosaves.appendChild(autosave).innerText = items[value];
        //							autosave.appendChild(document.createElement('button'));
        //						});
        //                	}
        //            });
        //        });
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log(sender.tab ?
                "message from a content script:" + sender.tab.url :
                "message from the extension");
            switch (Object.getOwnPropertyNames(request)[0]) {
                case "autosaveCount":
                    {
                        chrome.contextMenus.update(removeAllAutsosavesId, {
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