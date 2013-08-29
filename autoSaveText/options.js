document.onreadystatechange = function(event) {
    if (event.target.readyState !== "complete") {
        return;
    }
    (function() {
        var selectAll = document.querySelector('#select_all');
        selectAll.addEventListener('change', function(event) {
            var selectOneNodeList = document.querySelectorAll('.select_one');
            for (i = 0; i < selectOneNodeList.length; i++) {
                selectOneNodeList[i].checked = event.target.checked;
            }
        }, false);
        var deleteSelected = document.querySelector('#delete_selected');
        deleteSelected.addEventListener('click', function(event) {
            var selectOneCheckedNodeList = document.querySelectorAll('.select_one');
            console.log("options page is ready, selectOneCheckedNodeList", selectOneCheckedNodeList);
            var selectOneCheckedKeyArray = [];
            for (i = 0; i < selectOneCheckedNodeList.length; i++) {
                if (selectOneCheckedNodeList[i].checked && selectOneCheckedNodeList[i].dataset.autoSave) {
                    selectOneCheckedKeyArray.push(selectOneCheckedNodeList[i].dataset.autoSave);
                }
            }
            console.log("options page is ready, selectOneCheckedKeyArray", selectOneCheckedKeyArray);
            chrome.storage.sync.remove(selectOneCheckedKeyArray, function() {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                } else {
                    console.log("autosave data for following keys has been removed", selectOneCheckedKeyArray);
                    location.reload(true);
                }
            });
        }, false);
        chrome.storage.sync.get(null, function(items) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            } else {
                var autosaveDisableLossElement = document.querySelector('#disable');
                var disableLossKey = "autosave,disable,loss";
                autosaveDisableLossElement.value = items[disableLossKey];
                autosaveDisableLossElement.addEventListener('change', function(event) {
                    var item = {};
                    item[disableLossKey] = event.target.value;
                    chrome.storage.sync.set(item, function() {
                        if (chrome.runtime.lastError) {
                            toast(chrome.runtime.lastError.message);
                        } else {
                            toast((new Date()).toJSON() + " saved " + disableLossKey + " value " + event.target.value);
                        }
                    });
                }, false);

                var autosaveTimeoutElement = document.querySelector('#timeout');
                var timeoutKey = "autosave,timeout";
                autosaveTimeoutElement.value = items[timeoutKey];
                autosaveTimeoutElement.addEventListener('change', function(event) {
                    var item = {};
                    item[timeoutKey] = event.target.value;
                    chrome.storage.sync.set(item, function() {
                        if (chrome.runtime.lastError) {
                            toast(chrome.runtime.lastError.message);
                        } else {
                            toast((new Date()).toJSON() + " saved " + timeoutKey + " value " + event.target.value);
                        }
                    });
                }, false);


                var displayInternalElement = document.querySelector('#display_internal');
                var displayInternalKey = "autosave,display,internal";
                //        TODO Negate twice to handle undefined value as well.
                displayInternalElement.checked = !! items[displayInternalKey];
                displayInternalElement.addEventListener('change', function(event) {
                    displayInternalElement.checked = event.target.checked;
                    var item = {};
                    item[displayInternalKey] = displayInternalElement.checked;
                    chrome.storage.sync.set(item, function() {
                        if (chrome.runtime.lastError) {
                            toast(chrome.runtime.lastError.message);
                        } else {
                            toast((new Date()).toJSON() + " saved " + displayInternalKey + " value " + item[displayInternalKey]);
                            //                            TODO Please note the we need to reload page only when the asynchronuous sync.set calls back without failure!
                            location.reload(true);
                        }
                    });
                }, false);



                var propsArray = Object.getOwnPropertyNames(items).filter(function(key) {
                    return displayInternalElement.checked || key.match(/^autosave,text,/);
                }).sort();
                var autosaves = document.querySelector('.autosaves');
                var autosaveTemplate = autosaves.querySelector('.autosave_template');
                propsArray.forEach(function(value, index, object) {
                    var autosave = autosaveTemplate.cloneNode('deep');
                    // TODO Please note we need to change the clones className!
                    autosave.className = 'autosave';
                    //                var select = autosave.querySelector('.select_one');
                    var selectOne = autosave.querySelector('.select_one');
                    selectOne.dataset.autoSave = value;
                    var startDateTime = autosave.querySelector('.autosave_start');
                    var shortKey = value.replace('autosave,text,', '');
                    try {
                        var dateTime = new Date(shortKey);
                        if (isNaN(dateTime.getTime())) {
                            startDateTime.innerText = value;
                        } else {
                            startDateTime.innerText = dateTime.toString().replace(/\s*\([^)]+\)/, '');
                        }
                    } catch (exception) {
                        startDateTime.innerText = value;
                    }
                    var autosaveText = autosave.querySelector('.autosave_text');
                    autosaveText.innerText = items[value];
                    autosaves.appendChild(autosave);
                });
            }
        });
    })();
}