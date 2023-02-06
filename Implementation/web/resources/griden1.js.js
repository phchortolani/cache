
	//<script language="javascript">
	//<!--
	/*----------------------------------------------------------------------------\
	|                                Table Sort                                   |
	|-----------------------------------------------------------------------------|
	|                         Created by Erik Arvidsson                           |
	|                  (http://webfx.eae.net/contact.html#erik)                   |
	|                      For WebFX (http://webfx.eae.net/)                      |
	|-----------------------------------------------------------------------------|
	| A DOM 1 based script that allows an ordinary HTML table to be sortable.     |
	|-----------------------------------------------------------------------------|
	|                  Copyright (c) 1998 - 2002 Erik Arvidsson                   |
	|-----------------------------------------------------------------------------|
	| This software is provided "as is", without warranty of any kind, express or |
	| implied, including  but not limited  to the warranties of  merchantability, |
	| fitness for a particular purpose and noninfringement. In no event shall the |
	| authors or  copyright  holders be  liable for any claim,  damages or  other |
	| liability, whether  in an  action of  contract, tort  or otherwise, arising |
	| from,  out of  or in  connection with  the software or  the  use  or  other |
	| dealings in the software.                                                   |
	| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
	| This  software is  available under the  three different licenses  mentioned |
	| below.  To use this software you must chose, and qualify, for one of those. |
	| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
	| The WebFX Non-Commercial License          http://webfx.eae.net/license.html |
	| Permits  anyone the right to use the  software in a  non-commercial context |
	| free of charge.                                                             |
	| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
	| The WebFX Commercial license           http://webfx.eae.net/commercial.html |
	| Permits the  license holder the right to use  the software in a  commercial |
	| context. Such license must be specifically obtained, however it's valid for |
	| any number of  implementations of the licensed software.                    |
	| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
	|*GPL - The GNU General Public License    http://www.gnu.org/licenses/gpl.txt |
	|*Permits anyone the right to use and modify the software without limitations |
	|*as long as proper  credits are given  and the original  and modified source |
	|*code are included. Requires  that the final product, software derivate from |
	|*the original  source or any  software  utilizing a GPL  component, such  as |
	|*this, is also licensed under the GPL license.                               |
	\----------------------------------------------------------------------------*/
	var dom = (document.getElementsByTagName) ? true : false;
	var ie5 = (document.getElementsByTagName && document.all) ? true : false;
	var arrowUp, arrowDown;
	if (ie5 || dom)
	 initSortTable();
	if (document.WWW.YBED.value=='PHIL') { window.attachEvent('onresize',gridDoResizeOnResize); }
	function initSortTable() {
	  arrowUp = document.createElement('SPAN');
	  var tn = document.createTextNode('5');
	  arrowUp.appendChild(tn);
	  arrowUp.className = 'arrow';
	  arrowDown = document.createElement('SPAN');
	  var tn = document.createTextNode('6');
	  arrowDown.appendChild(tn);
	  arrowDown.className = 'arrow';
	}
	function sortTable(tableNode, nCol, bDesc, sType) {
	  var tBody = tableNode.tBodies[0];
	  var trs = tBody.rows;
	  var trl= trs.length;
	  var a = new Array();
	  for (var i = 0; i < trl; i++) {
	    a[i] = trs[i];
	  }
	  var start = new Date;
	  window.status = 'Sorting data...';
	  a.sort(compareByColumn(nCol,bDesc,sType));
	  window.status = 'Sorting data done';
	  for (var i = 0; i < trl; i++) {
	    tBody.appendChild(a[i]);
	    window.status = 'Updating row ' + (i + 1) + ' of ' + trl + ' (Time spent: ' + (new Date - start) + 'ms)';
	  }
	  // check for onsort
	  if (typeof tableNode.onsort == 'string')
	    tableNode.onsort = new Function('', tableNode.onsort);
	  if (typeof tableNode.onsort == 'function')
	    tableNode.onsort();
	}
	function CaseInsensitiveString(s) {
	  return String(s).toUpperCase();
	}
	function parseDate(s) {
	  return Date.parse(s.replace(/\-/g, '/'));
	}
	/* alternative to number function
	 * This one is slower but can handle non numerical characters in
	 * the string allow strings like the follow (as well as a lot more)
	 * to be used:
	 *    '1,000,000'
	 *    '1 000 000'
	 *    '100cm'
	 */
	function toNumber(s) {
	    return Number(s.replace(/[^0-9\.]/g, ''));
	}
	function compareByColumn(nCol, bDescending, sType) {
	 var c = nCol;
	 var d = bDescending;
	 var fTypeCast = String;
	 if (sType == 'Number')
	  fTypeCast = Number;
	 else if (sType == 'Date')
	  fTypeCast = parseDate;
	 else if (sType == 'CaseInsensitiveString')
	  fTypeCast = CaseInsensitiveString;
	 return function (n1, n2) {
	  if (fTypeCast(getInnerText(n1.cells[c])) < fTypeCast(getInnerText(n2.cells[c])))
	   return d ? -1 : +1;
	  if (fTypeCast(getInnerText(n1.cells[c])) > fTypeCast(getInnerText(n2.cells[c])))
	   return d ? +1 : -1;
	  return 0;
	 };
	}
	function sortColumnWithHold(e) {
	 // find table element
	 var el = ie5 ? e.srcElement : e.target;
	 var table = getParent(el, 'TABLE');
	 // backup old cursor and onclick
	 var oldCursor = table.style.cursor;
	 var oldClick = table.onclick;
	 // change cursor and onclick
	 table.style.cursor = 'wait';
	 table.onclick = null;
	 // the event object is destroyed after this thread but we only need
	 // the srcElement and/or the target
	 var fakeEvent = {srcElement : e.srcElement, target : e.target};
	 // call sortColumn in a new thread to allow the ui thread to be updated
	 // with the cursor/onclick
	 window.setTimeout(function () {
	  sortColumn(fakeEvent);
	  // once done resore cursor and onclick
	  table.style.cursor = oldCursor;
	  table.onclick = oldClick;
	 }, 100);
	}
	function sortColumn(e,ptable) {
	 var tmp = e.target ? e.target : e.srcElement;
	 var tHeadParent = getParent(tmp, 'THEAD');
	 var el = getParent(tmp, 'TH');
	 if (tHeadParent == null)
	  return;
	 if (el != null) {
	  var p = el.parentNode;
	  var i;
	  // typecast to Boolean
	  el._descending = !Boolean(el._descending);
	  if (tHeadParent.arrow != null) {
	   if (tHeadParent.arrow.parentNode != el) {
	    tHeadParent.arrow.parentNode._descending = null;"_" //reset sort order
	   }
	   tHeadParent.arrow.parentNode.removeChild(tHeadParent.arrow);
	  }
	  if (el._descending)
	   tHeadParent.arrow = arrowUp.cloneNode(true);
	  else
	   tHeadParent.arrow = arrowDown.cloneNode(true);
	  el.appendChild(tHeadParent.arrow);
	  // get the index of the td
	  var cells = p.cells;
	  var l = cells.length;
	  for (i = 0; i < l; i++) {
	   if (cells[i] == el) break;
	  }
	//  var table = getParent(el, 'TABLE');
	  var table = ptable ? ptable : getParent(el, 'TABLE');   //shobby
	  // can't fail
	  sortTable(table,i,el._descending, el.getAttribute('type'));
	 }
	}
	function getInnerText(el) {
	 if (ie5) return el.innerText;"_" //Not needed but it is faster
	 var str = '';
	 var cs = el.childNodes;
	 var l = cs.length;
	 for (var i = 0; i < l; i++) {
	  switch (cs[i].nodeType) {
	   case 1: //ELEMENT_NODE
	    str += getInnerText(cs[i]);
	    break;
	   case 3:"_" //TEXT_NODE
	    str += cs[i].nodeValue;
	    break;
	  }
	 }
	 return str;
	}
	function getParent(el, pTagName) {
	 if (el == null) return null;
	 else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase()) // Gecko bug, supposed to be uppercase
	  return el;
	 else
	  return getParent(el.parentNode, pTagName);
	}
	function AddLine(pyaddline,pwindow) { // JW - not in use i believe
		var retval;
		if (confirm('Create New Data Record?')) {  //neuen datensatz anlegen
			var retval = EventValue(YUCI.value,YUSER.value,YFORM.value,'FIX','COMGridEdit31S','CREATE','6','');
			pyaddline=1;
		}
		pwindow.event.returnValue=false;
		pwindow.event.cancelBubble=true;
	}
	function gridonmousemove(pgridhead,pevent,pgridbody,pthis) {
	// SR11328
	//	if (pthis.offsetLeft+pthis.offsetWidth-gridbodyDIV.scrollLeft-pevent.clientX<5) {
		if (pthis.offsetLeft+pthis.offsetWidth-gridbodyDIV.scrollLeft-(pevent.clientX+document.body.scrollLeft)<5) {
			pthis.style.cursor='col-resize';
		} else {
			pthis.style.cursor='hand';
		}
	}
	function gridonclick(pgridhead,pevent,pgridbody,pthis) {
		cgeCancelDrag();
		if (pthis.offsetLeft+pthis.offsetWidth-gridbodyDIV.scrollLeft-pevent.clientX>=5) {
			sortColumn(pevent,pgridbody);
		}
	}
	function windowsetTimeout(pstrCommand,pintDelay)	{
		if (0) {
			window.setTimeout(pstrCommand,pintDelay)
		} else {
			eval(pstrCommand)
		}
	}
	//----------------------------------
	//Column Resizing
	//----------------------------------
	function cge() {
		alert(2);
	}
	function gridStartColumnResize() {
		var el;
		var gridResize;
		gridCurrentColumn=event.srcElement.cellIndex;
		if (gridCurrentColumn==undefined) {
			gridCurrentColumn=event.srcElement.parentNode.parentNode.cellIndex;
		}
		//if (typeof(document.WWW)&&typeof(document.WWW.YBED)&&document.WWW.YBED.value=="PHIL") { alert('OY'); }
		var el=gridhead.cells[gridCurrentColumn];
		if (el!=undefined) {
		// SR11328
		//	gridPos = event.clientX;
			gridPos = event.clientX+document.body.scrollLeft;
			var gridResize=el.offsetLeft+el.offsetWidth-gridbodyDIV.scrollLeft+4; // <-- ? use doc offset when using grid offset
			if (gridResize-gridPos<6) {
				cgeCancelDrag();
				gridSize = el.offsetWidth;
				el.attachEvent("onmousemove", gridDoResize);
		        el.attachEvent("onmouseup", gridEndResize);
		        el.attachEvent("onlosecapture", gridEndResize);
		        el.setCapture();
			}
		}
        el = null;
        event.cancelBubble = true;
	}
	function gridDoResizeOnResize() {
		//if (typeof(gridCurrentColumn)=='undefined') { gridCurrentColumn=1; }
		//gridSize = gridbodyDIV.width;
		//gridPos = 0;
		//gridDoResize();
		gridheadDIV.style.left=gridbodyDIV.style.left;
	}
	function gridDoResize(){
		var sz;
	// SR11328
		//sz = gridSize + event.clientX - gridPos;
		sz = gridSize + event.clientX - gridPos + document.body.scrollLeft;
		sz = sz < 5 ? 5 : sz;
		gridhead.cells[gridCurrentColumn].style.width = sz;
		if (gridbody.rows.length>0) {
			gridbody.rows[0].cells[gridCurrentColumn].style.width=sz;
			gridbody.rows[0].cells[gridCurrentColumn].style.left=gridhead.cells[gridCurrentColumn].style.left;
			gridbody.style.left=gridhead.style.left;
		}
		gridbodyDIV.style.left=gridheadDIV.style.left;
	// SR11328
		gridbodyDIV.onscroll();
	}
	function gridEndResize() {
		var el;
		var width;
		el=gridhead.cells[gridCurrentColumn];
        el.detachEvent("onmousemove", gridDoResize);
        el.detachEvent("onmouseup", gridEndResize);
        el.detachEvent("onlosecapture", gridEndResize);
        el.releaseCapture();
		gridDoResize();
	// SR11328
    //	var width = gridSize + event.clientX - gridPos;
    	width = gridSize + event.clientX - gridPos + document.body.scrollLeft;
		if (width < 5) {width = 5}
        CallBack("OnColumnResize^COMGridEdit31Events",el.id,width);
		//x=y;
        gridbodyDIV.onscroll();
        el = null;
	}
	function ClearErrors(pintLine) {
		var intCols;
		var i;
		var objChild;
		objChild=gridbody.children[pintLine-1];
		if (objChild!=undefined) {
			intCols=gridbody.children[pintLine-1].length-1;
			for (var i = 0; i < intCols; i++) {
				gridbody.children[pintLine-1].children[i].error=0;
			}
		}
	}
	function GetBorderStyle(pthis) {
		var strBorder;
		var focusfield;
		var value;
		strBorder="1px outset";
		if (gridhead.resizing=='') {
			//if (document.getElementById('focusfield').value=='') {
				//document.getElementById('focusfield').value='tdY1_1';
			//}
			focusfield=document.getElementById('focusfield').value;
			if (pthis!=null) {
				if ((pthis.id==focusfield)&&(pthis.id!='')&&(focusfield!='')) {
					value=document.getElementById(focusfield).value;
					if (document.getElementById('activefield').value=='') {
						strBorder="2px solid black";
					} else {
						strBorder="1px outset";
					}
					pthis.title=pthis.tooltip;
				//} else if (((pthis.innerText=='  ')||(pthis.innerText=''))&&(pthis.required==1)) {
				} else if ((pthis.innerText=='  ')&&(pthis.required==1)) {
					strBorder="1px solid red";
				} else if (pthis.error==1) {
					strBorder="1px solid blue";
					pthis.tooltip='Error';
				} else {
					strBorder="1px outset";
					pthis.title=pthis.tooltip;
				}
			}
		}
		return strBorder;
	}
	function SetFocus(pstrName) {
		var blnSharedForm=document.getElementById('sharedform').value;
		document.getElementById('activegrid').value=pstrName;
		if ((pstrName=='')&&(blnSharedForm==1)) {
			gridDIV.style.border='2px solid gray';
		} else {
			gridDIV.style.border='2px solid blue';
		}
	}
	function getDIVheight(pMaxHeight) {
		var height;
		height=gridbodyDIV.offsetTop+gridbodyDIV.scrollHeight;
		if (height>pMaxHeight) {
			height=pMaxHeight-gridbodyDIV.offsetTop;
		}
		return height;
	}
	function getDIVheight1(pMaxHeight) {
		var heightlines;
		var length;
		var i;
		var scrollBarHeight;
		heightlines=0;
		scrollBarHeight=0;
		length=gridbody.children[0].children.length-1;
		for (var i = 0; i < length; i++) {
			heightlines = heightlines + gridbody.children[0].children[i].clientHeight;
		}
		heightlines=gridbody.scrollHeight;
		height=heightlines+gridhead.clientHeight;
		height=gridbody.offsetHeight;
		if (height>pMaxHeight) {
			height=pMaxHeight-gridhead.clientHeight;
		}
		return height;
	}
	function schAlert(pstr) {
		activateField(event.srcElement.id.substr(2,999),'white');
		//event.srcElement.parentElement.focus();
	}
	function getDIVheight2(pMaxHeight) {
		var height;
		var length;
		var i
		height=0;
		if (gridbody.children.length>0) {
			length=gridbody.children[0].children.length-1;
			for (var i = 0; i < length; i++) {
				//height = height + gridhead.children[i].offsetHeight;
				alert(gridhead.children[0].children[i].tagName);
			}
			//height=height;
			if (pMaxHeight==0) {
				height=null;
			} else { 
				if (pMaxHeight<height) {
					//height=pMaxHeight;
				}
			}
		}
		return height;
	}
	function getDIVwidth(pMaxWidth) {
		var width;
		var i;
		var length;
		width=0;
		length=gridhead.children[0].children[0].children.length;
		for (var i = 0; i < length; i++) {
			width = width + gridhead.children[0].children[0].children[i].offsetWidth;
		}
		width=width+16+4;
		if (pMaxWidth==0) {
			width=null;
		} else { 
			if (width>(pMaxWidth-gridDIV.offsetLeft)) {
				width=pMaxWidth-gridDIV.offsetLeft;
			}
		}
		return width;
	}
	function moveFocus(richt,fix,nofocus,normcolor) {
		var focusFieldNew;
		var blnFocusFlag;
		var focusfield=document.getElementById('focusfield').value;
		if (fix == 1) {
			if (focusfield != '') {
				document.getElementById(focusfield).style.border='none';
				document.getElementById(focusfield).style.border='1px outset';
			}
			document.getElementById('focusfield').value=richt;
			if (richt!='') {
				if (normcolor == 1) {
					document.getElementById(richt).style.border='2px solid black';
				} else {
					document.getElementById(richt).style.border='2px solid red';
					document.getElementById(richt).value='+';
				}
				if (nofocus != 1) document.getElementById(richt).focus();
			}
		} else if (focusfield!='') { // JW 1-Dec-2004: Make sure there is a line
			/* SR11186
			colour = document.getElementById(focusfield).style.backgroundColor
			blnFocusFlag=((colour=='ivory')||(colour=='white'))
			*/
			blnFocusFlag=false
			focusfieldNew=focusfield;
			if        (richt==9)  { focusfieldNew=moveFocusTab(focusfield);
			} else if (richt==37) { focusfieldNew=moveFocusLeft(focusfield);
			} else if (richt==39) { focusfieldNew=moveFocusRight(focusfield);
			} else if (richt==38) { focusfieldNew=moveFocusUp(focusfield);
			} else if (richt==40) { focusfieldNew=moveFocusDown(focusfield);
			} else if (richt==36) { focusfieldNew=moveFocusHome(focusfield);
			} else if (richt==35) { focusfieldNew=moveFocusEnd(focusfield);
			} else if (richt==34) { focusfieldNew=moveFocusPgDn(focusfield);
			} else if (richt==33) { focusfieldNew=moveFocusPgUp(focusfield);
			}	
			var focusfieldMessage=focusfield+':'+focusfieldNew;
			retval=focusfieldNew;
			if (retval != '' && retval !=richt) {
				document.getElementById('focusfield').value=retval;
				focusfieldNew=document.getElementById(retval);
				// if (focusfield != '') {
				document.getElementById(focusfield).style.border='none';
				document.getElementById(focusfield).style.border='1px outset';
				document.getElementById(focusfield).style.border=GetBorderStyle(document.getElementById(focusfield));
				// }
				//focusfieldNew.style.border='2px solid black';
				focusfieldNew.style.border=GetBorderStyle(focusfieldNew);
				if ((focusfieldNew.offsetLeft+focusfieldNew.offsetWidth)>(gridDIV.offsetWidth+gridbodyDIV.scrollLeft)) {
					gridbodyDIV.scrollLeft=(focusfieldNew.offsetLeft+focusfieldNew.offsetWidth-gridDIV.clientWidth);
				}
				if ((focusfieldNew.offsetLeft)<(gridbodyDIV.scrollLeft+10)) {
					gridbodyDIV.scrollLeft=(focusfieldNew.offsetLeft);
					if (gridbodyDIV.scrollLeft<200) {
						gridbodyDIV.scrollLeft=0;
					}
				}
				if ((focusfieldNew.offsetTop+focusfieldNew.offsetHeight)>(gridbodyDIV.offsetHeight+gridbodyDIV.scrollTop)) {
					gridbodyDIV.scrollTop=focusfieldNew.offsetHeight+gridbodyDIV.scrollTop;
				} else if ((focusfieldNew.offsetTop)<(gridbodyDIV.scrollTop)) {
					gridbodyDIV.scrollTop=focusfieldNew.offsetTop;
				}
			}
		}
		function moveFocusLeft(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var blnFlag=true;
			while (blnFlag==true) {
				if (document.getElementById(focusfieldNew).previousSibling.id == '') {
					focusfieldNew=pfocusfield;
					blnFlag=false;
				} else if (document.getElementById(focusfieldNew).previousSibling.id.search("key")>-1) {
					focusfieldNew=pfocusfield;
					blnFlag=false;
				} else {
					focusfieldNew=document.getElementById(focusfieldNew).previousSibling.id;
					//if (document.getElementById(focusfieldNew).style.backgroundColor!='ivory') {
					if ((document.getElementById('read'+focusfieldNew))) {
						if (blnFocusFlag==false) {
							blnFlag=false;
						}
					} else {
						blnFlag=false;
					}
				}
			}
			return focusfieldNew;
		}
		function moveFocusRight(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var blnFlag=true;
			while (blnFlag==true) {
				if (document.getElementById(focusfieldNew).nextSibling == null) {
					focusfieldNew=pfocusfield;
					blnFlag=false;
				} else {
					focusfieldNew=document.getElementById(focusfieldNew).nextSibling.id;
					//if (document.getElementById(focusfieldNew).style.backgroundColor!='ivory') {
					if ((document.getElementById('read'+focusfieldNew))) {
						if (blnFocusFlag==false) {
							blnFlag=false;
						}
					} else {
						blnFlag=false;
					}
				}
			}
			return focusfieldNew;
		}
		/*
		function moveFocusUpOld(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var previousSibling=document.getElementById(pfocusfield).parentNode.previousSibling;
			if (previousSibling != null) {
				focusfieldNew=previousSibling.children[document.getElementById(pfocusfield).cellIndex].id;
			} 
			return focusfieldNew;
		}
		*/
		function moveFocusUp(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var previousSibling=document.getElementById(pfocusfield).parentNode.previousSibling;
			var quit=(previousSibling==null);
			while (!quit) {
				if (previousSibling!=null) {
					// This handles non-displayed lines
					if (previousSibling.style.display!="none") {
						focusfieldNew=previousSibling.children[document.getElementById(pfocusfield).cellIndex].id;
						quit=true;
					} else {
						previousSibling=previousSibling.previousSibling;
						if (previousSibling==null) {
							quit=true;
						}
					}
				}
			}				
			return focusfieldNew;
		}
		function moveFocusDown(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var nextSibling=document.getElementById(pfocusfield).parentNode.nextSibling;
			var quit=(nextSibling==null);
			while (!quit) {
				if (nextSibling!=null) {
					// This handles non-displayed lines
					if (nextSibling.style.display!="none") {
						focusfieldNew=nextSibling.children[document.getElementById(pfocusfield).cellIndex].id;
						quit=true;
					} else {
						nextSibling=nextSibling.nextSibling;
						if (nextSibling==null) {
							quit=true;
						}
					}
				}
			}			
			return focusfieldNew;
		}		
		/*
		function moveFocusDownOld(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var nextSibling=document.getElementById(pfocusfield).parentNode.nextSibling;
			if (nextSibling != null) {
				focusfieldNew=nextSibling.children[document.getElementById(pfocusfield).cellIndex].id;
			} 
			return focusfieldNew;
		}
		*/
		function moveFocusTab(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var nextSibling;
			var objChildren=document.getElementById(pfocusfield).parentNode.children;
			var moving;
			// var colour = document.getElementById(pfocusfield).style.backgroundColor;
			// blnFocusFlag=((colour=='ivory')||(colour=='white'));
			blnFocusFlag=true  // SR11186
			do {
				if ((event.shiftKey==false)&&(event.shiftLeft==false)) {
					if (objChildren[objChildren.length-1].id == document.getElementById(pfocusfield).id) {
						focusfieldNew=moveFocusTabNextRow(pfocusfield);
					} else {
						focusfieldNew=moveFocusRight(pfocusfield);
						if (pfocusfield==focusfieldNew) {
							focusfieldNew=moveFocusTabNextRow(pfocusfield);
							/* SR11186
							if (document.getElementById(focusfieldNew).style.backgroundColor!='ivory') {
								if (blnFocusFlag==true) {
									focusfieldNew=moveFocusRight(focusfieldNew);
								}
							} */
						}
					}
				} else {
					if (objChildren[1].id==document.getElementById(pfocusfield).id) {
						focusfieldNew=moveFocusTabPrevRow(pfocusfield);
					} else {
						focusfieldNew=moveFocusLeft(pfocusfield);
						if (pfocusfield==focusfieldNew) {
							focusfieldNew=moveFocusTabPrevRow(pfocusfield);
							/* SR11186
							if (document.getElementById(focusfieldNew).style.backgroundColor!='ivory') {
								if (blnFocusFlag==true) {
									focusfieldNew=moveFocusLeft(focusfieldNew);
								}
							} */
						}
					}
				}
				// SR11186
				if (pfocusfield==focusfieldNew) {  // no more enabled fields
					focusfieldNew = focusfield
					moving=false
				} else {
					pfocusfield=focusfieldNew
					moving = (document.getElementById(focusfieldNew).style.backgroundColor=='lightgrey')
				}
			} while (moving)
			return focusfieldNew;
		}
		function moveFocusTabNextRowOld(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var nextSibling=document.getElementById(pfocusfield).parentNode.nextSibling;
			if (nextSibling != null) {
				focusfieldNew=nextSibling.children[1].id;
				if (document.getElementById(focusfieldNew).style.backgroundColor!='ivory') {
					if (blnFocusFlag==true) {
						focusfieldNew=moveFocusRight(focusfieldNew);
					}
				}
			}
			return focusfieldNew;
		}
		function moveFocusTabNextRow(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var nextSibling=document.getElementById(pfocusfield).parentNode.nextSibling;
			var quit=(nextSibling==null);
			while (!quit) {
				if (nextSibling != null) {
					if (nextSibling.style.display!="none") {	
						focusfieldNew=nextSibling.children[1].id;
						quit=true;
						if (document.getElementById(focusfieldNew).style.backgroundColor!='ivory') {
							if (blnFocusFlag==true) {
								focusfieldNew=moveFocusRight(focusfieldNew);
							}
						}
					} else {
						nextSibling=nextSibling.nextSibling;
						if (nextSibling==null) {
							quit=true;
						}
					}
				}
			}
			return focusfieldNew;
		}
		function moveFocusTabPrevRowOld(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var prevSibling=document.getElementById(pfocusfield).parentNode.previousSibling;
			if (prevSibling != null) {	
				var objChildren=document.getElementById(pfocusfield).parentNode.children;
				focusfieldNew=prevSibling.children[objChildren.length-1].id;
				quit=true;
				if (document.getElementById(focusfieldNew).style.backgroundColor!='ivory') {
					if (blnFocusFlag==true) {
						focusfieldNew=moveFocusLeft(focusfieldNew);
					}
				}
			}
			return focusfieldNew;
		}
		function moveFocusTabPrevRow(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var prevSibling=document.getElementById(pfocusfield).parentNode.previousSibling;
			var quit=(prevSibling==null);
			while (!quit) {
				if (prevSibling != null) {	
					if (prevSibling.style.display!="none") {
						var objChildren=document.getElementById(pfocusfield).parentNode.children;
						focusfieldNew=prevSibling.children[objChildren.length-1].id;
						quit=true;
						if (document.getElementById(focusfieldNew).style.backgroundColor!='ivory') {
							if (blnFocusFlag==true) {
								focusfieldNew=moveFocusLeft(focusfieldNew);
							}
						}
					} else {
						prevSibling=prevSibling.previousSibling;
						if (prevSibling==null) {
							quit=true;
						}
					}
				}
			}
			return focusfieldNew;
		}
		function moveFocusHome(pfocusfield) {
			var focusfieldNew=pfocusfield;
			if (document.getElementById(pfocusfield).firstChild != null) {
				//focusfieldNew=document.getElementById(pfocusfield).parentNode.parentNode.firstChild.children[1].id;
				focusfieldNew=document.getElementById(pfocusfield).parentNode.children[1].id; // SR11247
				/* SR11186
				if (document.getElementById(focusfieldNew).style.backgroundColor!='ivory') {
					focusfieldNew=moveFocusRight(focusfieldNew);
				} */
			}
			return focusfieldNew;
		}
		function moveFocusEnd(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var objChildren;
			if (document.getElementById(focusfield).lastChild != null) {
				//objChildren=document.getElementById(pfocusfield).parentNode.parentNode.lastChild.children;
				objChildren=document.getElementById(pfocusfield).parentNode.children;
				focusfieldNew=objChildren[objChildren.length-1].id;
				/* SR11186
				if (document.getElementById(focusfieldNew).style.backgroundColor!='ivory') {
					focusfieldNew=moveFocusLeft(focusfieldNew);
				} */
			}
			return focusfieldNew;
		}
		function moveFocusPgDn(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var parentNode=document.getElementById(pfocusfield).parentNode;
			if ((parentNode.rowIndex + 10) > parentNode.parentNode.children.length) {
				parentNode.parentNode.children[parentNode.parentNode.children.length-1].children[document.getElementById(pfocusfield).cellIndex].scrollIntoView(true);
				var focusfieldNew = parentNode.parentNode.children[parentNode.parentNode.children.length-1].children[document.getElementById(pfocusfield).cellIndex].id;
			} else {
				parentNode.parentNode.children[parentNode.rowIndex + 10].children[document.getElementById(pfocusfield).cellIndex].scrollIntoView(true);
				var focusfieldNew = parentNode.parentNode.children[parentNode.rowIndex + 10].children[document.getElementById(pfocusfield).cellIndex].id;
			}
			return focusfieldNew;
		}
		function moveFocusPgUp(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var parentNode=document.getElementById(pfocusfield).parentNode;
			if ((parentNode.rowIndex - 10) < 0) {
				var focusfieldNew = parentNode.parentNode.children[0].children[document.getElementById(focusfield).cellIndex].id;
			} else {
				var focusfieldNew = parentNode.parentNode.children[parentNode.rowIndex - 10].children[document.getElementById(focusfield).cellIndex].id;
			}
			return focusfieldNew;
		}
	}
	//----------  End MoveFocus Code-----------------------------------
	function StoreFocus() {
		var yfield=document.getElementById('focusfield').value.substring(2,999);
		var retval = EventValue(document.getElementById('gridYUCI').value,document.getElementById('gridYUSER').value,document.getElementById('gridYFORM').value,'FIX','COMGridEdit31S','SETFOCUSFIELD','6',yfield);
	}
	function deleteRowOld(line) { // JW 18-Jan-2005
	  var intLastLine=gridbody.children[0].children.length-1;
	  if (line<intLastLine) {
	    moveFocus(40);
	  } else {
	    if (line==0) {
	      document.getElementById('focusfield').value='';
	    } else {
	      moveFocus(38);
	    }
	  }
	  document.all.gridbody.deleteRow(line);
     //updateRecord(line);  //nur ausschalten   ;shobby
	}
	function deleteRow(line) {
	  var previousFF = document.getElementById('focusfield').value
	  moveFocus(40);
	  if (document.getElementById('focusfield').value==previousFF) {
		  moveFocus(38);
		  if (document.getElementById('focusfield').value==previousFF) {
			  document.getElementById('focusfield').value='';
		  }
	  }
	  document.all.gridbody.deleteRow(line);
	}
 	//-->
	//</script>
	

	//<!--
	function gridControlsCheck(pYFIELDNAME,pYTEXT,pblnReadOnly) {
		var objCheck;
		objCheck=document.createElement('INPUT');
		objCheck.type='checkbox';
		objCheck.name=pYFIELDNAME;
		objCheck.id=pYFIELDNAME;
		objCheck.value=pYTEXT;
		if (pYTEXT==1) {
			objCheck.checked=true;
		}
		if (!pblnReadOnly) {
			objCheck.attachEvent('onClick',alert(1));
		}
	}
 	//-->
	

	//<script language="javascript">
	//<!--
	//----------------------------------
	//Column Dragging
	//----------------------------------
 var cgeDragTimeOut=null;
