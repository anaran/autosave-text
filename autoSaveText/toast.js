var toast = function(message) {
    var myd = document.createElement('span');
 	var messages =  document.querySelector('div.messages') || document.body.appendChild(document.createElement('div'));
 	messages.className = 'messages';
    myd.className = "toast";
    myd.innerText = message;
    messages.insertBefore(myd, messages.firstChild);
    var to = setTimeout(function() {
        // myd.style.opacity = 0;
        messages.removeChild(myd);
        console.log("running toast timeout");
    }, 10000);
    myd.onclick = function(event) {
        if (to) {
            clearTimeout(to);
            to = undefined;
            if (false) {
                // NOTE I don't know how to copy the selection in chrome or firefox for android 
                var selection = window.getSelection();
                if (selection) {
                    window.getSelection().selectAllChildren(myd);
                }
            }
            console.log("clearing toast timeout");
            myd.style.opacity = 0.3;
        } else {
            messages.removeChild(myd);
        }
    };
};