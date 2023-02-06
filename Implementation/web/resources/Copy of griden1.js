	function gridonmousemove(pgridhead,pevent,pgridbody,pthis) {
		if ((pgridhead.resizing!='')||(ColumnResizing(pevent,pthis))) {
			pthis.style.cursor='col-resize';
		} else {
			pthis.style.cursor='hand';
		} if (gridhead.resizing!='') {
			ColumnResizingOffset(pevent,pthis,pgridhead.resizing);
		}
	}
	function gridonmousedown(pgridhead,pevent,pgridbody,pthis) {
		pgridhead.resizing=ColumnResizing(pevent,pthis);
		if (pgridhead.resizing!='') {
			pthis.style.cursor='col-resize';
		}
	}
	function gridonmouseup(pgridhead,pevent,pgridbody,pthis) {
		if (ColumnResizing(pevent,pthis)=='') {
			pthis.style.cursor='hand';
		}
		pgridhead.resizing='';
	}
	function gridonclick(pgridhead,pevent,pgridbody,pthis) {
		if ((pgridhead.resizing=='')&&(ColumnResizing(pevent,pthis)=='')) {
			sortColumn(pevent,pgridbody);
		}
	}
	function gridonresize(pgridhead,pevent,pgridbody,pthis) {
		pgridbody.children[0].children[0].children[pgridhead.resizing].style.width=pthis.offsetWidth;
	}
	
	function windowsetTimeout(pstrCommand,pintDelay)	{
		if (0) {
			window.setTimeout(pstrCommand,pintDelay)
		} else {
			eval(pstrCommand)
		}
	}
	
	
	function ColumnResizing(pevent,pthis) {
		//determines whether the click should be ignored for column sorting in preference to
		//column resizing.
		var blnFlag;
	
		blnFlag='';
		if (pevent.x-pthis.offsetLeft<5) {
			blnFlag=pthis.cellIndex-1;
		}else if (pthis.offsetLeft+pthis.offsetWidth-pevent.x<5) {
			blnFlag=pthis.cellIndex;
		}
		return blnFlag;
	}

	function ColumnResizingOffset(pevent,pthis,presizing) {
		//determines whether the click should be ignored for column sorting in preference to
		//column resizing.
		var intOffset;
		var width;
	
		intOffset=0;
		if (pevent.button==1) {
			if (pthis.cellIndex>presizing) {
				intOffset=pthis.offsetLeft-pevent.x;
				width=pthis.parentNode.children[presizing].offsetWidth-intOffset;
			}else if (pthis.cellIndex==presizing) {
				intOffset=pthis.offsetLeft+pthis.offsetWidth-pevent.x;
				width=pthis.parentNode.children[presizing].offsetWidth-intOffset;
				if (width<0) {width=0;}
			}
			pthis.parentNode.children[presizing].style.width=width;
		} else {
			gridhead.resizing='';
		}
		return intOffset;
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
			if (document.getElementById('focusfield').value=='') {
				//document.getElementById('focusfield').value='tdY1_1';
			}
			focusfield=document.getElementById('focusfield').value;
			if (pthis!=null) {
				if ((pthis.id==focusfield)&&(pthis.id!='')&&(focusfield!='')) {
					value=document.getElementById(focusfield).value;
					//if (pthis.id==focusfield) {
					//if ((value!='')&&(document.getElementById('activefield').value='')) {
					//if ((value!='')&&(value!=undefined)) {
					if (document.getElementById('activefield').value=='') {
						strBorder="2px solid black";
						//window.status='strBorder='+strBorder+','+pthis.id+','+focusfield+','+document.getElementById(focusfield).value+','+document.getElementById('activefield').value
					} else {
						strBorder="1px outset";
					}
					pthis.title=pthis.tooltip;
				//} else if (((pthis.innerText=='  ')||(pthis.innerText=''))&&(pthis.required==1)) {
				} else if ((pthis.innerText=='  ')&&(pthis.required==1)) {
					strBorder="1px solid red";
				} else if (pthis.error==1) {
					strBorder="1px solid red";
					pthis.tooltip='Error';
				} else {
					strBorder="1px outset";
					pthis.title=pthis.tooltip;
				}
			}
		}
		//strBorder="1px solid green";
		if (pthis.id=='tdY2_2') {
			//window.status=pthis.error+','+pthis.required+','+pthis.innerText+','+strBorder+','+focusfield+','+pthis.id
		}
		return strBorder;
	}
	
	
	function SetFocus(pstrName) {
		var blnSharedForm=document.getElementById('sharedform').value;
		document.getElementById('activegrid').value=pstrName;
		if ((pstrName=='')&&(blnSharedForm==1)) {
			gridDIV.style.border='2px solid gray';
			//document.scripts[7].htmlFor="document";
		} else {
			gridDIV.style.border='2px solid blue';
			//document.scripts[7].htmlFor="gridDIV";
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
		//alert(event.srcElement.id);
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
			//alert(pMaxHeight+','+height);
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
		focusfield=document.getElementById('focusfield').value;
		if (fix == 1) {
			if (focusfield != '') {
				document.getElementById(focusfield).style.border='none';
				document.getElementById(focusfield).style.border='1px outset';
			}
			document.getElementById('focusfield').value=richt;
			if (normcolor == 1) {
				document.getElementById(richt).style.border='2px solid black';
			} else {
				document.getElementById(richt).style.border='2px solid red';
				document.getElementById(richt).value='+';
			}
			if (nofocus != 1) document.getElementById(richt).focus();
		} else {
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
				if (focusfield != '') {
					document.getElementById(focusfield).style.border='none';
					document.getElementById(focusfield).style.border='1px outset';
					document.getElementById(focusfield).style.border=GetBorderStyle(document.getElementById(focusfield));
				}
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
	}
	function moveFocusLeft(pfocusfield) {
		var focusfieldNew=pfocusfield;
		var focusfield=pfocusfield;
		var blnFlag=true;
		while (blnFlag==true) {
			if (document.getElementById(focusfield).previousSibling.id == '') {
				blnFlag=false;
				focusfieldNew=pfocusfield;
			} else if (document.getElementById(focusfield).previousSibling.id.search("key")>-1) {
				blnFlag=false;
				focusfieldNew=pfocusfield;
			} else {
				focusfield=document.getElementById(focusfield).previousSibling.id;
				//if (document.getElementById(focusfield).style.backgroundColor!='lightgrey') {
				if (document.getElementById(focusfield).style.backgroundColor=='ivory') {
					blnFlag=false;
					focusfieldNew=focusfield;
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
				blnFlag=false;
			} else {
				focusfieldNew=document.getElementById(focusfieldNew).nextSibling.id;
				if (document.getElementById(focusfieldNew).style.backgroundColor=='lightgrey') {
				} else {
					blnFlag=false;
				}
			}
		}
		return focusfieldNew;
	}
	function moveFocusUp(pfocusfield) {
		var focusfieldNew=pfocusfield;
		var previousSibling=document.getElementById(pfocusfield).parentNode.previousSibling;
		if (previousSibling != null) {
			focusfieldNew=previousSibling.children[document.getElementById(focusfield).cellIndex].id;
		}
		return focusfieldNew;
	}
	function moveFocusDown(pfocusfield) {
		var focusfieldNew=pfocusfield;
		var nextSibling=document.getElementById(pfocusfield).parentNode.nextSibling;
		if (nextSibling != null) {
			focusfieldNew=nextSibling.children[document.getElementById(pfocusfield).cellIndex].id;
		} 
		return focusfieldNew;
	}
	function moveFocusTab(pfocusfield) {
		var focusfieldNew=pfocusfield;
		var nextSibling;
		var objChildren=document.getElementById(pfocusfield).parentNode.children;
		if ((event.shiftKey==false)&&(event.shiftLeft==false)) {
			if (objChildren[objChildren.length-1].id == document.getElementById(pfocusfield).id) {
				nextSibling=document.getElementById(pfocusfield).parentNode.nextSibling;
				if (nextSibling != null) {
					focusfieldNew=nextSibling.children[1].id;
					if (document.getElementById(focusfieldNew).style.backgroundColor=='lightgrey') {
						focusfieldNew=moveFocusRight(focusfieldNew);
					}
				}
			} else {
				focusfieldNew=moveFocusRight(focusfield);
			}
		} else {
			if (objChildren[1].id==document.getElementById(pfocusfield).id) {
				if (document.getElementById(pfocusfield).parentNode.parentNode.prevSibling != null) {
					focusfieldNew=document.getElementById(pfocusfield).parentNode.prevSibling.children[objChildren.length-1].id;
				}			
			}
			focusfieldNew=moveFocusLeft(focusfield);			
		}
		return focusfieldNew;
	}
	function moveFocusHome(pfocusfield) {
		var focusfieldNew=pfocusfield;
		if (document.getElementById(pfocusfield).firstChild != null) {
			focusfieldNew=document.getElementById(pfocusfield).parentNode.parentNode.firstChild.children[1].id;
			if (document.getElementById(focusfieldNew).style.backgroundColor=='lightgrey') {
				focusfieldNew=moveFocusRight(focusfieldNew);
			}
		}
		return focusfieldNew;
	}
	function moveFocusEnd(pfocusfield) {
		var focusfieldNew=pfocusfield;
		var objChildren;
		if (document.getElementById(focusfield).lastChild != null) {
			objChildren=document.getElementById(pfocusfield).parentNode.parentNode.lastChild.children;
			focusfieldNew=objChildren[objChildren.length-1].id;
			if (document.getElementById(focusfieldNew).style.backgroundColor=='lightgrey') {
				focusfieldNew=moveFocusLeft(focusfieldNew);
			}
		}
		return focusfieldNew;
	}
	function moveFocusPgDn(pfocusfield) {
		var focusfieldNew=pfocusfield;
		var parentNode=document.getElementById(pfocusfield).parentNode;
		if ((parentNode.rowIndex + 10) > parentNode.parentNode.children.length) {
			var focusfieldNew = parentNode.parentNode.children[parentNode.parentNode.children.length-1].children[document.getElementById(pfocusfield).cellIndex].id;
		} else {
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
	| This software is provided ""as is"", without warranty of any kind, express or |
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




	// **************************** Routines from FINWWWFORM31J3 *************************************************

 	function activateFieldNow(yfield,yhtml,yvalue,yadd) {   //EINFÜGEN INPUT FELD IN SOURCE CODE
 	  if (yadd == 1) {                                      //MEHRFACH-AUFRUF BEI ÜBERLANGEM CODE (SELECT/MEMO)
 	    document.getElementById('td'+yfield).innerHTML='';
 	    ycancel = null;
 	    for (yline=1 ; yline<=30 ; yline++) {
 	      //window.setTimeout('loadSelectField('+yfield+','+yline+'),1);
 	      windowsetTimeout('loadSelectField('+yfield+','+yline+')',1);
 	      if (ycancel == 1) break;
	    }
	    //window.setTimeout('showSelectField('+yfield+','+yvalue+')',1);
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
	function deleteRow(line) {
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

	function showSelectField(yfield,yvalue) {               //SPEICHERUNG
	  yhtml = document.getElementById('td'+yfield).innerHTML;
	  yhtml = yhtml.replace(/_ASCII60_/gi,'<');
	  yhtml = yhtml.replace(/_ASCII62_/gi,'>');
	  document.getElementById('td'+yfield).innerHTML = yhtml;
	  document.getElementById(yfield).value=unescape(yvalue);
	  document.getElementById(yfield).focus();
	}

	function inactivateField(yfield,yhtml,ycolor,yfocus) {   //RÜCKHOLEN TEXT FELD UND EINFÜGEN IN SOURCE CODE
	  document.getElementById('td'+yfield).innerHTML=unescape(yhtml);
	  document.getElementById('td'+yfield).style.backgroundColor=ycolor;
	  document.getElementById('activefield').value='';
	  if (yfocus == 1 ) {
	    document.getElementById('focusfield').value='td'+yfield;
	    document.getElementById('td'+yfield).style.border='2px solid black';
	    }
	  ysaveevent=null;
	}