function cgeCancelDrag() {
	if (cgeDragTimeOut!=null) {
		window.clearTimeout(cgeDragTimeOut);
		cgeDragTimeOut=null;
	}
}
function cgeDragColumn() {
	var objHdr=findObjectTagName(event.srcElement,'TH');
	cgePos = event.clientX;
	cgeSize=getPageOffsetLeft(objHdr);
	cgeDragTimeOut=window.setTimeout('cgeDragColumnNow("'+objHdr.id+'")',500);
}
function cgeDragColumnNow(pidElement) {
	var objHdr=document.getElementById(pidElement);
	var el = document.createElement('div');
	el.id='move';
	el.moveElement=objHdr.id;
	el.className='head';
 	el.style.width=objHdr.style.width;
 	el.style.zIndex=10;
 	el.style.position='absolute';
 	el.innerHTML=objHdr.innerText;
 	el.style.top=getPageOffsetTop(objHdr);
 	el.style.left=cgeSize;
 	el.style.fontSize='x-small';
 	el.style.fontFamily='Arial';
 	el.style.fontWeight='bold';
 	el.style.textAlign='center';
 	el.style.border='1px outset';
 	el.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=60)";
    document.body.attachEvent("onmousemove", cgeDoDragColumn);
    document.body.attachEvent("onmouseup", cgeEndDragColumn);
    document.body.attachEvent("onlosecapture", cgeEndDragColumn);
    document.body.setCapture();
 	document.body.appendChild(el);
 	el = null;
} 	
function cgeDoDragColumn() {
	var sz = cgeSize + event.clientX - cgePos;
	move.style.left= sz;
}
function cgeEndDragColumn() {
	var InsertElement=null;
	var strValue='';
	var sz = cgeSize + event.clientX - cgePos;
	var hdr=gridheadRow;
	var FromId;
	var ToId;
	for (i=0;i<hdr.cells.length;i++) {
		if (getPageOffsetLeft(hdr.cells[i])<sz) {
			InsertElement=hdr.cells[i];
		}
	}
	if (InsertElement!=null) {
		if (move.moveElement!=InsertElement.id) {
			//CallBack("SwapColumns^COMViewFilterColumn",move.moveElement,InsertElement);
			var Node=document.getElementById(move.moveElement);
			FromId=Node.id;
			ToId=InsertElement.id;
			cgeSwapNodes(Node.cellIndex,InsertElement.cellIndex);
			Node.removeNode;
			InsertElement.insertAdjacentElement('BeforeBegin',Node);
			var retval = EventValue(document.getElementById('gridYUCI').value,document.getElementById('gridYUSER').value,document.getElementById('gridYFORM').value,'FIX','COMGridEdit31R','REORDERLAYOUT','6',FromId+';'+ToId);
		}
	}
	document.body.detachEvent("onmousemove", cgeDoDragColumn);
    document.body.detachEvent("onmouseup", cgeEndDragColumn);
    document.body.detachEvent("onlosecapture", cgeEndDragColumn);
    document.body.releaseCapture();
	move.outerHTML='';
	return false;
	event.cancelBubble=true;
}
function cgeSwapNodes(From,To) {
	var Rows;
	var i;
	var Node;
	var InsertElement;
	Rows=gridbody.children[0].children.length;
	for (i=0;i<Rows;i++) {
		InsertElement=gridbody.children[0].children[i].children[To];
		Node=gridbody.children[0].children[i].children[From];
		Node.removeNode;
		InsertElement.insertAdjacentElement('BeforeBegin',Node);
	}
}
 	//-->
	//</script>
	

