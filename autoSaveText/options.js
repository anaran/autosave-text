(function() {
    chrome.storage.sync.get(null, function(items) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
        } else {
            var propsArray = Object.getOwnPropertyNames(items).sort();
            var autosaves = document.querySelector('.autosaves');
            var autosaveTemplate = autosaves.querySelector('.autosave_template');
            propsArray.forEach(function(value, index, object) {
                var autosave = autosaveTemplate.cloneNode('deep');
                // TODO Please note we need to change the clones className!
                autosave.className = 'autosave';
                //                var select = autosave.querySelector('.select_one');
                var startDateTime = autosave.querySelector('.autosave_start');
                startDateTime.innerText = new Date(value.replace('autosave:', '')).toString().replace(/\s*\([^)]+\)/, '');
                var autosaveText = autosave.querySelector('.text');
                autosaveText.innerText = items[value];
                autosaves.appendChild(autosave);
            });
        }
    });
})();