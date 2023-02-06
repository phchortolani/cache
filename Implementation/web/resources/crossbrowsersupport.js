var capturing;
var objMoving;
function getBrowser() {
	if (#($get(YUSERAGENT)='MSIE')#) {
		return 'IE';
	} else {
		return '';
	}
}
function doInsertAdjacentElement(pObject,pstrWhere,pInsert) {
	if (pObject.insertAdjacentElement) {
		pObject.insertAdjacentElement(pstrWhere,pInsert)
	} else {
		switch(pstrWhere) {
			case "BeforeBegin":
				pObject.parentNode.insertBefore(pInsert, pObject);
				break;
			case "AfterEnd":			
				pObject.parentNode.insertBefore(pInsert, pObject.nextSibling);
		}
	}
}
function windowclosePopup() {  
	if (document.getElementById('popup-div')) document.getElementById('popup-div').hide();
}
function doGetAttribute(pobject,pstrType) {
	alert(typename(pobject.getAttribute(pstrType)));
}
function doSetDisplay(pObject,pstrDisplay) {
	if (pstrDisplay=='inline') {
		pstrDisplay='inline-table';
	}
	pObject.style.display=pstrDisplay;
}
var keyPressed   = null;
var ctrlPressed  = null;
var shiftPressed = null;
var altPressed   = null;
function trackKeyEvent(evt) {  
	evt = window.event ? window.event : evt;
	var keyCode     = evt.keyCode;
	var ctrlKey     = evt.ctrlKey;
	var shiftKey    = evt.shiftKey;
	var altKey      = evt.altKey;
	var srcElement  = document.all ? evt.srcElement.id : evt.target.id;
	var cancelEvent = false;
	if (keyCode == 112 && srcElement == "") cancelEvent = true;  
	if (!document.all && keyCode == 112)   {   
		cancelEvent = true;
		retval = EventValue("#($zu(5))#","#($g(YUSER))#","#($g(YFORM))#","FIX",srcElement, " ","3","NOVALUE");
	}
	if (document.all && keyCode == 13 && srcElement) {         
		evt.keyCode = 9;
	}
	else if (keyCode == 13 && srcElement) {  
	}
	if (cancelEvent || evt.keyCode == "") {
		doCancelEvent(evt);
	} else {
		keyPressed   = evt.keyCode;
		ctrlPressed  = ctrlKey;
		shiftPressed = shiftKey;
		altPressed   = altKey;
	}
}
function getEventKeyCode(e) {
	return e.keyCode ? e.keyCode : keyPressed;
}
function doCancelEvent(e) {
	if (e && e.preventDefault) {   
		 e.preventDefault();
		 e.stopPropagation();
	} else if (e) {                
		e.returnValue = false;
		e.cancelBubble = true;
	}
	keyPressed   = null;   
	ctrlPressed  = null;
	shiftPressed = null;
	altPressed   = null;   
}
function doGetMouseButton(event) {
	var button;
	if (event.which == null) {
		button=(event.button == 1) ? "LEFT" :
		((event.button == 4) ? "MIDDLE" : "RIGHT");
	} else {
		button=(event.which == 1) ? "LEFT" :
		((event.which == 2) ? "MIDDLE" : "RIGHT");
	}
	return button;
}
function isIE() {
	return #(YUSERAGENT="MSIE")#;
}
if (!isIE()) {
	var _emptyTags = {
	   "IMG":   true,
	   "BR":    true,
	   "INPUT": true,
	   "META":  true,
	   "LINK":  true,
	   "PARAM": true,
	   "HR":    true
	};
	HTMLElement.prototype.__defineSetter__("oldWidth", function (sText) {
		this.setAttribute("oldWidth",sText);
	});
	HTMLElement.prototype.__defineGetter__("oldWidth", tmpGet = function () {
		return this.getAttribute("oldWidth");
	});
	HTMLElement.prototype.__defineSetter__("innerText", function (sText) {
		this.innerHTML = convertTextToHTML(sText);
		return sText;
	});
	var tmpGet;
	HTMLElement.prototype.__defineGetter__("innerText", tmpGet = function () {
		var r = this.ownerDocument.createRange();
		r.selectNodeContents(this);
		return r.toString();
	});
	HTMLElement.prototype.__defineSetter__("outerText", function (sText) {
		this.outerHTML = convertTextToHTML(sText);
		return sText;
	});
	HTMLElement.prototype.__defineGetter__("outerText", tmpGet);
	HTMLElement.prototype.insertAdjacentText = function (sWhere, sText) {
		this.insertAdjacentHTML(sWhere, convertTextToHTML(sText));
	};
	HTMLElement.prototype.__defineGetter__("outerHTML", function () {
		var attrs = this.attributes;
		var str = "<" + this.tagName;
		for (var i = 0; i < attrs.length; i++)
			str += " " + attrs[i].name + "=\"" + attrs[i].value + "\"";
		if (_emptyTags[this.tagName])
			return str + ">";
		return str + ">" + this.innerHTML + "</" + this.tagName + ">";
	});
	HTMLElement.prototype.__defineSetter__("outerHTML", function (sHTML) {
		var r = this.ownerDocument.createRange();
		r.setStartBefore(this);
		var df = r.createContextualFragment(sHTML);
		this.parentNode.replaceChild(df, this);
	});
	Event.prototype.__defineSetter__("cancelBubble", function (b) {
		if (b) this.stopPropagation();
	});
	Event.prototype.__defineSetter__("returnValue", function (b) {
		if (!b) this.preventDefault();
	});
	Event.prototype.__defineGetter__("srcElement", function () {
		var node = this.target;
		while (node.nodeType != 1) node = node.parentNode;
		return node;
	});
	Event.prototype.__defineGetter__("toElement", function () {  
		if (this.type=='mouseout') {
			return this.relatedTarget;
		} else if (this.type=='mouseover') {
			return this.target;
		}
	});
	parent.cgeSortColumnAscending = function (a,b) {
		alert('cge');
	}
	Event.prototype.__defineGetter__("fromElement", function () {  
		if (this.type=='mouseout') {
			return this.target;
		} else if (this.type=='mouseover') {
			return this.relatedTarget;
		}
	});
    Event.prototype.__defineGetter__("x", function() {
        return this.pageX;
    });
    Event.prototype.__defineGetter__("y", function() {
        return this.pageY;
    });
    Event.prototype.__defineGetter__("offsetX", function() {
        return this.layerX;
    });
    Event.prototype.__defineGetter__("offsetY", function() {
        return this.layerY;
    });
	var allGetter = function () {  
		var a = this.getElementsByTagName("*");
		var node = this;
		a.tags = function (sTagName) {
			return node.getElementsByTagName(sTagName);
		};
		return a;
	};
	HTMLDocument.prototype.__defineGetter__("all", allGetter);
	HTMLElement.prototype.__defineGetter__("all", allGetter);
	HTMLDocument.prototype.__defineGetter__("frames", function() {  
		return document.getElementsByTagName('FRAME');
	});
	HTMLFrameElement.prototype._location=HTMLFrameElement.location;
	HTMLFrameElement.prototype.__defineSetter__("location", function(locn) { 
		this._location=locn;
		this._location.href=locn.href;
	});
	HTMLFrameElement.prototype.__defineGetter__("location", function() {
		return this;
	});
	HTMLElement.prototype.fireEvent = function (peventName) {  
		peventName=peventName.toLowerCase();
		var eventType='unknown';
		switch (peventName) {
			case 'onclick'    : eventType= 'MouseEvent'; break;
			case 'ondragstart': eventType= 'MouseEvent'; break;
			case 'onkeyup'    : eventType= 'KeyboardEvent'; break;
			case 'onblur'     : eventType= 'HTMLEvents'; break;
			case 'onfocusout' : eventType= 'HTMLEvents'; break;   
			case 'onchange'   : eventType= 'HTMLEvents'; break;
			default: result = 'unknown';
		}
		peventName=peventName.replace(/on/, "");
		var evt = document.createEvent(eventType);
		if (eventType=='KeyboardEvent') {
  			evt.initKeyEvent(peventName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		} else if (eventType=='MouseEvent') {
  			evt.initMouseEvent(peventName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		} else if (eventType=='HTMLEvents') {
  			evt.initEvent(peventName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		} else {
			alert('event '+peventName+' not known. Add to "HTMLElement.prototype.fireEvent" in WWWFORMCrossBrowserSupport.');
		}
		var canceled = !this.dispatchEvent(evt);
		return canceled;
	};
	var Capture;
	window.attachEvent= function (sType, fHandler) {  
		var shortTypeName = sType.replace(/on/, "");
		window.addEventListener(shortTypeName, fHandler, false);
	}
	window.detachEvent= function (sType, fHandler) {  
		var shortTypeName = sType.replace(/on/, "");
		if (typeof fHandler._ieEmuEventHandler == "function") {
			window.removeEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
		} else {   
			window.removeEventListener(shortTypeName, fHandler, true);
		}
	}
	window.createPopup=function() {
		var pObject; 
		pObject=document.createElement('div');
		pObject.setAttribute('id', 'popup-div');
		pObject.document = new Object();
		pObject.document['body'] = new Object();
		pObject.document.body['style'] = new Object();
		pObject.document.body['innerHTML'] = '';
		pObject.document.body['children'] = new Object();
		pObject.document.body.children[0] = new Object();
		pObject.show = function(x,y,w,h) {
			this.style.left = x ? x : 0;
			this.style.top = y ? y : 0;
			this.style.width = w ? w : 0;
			this.style.height = h ? h : 0;
			this.style.visibility = "visible";
			this.style.position = "absolute";
			this.style.backgroundColor = '#fff';
			this.style.backgroundColor = 'lightgrey'; 
			this.style.height = -1;	
			this.style.zIndex = "99999";
			var style = '';
			for(var css in this.document.body['style']) {
				style += css + ':' + this.document.body['style'][css] + '; ';
			}
			this.innerHTML = "<div style='" + style + "'>" + this.document.body['innerHTML'] + "</div>";
			document.body.appendChild(this);
			window.mouseListener = window.mouseListener ? window.mouseListener : document.onmouseup;
			if (window.mouseListener) {
				document.onmouseup = new Function("window.mouseListener(); windowclosePopup(); document.onmouseup = window.mouseListener;");  
			}
			else {
				document.onmouseup = windowclosePopup();  
			}
		};
		pObject.Columns = pObject; 
		pObject.hide = function() {
			this.style.visibility = "hidden";
			if (document.getElementById('popup-div')) document.body.removeChild(document.getElementById('popup-div')); 
		};	
	return pObject;
	}
	document._getElementById = document.getElementById;
	document.getElementById = function(id) {
		var obj=null;
		var obj=document._getElementById(id);
		if (obj==null) obj=document.getElementsByName(id)[0];
		return obj;
	}
	window._showModalDialog = window.showModalDialog;
	window.showModalDialog=function(uri,arguments,options) {
		if (uri!=null) var control=uri.split('YLFDAT=')[1];
		if ((control!=null) && (control.split('&')[0]!=null)) control=control.split('&')[0];
		if (document.getElementById(control)!=null) {
			var strInitValue=document.getElementById(control).value;
			var retval=window._showModalDialog(uri,arguments,options);
			if (retval==null) retval=document.getElementById(control).value;
			if (retval==strInitValue) retval=null;
			window.status='exi:'+control+':'+retval;
		} else {
			var retval=window._showModalDialog(uri,arguments,options);
			window.status='not:'+control+':'+retval;
		}
		return retval;
	}
	HTMLDocument.prototype.attachEvent =
	HTMLElement.prototype.attachEvent = function (sType, fHandler) {
		var shortTypeName = sType.replace(/on/, "");
		var blnQuit=false;
		fHandler._ieEmuEventHandler = function (e) {
			window.event = e;
			return fHandler();
		};
		if (shortTypeName=='losecapture') {
			shortTypeName='blur';
			var obj=document;
		} else if (shortTypeName=='resize') {
			var strFunction=String(fHandler);
			if (strFunction.indexOf('function ()')==-1) {    
				cvResizeFunction[this.id]=strFunction		
			} else {
				cvResizeFunction[this.id]=String(fHandler).split('{')[1].split('}')[0];
			}
			window.setTimeout('simulatedonresize('+this.id+');',1);
			blnQuit=true;
		} else {
			var obj=Capture? document:this;
		}
			if (!blnQuit) obj.addEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
	};
	Window.prototype.detachEvent=
	HTMLDocument.prototype.detachEvent =
	HTMLElement.prototype.detachEvent = function (sType, fHandler) {
		var shortTypeName = sType.replace(/on/, "");
		var blnQuit=false;
		if (shortTypeName=='losecapture') {
			shortTypeName='blur';
			var obj=document;
		} else if (shortTypeName=='resize') {
			cvResizeFunction[this.id]=null;
			blnQuit=true;
		} else {
			var obj=Capture? document:this;
		}
		if (!blnQuit && typeof fHandler._ieEmuEventHandler == "function") {
			obj.removeEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
		} else {   
			obj.removeEventListener(shortTypeName, fHandler, true);
		}
	};
	HTMLDocument.prototype.setCapture =
	HTMLElement.prototype.setCapture = function () {
		Capture=true;
	};
	HTMLDocument.prototype.releaseCapture =
	HTMLElement.prototype.releaseCapture = function () {
		Capture=false;
	};
	emulateEventHandlers(["click"]);
}
var cvResizeFunction = new Array();
var cvResizeWidth = new Array();
var cvResizeHeight = new Array();
var cvResizeLeft = new Array();
var cvResizeTop = new Array();
function simulatedonresize(elem) {      
	var blnResize=true;
	if ((elem!=null) && (elem.id!=null) && (cvResizeFunction[elem.id]!=null)) {
		if (elem.offsetWidth!=cvResizeWidth[elem.id]) {
		} else if (elem.offsetHeight!=cvResizeHeight[elem.id]) {
		} else if (elem.offsetLeft!=cvResizeLeft[elem.id]) {
		} else if (elem.offsetTop!=cvResizeTop[elem.id]) {
		} else {
			blnResize=false;
		}
		if (blnResize) {
			eval(cvResizeFunction[elem.id]);
			cvResizeWidth[elem.id]=elem.offsetWidth;
			cvResizeHeight[elem.id]=elem.offsetHeight;
			cvResizeLeft[elem.id]=elem.offsetLeft;
			cvResizeTop[elem.id]=elem.offsetTop;
		}
		window.setTimeout('simulatedonresize('+elem.id+');',10000);
	}
}
function emulateEventHandlers(eventNames) {
	document.addEventListener("click", function(e) {window.event=e;},true);
	document.addEventListener("keydown", function(e) {eventOnKeyDown(e);},true);
}
function eventOnKeyDown(e) {
	window.event=e;
	if (e.keyCode==112) {
		e.cancelBubble=true;
		e.returnValue=false;
		if (e.srcElement.id!='') {
			retval = EventValue("#($zu(5))#","#($g(YUSER))#","#($g(YFORM))#","FIX",e.srcElement.id, " ","3","NOVALUE");
		}
	}
	if (typeof(pruef) == 'function') pruef(window.event.keyCode);
}