//<script language="javascript">
//<!--
function cgeUpdateValue(id,Value,Color) {
	if (document.getElementById(id+'_checkbox')!=null) {
		document.getElementById(id+'_checkbox').checked=+Value;
	} else {
		document.getElementById(id).firstChild.innerHTML=Value;
		document.getElementById(id).style.color=Color;
	}
}
function cgeAddCell(Row,fieldname,required,font,fontsize,backgroundColor,width,height,textAlign,ytext) {
	var newCell=Row.insertCell(-1);
	newCell.id='td'+fieldname;
	newCell.required=required;
	var cellStyle=newCell.style;
	cellStyle.font=fontsize+'pt '+font;
	cellStyle.fontWeight='normal';
	if (required==1) {
		cellStyle.border='1px solid red';
	} else {
		cellStyle.border='1px outset';
	}
	cellStyle.backgroundColor=backgroundColor;
 	cellStyle.width=gridhead.rows[0].cells[newCell.cellIndex].style.width;
	cellStyle.height=height;
	cellStyle.margin='0pt';
	cellStyle.padding='0pt';
	cellStyle.textAlign=textAlign;
	newCell.attachEvent('onmousedown',schAlert);
	newCell.innerHTML=unescape(ytext);
}
// ********************** Row Creation Code ******************************************************
var gCOLON='';
function RunMethod(pMethod) {
	var retval = EventValue(document.getElementById('gridYUCI').value,document.getElementById('gridYUSER').value,document.getElementById('gridYFORM').value,'FIX','COMGridEdit31R','RUNMETHOD','6',pMethod);
}
function cgeBodyRow(Body,idRow) {
	var newRow=Body.insertRow(-1);
	newRow.id='GridRow'+idRow;
	newRow.style.font='12pt Script';
}
function cgeAddManyRows(Body,strBigString) {
	var i;
	var Rows=strBigString.split('~!@#$~');
	var intRows=Rows.length-1;
	for (i = 0; i != intRows ; i++) {
		var Cols=Rows[i].split('~');
		cgeBodyFieldCell(Cols[0],Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6],Cols[7],Cols[8],Cols[9],Cols[10],Cols[11],Cols[12]);
	}
}
function cgeBodyFieldKey(Row,font,fontsize,height,backgroundColor,innerHTML) {
	var newCell=Row.insertCell(-1);
	newCell.className='TDkey';
	var cellStyle=newCell.style;
	cellStyle.font=fontsize+'pt '+font;
	if (document.WWW.YBED.value == "JOSEPH1") {
		(alert(newCell.cellIndex))
	}
 	cellStyle.width=gridhead.rows[0].cells[newCell.cellIndex].style.width;
	cellStyle.height=height+'pt';
	cellStyle.backgroundColor=backgroundColor;
	newCell.innerHTML=unescape(innerHTML);
	//newCell.innerHTML=unescape('&nbsp;');
}
function cgeBodyFieldCell(strRow,fieldname,required,font,fontsize,backgroundColor,height,textAlign,innerHTML,enabled,title,pCOLON,fontcolor) {
	gCOLON=pCOLON;
	//var Row=document.getElementById(strRow);
	var Row=strRow;
	var newCell=Row.insertCell(-1);
	var strFont=fontsize+'pt '+font;
	newCell.id='td'+fieldname;
	newCell.required=required;
	newCell.title=title;
	/////newCell.noWrap=true;
	var cellStyle=newCell.style;
	if (cellStyle.font!=strFont) {cellStyle.font=strFont;}
	//cellStyle.font=fontsize+'pt '+font;
	cellStyle.fontWeight='normal';
	if (fontcolor!='') {
		cellStyle.color=fontcolor;
	}
	newCell.className='TDfld';
	if (required==1) {
		if (innerHTML=='') {
			newCell.className='TDreq';
		}
		cellStyle.border='1px solid red';
	} else {
		cellStyle.border='1px outset';
	}
	cellStyle.backgroundColor=backgroundColor;
 	if (Row.rowIndex==0) {
	 	cellStyle.width=gridhead.rows[0].cells[newCell.cellIndex].style.width;
 	}
	cellStyle.height=height;
	cellStyle.margin='0pt';
	cellStyle.padding='0pt';
	cellStyle.textAlign=textAlign;
	if (enabled==1) {
		newCell.attachEvent('onmousedown',cgeOnMouseDownEnabled);
	} else {
		newCell.attachEvent('onmousedown',cgeOnMouseDownDisabled);
		var newReadOnly=document.createElement('INPUT');
		newReadOnly.id='read'+fieldname;
		newReadOnly.value=1;
		//Row.appendChild(newReadOnly); JW: If we add more children to the row, 
		// the count of columns becomes incorrect. So attach to grid body.
		document.getElementById('gridbody').appendChild(newReadOnly);
		//newCell.appendChild(newReadOnly); - this would be more appropriate...
		if (document.WWW.YBED.value!="ROB") {
			newCell.setAttribute("Locked")=1
		}
	}
	if (innerHTML!='') {
		newCell.innerHTML=unescape(innerHTML);
		if (document.WWW.YBED.value == "SHOBBY") {
			//x=y;
			//newCell.innerHTML=unescape('aaa');
			//newCell.innerHTML='aaa';
		}
	}
	//TBODY.refresh();
}
function cgeOnMouseDownEnabled() {
	activateField(findObjectTagName(event.srcElement,'TD').id.substr(2),gCOLON);
}
function cgeOnMouseDownDisabled() {
	moveFocus(findObjectTagName(event.srcElement,'TD').id,1,1,1)
}
// ********************** /Row Creation Code ******************************************************
function createInput(pid,pvalue,ptype) {
	var objInput=document.createElement('INPUT');
	objInput.id=pid;
	objInput.value=pvalue;
	objInput.type=ptype;
	gridDIV.appendChild(objInput);
}
function setFocusGrid() {
	var retval=SetFocus('Grid');
	window.event.cancelBubble=true;
	window.event.returnValue=false;
}
function gridAddHeader() {
	var objTable=document.createElement('TABLE');
	objTable.cellSpacing=0;
	objTable.cellPadding=0;
	var objRow=document.createElement('ROW');
	objRow.id="gridKeys";
	objTable.appendChild(objRow);
	gridDIV.appendChild(objTable);
}
function gridAddHeaderKey(pfont,pheight,ptext) {
	var objTH=document.createElement('th');
	objTH.noWrap=true;
	objTH.className='TH';
	objTH.style.font=pfont+'pt arial';
	objTH.style.height=pheight+'pt';
	objTH.style.fontWeight='bold';
	objTH.innerHTML=ptext;
	gridKeys.appendChild(objTH);
	x=y;
}
function createDIV(pLeft,pTop) {
	var objDIV=document.createElement("DIV");
	objDIV.id='gridDIV';
	objDIV.className='gDIVsh';
	//objDIV.style.left=pLeft;
	objDIV.style.top=pTop;
	//objDIV.style.height=100;
	//objDIV.style.width=100;
	objDIV.attachEvent('onfocusin',setFocusGrid) ;
	document.getElementById('xxx').appendChild(objDIV);
	//objDIV.style.height=expression("_intMaxHeight_");
	//objDIV.style.width=expression("_intMaxWidth_");
	//write YCR," onclick ='window.event.cancelBubble=true; ' " ;
	createInput('activefield','','hidden');
	createInput('nextactivefield','','hidden');
	createInput('nextactivecolor','','hidden');
	createInput('gridYUCI','','hidden');
	createInput('gridYUSER','','hidden');
	createInput('gridYFORM','','hidden');
	createInput('activegrid','','');
	createInput('sharedform',0,'hidden');
	createInput('focusfield','','hidden');
	createInput('test','','hidden');
} 	
	var ShowAllLines=new Array(); //null;
	//var PreviousSelected=null;
	var FirstHiddenRow=null;
