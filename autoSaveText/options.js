document.addEventListener('readystatechange', function(event) {
    try {
        if (event.target.readyState !== "complete") {
            return;
        }
        (function() {
            function getDownloadFileName() {
                var abbrevCount;
                try {
                    //		var arrayLength = JSON.parse(localStorage.map).length;
                    //		if (arrayLength % 2) {
                    //			chrome.extension.getBackgroundPage().alert(chrome.i18n.getMessage("odd_map_array_length") + arrayLength);
                    //		}
                    //		abbrevCount = arrayLength / 2;
                } catch (e) {}
                var d = new Date();
                var fileName = 'autosave-text-'; //$NON-NLS-0$
                fileName += d.getFullYear();
                var month = d.getMonth() + 1;
                fileName += "-" + ((month < 10) ? "0" + month : month); //$NON-NLS-0$ //$NON-NLS-1$
                //	TODO getDay() returns the day of week,
                //	see http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.5.16
                var day = d.getDate();
                fileName += "-" + ((day < 10) ? "0" + day : day); //$NON-NLS-0$ //$NON-NLS-1$
                var hours = d.getHours();
                fileName += "T" + ((hours < 10) ? "0" + hours : hours); //$NON-NLS-0$ //$NON-NLS-1$
                var minutes = d.getMinutes();
                fileName += ((minutes < 10) ? "0" + minutes : minutes); //$NON-NLS-0$
                var seconds = d.getSeconds();
                fileName += ((seconds < 10) ? "0" + seconds : seconds); //$NON-NLS-0$
                var timeZoneOffset = -d.getTimezoneOffset();
                var offsetMinutes = timeZoneOffset % 60;
                var offsetHours = (timeZoneOffset - offsetMinutes) / 60;
                fileName += (offsetHours > 0 ? "+" : "") + ((offsetHours < 10) ? "0" + offsetHours : offsetHours) + ((offsetMinutes < 10) ? "0" + offsetMinutes : offsetMinutes); //$NON-NLS-0$ //$NON-NLS-2$ //$NON-NLS-1$
                fileName += '.txt'; //$NON-NLS-0$
                return fileName;
            }
            chrome.storage.sync.get(null, function(items) {
                try {
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError.message);
                    } else {
                        var exportLinkElement = document.querySelector('.export_link');
                        var exportElement = document.querySelector('.export');
                        exportElement.addEventListener('click', function(event) {
                            var blob = new window.Blob([JSON.stringify(items)], {
                                "type": 'text/plain' //$NON-NLS-1$ //$NON-NLS-0$
                            });
                            exportLinkElement.href = URL.createObjectURL(blob);
                            exportLinkElement.download = getDownloadFileName();
                            exportLinkElement.click();
                        }, false);

                        function errorHandler(domError) {
                            console.log(domError);
                            toast(domError);
                        }
                        var readFileUpdateUI = function(file /*, element, nameElement*/ ) {
                            var reader = new FileReader();
                            reader.onerror = errorHandler;
                            reader.onload = function(writeEvent) {
                                console.timeEnd('read of ' + file.name);
                                var result = writeEvent.target.result;
                                var resultItems = JSON.parse(result);
                                var count = Object.getOwnPropertyNames(resultItems).length;
                                chrome.storage.sync.set(resultItems, function() {
                                    if (chrome.runtime.lastError) {
                                        toast(chrome.runtime.lastError.message);
                                    } else {
                                        toast((new Date()).toJSON() + " synced " + count + " imported items to storage");
                                    }
                                });
                                //                                console.log(result);
                            };
                            console.time('read of ' + file.name);
                            reader.readAsText(file);
                        };
                        var importElement = document.querySelector('.import');
                        var importFileElement = document.querySelector('.import_file');
                        importFileElement.addEventListener('change', function(event) {
                            console.log(event.target.files);
                            if (event.target.files.length === 1) {
                                readFileUpdateUI(event.target.files[0] /*, mod, modFileName*/ );
                            }
                        }, false);
                        importElement.addEventListener('click', function(event) {
                            importFileElement.click();
                        }, false);
                        var selectAll = document.querySelector('.select_all');
                        var deleteSelectedElement = document.querySelector('.delete_selected');
                        selectAll.addEventListener('change', function(event) {
                            var selectOneNodeList = document.querySelectorAll('.select_one');
                            for (i = 0; i < selectOneNodeList.length; i++) {
                                selectOneNodeList[i].checked = event.target.checked;
                            }
                            //                        console.log('selectAll.checked', selectAll.checked);
                            deleteSelectedElement.value = chrome.i18n.getMessage('delete_selected', [(event.target.checked ? selectOneNodeList.length : 0)]);
                        }, false);
                        deleteSelectedElement.addEventListener('click', function(event) {
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
                        var propsAllArray = Object.getOwnPropertyNames(items).sort().reverse();
                        var propsAutosavesArray = propsAllArray.filter(function(key) {
                            return key.match(/^autosave,text,/);
                        });
                        var allKeyCount = propsAllArray.length;
                        var internalKeyCount = allKeyCount - propsAutosavesArray.length;
                        var autosaveDisableLossElement = document.querySelector('.disable');
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
                        var autosaveMinimumLengthElement = document.querySelector('.minimum');
                        var minimumLengthKey = "autosave,minimum,length";
                        autosaveMinimumLengthElement.value = items[minimumLengthKey];
                        autosaveMinimumLengthElement.addEventListener('change', function(event) {
                            var item = {};
                            item[minimumLengthKey] = event.target.value;
                            chrome.storage.sync.set(item, function() {
                                if (chrome.runtime.lastError) {
                                    toast(chrome.runtime.lastError.message);
                                } else {
                                    toast((new Date()).toJSON() + " saved " + minimumLengthKey + " value " + event.target.value);
                                }
                            });
                        }, false);
                        var autosaveVersionElement = document.querySelector('.version');
                        autosaveVersionElement.textContent = chrome.i18n.getMessage('version', [chrome.app.getDetails().version]);
                        var autosaveTimeoutElement = document.querySelector('.timeout');
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
                        var displayInternalElement = document.querySelector('.display_internal');
                        var displayInternalLabelElement = document.querySelector('.display_internal_label');
                        displayInternalLabelElement.textContent = chrome.i18n.getMessage('display_internal_label', [internalKeyCount]);
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
                        var selectAllLabelElement = document.querySelector('label[for=select_all]');
                        selectAllLabelElement.textContent = chrome.i18n.getMessage('select_all_label', [(displayInternalElement.checked ? allKeyCount : allKeyCount - internalKeyCount)]);
                        var propsArray = displayInternalElement.checked ? propsAllArray : propsAutosavesArray;
                        var autosaves = document.querySelector('.autosaves');
                        var autosaveTemplate = autosaves.querySelector('.autosave_template');
                        propsArray.forEach(function(value, index, object) {
                            var autosave = autosaveTemplate.cloneNode('deep');
                            // TODO Please note we need to change the clones className!
                            autosave.className = 'autosave';
                            //                var select = autosave.querySelector('.select_one');
                            var selectOne = autosave.querySelector('.select_one_template');
                            selectOne.className = 'select_one';
                            selectOne.addEventListener('change', function(event) {
                                selectOne.checked = event.target.checked;
                                console.log('selectOne.checked', selectOne.checked);
                                var selectedCount = document.querySelectorAll('.select_one:checked').length;
                                deleteSelectedElement.value = chrome.i18n.getMessage('delete_selected', [selectedCount]);
                            }, false);
                            var selectOneNodeList = document.querySelectorAll('.select_one');
                            deleteSelectedElement.value = chrome.i18n.getMessage('delete_selected', [selectOneNodeList.length]);
                            selectOne.dataset.autoSave = value;
                            var startDateTime = autosave.querySelector('.autosave_start');
                            var shortKey = value.replace('autosave,text,', '');
                            try {
                                var dateTime = new Date(shortKey);
                                if (isNaN(dateTime.getTime())) {
                                    startDateTime.textContent = value;
                                } else {
                                    startDateTime.textContent = dateTime.toString().replace(/\s*\([^)]+\)/, '');
                                }
                            } catch (exception) {
                                startDateTime.textContent = value;
                            }
                            var autosaveText = autosave.querySelector('.autosave_text');
                            var autosaveFooterLink = autosave.querySelector('.autosave_footer_link');
                            autosaveText.addEventListener('cut', function(event) {
                                if (event.preventDefault) {
                                    event.preventDefault();
                                }
                            }, false && "useCapture");
                            autosaveText.addEventListener('keydown', function(event) {
                                console.log(event);
                                // TODO Only allow Ctrl+A and Ctrl+C. Ctrl+X would not harm since we prevent the cut event already.
                                if (["Up", "Down", "Left", "Right"].some(function(value) {
                                    return value === event.keyIdentifier;
                                }) || event.ctrlKey && String.fromCharCode(event.keyCode).match(/[AC]/)) {} else {
                                    if (event.preventDefault) {
                                        event.preventDefault();
                                    }
                                }
                            }, false && "useCapture");
                            if (items[value] instanceof Array) {
                                autosaveText.textContent = items[value][0];
                                autosaveFooterLink.href = items[value][1];
                                autosaveFooterLink.textContent = items[value][1];
                            } else {
                                autosaveText.textContent = items[value];
                            }
                            autosaves.appendChild(autosave);
                        });
                        var selectedCount = document.querySelectorAll('.select_one:checked').length;
                        deleteSelectedElement.value = chrome.i18n.getMessage('delete_selected', [selectedCount]);
                    }
                } catch (exception) {
                    window.alert('exception.stack: ' + exception.stack);
                    console.log((new Date()).toJSON(), "exception.stack:", exception.stack);
                }
            });
        })();
    } catch (exception) {
        window.alert('exception.stack: ' + exception.stack);
        console.log((new Date()).toJSON(), "exception.stack:", exception.stack);
    }
}, false);