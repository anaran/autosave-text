console.time("autosave_bg.js loading takes");
console.log("autosave_bg.js loads into", location.href);

(function() {
    try {
        //    chrome.contextMenus.removeAll(function() {
        //        if (chrome.extension.lastError) {
        //            toast("lastError:" + chrome.extension.lastError.message);
        //        }
        //    });
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
        chrome.contextMenus.onClicked.addListener(function(info, tab) {
            chrome.storage.sync.get(null, function(items) {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                } else window.alert(JSON.stringify(items));
            });
        });
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log(sender.tab ?
                "message from a content script:" + sender.tab.url :
                "message from the extension");
            switch (Object.getOwnPropertyNames(request)[0]) {
            	case "autosaveCount": {
                chrome.contextMenus.update(removeAllAutsosavesId, {
                    title: "remove all " + request["autosaveCount"] + " autosaves"
                });
                sendResponse({
                    farewell: "goodbye"
                });
            }
            }
        });
    } catch (exception) {
        window.alert('exception.message: '+exception.message+'\n\n'+'exception.stack: ' + exception.stack);
        console.log((new Date()).toJSON(), "exception:", exception);
    }
})();

console.timeEnd("autosave_bg.js loading takes");
console.log("autosave_bg.js is loaded at", (new Date()).toJSON());