//Changed to allow both selected and unselected
//function gridDeleteUnselected(pintCol) { 
function gridDeleteSelection(pintCol,areChecked) {
	//var intRows=gridbodyDIV.children[0].children[0].children.length;
	var intRows=TBODY.children.length;
	var i;
	var intRemoved=0;
	var focusField;
	focusField=document.getElementById('focusfield').value;
	if (focusField!='') {
		var focusRow=getRowNum(focusField);
		var blnShowing=true;
	}
	for (i = intRows; i != 0 ; i--) {
		var row = TBODY.children[i-1];
		var rowNum = getRowNum(row.children[1].id);
		var cell = getCell(rowNum,pintCol);
		if (cell!=null) {
			if (cell.checked==areChecked) {
				if (ShowAllLines[pintCol]==null) {
					row.style.display='none';
					intRemoved++;
					if (rowNum==focusRow) {
						blnShowing=false;
					}
				} else {
					row.style.display='block';
				}
			}
		}
	}
	/*
	for (var i = intRows; i !=0 ; i--) {
		var cell = document.getElementById('Y'+i+'_'+pintCol)
		if (cell!=null) {
			//if (document.getElementById('Y'+i+'_'+pintCol).checked==false) {
			if (cell.checked==areChecked) {
				//deleteRow(i)
				if (ShowAllLines[pintCol]==null) {
					//gridbodyDIV.children[0].children[0].children[i-1].style.display='none';
					cell.parentElement.parentElement.parentElement.style.display='none';
					intRemoved++;
					if (i==focusRow) {
						blnShowing=false;
					}
				} else {
					//gridbodyDIV.children[0].children[0].children[i-1].style.display='block';
					cell.parentElement.parentElement.parentElement.style.display='block';
				}
			}
		}
	}
	*/
	// If we are on a removed field, we must attempt to find a row above and then below (if we don't find one)
	// to focus on. 
	/*
	if (PreviousSelected!=null) {
		moveFocus(PreviousSelected,1,0,1);
		PreviousSelected=null; 
	} else if */	
	if (intRemoved!=intRows) {
		if (focusField=='') { // go to first cell
			moveFocus(TBODY.children[0].children[1].id,1,0,1)
		} else if (!blnShowing) {
			moveFocus(38,0,0,'');
			if (document.getElementById('focusfield').value==focusField) {
				moveFocus(40,0,0,'');
			}
		}
	} else if (intRows > 0) {
		//PreviousSelected=focusField;
		moveFocus('',1);
		document.getElementById('focusfield').value='';
	}
	if (ShowAllLines[pintCol]==null) {
		ShowAllLines[pintCol]=1;
		FirstHiddenRow = null;
	} else {
		ShowAllLines[pintCol]=null;
	}
}
// JW : 19-Jan-2005 : Get the row number from a cell object id.
function getRowNum(cellObj) {
	return cellObj.split("Y")[1].split("_")[0];
}
// JW : 19-Jan-2005 : Get the cell object from row and column paramaters
function getCell(row,col) {
	return document.getElementById('Y'+row+'_'+col)
}
 	//-->
	//</script>
	

