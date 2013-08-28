document.onreadystatechange = function(event) {
    if (event.target.readyState !== "complete") {
        return;
    }
    (function() {
        var selectAll = document.querySelector('#select_all');
        selectAll.addEventListener('change', function(event) {
            //    selectAll.onchange = function(event) {
            for (i = 0; i < selectOneNodeList.length; i++) {
                selectOneNodeList[i].checked = event.target.checked;
            }
        }, false);
        //    };
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
                var autosaveTimeout = document.querySelector('#timeout');
                var key = "autosave,timeout";
                autosaveTimeout.value = items[key];
                autosaveTimeout.addEventListener('change', function(event) {
                    //TODO Save value to sync storage
                    var item = {};
                    item[key] = event.target.value;
                    chrome.storage.sync.set(item, function() {
                        if (chrome.runtime.lastError) {
                            toast(chrome.runtime.lastError.message);
                        } else {
                            toast((new Date()).toJSON() + " saved autosave timeout value " + event.target.value);
                        }
                    });
                }, false);
                var propsArray = Object.getOwnPropertyNames(items).sort();
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
                    startDateTime.innerText = new Date(value.replace('autosave,', '')).toString().replace(/\s*\([^)]+\)/, '');
                    var autosaveText = autosave.querySelector('.autosave_text');
                    autosaveText.innerText = items[value];
                    autosaves.appendChild(autosave);
                });
            }
        });
    })();
}