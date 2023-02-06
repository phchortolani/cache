<!--

v3 = 0; op = 0; ie4  = 0; ie5 = 0; nn4 = 0; nn6 = 0; isMac = 0;

if(document.images) {
    if (navigator.userAgent.indexOf("Opera") != -1) {
        op = 1;
    } else {
        ie4 = (document.all && !document.getElementById);
        nn4 = (document.layers);
        ie5 = (document.all && document.getElementById);
        nn6 = (document.addEventListener);
    }
} else {
    v3 = 1;    
}

if (navigator.userAgent.indexOf("Mac") != -1) {
    isMac = 1;
}

// start the actual code for an alert
function alert_confirm(title, msg, icon, buts, defs, mode) {
    if (ie4 || ie5) {
        // if its IE4+ call the VB Script 
        //retVal = makeMsgBox("Hi","how are you?",32,1,256,4096);
        retVal = makeMsgBox(title, msg, icon, buts, defs, mode);
  
        // which button was pressed?
        // retVal = 1 => Button OK
        // retVal = 2 => Button Canceled
        return retVal;
    } else {
        // else use a simple alert
        alert(msg);
        return 0;
    }
}

// start the code for a prompt
function input_box(title, msg, defaultAnswer) {
    // only three args here
    // Title, Question, Default answer
    
    if (ie4 || ie5) {
        retVal = makeInputBox(title, msg, defaultAnswer);
    } else {
        retVal = prompt(msg, defaultAnswer);
    }
    
    // retVal => boolean ? Submitted : Canceled
    return retVal;    
}
// -->