//<script language="javascript">
//<!--
function activateFieldNow(yfield,yhtml,yvalue,yadd) {   //EINFÜGEN INPUT FELD IN SOURCE CODE
	if (yadd == 1) {                                      //MEHRFACH-AUFRUF BEI ÜBERLANGEM CODE (SELECT/MEMO)
		document.getElementById('td'+yfield).innerHTML='';
		ycancel = null;
		for (yline=1 ; yline<=30 ; yline++) {
			windowsetTimeout('loadSelectField('+yfield+','+yline+')',1);
			if (ycancel == 1) break;
		}
	windowsetTimeout('showSelectField('+yfield+','+yvalue+')',1);
	} else {
		document.getElementById('td'+yfield).innerHTML=unescape(yhtml);
		document.getElementById(yfield).value=unescape(yvalue);
		document.getElementById(yfield).focus();
		if (document.getElementById(yfield).type=='checkbox') {
			saveData(yfield,!document.getElementById(yfield).checked,'2','mouseclick');
		}
	}
}
function showSelectField(yfield,yvalue) {               //SPEICHERUNG
	yhtml = document.getElementById('td'+yfield).innerHTML;
	yhtml = yhtml.replace(/_ASCII60_/gi,'<');
	yhtml = yhtml.replace(/_ASCII62_/gi,'>');
	document.getElementById('td'+yfield).innerHTML = yhtml;
	document.getElementById(yfield).value=unescape(yvalue);
	document.getElementById(yfield).focus();
}
function inactivateField(yfield,yhtml,ycolor,yfocus) {   //RÜCKHOLEN TEXT FELD UND EINFÜGEN IN SOURCE CODE
	var oldfield='td'+yfield;
	document.getElementById(oldfield).innerHTML=unescape(yhtml);
	document.getElementById(oldfield).style.backgroundColor=ycolor;
	//alert(document.getElemeberById('td'+document.getElementById('activefield').value).value);
	document.getElementById('activefield').value='';
	//document.getElementById('activefield').style.border=getBorderStyle(document.getElementById('activefield'));  ???
	if (yfocus == 1 ) {
		//document.getElementById('focusfield').value='td'+yfield;
		//document.getElementById('td'+yfield).style.border='2px solid black';
		focusfield = document.getElementById('focusfield').value
		var retval = EventValue(document.getElementById('gridYUCI').value,document.getElementById('gridYUSER').value,document.getElementById('gridYFORM').value,'FIX','GetFontColour^COMGridEdit31R',oldfield,'6','darkblue');
		document.getElementById(oldfield).style.color=retval;
		document.getElementById(focusfield).style.border='2px solid black';
	}
	ysaveevent=null;
	activateNextField();
}
function activateField(yfield,ycolor) {      //AUFBAU INPUT FELD DURCH HYPEREVENT
	//if (yaddline==null) {
		if (document.getElementById('activefield').value != yfield) {
			document.getElementById('nextactivefield').value=yfield;
			document.getElementById('nextactivecolor').value=ycolor;
		}
		if (document.getElementById('activefield').value == '') {
			activateNextField();
		}
	//}
}
function activateNextField() {   // JW 24-Nov-2004: One click to change focus
	yfield=document.getElementById('nextactivefield').value;
	ycolor=document.getElementById('nextactivecolor').value;
	if (yfield!='') {
		if (!(document.getElementById('read'+yfield))) {
			document.getElementById('activefield').value=yfield;
			document.getElementById('td'+yfield).style.backgroundColor=ycolor;
			focusfield=document.getElementById('focusfield').value;
			if (focusfield != '') {
				document.getElementById(focusfield).style.border='1px outset';
				var retval = EventValue(document.getElementById('gridYUCI').value,document.getElementById('gridYUSER').value,document.getElementById('gridYFORM').value,'FIX','GetFontColour^COMGridEdit31R',focusfield,'6','darkblue');
				document.getElementById(focusfield).style.color=retval;
			}
			document.getElementById('focusfield').value='td'+yfield;
			yaddline=null;
			retval = EventValue(document.getElementById('gridYUCI').value,document.getElementById('gridYUSER').value,document.getElementById('gridYFORM').value,'FIX','COMGridEdit31A','','6',yfield);
		}
	}
	document.getElementById('nextactivefield').value='';
}
function SetLineDefaults() {
	var retval=EventValue(document.getElementById('gridYUCI').value,document.getElementById('gridYUSER').value,document.getElementById('gridYFORM').value,'FIX','OnSetLineDefaults^COMGridEdit31Events','','6','');
}
function Trim(pstrValue) 
{
	// Not used at the moment, leaving it in as it may be useful one day.
	// Remove leading spaces and carriage returns
	while ((pstrValue.substring(0,1) == ' ') || (pstrValue.substring(0,1) == '\n') || (pstrValue.substring(0,1) == '\r'))
	{
		pstrValue = pstrValue.substring(1,pstrValue.length);
	}
	// Remove trailing spaces and carriage returns
	while ((pstrValue.substring(pstrValue.length-1,pstrValue.length) == ' ') || (pstrValue.substring(pstrValue.length-1,pstrValue.length) == '\n') || (pstrValue.substring(pstrValue.length-1,pstrValue.length) == '\r'))
	{
		pstrValue = pstrValue.substring(0,pstrValue.length-1);
	}
	return pstrValue;
}
function ToggleHeader()
{
// This function hides the fieldset above the grid and then moves and resizes the grid.
// 27-Dec-2004		RPW		Created for 10061
	var lngHeight;
	var objFieldSet=findObjectTagName(document.all['YFINAPInvD2'],'FIELDSET');
	if (objFieldSet!=null) {
		if (objFieldSet.style.display!='none') {
			lngHeight=objFieldSet.offsetHeight;
			objFieldSet.style.display='none';
			gridDIV.style.posHeight+=lngHeight;
			EventValue(document.WWW.YUCI.value,document.WWW.YUSER.value,document.WWW.YFORM.value,"ToggleHeader","ToggleHeader^FINAPInv","none","6",gridDIV.style.posHeight);
		} else {
			objFieldSet.style.display='block';
			lngHeight=objFieldSet.offsetHeight;
			gridDIV.style.posHeight-=lngHeight;
			EventValue(document.WWW.YUCI.value,document.WWW.YUSER.value,document.WWW.YFORM.value,"ToggleHeader","ToggleHeader^FINAPInv","block","6",gridDIV.style.posHeight);
		}
	}	
}
function SetGridHeight(pintHeight)
{
	var objFieldSet=findObjectTagName(document.all['YFINAPInvD2'],'FIELDSET');
	if (objFieldSet!='null') {
		objFieldSet.style.display='none';
		gridDIV.style.posHeight=pintHeight
	}
}
function findObjectTagName(objElement,tagName)
{
	var returnValue=null;
	if (objElement!=null) {
		if (objElement.tagName==tagName) {
			returnValue=objElement;
		} else {
			returnValue=findObjectTagName(objElement.parentElement,tagName);
		}
	}
	return returnValue;
}
 	//-->
	//</script>
	
