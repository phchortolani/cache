/* Modified Date: 2014-03-28 09:15:30: */
/* Modified Language: 1742866665: */
	//<script language="javascript">
	//<!--
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 	function gridEventWithin(pobject,pContainer,pContainerDIV,pclientX) {
		//SR17724 //SR17724.9 
		var intContainerOffsetLeft;
		if (isNewGrid()) {
			intContainerOffsetLeft=pContainer.offsetLeft;
		} else {
			intContainerOffsetLeft=0;
		}
		//window.status=currentHeader().id+'.'+pobject.parentNode.id+'||'+isNewGrid()+':'+(document.getElementById('GridVersion'))+':'+intContainerOffsetLeft+':'+pContainer.id+'+'+pContainerDIV.id+'+'+pContainer.offsetLeft+'+'+pContainerDIV.scrollLeft+'+'+pobject.offsetLeft+'+'+pobject.offsetWidth+'-'+pContainer.scrollLeft+'+'+pContainer.offsetLeft+'-'+pclientX+'-'+document.body.scrollLeft+'='+(pContainerDIV.offsetLeft+pobject.offsetLeft+pobject.offsetWidth-pContainer.scrollLeft+intContainerOffsetLeft-pclientX-document.body.scrollLeft); //SR17724	 	
		return (pContainerDIV.offsetLeft+pobject.offsetLeft+pobject.offsetWidth-pContainer.scrollLeft+intContainerOffsetLeft-pclientX-document.body.scrollLeft)<5; //SR17724
 	}
	function getContainer(pobj) {  //SR17724.9 
		var obj=pobj;
		var id=obj.id;
		var idContainer='';
		while (id!='gridDIV') {
			obj=obj.parentNode
			id =obj.id
			if ((id=='gridheadRowKey')||(id=='gridheadRow')||(id=='gridheadRow2Key')||(id=='gridheadRow2')) {
				idContainer=id;
				break;
			}
		}
		return id;
	}
	function gridonmousemove(pgridhead,pevent,pgridbody,pthis) {
		var strCurrentHeader=currentHeader().id;
		if ((strCurrentHeader=='gridhead')||(strCurrentHeader=='gridheadKey')) {
			if (isFixedCol(getContainer(pevent.srcElement))) {					 //SR17724.16
				var objContainer    = document.getElementById('gridheadKey');    //SR17724.16
				var objContainerDIV = document.getElementById('gridheadDIVKey'); //SR17724.16 
			} else {
				var objContainer    = document.getElementById('gridhead');       //SR17724.16
				var objContainerDIV = document.getElementById('gridheadDIV');    //SR17724.16 
			}
		} else if ((strCurrentHeader=='gridhead2')||(strCurrentHeader=='gridhead2Key')) {
			if (isFixedCol(getContainer(pevent.srcElement))) {					 //SR17724.16
				var objContainer    = document.getElementById('gridhead2Key');    //SR17724.16
				var objContainerDIV = document.getElementById('gridheadDIV2Key'); //SR17724.16 
			} else {
				var objContainer    = document.getElementById('gridhead2');       //SR17724.16
				var objContainerDIV = document.getElementById('gridhead2DIV');    //SR17724.16 
			}
		} else {
			alert(strCurrentHeader);
		}
		if ((pevent.srcElement.id=='THkey_Expand')||(pevent.srcElement.id=='THfld_Expand')||(pevent.srcElement.id=='Expand')) {							 //SR17724.14
			pthis.style.cursor='pointer';									 //SR17724.14
		} else if (gridEventWithin(pthis,objContainer,objContainerDIV,pevent.clientX)) { //SR17724
			//SR17724if (pthis.offsetLeft+pthis.offsetWidth-gridbodyDIV.scrollLeft+gridbodyDIV.offsetLeft-(pevent.clientX+document.body.scrollLeft)<5) { //SR17724
			pthis.style.cursor='col-resize';
		} else {
			//SR17724 if (GRIDNumPages==1) {		// SR11573 - sort only if one page
			//SR17724 	//pthis.style.cursor='hand';
				pthis.style.cursor='pointer';  //SR17253
			//SR17724 } else {
			//SR17724 	pthis.style.cursor='auto';
			//SR17724 }
		}
		pevent.srcElement.style.cursor=pthis.style.cursor;
		//SR17724 window.status=pthis.id+'.'+pevent.srcElement.id+'.'+pthis.style.cursor+'.'+pevent.srcElement.style.cursor+'::'+pevent.srcElement.className;
	}
 	function gridonclick(pevent,pgridhead,pgridbody,pgridbodyDIV) {
	 	if (!GRESIZING) {
		 	var manual = false;
			var srcElement=findObjectTagName(pevent.srcElement,'TH');
			cgeCancelDrag();
			moveFocus(getFocusField(),1,0);
			if (isFixedCol(getContainer(srcElement))) {
				var objContainer    = document.getElementById('gridheadKey');    //SR17724.16
				var objContainerDIV = document.getElementById('gridheadDIVKey'); //SR17724.16
			} else {
				var objContainer    = document.getElementById('gridhead');    	 //SR17724.16
				var objContainerDIV = document.getElementById('gridheadDIV');    //SR17724.16
			}
			if (!gridEventWithin(srcElement,objContainer,objContainerDIV,pevent.clientX)) { //SR17724 //SR17724.16
				//SR17724 if (srcElement.offsetLeft+srcElement.offsetWidth-pgridbodyDIV.scrollLeft-pevent.clientX>=5) {
				if (!manual) {
				    //if (GRIDNumPages==1) {		// SR11573 - sort only if one page
					sortColumn(pevent,pgridbody);
				}
			}
		}
		GRESIZING=false; //SR17724
	}
	function GetBorderStyle(pthis) {
		var gridhead=document.getElementById('gridhead');  //SR17253
		//var strBorder="1px outset";
		if (pthis.id.split('_')[0]=='tdEnd') {
			strBorder='none'; //SR17724.19
		} else if (pthis.id==getFocusField()) {
				strBorder="2px solid black";
		} else {
			var strBorder="1px outset yellow"; //SR17401
		}
		return strBorder;
	}
	function SetFocus(pstrName) {
		var blnSharedForm=document.getElementById('sharedform').value;
		var gridDIV      =document.getElementById('gridDIV');  //SR17253
		document.getElementById('activegrid').value=pstrName;
		if ((pstrName=='')&&(blnSharedForm==1)) {
			//SR17253 gridDIV.style.border='2px solid gray';
			gridDIV.className='gDIVsh';
		} else {
			gridDIV.className='gDIVex';
			//SR17253 gridDIV.style.border='2px solid blue';
			if (document.getElementById('gridbody').rows.length==0) {			//SR17253
				//on first entry into an empty grid.  SR12409
				if ((event!=null) && (window.event.srcElement!=null) &&(window.event.srcElement.id == 'gridbodyDIV') && (event.srcElement.id.split("_")[0]!="CLICK")) { // SR14427
					if (document.getElementById('addnew').value==1) {
						var retval = EventValue(YUCI,YUSER,YFORM,"FIX","COMGridEdit31S","CREATE","6","");
						gridbodyDIV.onscroll();
					}
				}
			}
		}
		var strFocus=getFocusField()
		if ((strFocus!='')&&(strFocus!='td'+document.getElementById('activefield').value)) {
			//SR12058
			var objFocus=document.getElementById(getFocusField());
			if (objFocus!=null) {
				//objFocus.style.border=GetBorderStyle(objFocus);
			}
		}
	}
	function moveFocusTop() {
		var TBODY=document.getElementById('TBODY');	//SR17253
		if (TBODY.children.length>0) {
			moveFocus(TBODY.children[0].children[TBODY.children[0].children.length-1].id,1,0,1);
			moveFocus(36);
		}
		SetFocus('Grid'); //SR17724.11
	}
	function moveFocusBottom() {
		var TBODY=document.getElementById('TBODY');	//SR17253.2001-07-01
		if (TBODY.children.length>0) {
			moveFocus(TBODY.children[TBODY.children.length-1].children[TBODY.children[0].children.length-1].id,1,1,1);
			moveFocus(36);
		}
	}
	function setDelayedFocus(pfocusField, pcount) {
		//TODO SR17630
		if (pcount >= 500)
			return;
		yfield = pfocusField.substring(2, 999);
		if (document.getElementById('td' + yfield) == null) {
			setTimeout('setDelayedFocus("' + pfocusField + '", ' +
				(pcount + 1) + ');', 10);
		} else {
			activateField(yfield);
		}
	}
	function moveFocus(richt,fix,nofocus,normcolor) {
		var focusfieldNew;
		var blnFocusFlag;
		var objFocusField;
		var objRicht;
		var gridDIV    =document.getElementById('gridDIV');			//SR17253
		var gridbodyDIV=document.getElementById('gridbodyDIV');		//SR17253
		var gridhead2=document.getElementById('gridhead2');			//SR17630
		var gridhead=document.getElementById('gridhead');			//SR17630
		var focusfield=getFocusField();
		if ((richt!=focusfield)||(fix==1)) {
			if (fix == 1) {
				setFocusField(richt);
				if (focusfield != '') { //SR17724.8
					objFF = document.getElementById(focusfield);
					if (objFF!=null) {
						//getRowKey(objFF.id).firstChild.style.fontWeight='normal'; //SR17724.8 
						if (richt!=focusfield) focusOff(objFF);
					}
				}
				if (richt!='') {
					objRicht=document.getElementById(richt);
					if (objRicht!=null) {
						//getRowKey(objRicht.id).firstChild.style.fontWeight='bold'; //SR17724.8 
						if (normcolor == 1) {
							if (richt!=focusfield) focusOn(objRicht);
						} else {
							objRicht.style.border='2px solid red';
							objRicht.value='+';
						}
						if ((nofocus!=1) && (objRicht.style.visibility!='hidden')&&(objRicht.className.indexOf('hide')==-1) ) {  //SR17475
							objRicht.focus();
						}
					}
				}
			} else if (focusfield!='') { // JW 1-Dec-2004: Make sure there is a line
				blnFocusFlag=false
				focusfieldNew=focusfield;
				objFocusField=document.getElementById(focusfield);
				if        (richt==9)  { focusfieldNew=moveFocusTabEnter(focusfield);  //BR014882
				} else if (richt==13) { focusfieldNew=moveFocusTabEnter(focusfield);  //BR014882
				} else if (richt==37) { focusfieldNew=moveFocusLeft(focusfield);
				} else if (richt==39) { focusfieldNew=moveFocusRight(focusfield);
				} else if (richt==38) { focusfieldNew=moveFocusUp(objFocusField);   //note object
				} else if (richt==40) { focusfieldNew=moveFocusDown(objFocusField); //note object
				} else if (richt==36) { focusfieldNew=moveFocusHome(focusfield);
				} else if (richt==35) { focusfieldNew=moveFocusEnd(focusfield);
				} else if (richt==34) { focusfieldNew=moveFocusPgDn(focusfield);
				} else if (richt==33) { focusfieldNew=moveFocusPgUp(focusfield);
				}
				if (focusfieldNew!=focusfield) {	//SR12775
					getRowKey(focusfield).firstChild.style.fontWeight='normal'; //SR17724.8 
					getRowKey(focusfieldNew).firstChild.style.fontWeight='bold'; //SR17724.8 
					retval=focusfieldNew;
					if ((retval!='') && (retval!=richt)) {
						setFocusField(retval);
						focusfieldNew=document.getElementById(retval);
						focusOff(objFocusField);
						focusOn(focusfieldNew);
						if (document.getElementById('GridVersion').value==1) {
							if (!isFixedCol(focusfieldNew.parentNode.id)) { //SR17724.18
								var Left=gridbodyDIV.scrollLeft;
								if (focusfieldNew.offsetLeft+focusfieldNew.offsetWidth>gridbodyDIV.scrollLeft+gridbodyDIV.clientWidth) {
									Left=-gridbodyDIV.clientWidth+focusfieldNew.offsetLeft+focusfieldNew.offsetWidth;
								}
								if ((focusfieldNew.offsetLeft)<(Left+10)) {
									Left=(focusfieldNew.offsetLeft);
									if (Left<200) {
										Left=0;
									}
								}
								if (Left!=gridbodyDIV.scrollLeft) gridbodyDIV.scrollLeft=Left;
							}
						} else {
							if ((focusfieldNew.offsetLeft+focusfieldNew.offsetWidth)>(gridDIV.offsetWidth+gridDIV.offsetLeft+gridbodyDIV.scrollLeft)) {
								gridbodyDIV.scrollLeft=(focusfieldNew.offsetLeft+focusfieldNew.offsetWidth-gridDIV.offsetWidth);
							}
							if ((focusfieldNew.offsetLeft)<(gridbodyDIV.scrollLeft+10)) {
								gridbodyDIV.scrollLeft=(focusfieldNew.offsetLeft);
								if (gridbodyDIV.scrollLeft<200) {
									gridbodyDIV.scrollLeft=0;
								}
							}
						}
						if ((focusfieldNew.offsetTop+focusfieldNew.offsetHeight)>(gridbodyDIV.offsetHeight+gridbodyDIV.scrollTop)) {
							gridbodyDIV.scrollTop=focusfieldNew.offsetTop+gridbodyDIV.scrollTop;
						} else if ((focusfieldNew.offsetTop)<(gridbodyDIV.scrollTop)) {
							gridbodyDIV.scrollTop=focusfieldNew.offsetTop;
						}
						//setTimeout('setDelayedFocus("' + retval + '", 0);', 10); //SRBR014991
					}
				}
			}
			if (document.getElementById('gridhead2')!=null) {
				var gridheadDIVKey=document.getElementById('gridheadDIVKey');		//SR17724.6
				var gridheadDIV2Key=document.getElementById('gridheadDIV2Key');		//SR17724.6
				if ((getFocusField()=='') || (document.getElementById(getFocusField()).parentNode._Form) == YFORM) {
					gridhead2.style.display = 'none';		//SR14484
					gridhead.style.display = 'block';
					if (gridheadDIV2Key!=null) {
						gridheadDIV2Key.style.display = 'none';		//SR14484 	//SR17724.26
						gridheadDIVKey.style.display = 'block';					//SR17724.26
					}
				} else {
					gridhead.style.display = 'none';		//SR14484
					gridhead2.style.display = 'block'; //SR17724
					if (gridheadDIV2Key!=null) {
						gridheadDIVKey.style.display = 'none';		//SR14484		//SR17724.26
						gridheadDIV2Key.style.display = 'block'; //SR17724			//SR17724.26
					}
				}
			}
			gridbodyDIV.onscroll();   //SR12798
		}
		function focusOn(pobj) {
			pobj.style.border='2px solid black';
			getRowKey(pobj.id).firstChild.style.fontWeight='bold'; //SR17724.8 
			if ((isFF())&&(pobj.className=='TDfld')) pobj.style.width=(pobj.clientWidth-2)+'px';
		}
		function focusOff(pobj) {
			pobj.style.border='1px outset white';
			getRowKey(pobj.id).firstChild.style.fontWeight='normal'; //SR17724.8 
			if ((isFF())&&(pobj.className=='TDfld')) pobj.style.width=(pobj.clientWidth+2)+'px';
		}
		function moveFocusLeft(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var objPrev;
			var blnFlag=true;
			while (blnFlag==true) {
				//SR17724.7 objPrev = document.getElementById(focusfieldNew).previousSibling;
				objPrev = getPreviousSiblingHorizontal(document.getElementById(focusfieldNew)); //SR17724.7 
				if (objPrev!=null) {
					//SR17724.26 if (objPrev.id == '') {
					if (objPrev.id.search('tdY') != 0) { //SR17724.26
						focusfieldNew=pfocusfield;
						blnFlag=false;
					} else if (objPrev.id.search("Key")>-1) {
						focusfieldNew=pfocusfield;
						blnFlag=false;
					} else {
						if (!isHiddenCol(objPrev)) { // SR11848: Keep going if hidden
							//if (objPrev.getAttribute("Locked")) {
							if (objPrev.Locked) {	//SR17xxxx
								if (blnFocusFlag==false) {
									blnFlag=false;
								}
							} else {
								blnFlag=false;
							}
						}
						focusfieldNew=objPrev.id;
					}
				} else {
					focusfieldNew=pfocusfield;
					blnFlag=false;
				}
			}
			return focusfieldNew;
		}
		function moveFocusRight(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var objNext;
			var blnFlag=true;
			while (blnFlag==true) {
				//SR17724 objNext = document.getElementById(focusfieldNew).nextSibling;
				objNext = getNextSiblingHorizontal(document.getElementById(focusfieldNew)); //SR17724
				if (objNext == null) {
					focusfieldNew=pfocusfield;
					blnFlag=false;
				} else {
					if (!isHiddenCol(objNext)) { // SR11848: Keep going if hidden
					//	if (objNext.getAttribute("Locked")) {
						if (objNext.Locked) {	//SR17xxxx
							if (blnFocusFlag==false) {
								blnFlag=false;
							}
						} else {
							blnFlag=false;
						}
					}
					focusfieldNew=objNext.id;
				}
			}
			return focusfieldNew;
		}
		function moveFocusUp(pobjFocusField) {
			var focusfieldNew=pobjFocusField.id;
		//	var previousSibling=pobjFocusField.parentNode.previousSibling;
			var previousSibling=getPreviousSibling(pobjFocusField.parentNode);
			var quit=(previousSibling==null);
			while (!quit) {
				if (previousSibling==null) {
					quit=true;
				} else {
					// This handles non-displayed lines
					if (previousSibling.style.display!="none") {
						try {
							focusfieldNew=previousSibling.children[pobjFocusField.cellIndex].id;
							quit=true;
						} catch (Exception) {
							previousSibling=getPreviousSibling(previousSibling);
						}
					} else {
						//previousSibling=previousSibling.previousSibling;
						previousSibling=getPreviousSibling(previousSibling);
						if (previousSibling==null) {
							quit=true;
						}
					}
				}
			}				
			return focusfieldNew;
		}
		function isFixedCol(pid) {
			return (pid.indexOf('Key')>0); //SR17724
		}
		function getRow(pid) { //SR17724.5 //SR17724.7
			return document.getElementById(getRowId(pid));
			//return document.getElementById(document.getElementById(pid).parentNode.id.split('Key')[0]);			
		}
		function getRowId(pid) { //SR17724.7
			var obj = document.getElementById(pid);
			while (obj!='') {
				if (obj.id.substring(0,7)=='GridRow') {
					if (obj.id.charAt(obj.id.length-1)!='a') {
						break;
					}
				}
				obj=obj.parentNode;
			}
			if (isFixedCol(obj.id)) {
				if (isExpanded(pid)) {
					result=obj.id.split('aKey')[0]; //SR17724.12
				} else {
					result=obj.id.split('Key')[0];  //SR17724.12
				}
			} else {
				result=obj.id
			}
			//SR17724.8 if (currentHeader().id=='gridhead2') { //SR17724.5
			if (isExpanded(pid)) { //SR17724.8
				result=result+'a';				   //SR17724.5
			}									   //SR17724.5
			return result
		}
		function getRowKey(pid) { //SR17724.7 //SR17724.8
			if (document.getElementById('GridVersion').value!=1) {
				return document.getElementById(getRowId(pid));
			} else {
				return document.getElementById(getRowId(pid)+'Key');
			}
		}
		function getNextSiblingHorizontal(pobjNode) {
			var objNode=pobjNode;
			if (currentHeader().id=='gridhead') {
				if ((objNode.nextSibling==null)&&(isFixedCol(objNode.parentNode.id))) { //SR17724
 					objNode=getRow(objNode.id).children[0]; //SR17724.5
				} else {
					objNode=objNode.nextSibling;
				}
			} else {
				if ((objNode.nextSibling==null)&&(isFixedCol(objNode.parentNode.id))) { //SR17724.5
 					objNode=getRow(objNode.id).children[0];
 					//objNode=getRow(objNode.id).children[0].children[0].children[0].children[0].children[0]; //SR17724.5
				} else { //SR17724.5
					objNode=objNode.nextSibling;
				}
			}
			return objNode;
		}
		function getPreviousSiblingHorizontal(pobjNode) { //SR17724.7
			var objNode=pobjNode;
			if (currentHeader().id=='gridhead') {
				if ((objNode.previousSibling==null)&&(!isFixedCol(objNode.parentNode.id))) { //SR17724
 					objNode=getRowKey(objNode.id).lastChild; //SR17724.5
				} else {
					objNode=objNode.previousSibling;
				}
			} else {
				if ((objNode.previousSibling==null)&&(!isFixedCol(objNode.parentNode.id))) { //SR17724.5
 					objNode=getRowKey(objNode.id).lastChild; //SR17724.5
				} else { //SR17724.5
					objNode=objNode.previousSibling;
				}
			}
			return objNode;
		}
		function getNextSibling(pobjNode) {
			var objNode=pobjNode;
			var blnExpanded=isExpanded(pobjNode.children[0].id);
			while (true) {
				if (currentHeader().id=='gridhead') {
					objNode=objNode.nextSibling;
				} else {
					try {
						objNode=objNode.parentNode.parentNode.parentNode.parentNode.nextSibling.children[0].children[0].children[0].children[0];
					} catch (Exception) {
						objNode=null;
					}
				}
				if (objNode==null) break;
				if (isExpanded(objNode.children[0].id)==blnExpanded) break;
			}
			return objNode;
		}
		function getPreviousSibling(pobjNode) {
			var objNode=pobjNode;
			if (currentHeader().id=='gridhead') {
				objNode=objNode.previousSibling;
				if ((objNode!=null) && (objNode.nodeType!=1)){
					objNode=getPreviousSibling(objNode); //SR17404
				}
			} else {
				try {
					objNode=objNode.parentNode.parentNode.parentNode.parentNode.previousSibling.children[0].children[0].children[0].children[0];
				} catch (Exception) {
					objNode=null;
				}
			}
			return objNode;
		}
		function moveFocusDown(pobjFocusField) {
			var focusfieldNew=pobjFocusField.id;
		//	var nextSibling=pobjFocusField.parentNode.nextSibling;
			var nextSibling=getNextSibling(pobjFocusField.parentNode);
			var quit=(nextSibling==null);
			while (!quit) {
				if (nextSibling==null) {
					quit=true;
				} else {
					// This handles non-displayed lines
					if (nextSibling.style.display!="none") {
						try {
							focusfieldNew=nextSibling.children[pobjFocusField.cellIndex].id;
							quit=true;
						} catch (Exception) {
							nextSibling=getNextSibling(nextSibling);
						}
					} else {
						//nextSibling=nextSibling.nextSibling;
						nextSibling=getNextSibling(nextSibling);
						if (nextSibling==null) {
							quit=true;
						}
					}
				}
			}		
			return focusfieldNew;
		}		
		function moveFocusTabEnter(pfocusfield) {
			var focusfieldNew=pfocusfield;
			var nextSibling;
			var objChildren=document.getElementById(pfocusfield).parentNode.children;
			var moving;
			blnFocusFlag=true  // SR11186
			do {
				//if ((event.shiftKey==false)&&(event.shiftLeft==false)) {  //SR17410
				//if ((event.shiftKey==false||typeof(event.shiftKey)=='undefined')&&(event.shiftLeft==false||typeof(event.shiftLeft)=='undefined')) {
				if (!event||(!event.shiftKey)) { //Previous line just a complicated way of doing this???
					//SR17724.4 if (objChildren[objChildren.length-1].id == document.getElementById(pfocusfield).id) {
					if (objChildren[objChildren.length-1].id == pfocusfield) { 						//SR17724.4
						if (isFixedCol(document.getElementById(pfocusfield).parentNode.id)) {		//SR17724.4
							focusfieldNew=moveFocusRight(pfocusfield);
							if (focusfieldNew==pfocusfield) focusfieldNew=moveFocusTabNextRow(pfocusfield); //SR17724.12
						} else {
							focusfieldNew=moveFocusTabNextRow(pfocusfield);
						}
					} else {
						focusfieldNew=moveFocusRight(pfocusfield);
						if (pfocusfield==focusfieldNew) {
							focusfieldNew=moveFocusTabNextRow(pfocusfield);
						}
					}
				} else {
					if (objChildren[0].id==pfocusfield) { //SR17724.28
						if (!isFixedCol(document.getElementById(pfocusfield).parentNode.id)) {		//SR17724.4
							focusfieldNew=moveFocusLeft(pfocusfield);
							if (focusfieldNew==pfocusfield) focusfieldNew=moveFocusTabPrevRow(pfocusfield); //SR17724.12
						} else {
							focusfieldNew=moveFocusTabNextRow(pfocusfield);
						}
					} else {
						focusfieldNew=moveFocusLeft(pfocusfield);
						if (pfocusfield==focusfieldNew) {
							focusfieldNew=moveFocusTabPrevRow(pfocusfield);
						}
					}
				}
				// SR11186
				if (pfocusfield==focusfieldNew) {  // no more enabled fields
					focusfieldNew = focusfield
					moving=false
				} else {
					pfocusfield=focusfieldNew
					//moving = document.getElementById(focusfieldNew).getAttribute("Locked")
					moving = document.getElementById(focusfieldNew).Locked 	//SR17xxxx
				}
			} while (moving)
			return focusfieldNew;
		}
		function moveFocusTabNextRow(pfocusfield) {
			// Move down, if can - then move home.
		//	var retval
			var focusfieldNew = moveFocusDown(document.getElementById(pfocusfield)); //SR17724.12
			if (focusfieldNew == pfocusfield) {
				if (GRIDPage!=GRIDNumPages) {					//SR12775
					GoToPage(GRIDPage+1,GRIDNumPages,"T",0);
				} else if (document.getElementById('addnew').value==1) {
					// Can't move down, but can create new row. so do it
					//retval = EventValue(YUCI,YUSER,YFORM,"FIX","COMGridEdit31S","CREATE","6","");
					window.setTimeout('EventValue(YUCI,YUSER,YFORM,"FIX","COMGridEdit31S","CREATE","6","")',0);	//SR14550
				}
			} else {
				focusfieldNew = moveFocusHome(focusfieldNew);
			}
			return focusfieldNew;
		}
		function moveFocusTabPrevRow(pfocusfield) {
			// Move up, if can - then move to end.
			var focusfieldNew = moveFocusUp(document.getElementById(pfocusfield))
			if (focusfieldNew != pfocusfield) {
				focusfieldNew = moveFocusEnd(focusfieldNew)
			} else if (GRIDPage!=1) {					//SR12775
				GoToPage(GRIDPage-1,GRIDNumPages,"E",0)
			}
			return focusfieldNew;
		}
		function moveFocusHome(pfocusfield) {
			var firstFld;
			var focusfieldNew=pfocusfield;
			var objFocus=document.getElementById(pfocusfield)
			if (objFocus!=null && objFocus.firstChild != null) {
				if (document.getElementById('GridVersion').value==1) {
					var intFixedColumns=getFixedColumns(pfocusfield); //SR17724.12
					if (intFixedColumns>0) {
						var objRow=document.getElementById(document.getElementById(pfocusfield).parentNode.id.split('Key')[0]+'Key');
						var intFirstFixedColumn = objRow.children.length-intFixedColumns;
					} else {
						var objRow=document.getElementById(document.getElementById(pfocusfield).parentNode.id.split('Key')[0]);
						var intFirstFixedColumn = 0;
					}
					if (isExpanded(pfocusfield)) {
						firstFld = objRow.children[intFirstFixedColumn];
					} else {
						firstFld = objRow.children[intFirstFixedColumn];
					}
					if (firstFld==null) {
						//All fixed columns may be hidden SR17724.12
						var objRow=document.getElementById(document.getElementById(pfocusfield).parentNode.id.split('Key')[0]);
						var intFirstFixedColumn = 0;
						firstFld = objRow.children[intFirstFixedColumn];
					}
					focusfieldNew=firstFld.id; // SR11247
					if (isHiddenCol(firstFld)) { // SR11848: Move over if hidden
						focusfieldNew = moveFocusRight(focusfieldNew);
					}
				} else {
					var i = 0;  //SR17724.13
					do { // JW Don't go on primary keys
						firstFld = document.getElementById(pfocusfield).parentNode.children[i++];
						//SR177234.13 } while (firstFld.id=='')
					} while (firstFld.className.substring(0,5)!='TDfld')  //SR177234.13 
					focusfieldNew=firstFld.id; // SR11247
					if (isHiddenCol(firstFld)) { // SR11848: Move over if hidden
						focusfieldNew = moveFocusRight(focusfieldNew);
					}
				}
			}
			return focusfieldNew;
		}
		function moveFocusEnd(pfocusfield) {
			var lastFld;
			var focusfieldNew=pfocusfield;
			var objChildren;
			if (!isFixedCol(getRow(pfocusfield).id)) {						//SR17724.5
				pfocusfield=getRow(pfocusfield).children[0].id;				//SR17724.5
			}																//SR17724.5
			if (document.getElementById(pfocusfield).lastChild != null) {   //SR17724.5
			//	objChildren=document.getElementById(pfocusfield).parentNode.parentNode.lastChild.children;
				objChildren=document.getElementById(pfocusfield).parentNode.children;
				lastFld=objChildren[objChildren.length-1];
				focusfieldNew=lastFld.id;
				if (isHiddenCol(lastFld)) {// SR11848: Move over if hidden
					focusfieldNew = moveFocusLeft(focusfieldNew);
				}
			}
			return focusfieldNew;
		}
		function moveFocusPgDn(pfocusfield) {
			var focusfieldNew=pfocusfield;
			if (document.getElementById('GridVersion').value==1) {
				var parentNode=document.getElementById(pfocusfield).parentNode;
				if ((parentNode.rowIndex + 10) >= parentNode.parentNode.children.length) {	// JW >= not >
					var focusfieldNew = parentNode.parentNode.children[parentNode.parentNode.children.length-1].children[document.getElementById(pfocusfield).cellIndex].id;
				} else {
					var focusfieldNew = parentNode.parentNode.children[parentNode.rowIndex + 10].children[document.getElementById(pfocusfield).cellIndex].id;
				}
				var Top=gridbodyDIV.scrollTop;
				if (focusfieldNew.offsetTop+focusfieldNew.offsetHeight>gridbodyDIV.scrollTop+gridbodyDIV.clientHeight) {
					Top=-gridbodyDIV.clientHeight+focusfieldNew.offsetTop+focusfieldNew.offsetHeight;
				}
				if ((focusfieldNew.offsetTop)<(Top+10)) {
					Top=(focusfieldNew.offsetTop);
					if (Top<200) {
						Top=0;
					}
				}
				if (Top!=gridbodyDIV.scrollTop) gridbodyDIV.scrollTop=Top;
			} else {
				var parentNode=document.getElementById(pfocusfield).parentNode;
				if ((parentNode.rowIndex + 10) >= parentNode.parentNode.children.length) {	// JW >= not >
					parentNode.parentNode.children[parentNode.parentNode.children.length-1].children[document.getElementById(pfocusfield).cellIndex].scrollIntoView(true);
					var focusfieldNew = parentNode.parentNode.children[parentNode.parentNode.children.length-1].children[document.getElementById(pfocusfield).cellIndex].id;
				} else {
					parentNode.parentNode.children[parentNode.rowIndex + 10].children[document.getElementById(pfocusfield).cellIndex].scrollIntoView(true);
					var focusfieldNew = parentNode.parentNode.children[parentNode.rowIndex + 10].children[document.getElementById(pfocusfield).cellIndex].id;
				}
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
	function canExpand() {
		return document.getElementById('THkey_Expand')!=null; //SR17724.29
	}
	function isExpanded(pid) { //SR17724.8
		return document.getElementById(pid).className.indexOf('TDfldEx')>-1;
	}
	function isNewGrid() {
		return (document.getElementById('GridVersion').value==1); //SR17724
	}
	function getFixedColumns(pid) { //SR17724.12
		var intFixedColumns;
		if (isExpanded(pid)) {
			intFixedColumns=document.getElementById('FixedColumnsExpanded').value;
		} else {
			intFixedColumns=document.getElementById('FixedColumns').value;
		}
		return intFixedColumns; 
	}
	function StoreFocus() {
		var yfield=getFocusField().substring(2,999);
		var retval = EventValue(YUCI,YUSER,YFORM,'FIX','COMGridEdit31S','SETFOCUSFIELD','6',yfield);
	}
	function deleteGrid() {
		// SR13655: added to increase speed of delete
		setFocusField('');
		var objGrid = document.all.gridbody;
		while (objGrid.rows.length>0) {
			objGrid.deleteRow();
		}
		GoToPage(1,1,"",0);
	}
	function deleteRow(strCell) {
		//TODO SR17630
		var previousFF = getFocusField();
		var objCell=document.getElementById('td'+strCell);
		//SR17630 alert(objCell.parentNode._Form);
		var intLine=objCell.parentNode.rowIndex;
		var strDelete='';
		var strRef;
		var TBODY=document.getElementById('TBODY');	//SR17253.2001-07-01
	  if ('td'+strCell == previousFF) {
		  moveFocus(40);
		  if (getFocusField()==previousFF) {
			  moveFocus(38);
			  if (getFocusField()==previousFF) {
				  setFocusField('');
				  if (objCell.parentNode.id.indexOf('_')!=-1) {
					  strRef=document.getElementById(objCell.parentNode.id.split('_')[0]).rowIndex;
					  moveFocus(getFirstCell(TBODY.rows[strRef]),1,1,1);
				  }
			  }
		  }
	  }
	  intLine=getGridRow(objCell);
	  expandObject(TBODY.rows[intLine].id);
	  if (TBODY.rows[intLine].id.indexOf('_')==-1) {
		  for (var i = intLine+1; i < document.getElementById('gridbody').rows.length; i++) {
			  if (document.getElementById('gridbody').rows[i].id.indexOf('_')==-1) {
				  break;
			  } else {
		  	  	strCell=getFirstCell(document.getElementById('gridbody').rows[i].children[0].children[0].children[0].children[0]).substring(2,9999);
		  	    strDelete=strCell+';'+i+','+strDelete;
		 	  }
		  }
	  }
	  if (strDelete!='') {
		  for (i = 0; i < (strDelete.split(',').length-1); i++) {
			  strCell=strDelete.split(',')[i]
			  retval = EventValue(document.WWW.YUCI.value,document.WWW.YUSER.value,document.getElementById('gridbody').rows[strCell.split(';')[1]].children[0].children[0].children[0].children[0]._Form,'FIX','COMGridEdit31S','KILL','6',strCell);
		  }
	  }	 
	  //SR17724.10 document.all.gridbody.deleteRow(intLine);
	  document.getElementById('gridbody').deleteRow(intLine); //SR17724.10 
	  if (document.getElementById('gridbodyKey')!=undefined) {
		  document.getElementById('gridbodyKey').deleteRow(intLine); //SR17724.10 
		  cgeOnScroll();											 //SR17724.10
	  }
	  if (intLine==0) { resetColumnWidths(); }
	}
	function getFirstCell(objBODY) {
		var id='';
		if (objBODY.id.indexOf('Key')!=-1) {
			var id=getFirstCellEx(objBODY);
		} else {
			var id=getFirstCellEx(document.getElementById(objBODY.id+'Key'));
		}
		if (id=='') id=getFirstCellEx(document.getElementById(objBODY.id.replace('Key','')));
		return id;
	}
	//function getFirstCellEx1(objBODY) { //SR17724.A
	//	var id='';
	//	if ((objBODY!=null)&&(objBODY.rows!=null)&&(objBODY.rows[0].cells!=null)) {
	//		//if (objBODY.id.indexOf('_')!=-1) objBODY=objBODY.children[0].children[0].children[0].children[0]
	//		for (var i = 0; i < objBODY.rows[0].cells.length; i++) {
	//			objCell=objBODY.rows[0].cells[i];
	//			if (objCell.className.indexOf('TDfld')!=-1) {
	//				if (!isHiddenCol(objCell)) {
	//					id=objCell.id;
	//					break;
	//				}
	//			}
	//		}
	//	}
	//	return id;
	//}
  	function getFirstCellEx(objBODY) {
		var id='';
		if ((objBODY!=null)&&(objBODY.cells!=null)) {
			//if (objBODY.id.indexOf('_')!=-1) objBODY=objBODY.children[0].children[0].children[0].children[0]
			for (var i = 0; i < objBODY.cells.length; i++) {
				objCell=objBODY.cells[i];
				if (objCell.className.indexOf('TDfld')!=-1) {
					if (!isHiddenCol(objCell)) {
						id=objCell.id;
						break;
					}
				}
			}
		}
		return id;
  	}
	function getGridRow(pobj) {
		var idRow;
		var parentNode;
		var arr;
		idRow='';
		if (pobj!=null) {
			idRow=pobj.id;
			if ((idRow.substr(0,7)=='GridRow')&&(idRow.substr(idRow.length-1)!='a')) {
				idRow=pobj.rowIndex;
			} else {
				idRow=getGridRow(pobj.parentNode);
			}
		}
		return idRow;
	}
	function resetColumnWidths() {
		var gridheadRow=document.getElementById('gridheadRow');		//SR17253.2010-07-01
		var gridbody   =document.getElementById('gridbody');	    //SR17253.2010-07-01
		var intCells   =gridheadRow.children.length;
		if (gridbody.rows.length>0) {
			for (var i = 0; i < intCells; i++) {
				if (gridbody.rows[0].cells[i]!=null) {
					gridbody.rows[0].cells[i].style.width=gridheadRow.cells[i].style.width;
				}
			}
		}
	}
	// 10-Mar-2005 JW	SR11848: is the column that this cell is in, hidden?
	function isHiddenCol(objCell) {
		//return (objCell.style.display=='none');  //BR014904 25-Mar-2008 reverted
		var Key="";												//SR17724.20
		if (isFixedCol(objCell.parentNode.id)) Key='Key';		//SR17724.20
		if (objCell.id.split('_')[0]=='tdEnd') {
			return true; //SR17724.19
		    //} else if (currentHeader()==document.getElementById('gridhead'+Key)) {
		} else if (!isExpanded(objCell.id)) {
			return (document.getElementById('gridheadRow'+Key).children[objCell.cellIndex].Hidden);
		} else {
			return document.getElementById('gridheadRow2'+Key).children[objCell.cellIndex].Hidden;
		}
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
	

	//<script language='javascript'>
	//<!--
	var cgeDragTimeOut=null;
	function cgeCancelDrag() {
		if (cgeDragTimeOut!=null) {
			window.clearTimeout(cgeDragTimeOut);
			cgeDragTimeOut=null;
		}
	}
	function cgeDragColumn(event) {		//SR17253	
		if (blnCanDrag) {
	//SR17253 if (window.event.button==1) {
	//SR17304 if (event.button==1) {
			if (doGetMouseButton(event)=='LEFT') {				//SR17304
				var objHdr=findObjectTagName(event.srcElement,'TH');
				cgePos = event.clientX;
				cgeSize=getPageOffsetLeft(objHdr);
				cgeDragTimeOut=window.setTimeout('cgeDragColumnNow("'+objHdr.id+'")',500);
			}
		}
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
	//SR17315 el.style.fontSize='x-small';
		el.style.fontSize='10pt';						//SR17315 
		el.style.fontFamily='Arial';
		el.style.fontWeight='bold';
		el.style.textAlign='center';
	//	el.style.border='1px outset'; //SR17401
		el.style.border='1px outset white';
		el.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity=60)";
		document.body.setCapture();
		document.body.attachEvent("onmousemove", cgeDoDragColumn);
		document.body.attachEvent("onmouseup", cgeOnMouseUp);			//SR17324
		document.body.attachEvent("onlosecapture", cgeOnLoseCapture);	//SR17324
		document.body.appendChild(el);
		el = null;
	}
	function cgeOnMouseUp() { cgeEndDragColumn(window.event);} 			//SR17324 //SR17724.29
	function cgeOnLoseCapture() { cgeEndDragColumn(window.event);} 		//SR17324 //SR17724.29
	function cgeDoDragColumn(event) {        // SR17321
		if (!event) event = window.event;    // SR17321
		var sz = cgeSize + event.clientX - cgePos;
		document.getElementById('move').style.left= sz;  //SR17321
	}
	function cgeEndDragColumn(event) {       // SR17321  //SR17224
		document.body.detachEvent("onmousemove", cgeDoDragColumn);
		document.body.detachEvent("onmouseup", cgeOnMouseUp);			//SR17324
		document.body.detachEvent("onlosecapture", cgeOnLoseCapture);	//SR17324
		document.body.releaseCapture();
		if (!event) event = window.event;    // SR17321
		var InsertElement=null;
		var strValue='';
		var sz = cgeSize + event.clientX - cgePos;
		//SR17224 var hdr=gridheadRow;
		//SR17724.29 var hdr=objHeader;  //SR17224
		var hdr=document.getElementById(currentHeader().id.replace('Key','')); //SR17724.29
		var FromId;
		var ToId;
 		var move=document.getElementById('move');		// SR17321
		InsertElement=getInsertElement(hdr,sz);
		if (InsertElement!=null) {
			if (move.moveElement!=InsertElement.id) {
				var Node=document.getElementById(move.moveElement);
				FromId=Node.id;
				ToId=InsertElement.id;
				//SR17724.29 cgeSwapNodes(Node.cellIndex,InsertElement.cellIndex);
				cgeSwapNodes(Node,InsertElement); //SR17724.29
				Node.removeNode;
			//	InsertElement.insertAdjacentElement('AfterEnd',Node);    // SR17321
				doInsertAdjacentElement(InsertElement,'AfterEnd',Node);
				if (document.getElementById('GridVersion').value==1) {
					if ((currentHeader().id=='gridhead')||(currentHeader().id=='gridheadKey')) {
						var intFixedCols=document.getElementById('gridheadKey').rows[0].cells.length-1; //SR17724.29 TODO Expanded Lines
					} else {
						var intFixedCols=document.getElementById('gridhead2Key').rows[0].cells.length-1; //SR17724.29 TODO Expanded Lines
					}
					if (canExpand()) intFixedCols=intFixedCols-1;
					//var retval = EventValue(YUCI,YUSER,YFORM,'FIX','COMGridEdit31R','REORDERLAYOUT','6',FromId+';'+ToId+';'+YFORM+','+intFixedCols);
					if (ToId.indexOf('THkey')!=-1) ToId='';
					//alert(intFixedCols+':'+currentHeader().id);
					var retval = EventValue(YUCI,YUSER,Node.id.split('_')[1],'FIX','COMGridEdit31R','REORDERLAYOUT','6',FromId+';'+ToId+';'+Node.id.split('_')[1]+','+intFixedCols);
				} else {
					var retval = EventValue(YUCI,YUSER,Node.id.split('_')[1],'FIX','COMGridEdit31R','REORDERLAYOUT','6',FromId+';'+ToId);
				}
			}
		}
		move.outerHTML='';
	//	move=null;						//SR17253 (memory leak)
		event.cancelBubble=true;
		cgeOnScroll(); //SR17724.29
		return false;
		function getInsertElement(objHeader,sz) {
			var InsertElement;
			var intBorder=0;
			if (document.getElementById('gridheadTD')!=null) intBorder=document.getElementById('gridheadTD').offsetLeft;
			if (sz>=intBorder) {
				InsertElement= getInsertElementEx(objHeader,sz)
			} else {
				var objHeaderKey=document.getElementById(objHeader.id+'Key');
				if (objHeaderKey!=null) InsertElement=getInsertElementEx(document.getElementById(objHeader.id+'Key'),sz);
			}
			return InsertElement;
		}
		function getInsertElementEx(objHeader,sz) {
			var intLeft;
			var gridheadKeyOffsetWidth=0;
			var objCells=objHeader.rows[0].cells;
			for (var i=0;i<objCells.length;i++) {
				intLeft=getPageOffsetLeft(objCells[i]);
				//alert(i+'('+objHeader.id+'):'+intLeft+'<'+sz+":"+gridhead.offsetLeft+':'+gridhead2Key.offsetWidth+'.'+gridheadKey.offsetWidth);
				if (objCells[i].className=='THfld') { // Don't move primary keys
					if (intLeft<sz) {
						//if (intLeft>=gridheadKeyOffsetWidth) {
							InsertElement=objCells[i];
						//}
					} else {
						break;
					}
				} else if (objCells[i].className=='THkey') {
					if (getPageOffsetLeft(objCells[i])<sz) {
						if ((objCells[i+1]!=null)&&((objCells[i+1].id=='THkey_Expand')||(objCells[i+1].id=='THfld_Expand'))) {
							InsertElement=objCells[i+1];
						} else {
							InsertElement=objCells[i];
						}
					} else {
						break;
					}
				}
			}
			return InsertElement;
		}
	}
	function cgeSwapNodes(pobjFr,pobjTo) { //SR17724.29
		if (getParent(pobjFr,'TABLE').id.indexOf('gridhead2')==-1) {
			cgeSwapNodesMain(pobjFr,pobjTo);
		} else {
			cgeSwapNodesExpanded(pobjFr,pobjTo);
		}
	}
	function cgeSwapNodesExpanded(pobjFr,pobjTo) { //SR17724.29
		var Rows;
		var i;
		var idxFr=pobjFr.cellIndex;
		var idxTo=pobjTo.cellIndex;
		var objChildFr=document.getElementById(getParent(pobjFr,'TABLE').id.replace('gridhead2','gridbody')).children[0];
		var objChildTo=document.getElementById(getParent(pobjTo,'TABLE').id.replace('gridhead2','gridbody')).children[0];
		var objTo;
		var objFr;
		Rows=objChildFr.children.length;
		for (i=0;i<Rows;i++) {
			if (objChildFr.children[i].id.indexOf('_')!=-1) {
				objTo=objChildTo.children[i].children[0].children[0].children[0].children[0].children[idxTo];
				objFr=objChildFr.children[i].children[0].children[0].children[0].children[0].children[idxFr];
			//alert('expanded='+objTo.id+'.'+objFr.id);
				objFr.removeNode;
			//	InsertElement.insertAdjacentElement('AfterEnd',Node);    // SR17321
				doInsertAdjacentElement(objTo,'AfterEnd',objFr);
			}
		}
	} 
	function cgeSwapNodesMain(pobjFr,pobjTo) { //SR17724.29
		var Rows;
		var i;
		var idxFr=pobjFr.cellIndex;
		var idxTo=pobjTo.cellIndex;
		var objChildFr=document.getElementById(getParent(pobjFr,'TABLE').id.replace('gridhead','gridbody')).children[0];
		var objChildTo=document.getElementById(getParent(pobjTo,'TABLE').id.replace('gridhead','gridbody')).children[0];
		var objTo;
		var objFr;
		Rows=objChildFr.children.length;
		for (i=0;i<Rows;i++) {
			if (objChildTo.children[i].id.indexOf('_')==-1) {
				objTo=objChildTo.children[i].children[idxTo];
				objFr=objChildFr.children[i].children[idxFr];
				objFr.removeNode;
			//	InsertElement.insertAdjacentElement('AfterEnd',Node);    // SR17321
				doInsertAdjacentElement(objTo,'AfterEnd',objFr);
			}
		}
	} 
 	//-->
	//</script>
	

	//<script language="javascript">
	//<!--
	function hideMainLines() {
		var TBODY=document.getElementById('TBODY');  //W3C
		var TBODYKey=document.getElementById('TBODYKey');  //17724.23
		var blnFlag=!TBODY._ShowMainLines;
		TBODY._ShowMainLines=!TBODY._ShowMainLines;
		for (var i=0;i<TBODY.rows.length;i++) {
			TBODY.rows[i].style.display = (!blnFlag || TBODY.rows[i].id.indexOf('_')!=-1) ? 'inline' : 'none';
			if (TBODYKey!=null) TBODYKey.rows[i].style.display = (!blnFlag || TBODYKey.rows[i].id.indexOf('_')!=-1) ? 'inline' : 'none'; //SR17724.23
		}
	}
	function childCount(pintRow) {
		var TBODY=document.getElementById('TBODY');  //W3C
		var intCount=0;
		for (var i=pintRow+1;i<TBODY.rows.length;i++) {
			if (TBODY.rows[i].id.indexOf('_')==-1) {
				break;
			} else {
				intCount++;
			}
		}
		return intCount;
	}
	function lastChildId(pintRow,pType) {
		var TBODY=document.getElementById('TBODY'+pType);  //W3C
		var id=pintRow;
		for (var i=pintRow+1;i<TBODY.rows.length;i++) {
			if (TBODY.rows[i].id.indexOf('_')==-1) {
				break;
			} else {
				id=i;
			}
		}
		return TBODY.rows[id].id;
	}
	function moveFocusToNextLinkedLine(pKey) {
		var TBODY=document.getElementById('TBODY');  //W3C
		var objRow;
		var intRow;
		var focusField=document.getElementById('focusField').value;
		var intCol=getColNum(focusField);
		if (focusField=='') {
			var objRow=TBODY.rows[0];
		} else {
			var objRow=TBODY.rows[getGridRow(document.getElementById(focusField))];
		}
		for (var i = (objRow.rowIndex+1); i < TBODY.rows.length; i++) {
			objRow=TBODY.rows[i];
			if (objRow._Links) {
				intRow=TBODY.rows[i].id.split('GridRow')[1];
				moveFocus('tdY'+intRow+'_'+intCol,1,1,1);
				break;
			}
		}
	}
	function moveFocusToPrevLinkedLine(pKey) {
		var TBODY=document.getElementById('TBODY');  //W3C
		var objRow;
		var intRow;
		var focusField=document.getElementById('focusField').value;
		var intCol=getColNum(focusField);
		if (focusField=='') {
			var objRow=TBODY.rows[TBODY.rows.length-1];
		} else {
			var objRow=TBODY.rows[getGridRow(document.getElementById(focusField))];
		}
		for (var i = (objRow.rowIndex-1); i > -1; i--) {
			objRow=TBODY.rows[i];
			if (objRow._Links) {
				intRow=TBODY.rows[i].id.split('GridRow')[1];
				moveFocus('tdY'+intRow+'_'+intCol,1,1,1);
				break;
			}
		}
	}
	function expandObject(pintRow) {
		var TBODY=document.getElementById('TBODY');  //W3C
		var arr;
		var objParent;
		var objRow=TBODY.rows[pintRow];
		var id=objRow.id.split('GridRow')[1].split('_')[0];
		objParent=document.getElementById('GridRow'+id);
		if (childCount(objParent.rowIndex)==1) {
			// about to delete the last child
	  		objParent._Links=false;
			document.getElementById('Expand_'+id).src=cgeYGIF+'bplus.gif';
		}
	}
	function setExpanded(pblnState) {
		var objExpand=document.getElementById('Expand')
		objExpand.src=(pblnState) ? cgeYGIF+'cminus_small.gif' : cgeYGIF+'cplus_small.gif'; //SR17724
		objExpand._Expanded=pblnState;
		var objExpand=document.getElementById('Expand1')
		if (objExpand!=null) { //IPIRANGA-164 1a
			objExpand.src=(pblnState) ? cgeYGIF+'cminus_small.gif' : cgeYGIF+'cplus_small.gif'; //SR17724
			objExpand._Expanded=pblnState;		
		}
	}
	function cgeExpandAll() {
		//SR17724
		var TBODY=document.getElementById('TBODY');  //W3C
		var strRowId;
		var intPos;
		//SR17724.53 var objExpand=document.getElementById('Expand');
		var objExpand=window.event.srcElement;  //SR17724.53
		cgeCancelDrag();
		setExpanded(!objExpand._Expanded);
		//objExpand.src=(!objExpand._Expanded) ? cgeYGIF+'cminus_small.gif' : cgeYGIF+'cplus_small.gif'; //SR17724
		//objExpand._Expanded=!objExpand._Expanded;
		for (var i = 0; i < TBODY.rows.length; i++) {
			strRowId=TBODY.rows[i].id;
			intPos=strRowId.indexOf("_");
			if (intPos==-1) {
				if (document.getElementById(strRowId)._Links) {
					var arr=strRowId.split('GridRow');
					cgeExpandEx(arr[1],'Expand_'+arr[1],objExpand._Expanded);
				}
			}
		}
		window.event.returnValue = false;  //SR17853
		window.event.cancelBubble = true;  //SR17253 //SR17853
	}
	var newRow;
	function cgeExpand(Row,State) {
		var id='Expand_'+Row
		if (document.getElementById('GridRow'+Row)._Links) {
			if (State==undefined) { 
				State=!document.getElementById(id)._Expanded;
			}
			cgeExpandEx(Row,id,State);
		}
	}
	// SR17377 replacement
	function cgeCreateExpandRow(Row,Data,Key,Show,Form,Parent,Type) {
		if (Type==undefined) Type='';
		var TBODY=document.getElementById('TBODY'+Type);  //W3C
		var ELBody=document.getElementById('ELBody');  //W3C
		var idIndex;
		var objRow;
		if (Key==undefined) Key='';
		if (Parent==undefined) Parent='';
		objRow=document.getElementById('GridRow'+Row);
		objRow._Links=true;
		for (var i = 1; i <99999; i++) {
			idIndex=Row+'_'+i;
			if (document.getElementById('GridRow'+idIndex)==undefined) {
				break;
			}
		}
		newRow=cgeBodyRow(TBODY,idIndex,null,ELBody,Type);	//SR11573 //SR17724
		//document.getElementById(lastChildId(objRow.rowIndex)).insertAdjacentElement('AfterEnd',newRow);    // SR17321
		doInsertAdjacentElement(document.getElementById(lastChildId(objRow.rowIndex,Type)),'AfterEnd',newRow);
		//SR17658 var newCell=cgeExpandBodyFieldCell(newRow,'ExCon'+idIndex,'arial',10,'white','-1',ELBody);           // SR17597
	//	var newCell=cgeBodyFieldCell(newRow,'ExCon'+idIndex,'arial',10,'white','','-1','','',Form+'_'+i);
		var newCell=cgeBodyFieldCell(newRow,'ExCon'+idIndex,'arial',10,'white','','','','-1','','','',ELBody,1);  //SR17658
		//								1	        2           3    4    5     6  7  8  9   10 11 12   13   14
		newCell.style.border='none';
		//SR17724.19 newCell.colSpan=objRow.cells.length-1;
		newCell.colSpan=objRow.cells.length; //SR17724.19 
		var newTable=document.createElement('table');
		newTable.style.overflow='hidden';
		newTable.style.tableLayout='fixed';
		newTable.cellSpacing=0;
		newTable.style.width='100%';
		newCell.appendChild(newTable);
		var newBody=document.createElement('tbody');
		newTable.appendChild(newBody);
		newRow=cgeBodyRow(newBody,idIndex+'a',Form,ELBody,Type); //SR17724 //SR17724.5
		newBody.appendChild(newRow);
		newBody.id='TBODYEx'+Type  //SR17724.A
		cgeExpand(Row,Show);
		return newRow;
	}
	function setState(obj,State) {
		if (State==undefined) { State=true };
		obj._Expanded=State;
		obj.src = State ? cgeYGIF+'cminus_small.gif' : cgeYGIF+'cplus_small.gif';
	}
	function cgeExpandEx(Row,id,Expanded) {
		var strFocus;
		var TBODY=document.getElementById('TBODY');  //W3C
		var TBODYKey=document.getElementById('TBODYKey');  //SR17724
		if (document.getElementById(id).src!='bplus.gif') {
			//Only if this row has linked Lines
			var strState = Expanded ? 'block' : 'none'; //SR17724
			for (var i = document.getElementById('GridRow'+Row).rowIndex+1; i < TBODY.rows.length; i++) {
				if (TBODY.rows[i].id.indexOf('_')==-1) {
					break;
				} else {
					TBODY.rows[i].style.display=strState;
					if (document.getElementById('GridVersion').value==1) TBODYKey.rows[i].style.display=strState;  //SR17724
				}
			}
			setState(document.getElementById(id),Expanded);
			if (Expanded) {
				if (document.getElementById('GridRow'+Row).nextSibling.id.indexOf('_')!=-1) {  //SR17724.A
					moveFocus(getFirstCell(document.getElementById('GridRow'+Row).nextSibling.children[0].children[0].children[0]),1,1,1);
				}
			} else {
				moveFocus(getFirstCell(document.getElementById('GridRow'+Row)),1,1,1);
			}
			if (cgeAll(Expanded)) {
				document.getElementById('Expand')._Expanded=Expanded;
				document.getElementById('Expand').src = Expanded ? cgeYGIF+'cminus_small.gif' : cgeYGIF+'cplus_small.gif';
			}
		}
	}
	function cgeAll(pState) {
		var blnFlag=true;
		var intRow;
		var TBODY=document.getElementById('TBODY');  //W3C
		for (var i = 0; i < TBODY.rows.length; i++) {
			if (TBODY.rows[i].id.indexOf('_')==-1) {
				intRow=TBODY.rows[i].id.split('GridRow')[1];
				if (document.getElementById('Expand_'+intRow)._Expanded!=pState) {
					blnFlag=false;
					break;
				}
			}
		}
		return blnFlag;
	}
 	//-->
	//</script>
	

	//<script language="javascript">
	//<!--
	//----------------------------------
	//Column Resizing
	//----------------------------------
	var cgeRatio=-1;
	var GRESIZING=false; //SR17724
	var YFINISHEDLOADINGGRID=false; //SESDF-672.4
	//SESDF-954 window.attachEvent('onresize',gridDoResizeOnResize);  //SR17430
	function cgeAlignColumns() {
		var retval = EventValue(YUCI,YUSER,YFORM,'FIX','COMGridEdit31R','ALIGN','6','');
		window.location.reload();
	}
	function currentHeader() {
		var result=document.getElementById('gridhead'+Gkey);         //SR17253 //SR17724.14
		var gridhead2=document.getElementById('gridhead2');     //SR17253 // SR17597
		if (gridhead2!=null) {
			if (gridhead2.style!=null) {
				if (gridhead2.style.display!='none') {
					result=document.getElementById('gridhead2'+Gkey);
				}
			}
		}
		return result;
	}
	var Gkey=''; //SR17724.14
	function gridStartColumnResize() {		//SR17253  //SR17325.1
		if (isFixedCol(event.srcElement.parentNode.id)) { //SR17724.14
			Gkey='Key';									  //SR17724.14
		} else {
			Gkey='';									  //SR17724.14
		}
		gridStartColumnResizeFld();
	}
	function gridStartColumnResizeFld() {		//SR17253  //SR17325.1
		var el;
		var gridResize;
		var gridbodyDIV=document.getElementById('gridbodyDIV'+Gkey);			// SR17325 test  //SR17724.14
		gridCurrentColumn=getParent(event.srcElement,'th').cellIndex;				//SR17253	//SR17325.1 //SR17687
		var el=currentHeader().rows[0].cells[gridCurrentColumn];
		if (el!=undefined) {
			gridPos = event.clientX+document.body.scrollLeft;
			if (event.srcElement.style.cursor=='col-resize') { //SR17724
				cgeCancelDrag();
				gridSize = el.offsetWidth;
				if (isFF()) gridSize=el.clientWidth; //CORE-142
				gridDoResize();
				el.setCapture();
				el.attachEvent("onmousemove", gridEventsonmousemove);
				el.attachEvent("onmouseup", gridEventsonmouseup);
				el.attachEvent("onlosecapture", gridEventsonlosecapture);
				GRESIZING=true; //SR17724
			}
		}
		el = null;
		event.cancelBubble = true;
		autoResize();
	}
	function gridEventsonmousemove() {gridDoResize()};
	function gridEventsonmouseup() {gridEndResize()};
	function gridEventsonlosecapture() {gridEndResize()};
	function gridDoResizeOnResize() { // cause the header to be redrawn correctly.
		var curPos = document.getElementById('gridbodyDIV'+Gkey).scrollLeft;  	//SR17724.14
		document.getElementById('gridbodyDIV'+Gkey).scrollLeft = 1;				//SR17724.14
		currentHeader().style.left = 0;
		document.getElementById('gridbodyDIV'+Gkey).scrollLeft = curPos;		//SR17724.14
	}
	function getCSSRule(ruleName) {								//SESDF-672.3
   		ruleName=ruleName.toLowerCase();
   		if (document.styleSheets) {
      		for (var i=0; i<document.styleSheets.length; i++) {
         		var styleSheet=document.styleSheets[i];
         		var ii=0;
        		var cssRule=false;
         		do {
            		if (styleSheet.cssRules) {
              		 cssRule = styleSheet.cssRules[ii];
            	} else {
               		cssRule = styleSheet.rules[ii];
            	}
            	if (cssRule) {
               		if (cssRule.selectorText.toLowerCase()==ruleName) {
                     	return cssRule;
              		}
            	}
            	ii++;
         		} while (cssRule)
      		}
   		}
   		return false;
	}
	if (isIE()) var TDhideIERule = getCSSRule('.TDhideIE'); //SESDF-672.3
	function autoResize() {
		var height=0;
		var i;
		if (YFINISHEDLOADINGGRID!=true) return false;  //**** EARLY EXIT SESDF-672.4
		var gridbody   =document.getElementById('gridbody');	//SR17724.14
		if (gridbody.rows.length>0) {
			if (gridbody.getAttribute('AutoResizeRows')==1) { //SR18004
				if (isIE()) TDhideIERule.style.display='none';			//SESDF-672.3
				var gridbodyKey=document.getElementById('gridbodyKey');	//SR17724.14
				if (gridbodyKey==undefined) gridbodyKey=gridbody; //CORE-237.1
				var intRows=gridbody.rows.length;
				gridbody.style.tableLayout='auto';
				gridbodyKey.style.tableLayout='auto';
				if (intRows>0) {
					for (var i=0;i<intRows;i++) {
						gridbody.rows[i].cells[0].style.height='0px';
						gridbodyKey.rows[i].cells[0].style.height='0px';
					}
					for (var i=0;i<intRows;i++) {
						var objBody=gridbody.rows[i];
						var objBodyKey=gridbodyKey.rows[i];
						height=Math.max(objBodyKey.offsetHeight,objBody.offsetHeight);
						objBody.cells[0].style.height=height+'px';
						objBody.style.height=height+'px';     //SESDF-672.1
						objBodyKey.cells[0].style.height=height+'px';
						objBodyKey.style.height=height+'px';  //SESDF-672.1
					}
				}
				gridbody.style.tableLayout='fixed';
				gridbodyKey.style.tableLayout='fixed';
				if (isIE()) TDhideIERule.style.display='block';			//SESDF-672.3
			}
		}
	}
	function gridDoResize() {				//SR17253 //SR17325.1
		var sz;
		var gridbody   =document.getElementById('gridbody'+Gkey);	//SR17253
		var gridheadDIV=document.getElementById('gridheadDIV'+Gkey);	//SR17253
		var gridbodyDIV=document.getElementById('gridbodyDIV'+Gkey);	//SR17253
		var objHeadStyle=currentHeader().rows[0].cells[gridCurrentColumn].style;
		sz = gridSize + event.clientX - gridPos + document.body.scrollLeft;
		sz = sz < 5 ? 5 : sz;
		setCellWidth(objHeadStyle,sz,1);
		if (gridbody.rows.length>0) {
			if (currentHeader().id=='gridhead'+Gkey) {	//SR17724.14
				var objBodyStyle=gridbody.rows[0].cells[gridCurrentColumn].style;
				setCellWidth(objBodyStyle,sz,2+(1*objBodyStyle.borderRightWidth.split('px')[0]));
				objBodyStyle.left=objHeadStyle.left;
				objBodyStyle.layout='fixed';
				gridbody.style.left=currentHeader().style.left;
			}
		}
		gridbodyDIV.onscroll();
		autoResize();
		syncGridWidths(); //SR17325 resync grid's header and body widths                               //SR17325.2 
	}
	function setCellWidth(pobjCellStyle,sz,pintOffset,pobjCurrent) {
		if (isFF() && (pobjCurrent!=undefined)) {
			if (pobjCurrent.id==getFocusField()) {
				sz=sz-pintOffset; //CORE-142
			}
		}
		pobjCellStyle.width=sz;
		pobjCellStyle.maxWidth=sz;
		pobjCellStyle.minWidth=sz;		
	}
	function gridEndResize() {									//SR17253 //SR17325.1
		var width;
		var Form;
		var gridbodyDIV=document.getElementById('gridbodyDIV'+Gkey);  //SR17253.2010-07-01 //SR17724.14
		var el=currentHeader().rows[0].cells[gridCurrentColumn];		//SR17253
		el.detachEvent("onmousemove", gridEventsonmousemove);		//SR17325.1
		el.detachEvent("onmouseup", gridEventsonmouseup);			//SR17325.1
		el.detachEvent("onlosecapture", gridEventsonlosecapture);	//SR17325.1
		el.releaseCapture();
		gridDoResize();										//SR17253 //SR17325.1
		width = gridSize + event.clientX - gridPos + document.body.scrollLeft;
		if (width < 5) {width = 5}
		Form=setWidth(gridCurrentColumn,width,currentHeader().id);
		CallBack("OnColumnResize^COMGridEdit31Events",Form+';'+el.id,width);
		gridbodyDIV.onscroll();
		el = null;
		Gkey='';
		//GRESIZING=false;
		autoResize();
		syncGridWidths(); //SR17325 resync grid's header and body widths                               //SR18004 
	}
	function setWidth(gridCurrentColumn,width,gridHeader) {
		var Form='';
		var i;
		var objCell;
		var gridbody=document.getElementById('gridbody'+Gkey);		//SR17253 //SR17724.14
		for (i=0;i<gridbody.rows.length;i++) {
			if (gridbody.rows[i].id.indexOf('_')==-1) {
				if (gridHeader=='gridhead'+Gkey) {					//SR17724.14
			//without this, right aligned columns don't adjust position of cell contents
					objCell=gridbody.rows[i].cells[gridCurrentColumn]
					setCellWidth(objCell.style,width,2+(1*objCell.style.borderRightWidth.split('px')[0]));
					//objCell.style.width=width;
					//objCell.style.maxWidth=width;		//SR17724.14
					Form=objCell.parentNode._Form;
				}
			} else {
				if (gridHeader!='gridhead'+Gkey) {					//SR17724.14
					objCell=gridbody.rows[i].children[0].children[0].rows[0].cells[gridCurrentColumn];  //SR17597
					objCell.style.width=width;
					objCell.style.maxWidth=width;		//SR17724.14
					Form=objCell.parentNode._Form;
				}
			}
		}
		return Form;
	}
	function gridRatio() {
		return 1.3330106485963213; //SR17724
		//SR17724 The following appears unnecesary and can cause the header to be cut off and right most
		//        cells missing.
		//SR17724if (cgeRatio==-1) {
		//SR17724	var obj=document.getElementById('gridheadDIV');
		//SR17724	var intWidth=obj.offsetWidth;
		//SR17724	obj.style.width=intWidth+'pt';
		//SR17724	cgeRatio=obj.offsetWidth/intWidth;
		//SR17724	obj.style.width=intWidth;
		//SR17724}
		//SR17724return cgeRatio;
	}
	//-->
	//</script>
	

	//<script language="javascript">
	//<!--
	function cgeRightClick(event) {
		if (!event) event=window.event
		var srcElement=findObjectTagName(event.srcElement,'TH');
		if (srcElement==null) {
			srcElement=findObjectTagName(event.srcElement,'TD');
		}
		if ((srcElement!=null)&&(srcElement.id.substring(0,7)!='tdExCon')) {
			CallBackNow("Show^COMGridEdit31JRightClick",srcElement.id+','+srcElement.parentNode._Form+','+srcElement.innerText.replace('\n',' '));  //SR17253    
			if (Columns.document.body.innerHTML != "") {
				//Columns.show(event.pageX ? event.pageX : event.screenX,event.pageY ? event.pageY : event.screenY,200,Columns.document.body.children[0].offsetHeight);
				Columns.show(event.pageX ? event.pageX : event.screenX,event.pageY ? event.pageY : event.screenY,200,0);
				Columns.show(event.pageX ? event.pageX : event.screenX,event.pageY ? event.pageY : event.screenY,200,Columns.document.body.children[0].offsetHeight);
			}
			event.returnValue=false;
			event.cancelBubble=false;
		}
		return false;
	}
 	//-->
	//</script>
	

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
	function sortTable(tableNode, nCol, bDesc, sType,pblnByRelation) {  //SR18063
	  var tBody = tableNode.tBodies[0];
	  if (tBody!=undefined) {   //SR17253
		  var trs = tBody.rows;
		  var trl= trs.length;
	  } else {
		  trl=0;
	  }
	  if (GRIDNumPages) {
		  var retval=EventValue(YUCI,YUSER,YFORM,'FIX','OnSortGrid^COMGridEdit31Events',getFocusField(),'6',nCol+"~"+bDesc+"~"+pblnByRelation); //SR18063
	  } else {
		  var a = new Array();
		  var b = new Array();
		  var j=-1;
		  var k=-1;
		  for (var i = 0; i < trl; i++) {
			if (trs[i].id.indexOf('_')==-1) {
			  j=j+1;
			  a[j] = trs[i];
			} else {
			  k=k+1;
			  b[k]=trs[i];
			}
		  }
		  var start = new Date;
		  window.status = 'Sorting data...';
		  a.sort(compareByColumn(nCol,bDesc,sType));
		  window.status = 'Sorting data done';
		  //x=y;
		  for (var i = 0; i < j+1; i++) {
		    tBody.appendChild(a[i]);
		    window.status = 'Updating row ' + (i + 1) + ' of ' + trl + ' (Time spent: ' + (new Date - start) + 'ms)';
		  }
		  //for (var i = 0; i < k+1; i++) {
		  for (var i = k; i > -1; i--) {
		    tBody.appendChild(b[i]);
		//  document.getElementById(b[i].id.split('_')[0]).insertAdjacentElement('AfterEnd',b[i])    // SR17321
		    doInsertAdjacentElement(document.getElementById(b[i].id.split('_')[0]),'AfterEnd',b[i]);
		    window.status = 'Updating row ' + (i + 1) + ' of ' + trl + ' (Time spent: ' + (new Date - start) + 'ms)';
		  }
		  // check for onsort
		  if (typeof(tableNode.onsort) == 'string') {
		    tableNode.onsort = new Function('', tableNode.onsort);
		  } else if (typeof(tableNode.onsort) == 'function') {
		    tableNode.onsort();
		  }
		  resetColumnWidths();
	  }
	}
	function CaseInsensitiveString(s) {
	  return String(s).toUpperCase();
	}
	function parseDate(s) {
	  if (cgeDateFormat==null) {
	  	cgeDateFormat='DD/MM/YYYY';
	  }
	  var year = s.substring(cgeDateFormat.indexOf('Y'),cgeDateFormat.lastIndexOf('Y')+1),
	      month = s.substring(cgeDateFormat.indexOf('M'),cgeDateFormat.lastIndexOf('M')+1),
	      day = s.substring(cgeDateFormat.indexOf('D'),cgeDateFormat.lastIndexOf('D')+1);
	  return year+month+day;
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
	    return Number(s.replace(/[^0-9\.\-]/g, ''));
	}
	function compareByColumn(nCol, bDescending, sType) {
	 var c = nCol;
	 var d = bDescending;
	 var fTypeCast = String;
	 if (sType == 'Number')
	  fTypeCast = toNumber;
	 else if (sType == 'Date')
	  fTypeCast = parseDate;
	 else if (sType == 'CaseInsensitiveString')
	  fTypeCast = CaseInsensitiveString;
	 return function (n1, n2) {
	  //SR17411
	  if (fTypeCast(n1.cells[c].innerText) < fTypeCast(n2.cells[c].innerText))
	   return d ? -1 : +1;
	  if (fTypeCast(n1.cells[c].innerText) > fTypeCast(n2.cells[c].innerText))
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
	function sortColumn(e,ptable,pblnByRelation) {  //16032  //SR18063
	   var fakeEvent = {srcElement : e.srcElement, target : e.target};
	   window.setTimeout(function () { sortColumn1(fakeEvent,null,pblnByRelation);},1);  //SR18063
	}
	function sortColumn1(e,ptable,pblnByRelation) { //SR18063
	 var tmp = e.target ? e.target : e.srcElement;
	 //SR17724.2 var tHeadParent = getParent(tmp, 'THEAD');
	 var tHeadParent = document.getElementById('gridDIV'); //getParent(tmp, 'TBODY'); //SR17724.2 //CORE-233.5
	 var el = getParent(tmp, 'TH');
	 if (tHeadParent == null)
	  return;
	 if (el != null) {
	  var p = el.parentNode;
	  var i;
	  // typecast to Boolean
	  if (el._value==null) el._value=el.innerHTML;
	  if ((tHeadParent._arrow != el)&&(tHeadParent._arrow!=null)) tHeadParent._arrow.innerHTML=tHeadParent._arrow._value;
	  tHeadParent._arrow=el;
	  el._descending = !Boolean(el._descending); //CORE-204
	  if (!el._descending) {
	   	el.innerHTML=el._value+' '+String.fromCharCode(9650); //SESDF-769
	  } else {
	   	el.innerHTML=el._value+' '+String.fromCharCode(9660); //SESDF-769
	  }
	  // get the index of the TD
	  var cells = p.cells;
	  var l = cells.length;
	  for (i = 0; i < l; i++) {
	   if (cells[i] == el) break;
	  }
	  if ((document.getElementById('GridVersion').value==1)&&(!isFixedCol(el.parentNode.id))) {i=i+1+parseInt(document.getElementById('FixedColumns').value);} //SR17724.3
	//  var table = getParent(el, 'TABLE');
	  var table = ptable ? ptable : getParent(el, 'TABLE');   //shobby
	  // can't fail
	  //if ((cells[1].id=='THkey_Expand')&&(isFixedCol(el.parentNode.id))) i=i-1; //SR17724.16
	  if ((cells.length>1)&&(cells[1].id=='THkey_Expand')&&(i>1)) i=i-1; //SR17724.16 //SR17724.3 //CORE-233.1
	  sortTable(table,i,el._descending, el.getAttribute('type'),pblnByRelation);  //SR18063
	 }
	}
	function isFixedCol(pid) {
		return (pid.indexOf('Key')>0); //SR17724.2
	}
	function getInnerText(el) {  //TODO SR17724 (Remove this when finished patching to 1.70)
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
function cgeSortColumnAscending(pField,pTable,pblnByRelation) {  	//SR18063
	var table=document.getElementById(pTable);
	var event=new Object(); //document.createEventObject(); //CORE-189.1
	var el=getParent(document.getElementById(pField), 'TH')
	el._descending=true;  //CORE-204.2  Note this will be reversed in SortColumn1
	event.target=document.getElementById(pField);
	sortColumn(event,table,pblnByRelation);							//SR18063
}
function cgeSortColumnDescending(pField,pTable,pblnByRelation) {	//SR18063
	var table=document.getElementById(pTable);
	var event=new Object(); //document.createEventObject(); //CORE-189.1
	var el=getParent(document.getElementById(pField), 'TH')
	el._descending=false; //CORE-204.2  Note this will be reversed in SortColumn1
	event.target=document.getElementById(pField);
	sortColumn(event,table,pblnByRelation);							//SR18063
}
function getParent(el, pTagName) {
	if (el == null) { return null;
	} else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase()) { // Gecko bug, supposed to be uppercase",YCR
	  return el;
	} else {
  		return getParent(el.parentNode, pTagName);
	}
}
 	//-->
	//</script>
	

//<script language="javascript">
//<!--
	var blnDrawDynTableOnNextFocus = false; // SR15426  //W3C
	function cgeOnScroll2() {
		return 1;
		document.getElementById('gridbodyDIV').style.height=(document.getElementById('gridDIV').clientHeight-document.getElementById('gridbodyDIV').offsetTop)+'px';
		return 1;
	}
	var YFINISHEDLOADINGGRIDTIMEOUT;
	function cgeShowGrid(pintTimes,pblnAuto) { //SESDF-1237
		window.clearTimeout(YFINISHEDLOADINGGRIDTIMEOUT);
		YFINISHEDLOADINGGRIDTIMEOUT=window.setTimeout(function() { cgeShowGridEx(pintTimes,pblnAuto) },2);
	}
	function cgeShowGridEx(pintTimes,pblnAuto) { //SR17995 //SR18190
		var fltWidth=-1;						//SR18190
		if (YFINISHEDLOADINGGRID==true) {
			if (document.getElementById('gridDIV').offsetTop<-1000) {
				with (document.getElementById('gridDIV').style) {
					if (document.getElementById('gridDIV').getAttribute('_MaxWidth')==-1) {
						document.getElementById('gridDIV').style.width='0px'; //SR18190
						width=(document.getElementById('WWW2').offsetWidth)+'px';
						fltWidth=width;			//SR18190
					}
					top=(parseInt(document.getElementById('gridDIV').style.top)+10000)+'px';
				}
				cgeOnScroll();  //FF display scroll bar correctly
			}
			syncGridSize();
		}
		//SESDF-1237 if ((fltWidth==-1)&&(pintTimes<100)&&(document.getElementById('gridDIV').getAttribute('_MaxWidth')==-1)) window.setTimeout(function() { cgeShowGrid(pintTimes+1,pblnAuto) },200); //SR18190	 //SESDF-672.1	
		if ((fltWidth==-1)&&(pintTimes<100)&&(document.getElementById('gridDIV').getAttribute('_MaxWidth')==-1)) {cgeShowGrid(pintTimes+1,pblnAuto);} //SR18190	 //SESDF-672.1	
	}
	function cgeOnScroll() {
		var gridhead       =document.getElementById('gridhead');    //SR17724
		var gridheadKey    =document.getElementById('gridheadKey');    //SR17724
		var gridhead2      =document.getElementById('gridhead2');   //SR17724.24
		var gridbody       =document.getElementById('gridbody');    //SR17724.24
		var gridheadDIV    =document.getElementById('gridheadDIV');
		var gridheadDIVKey =document.getElementById('gridheadDIVKey'); //SR17995
		var gridheadDIV2Key=document.getElementById('gridheadDIV2Key');
		var gridbodyDIV    =document.getElementById('gridbodyDIV');
		var gridbodyDIVKey =document.getElementById('gridbodyDIVKey'); //SR17724.24
 		if (document.getElementById('GridVersion').value!=1) {
			try {
				gridheadDIV.style.left=(-gridbodyDIV.scrollLeft+'px');
			} catch(e) {
			}
 		} else {
	 		gridhead.style.height=''; //SR17724.30
	 		gridheadKey.style.height='';
	 		if (gridheadKey.clientHeight>gridhead.clientHeight) {
		 		gridhead.style.height=gridheadKey.clientHeight+'px';
	 		}
		 	gridheadKey.style.height='100%';
			try {
				gridhead.style.left=(-gridbodyDIV.scrollLeft+'px'); //SR17724 
				gridhead2.style.left=(-gridbodyDIV.scrollLeft+'px'); //SR17724 
			} catch(e) {
			}
			try {
				//gridbodyDIVKey.style.top=(-gridbodyDIV.scrollTop+'px'); //SR17724
				document.getElementById('gridbodyDIVKey').style.top=(-gridbodyDIV.scrollTop+'px'); //SR17724
			} catch(e) {
			}	
			if (document.getElementById('gridbodyDIVInner')!=null) { //SR17724
				if (!isIE()) {									 //SR17724
					var intHeight=getGridHeight(300,0);
					var intHeight=300; //SR17724.24
					gridbodyDIV.style.height=intHeight;
					gridbodyDIVKey.style.height=intHeight;
					gridbodyDIV.style.width=(document.getElementById('gridDIV').clientWidth-gridbodyDIV.offsetLeft)+'px'; //SR17724
					gridheadDIV.style.width=(document.getElementById('gridDIV').clientWidth-gridbodyDIV.offsetLeft)+'px'; //SR17724
				}
			}
 		}
 		var gridhead2=document.getElementById('gridhead2');
		if (gridhead2!=null) {
			var current=gridhead2.style.display;
			gridhead2.style.display=''; //SR17724.19
			var EndWidth=gridhead2.scrollWidth-gridhead.scrollWidth;
			if (EndWidth>0) {
				if (document.getElementById('tdEnd_1')!=null) document.getElementById('tdEnd_1').style.width=EndWidth+'px';
			}
			gridbody.style.width=Math.max(gridhead.offsetWidth,gridhead2.offsetWidth)+'px'; //SR17724
			if (gridheadDIV2Key!=null) gridheadDIV2Key.style.width=gridheadDIVKey.clientWidth+'px';
			if(isFF()) gridheadDIV2Key.style.width="-moz-max-content";
			gridhead2.style.display=current;
		}
	}
	function cgeGridDate() {
		return '2014-02-12 03:16:53';
	}
	//-->
	//</script>
	

//<script language="javascript">
//<!--
	function cgeClearDEVinfo() {   // SR17597
		var DEVinfo = document.getElementById('DEVinfo');
		DEVinfo.value = 'DEVinfo ['+navigator.userAgent+"] ";
	}
	function cgeAddBlock(pintPage,pstrFocus,pblnContinue) {
		var param=pintPage+'~'+pblnContinue;
		var retval = EventValue(YUCI,YUSER,YFORM,'FIX','COMGridEdit31R','BODYADDROWS','6',param);
		if (pstrFocus=='T') {
			moveFocusTop();
			pstrFocus = '';
		}
		if (retval==1) {
			var strCommand='cgeAddBlock('+pintPage+',\''+pstrFocus+'\',1);';
			window.setTimeout(strCommand,10);
		} else {
			if (pstrFocus=='B') {				//Move to Bottom Left
				moveFocusBottom();
			} else if (pstrFocus=='E') {		//Move to Bottom Right (End)
				moveFocusBottom();
				moveFocus(35);
			} else if (pstrFocus!='') {			// Move to pstrFocus cell
				moveFocus(pstrFocus,1,1,1);
				moveFocus(36); // This can be an issue if you want to Goto a particular field using GotoPage : check SR14427
				SetFocus('Grid');
			}
			document.getElementById('WWW2').style.cursor = 'auto'; //SR18182
			YFINISHEDLOADINGGRID=true;
			cgeShowGrid(1,0);
		}
	}
	function GoToPage(pintPage,numPages,pstrFocus,pintBlnContinue) {
		document.getElementById('WWW2').style.cursor = 'wait';
		if (numPages == null) {
			numPages = pintPage;
		}
		GRIDPage = pintPage;
		GRIDNumPages = numPages;		// Global set
		pagesText(numPages,pintPage);
		if (pintBlnContinue!=1) {	
			var af = document.getElementById('activefield').value;
			if (af!='') {
				saveDataNow(af);
			}
			setFocusField(''); // SR14427
			var objGrid = document.getElementById('gridbody');
			while (objGrid.rows.length>0) {
				objGrid.deleteRow(0);		//SR17253
			}
			var objGrid = document.getElementById('gridbodyKey');
			if (objGrid!=undefined) {
				while (objGrid.rows.length>0) {
					objGrid.deleteRow(0);		//SR17724
				}
			}
		}
		cgeAddBlock(pintPage,pstrFocus,pintBlnContinue);
	}
	function PerPage(obj) {
		var retval = EventValue(YUCI,YUSER,YFORM,'FIX','COMGridEdit31R','PERPAGE','6',obj.value);
		retval=retval.split('~');
		if (retval[0]==1) {
			GoToPage(1,retval[1],'T',0);  //SR17253
		} else {
			obj.value = retval[1];
		}
	}
	function InputData(obj,objNewStyle) {
		var objStyle=obj.style;
		objNewStyle=objNewStyle.split('~');
		objStyle.backgroundColor=objNewStyle[0];
		if (obj.value!='') {
			var param=obj.value+'~'+YFORM
			var retval = EventValue(YUCI,YUSER,YFORM,'FIX','COMGridEdit31Scan','READ','6',param);
			retval=retval.split('~');
			if (retval[0]==1) {
				param=retval[1]+'~'+YFORM+'~'+retval[2]+'~'+retval[3]+'~'+retval[4]
				EventValue(YUCI,YUSER,YFORM,'FIX','COMGridEdit31Scan','UPDATE','6',param);;
				obj.value = '';
			} else {
				obj.value = retval[1];
				objStyle.backgroundColor=objNewStyle[1];
			}
			window.setTimeout(function () {
				obj.focus();
				obj.select();  //SR18084.1
			}, 0);
		}
	}
	function enterScan(event,obj,objNewStyle) {
		if(window.event) { // IE8 and earlier
			keynum = event.keyCode;
	   	} else if(event.which) { // IE9/Firefox/Chrome/Opera/Safari
		    keynum = event.which;
		}
	    if (keynum == 13) {
	    	window.setTimeout(function() {document.getElementById('perpage').focus(); document.getElementById(obj.id).focus();},1);  //18084.1 
	   	}
	 }
	// if the form has a scan input field, then it should get the focus  SR17640
	function setFocusScanField() {
		if(document.getElementById('inputdata')) {
			document.getElementById('inputdata').focus();
		}
	}
	window.attachEvent('onload', setFocusScanField);
	function pagesText(pMax,pCurrent,pGroup) {
		var txt,grpSize,lstGrp,stop,start;
		grpSize = 10;
		if (pGroup == null) {
			pGroup = Math.floor((pCurrent-1) / grpSize + 1);
		}
		if (pGroup == 1) {
			txt = "??"
		} else {
			txt = Link(1,"<<") + Link(pGroup-1,"<");
		}
		stop = pGroup*grpSize;
		start = stop-grpSize+1;
		if (stop > pMax) {
			stop = pMax;
		}
		for (var i = start; i <= stop; i++) {
			if (pCurrent==i) {
				txt = txt+" <b>??"+i+"??</b>";
			} else {
				txt = txt+" <a href='#grid' onClick=\'GoToPage("+i+","+pMax+",\"T\",0);\'>??"+i+"??</a>";
			}
		}
		if (stop != pMax) {
			lstGrp = Math.floor((pMax-1) / grpSize + 1);
			txt = txt + Link(pGroup+1,">") + Link(lstGrp,">>");
		}
		document.all.pages.innerHTML = txt;
		function Link(pGroup,pText) {
			return "??<a href='#grid' onClick=\'pagesText("+pMax+","+pCurrent+","+pGroup+");\'>??"+pText+"??</a>";
		}
	}
	function cgeUpdateValue(id,Value) {
		if (document.getElementById(id+'_checkbox')!=null) {
			document.getElementById(id+'_checkbox').checked=+Value;
		} else if (document.getElementById(id)!=null) { //16042			
			var divid = document.getElementById(id+'dt');
			if (divid!=null) {
				divid.innerHTML=Value;
			}
		}
	}
	function isValid(value) {
		return ((value!="")&&(value!=null));
	}		
	function cgeUpdateStyle(id,objNewStyle) {
		var objObject=document.getElementById(id);
		if (objObject!=null) {
			var objStyle=objObject.style;
			objNewStyle=objNewStyle.split('~');
			if (isValid(objNewStyle[0])) objStyle.color=objNewStyle[0];
			if (isValid(objNewStyle[1])) objStyle.backgroundColor=objNewStyle[1];
			if (objNewStyle[2]!=null) objObject.title=objNewStyle[2];
			//SR16510
			if (document.getElementById(id+'_checkbox')!=null) {
				objObject.disabled=objNewStyle[3]==0;
				document.getElementById(id+'_checkbox').disabled=objNewStyle[3]==0; //SR17934
			} else {
				objObject.Locked=objNewStyle[3]==0;
			}
			//SR16510
			if (objNewStyle[3]!=-1) {
				//objObject.detachEvent('onmousedown',0)
				//objObject.attachEvent('onmousedown',objObject.Locked?cgeOnMouseDownDisabled:cgeOnMouseDownEnabled);
			}
		}
		return;         // FIXME : return without value?
	}
	// ********************** Row Creation Code ************************************
	var gCOLON='';      // not used?
	//function cgeBodyRow(Body,idRow,show) {
	function cgeBodyRow(Body,idRow,Form,Header,Type) {
		var newRow=document.createElement('tr');
		newRow.id='GridRow'+idRow+Type;
		if (newRow.id.indexOf('_')==-1) {newRow.style.display='block'};
		newRow._Form=Form;
		newRow.style.fontSize='10pt';
		newRow.style.fontFamily='Symbol';
		newRow.Header = Header;
		return newRow;
	}
	function cgeBodyRowEnd(Body,pnewRow) {
		Body.appendChild(pnewRow);
	}
	// SR17377 replacement
	function cgeAddManyRows(Body,strBigString) {
		var Rows=strBigString.split('~!@#$~');
		var intRows=Rows.length-1;
		for (var i = 0; i != intRows ; i++) {
			var Cols=Rows[i].split('~');
			cgeBodyFieldCell(Cols[0],Cols[1],Cols[2],Cols[3],Cols[4],Cols[5],Cols[6],Cols[7],Cols[8],Cols[9]);
			cgeBodyRowEnd(Body);
		}
	}
	// ********************** Field Creation Code **********************************
	function cgeHeadFields(objHeadRow,HeadType,Col,innerHTML,fontFamily,fontSize,width,height,bgColor,type,hidden,form,blnAttach) {
		var objTH=document.createElement('TH');
		var objStyle=objTH.style;
		if (Col=='Expand') {
		//	form='';   //SR17597
			form='_';
		} else {
			form='_'+form+'_';
		}
		if (HeadType=='Key') {
			objTH.className='THkey';
			objTH.id='THkey'+form+Col;		
		} else {
			if (hidden==1) {
				objTH.className='THhide'+getBrowser();
			} else {
				objTH.className='THfld';
			}
			objTH.id='THfld'+form+Col;
		}
		objTH.Hidden = hidden==1;
		objTH.unselectable='on';
		objTH.type=type;
		objStyle.fontFamily=fontFamily;
		objStyle.fontSize=fontSize+'pt';
		objStyle.backgroundColor=bgColor;
		objStyle.border='1px solid white';
		if (hidden==1) { 
			objTH.innerHTML='';
			objStyle.width='0px';
		} else {
			objTH.innerHTML=innerHTML+' ';
			//if ((objHeadRow.id=='gridheadRow2Key')&&(HeadType=='Key')) {
			//	objStyle.width=document.getElementById('gridheadRowKey').cells[0].style.width;
			//} else {
				objStyle.width=width+'px';
			//}
		}
	//	totalWidth=totalWidth+objStyle.width;   // concept only -GRF-
		//if (blnAttach==true) {      //SR17597  //SR17658
			objTH.attachEvent('onmousedown',function() { cgeonmousedown(window.event,objHeadRow.id); }); //SR17325.1  //SR17224
			objTH.attachEvent('onmousemove',cgeonmousemove); //SR17325.1
		//}                           //SR17597  //SR17658
		objHeadRow.appendChild(objTH);
	}
	// SR17377 replacement
	function cgeBodyFieldKey(objGridRow,pfont,fontsize,pheight,bgColor,innerHTML,tooltip,THname,Expand) {  //SR17628
		var newCell=document.createElement('TD');
		if (Expand==1) {
			newCell.className='TDkeyEx';
		} else {
			newCell.className='TDkey';
		}
		if (THname!='Expand') {               // SR17597
			newCell.id='td'+objGridRow.id;                 // "tdGridRow6"
			newCell.attachEvent('onmousedown',function() { moveFocus(getFirstCell(document.getElementById(objGridRow.id)),1,1,1); window.event.returnValue=false; window.event.cancelBubble=true;}); //SR17724.13
		} else {
			newCell.id='td'+objGridRow.id+'Exp';           // "tdGridRow6Exp"
			newCell.attachEvent('onmousedown',function() { window.event.returnValue=false; window.event.cancelBubble=true;}); //IPIRANGA-173.1
		}
		newCell.innerHTML=unescape(innerHTML);
		if (typeof(tooltip)!="undefined") { newCell.title=tooltip; }
		with (newCell.style) {
			font=fontsize+'pt '+pfont;
			backgroundColor=bgColor;
			if (document.getElementById('GridVersion').value!=1) {
				width=objGridRow.Header.rows[0].cells[objGridRow.children.length].style.width;
			} else {
				if (document.getElementById('THkey_'+THname)==null) {
					width=0;
				} else {
				    width=document.getElementById('THkey_'+THname).style.width; //SR17724
				}
			}
			minWidth=width;
			maxWidth=width;
			if (pheight!='') { height=pheight+'pt';}
		}
		objGridRow.appendChild(newCell);
	}
	function cgeBodyFieldCell(Row,fieldname,font,fontsize,backgroundColor,height,textAlign,innerHTML,enabled,title,pCOLON,fontcolor,Header,Expand,pblnLastKey,pblnEnd) {  //SR17628
		var newCell=document.createElement('TD');
		var strFont=fontsize+'pt '+font;
		newCell.id=getFieldId(fieldname,Row._Form); //SR17630 //SR17673.2
		if ((title!='')&&(title!=null)) {newCell.title=title;}
		if (isIE()) newCell.noWrap=true;  //SR18004
		var cellStyle=newCell.style;
		if ((fontsize+'pt')!=Row.style.fontSize) {
			cellStyle.fontSize=fontsize+'pt';
		}
		if (pblnLastKey==1) {
			//newCell.style.borderRight='0px'; //SR17724.6
		} else if (fieldname.indexOf('End_')>-1) {
			newCell.style.border='none'; //SR17724.19
		}
		if (fontcolor!='') { cellStyle.color=fontcolor;}
		if (Expand==1) {  //SR17628
			newCell.className='TDfldEx';
		} else { 
			newCell.className='TDfld';
		}
		if (backgroundColor!='') { cellStyle.backgroundColor=backgroundColor; }
		if (textAlign!='') {
			cellStyle.textAlign=textAlign;
		}
		newCell.Locked=enabled==0;
		if (pblnEnd!=1) newCell.attachEvent('onmousedown',cgeOnMouseDownEnabled); //16673
		if (innerHTML!='') {
			newCell.innerHTML=unescape(innerHTML);
		}
		if (document.getElementById('GridVersion').value!=1) {
			if (fieldname.indexOf('End_')<0) {
				var width=Row.Header.rows[0].cells[Row.children.length].clientWidth;
				if (width=='') {
					width=Row.Header.rows[0].cells[Row.children.length].style.width;
				} else {
					if (isIE()||isCH()) width=width+2;
				}
			}
		} else {
			//if (Row.id.split('_')[1]!=undefined) {
				//SR17724 Expanded lines
				width=20;
				if (document.getElementById('THfld_'+Row._Form+'_'+fieldname.split('_')[1]) != null) { //TODO
					var width=document.getElementById('THfld_'+Row._Form+'_'+fieldname.split('_')[1]).clientWidth; //SR17724
					if (width=='') {
						var strWidth=document.getElementById('THfld_'+Row._Form+'_'+fieldname.split('_')[1]).style.width;
						strWidth=parseInt(strWidth);
						//if (strWidth!=0) strWidth=strWidth+1;
						if ((Row.id.split('_')[1]!=undefined)&&(strWidth!=0)) {strWidth=strWidth+1;}
						width=strWidth+'px';
						//width=document.getElementById('THfld_'+Row._Form+'_'+fieldname.split('_')[1]).style.width; //SR17724
					} else {
						width=width-1;   //SR17724
						if (isIE()||isCH()) width=width+2;
					}
				}
			//} else {
			//	if (document.getElementById('THfld_'+Row._Form+'_'+fieldname.split('_')[1]) != null) { //TODO
			//		var width=document.getElementById('THfld_'+Row._Form+'_'+fieldname.split('_')[1]).clientWidth; //SR17724
			//		if (width=='') {
			//			 width=document.getElementById('THfld_'+Row._Form+'_'+fieldname.split('_')[1]).style.width; //SR17724
			//		} else {
			//			width=width+1;   //SR17724
			//			if ((pblnLastKey)&&(isIE())) { width=width-1;}
			//		}
			//		if (!isIE()&&(width>0)) width=width-2; //SR17724.14
			//	}
			//}
		}
		//if (fieldname.indexOf('End_')>-1) alert('4='+fieldname);
		if (((parseInt(width)==0))&&(!isIE())) { //CORE-142  //SESDF-672.1 //SESDF-672.2
			cellStyle.display='none';
		}		
		if (parseInt(width)==0) { //CORE-142  //SESDF-672.1 //SESDF-672.2
			cellStyle.display.height='0px';
		}
		//if (fieldname.indexOf('End_')>-1) alert('5=width='+width);
		if (fieldname.indexOf('End_')<0) {
			cellStyle.width=width;  //SR17658
			if (newCell.id.indexOf('tdExCon')<0) cellStyle.maxWidth=width; //SR17724.14
		}
		if (height!='') {
			cellStyle.height=height+'pt'; //SR17724
		}
		Row.appendChild(newCell);
		if (parseInt(newCell.style.width)==0) { //IPIRANGA-125
			var obj=newCell.children[0];
			while (obj!=null) {
				if (obj.id==('BTN'+fieldname)) {
					obj.style.visibility='hidden';
				}
				obj=obj.nextSibling;
			}
		}
		if (!isIE()) { //CORE-142
			var obj=newCell.children[0];
			if (obj!=null) {			//CORE-142.2
				obj.style.width='1px';
				obj.style.width=(parseInt(newCell.style.width)-8)+'px'; //CORE-237
			}							//CORE-142.2
		}
		if (parseInt(width)==0) { //CORE-142  //SESDF-672.1 //SESDF-672.2  //SESDF-672.3
			newCell.className='TDhide'+getBrowser();
		}		
		return newCell;
	}
	function cgeExpandBodyFieldCell(objGridRow,fieldname,font,fontsize,bgColor,enabled,Header) {   // SR17597
		var newCell=document.createElement('TD');
		var cellStyle=newCell.style;
		var strFont=fontsize+'pt '+font;
		newCell.id='td'+fieldname;
		newCell.noWrap=true;
		newCell.Locked=enabled==0;
		if ((fontsize+'pt')!=objGridRow.style.fontSize) {
			cellStyle.fontSize=fontsize+'pt';
		}
		if (bgColor!='') { cellStyle.backgroundColor=bgColor; }
		cellStyle.width=objGridRow.Header.rows[0].cells[objGridRow.children.length].style.width;
		newCell.className='TDfld';
		newCell.attachEvent('onmousedown',cgeOnMouseDownEnabled);
		objGridRow.appendChild(newCell);
		return newCell;
	}	
	// ****************************************************************************
	function cgeOnMouseDownEnabled(event) {      //SR17413
		if (!event) event=window.event;
		var field = typeof(event) != 'undefined' ? findObjectTagName(event.srcElement,'TD') : null;
		if (field!=null) {  //IPIRANGA-104
			if (field.id.substr(0,7)!='tdExCon') {  //ignore yellow space on expanded lines.
				if (doGetMouseButton(event)=='LEFT') {			//SR17304
					if (field) activateField(field.id.substr(2));   //SR17253 //SR17325.1
				} else {
					if (field) moveFocus(field.id,1,1,1);			//SR17253 //SR17325.1
				}
			}
		}
	}
	function cgeOnMouseDownDisabled(event) {     //SR17414
		if (!event) event=window.event;
		moveFocus(findObjectTagName(event.srcElement,'TD').id,1,1,1);					//SR17253 //SR17325.1
	}
	// ****************************************************************************
	function createInput(pid,pvalue,ptype) {
		var objInput=document.createElement('INPUT');
		objInput.id=pid;
		objInput.value=pvalue;
		objInput.type=ptype;
		gridDIV.appendChild(objInput);
	}
	function setFocusGrid() {
		var retval=SetFocus('Grid');
		window.event.returnValue = false;
	    window.event.cancelBubble = true;
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
	function createDIV(pLeft,pTop) {
		var objDIV=document.createElement("DIV");
		objDIV.id='gridDIV';
		objDIV.className='gDIVsh';
		objDIV.style.top=pTop;
		objDIV.attachEvent('onfocusin',setFocusGrid) ;
		document.getElementById('xxx').appendChild(objDIV);
		createInput('activefield','','hidden');
		createInput('nextactivefield','','hidden');
		createInput('activegrid','','');
		createInput('sharedform',0,'hidden');
		createInput('focusfield','','hidden');
		createInput('test','','hidden');
	}
	// ****************************************************************************
	function cgeonclick() {
		cgeCancelDrag();											//SR17724.22
		if (event.srcElement.parentNode.id!='gridheadRow2') {		//SR17724.22
			//SR17724
			var strType=getParent(window.event.srcElement,'TH').parentNode.id.split('gridheadRow')[1]; //SR17724.2
			gridonclick(window.event,document.getElementById('gridhead'+strType),document.getElementById('gridbody'+strType),document.getElementById('gridbodyDIV'+strType));
		}
	}
	//function cgeonmousemove() { // JW SR11734 - added header null check. //SR17325.1
	function cgeonmousemove(event) { // JW SR11734 - added header null check. //SR17325.1
		if (!event) event=window.event;
		var header = findObjectTagName(event.srcElement,'TH'); //SR17325.1
		if (header != null) {  // set pointer type
			gridonmousemove(document.getElementById('gridhead'),event,document.getElementById('gridbody'),header);  //SR17253
		}
	}
	function cgeonmousedown(event,pidHeaderRow) {	//SR17325.1  //SR17224
		if (!event) event=window.event;
		if (event.srcElement.className!='THkey') {                  //SR17253 //SR17325.1
			cgeDragColumn(event);	//SR17253
		}
		gridStartColumnResize();  //SR17253	//SR17325.1
	}
	function cgeTest2(event) {			//SR17253  //SR17687
		var obj=findObjectTagName(event.srcElement,'TH');
		if (obj!=null) {
			var className=obj.className;
			if ((className=='THkey')||(className=='THfld')) {
				cgeonclick(event);		//SR17253
			}
		}
		event.cancelBubble=true;
	}
	var ShowAllLines=new Array(); //null;
	// ??				Changed to allow both selected and unselected
	function gridDeleteSelection(pintCol,areChecked) {
	 	var TBODY=document.getElementById('TBODY');	   //SR17253.2001-07-01
		//var intRows=gridbodyDIV.children[0].children[0].children.length;
		var intRows=TBODY.children.length;
		var i,attr;
		var intRemoved=0;
		var focusField=getFocusField();
		if (focusField!='') {
			var focusRow=getRowNum(focusField);
			var blnShowing=true;
		}
		for (i = intRows; i != 0 ; i--) {
			var row = TBODY.children[i-1];
			var rowNum = getRowNum(row.children[row.children.length-1].id);
			var cell = getCell(rowNum,pintCol);
			if (cell!=null) {
				//attr = cell.checked;
				//if (blnNotCheckBox) {
				//	attr = cell.value;
				//}
				//if (attr == pValue) {
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
		// If we are on a removed field, we must attempt to find a row above and then below (if we don't find one)
		// to focus on. 
		if (intRemoved!=intRows) {
			if (focusField=='') { // go to first cell
				// moveFocus(TBODY.children[0].children[1].id,1,0,1)
				moveFocusTop();
			} else if (!blnShowing) {
				moveFocus(38,0,0,'');
				if (getFocusField()==focusField) {
					moveFocus(40,0,0,'');
				}
			}
		} else if (intRows > 0) {
			//PreviousSelected=focusField;
			moveFocus('',1);
			setFocusField('');
		}
		if (ShowAllLines[pintCol]==null) {
			ShowAllLines[pintCol]=1;
		} else {
			ShowAllLines[pintCol]=null;
		}
	}
	function getRowNum(cellObj) {
		if (cellObj.indexOf('tdGridRow')>-1) {
			return cellObj.split('tdGridRow')[1];		//SR17306
		} else if (cellObj.indexOf('tdEnd_')>-1) {		//IPIRANGA-108
			return cellObj.split('tdEnd_')[1];			//IPIRANGA-162.4b
		} else if (cellObj=="") {						//IPIRANGA-162.4b
			return "";			//IPIRANGA-108
		} else {
			return cellObj.split("Y")[1].split("_")[0];
		}
	}
	function getColNum(cellObj) {
		return cellObj.split("_")[1];
	}
	function getCell(row,col) {
		return document.getElementById('Y'+row+'_'+col)
	}
	function getFocusField() {
		return document.getElementById('focusfield').value;
	}
	function setFocusField(val) {
		if ((val != '' || blnDrawDynTableOnNextFocus) && (typeof(DrawDynTable_GridFieldFocus) != 'undefined')) { // SR15351 vvv // SR15246
			if (val != '') { // SR15246
				var row = getRowNum(val),
					curFld = getFocusField(),
					curRow = curFld == '' ? '' : getRowNum(curFld);
			} else { // SR15246 vvv
				var row = '';
			} // SR15246 ^^^
			if (curRow == '' || curRow != row || blnDrawDynTableOnNextFocus) { // SR15246
				var retTemp = EventValue(YUCI,YUSER,YFORM,"FIX","COMGridEdit31ExtraFields","FIX","6",YFORM+'~'+val);
				DrawDynTable_GridFieldFocus(row);
				blnDrawDynTableOnNextFocus = false; // SR15246
			}
		} // SR15351 ^^^
		if (typeof(callChangeRow)!='undefined') {						//SR18026
			//NOTE: callChangeRow is optionally defined in COMGridEdit31Links
			if (val!='') {
				//SR18016
				var row1=getRowNum(val);
				var row0=-1;
				if (getFocusField()!='') row0=getRowNum(getFocusField());
				if (row0!=row1) {
					window.setTimeout(function() {callChangeRow(row1+'~'+val);},10);		//SR18026
				}
			}
		}  																//SR18026
		document.getElementById('focusfield').value=val;
	}
	function ChangeRow(val) { //SR18026
		var retTemp = EventValue(YUCI,YUSER,YFORM,'FIX','COMGridEdit31S','CHANGEROW','6',val);
		return val;
	}
	// This is necessary since not all cells have a width specified, 1 px dropped so
	// as to be less than col width otherwise wrapping will occur.
	// This is also rather dodgy, subtracting 1 pixel is sometimes enough to prevent
	// wrapping though not always. Don't know if 2 will always prevent wrapping.
	function getColWidth(intCol,domObj) {
		return (parseInt(parseFloat(document.getElementById('THfld'+intCol).style.width)*gridRatio())-2-domObj.children[1].offsetWidth);
	}
	function getCellWidth(domObj) { // <-- doing this instead of hardcoded as that can be error prone.
		var domParObj=findParentOf(domObj,'TD'),
		    width = 0;
		if (domParObj!=null) {
			if (domParObj.rowIndex==1 || domParObj.id.split('GridRow')[1]==1) {
				width = domObj.parentNode.offsetWidth;
			} else {
				width = domParObj.style.width;
			}
		}
		return width;
	}
	function findParentOf(domObj,strType) { // <-- Could extend this to look for objects with particular ids
		return (domObj.nodeName.toLowerCase()==strType?domObj:typeof(domObj.parentNode)=='object'?findParentOf(domObj.parentNode,strType):null);
	}
	function hideShowColumn(idCol,pHide,pForm) {
		var focusfield;
		var objTH=document.getElementById('THfld_'+pForm+'_'+idCol);
	 	var gridbody=document.getElementById('gridbody');	   //SR17253.2001-07-01
		var numRows=gridbody.rows.length;                      //SR17429
		var rowNo;
		var strClass;
		if (objTH!=null) {
			var objTHstyle = objTH.style;
		// If toggling Hide/Show state, save new state and then perform appropriate Hide/Show operations
			if (objTH.Hidden != pHide) {
				objTH.Hidden = pHide;
				if (pForm==YFORM) {    // SR17429 added
					if (numRows>0) {
						if (pHide) {
							strClass = 'TDhide'+getBrowser();
						} else {
							strClass = 'TDfld';
						}
						for (rowNo = numRows-1; rowNo >= 0 ; rowNo--) {
							gridbody.rows[rowNo].cells[objTH.cellIndex].className = strClass;
						}
					}
				}
				//SR17325.2 ^^^^
				if (pHide) {
					objTH.setAttribute('oldWidth',objTHstyle.width);
					if (pForm==YFORM) {
						objTH.oldInner = objTH.innerHTML;
						objTH.innerHTML = '';
					//	objTH.className = 'THhide';             // SR17377  //SR17377 display/visibility switch GRF
						objTH.className = 'THhide'+getBrowser();
						objTHstyle.width = 0;
					} else {
						objTHstyle.width=0;
						setWidth(objTH.cellIndex,0,'gridhead2');
					}
					focusfield = getFocusField();
					// Move the focus if hiding the currently focussed field
					if ((focusfield!='') && document.getElementById(focusfield).cellIndex == objTH.cellIndex) {
						moveFocus(39,0,0,'');
						if (getFocusField()==focusfield) {
							moveFocusLeft(37,0,0,'');
						}
					}
				} else {
					if (objTH.getAttribute('oldWidth')!=null) {
						if (pForm==YFORM) {
							//objTHstyle.width = objTH.style.oldWidth;
							objTHstyle.width = objTH.getAttribute('oldWidth');
							objTH.innerHTML = objTH.oldInner;
							objTH.className = 'THfld';          // SR17377
						} else {
							objTHstyle.width=objTH.getAttribute('oldWidth');
							setWidth(objTH.cellIndex,objTH.getAttribute('oldWidth'),'gridhead2');
						}
					}
				}
				if (pForm==YFORM) {   //SR17429
					if (numRows>0) {
						for (rowNo = numRows-1; rowNo >= 0 ; rowNo--) {
							with (gridbody.rows[rowNo].cells[objTH.cellIndex].style) {
								width = objTHstyle.width;
								maxWidth = objTHstyle.width;
								display = 'table-cell';
								if (pHide) {	//CORE-233.4
									border='none';
								} else {
									border='1px outset white';
								}
							}
						}
					}
				}
			}
		}
	//	syncGridWidths();    //SR17403 - removed
	}
	function SwitchReadOnly(pRow,pCol,pblnDisabled,pstrEnabled,pstrDisabled) {
		//TODO SR17630
		//SR17630 var field = document.getElementById('tdY'+pRow+'_'+pCol);
		var field = document.getElementById('tdY'+pRow+'_'+pCol); //SR17630 
		var fieldCheckbox = document.getElementById('tdY'+pRow+'_'+pCol+'_checkbox');
		field.Locked = pblnDisabled ? true : false;
		if (typeof(fieldCheckbox) != 'undefined' && fieldCheckbox != null) {
			fieldCheckbox.disabled = pblnDisabled ? true : false;
		}
		field.style.backgroundColor = field.Locked ? pstrDisabled : pstrEnabled;
		field.attachEvent('onmousedown',field.Locked?cgeOnMouseDownDisabled:cgeOnMouseDownEnabled);
	}
	function RedrawDynTable() { // SR15246
		window.setTimeout('blnDrawDynTableOnNextFocus = true; setFocusField(getFocusField());',CallBackDelay);
	}
	// SR15246 - Should use purge, however need to investigate as not working when
	//           quickly tested (subsequent d.innterHTML = ''; causes unknown js error)
	function RemoveChildren(d,pblnKillObject) {
		if (d != null && typeof(d) == 'object') {
			while (d.firstChild != null) {
				d.removeChild(d.firstChild);
			}
			if (pblnKillObject && d.parentNode != null) {
				d.parentNode.removeChild(d);
			}
		}
	}
	function purge(d) {
		if (typeof(d) == 'object' && d != null) {
			var a = d.attributes, i, l, n;
			if (a) {
				l = a.length;
				for (i = 0; i < l; i += 1) {
					n = a[i].name;
					if (typeof d[n] === 'function') {
						d[n] = null;
					}
				}
			}
			a = d.childNodes;
			if (a) {
				l = a.length;
				for (i = 0; i < l; i += 1) {
					purge(d.childNodes[i]);
				}
			}
		}
	}
	// Synchronize the width of the grid's header and body tables with the sum of the header's cells widths.
	function syncGridWidths() {
		if (navigator.userAgent.indexOf('MSIE') == -1) {
			document.getElementById('gridbody').style.width = document.getElementById('gridhead').offsetWidth+'px';
		}
	}
	function syncGridSize() { //SR18004
		syncGridWidths();
 		autoResize();		
	}
	//-->
	//</script>
	

//<script language="javascript">
//<!--
//Globals---------------------------------------------------
var YUSER;
var YUCI;
var YFORM;
var cgeDateFormat;
var cgeYGIF; //W3C
function InitGlobals(pYUSER,pYUCI,pYFORM,pDateFormat,pYGIF,pYBED) {
	YUSER=pYUSER;
	YUCI=pYUCI;
	YFORM=pYFORM;
	cgeDateFormat=pDateFormat;
	cgeYGIF=pYGIF;
	//W3C YBED=pYBED;  
}
//Globals---------------------------------------------------
function activateFieldNow(yfield,yhtml,yvalue,yadd,yform) {  //SR17630
		//TODO SR17630
		//alert('activateFieldNow='+yfield+'>'+yhtml);
	if (yadd == 1) {                                    //MEHRFACH-AUFRUF BEI ??BERLANGEM CODE (SELECT/MEMO)
		document.getElementById(getFieldId(yfield,yform)).innerHTML='';  //SR17630 //SR17673.2
		ycancel = null;
		for (yline=1 ; yline<=30 ; yline++) {
			loadSelectField(yfield,yline);
			if (ycancel == 1) break;
		}
		showSelectField(yfield,yvalue);
	} else {
		document.getElementById(getFieldId(yfield,yform)).innerHTML=unescape(yhtml);  //SR17630 //SR17673.2
		document.getElementById(yfield).value=unescape(yvalue);
		if (isIE()) {
			document.getElementById(yfield).focus();
		} else {
			setTimeout("setFocusGrid(); document.getElementById(yfield).focus();",0); //HEVA-884 
		}
		/*
		if (document.getElementById(yfield).type=='checkbox') {
			saveData(yfield,!document.getElementById(yfield).checked,'2','mouseclick');
		}
		*/
	}
}
function showSelectField(yfield,yvalue) {               //SPEICHERUNG
		//TODO SR17630
	yhtml = document.getElementById('td'+yfield).innerHTML;
	yhtml = yhtml.replace(/_ASCII60_/gi,'<');
	yhtml = yhtml.replace(/_ASCII62_/gi,'>');
	document.getElementById('td'+yfield).innerHTML = yhtml;
	document.getElementById(yfield).value=unescape(yvalue);
	document.getElementById(yfield).focus();
}
function getFieldId(yfield,yform) {
	//In the format yfield=Y1_30
	//if ((==1)&&(document.getElementById('THkey_Expand')!=undefined)) return yfield+':'+yform+':';  //SR17630
	return 'td'+yfield; //+'_'+yform; //SR17673.2
}
function inactivateField(yfield,yhtml,yform) {
	var oldfield=getFieldId(yfield,yform);  //SR17630
	var objField=document.getElementById(oldfield);
	objField.innerHTML=unescape(yhtml);
	document.getElementById('activefield').value='';
	ysaveevent=null;
	activateNextField();
}
function modalReturn(pidField,pstrValue,pidType) {
	if (pstrValue == null) {
		pstrValue = document.getElementById(pidField).value;
	}
	saveData(pidField,pstrValue,pidType,'calendar');
}
function saveData(yfield,yvalue,ytyp,yevent) {      //FELDVALIDIERUNG UND SPEICHERAUFRUF
		//TODO SR17630
	if (yevent=='calendar') ysaveevent=null;
	if (ysaveevent==null) {
    	if (yevent != '' && yevent != null) ysaveevent=yevent;
    	//alert(yfield);
		var Form=document.getElementById(getFieldId(yfield)).parentNode._Form; //SR17673.2
		retval = EventValue(YUCI,YUSER,Form,'FIXVALID'+ytyp,Form,yvalue,'0',yfield);
		//saveDataNow(yfield);
		retval = EventValue(YUCI,YUSER,Form,'FIX','COMGridEdit31S','','6',yfield);  //16344
	}
}
function saveDataNow(yfield) {               //SPEICHERUNG
		//TODO SR17630
	//alert('saveDataNow='+yfield);
	var objField=document.getElementById('td'+yfield);
	var Form=objField.parentNode._Form
	retval = EventValue(YUCI,YUSER,Form,'FIX','COMGridEdit31S','','6',yfield);
}
function activateField(yfield) {
		//TODO SR17630
	var objField;
	var objActive;
	var ff = document.getElementById('focusfield').value
	if (ff!='') document.getElementById(ff).parentNode.firstChild.style.fontWeight='normal';
	objField=document.getElementById('td'+yfield);
	if (objField!=null) {
		objField.parentNode.firstChild.style.fontWeight='bold';
		objActive=document.getElementById('activefield');
	//alert('activateField='+yfield+'.'+objActive.value+'.'+objActive);
		if (objActive.value != yfield) {
			document.getElementById('nextactivefield').value=yfield;
			//document.getElementById('nextactivecolor').value=ycolor;
		}
		if (objActive.value == '') {
			DoEventsHack();  //16344
			activateNextField();
		}
	}
}
function DoEventsHack() {
	var xColumns=window.createPopup();
	xColumns.show(0, 0, 0, 0);
	xColumns.hide();
}
function activateNextField() {
	yfield=document.getElementById('nextactivefield').value;
	document.getElementById('nextactivefield').value='';
	if (yfield!='') {
		//CORE-69 document.getElementById('gridDIV').focus();             // SR17410
		moveFocus('td'+yfield,1,1,1);
		var activeCell = document.getElementById('td'+yfield);
		//if (!activeCell.getAttribute("Locked") // enabled		//SR17xxx
		if (!activeCell.Locked // enabled
		&& (document.getElementById(yfield)==null)) {  // has no checkbox kid
			document.getElementById('activefield').value=yfield;
			yaddline=null;
			var Form=document.getElementById('td'+yfield).parentNode._Form
			yfield=yfield.split(':')[0]; //SR17630
			retval = EventValue(YUCI,YUSER,Form,'FIX','COMGridEdit31A','','6',yfield);
		}
	}
}
function loadSelectField(yfield,yline) {      //LADEN HTML SELECT CODE
		//TODO SR17630
	if (ycancel != 1) {
		var Form=document.getElementById('td'+yfield).parentNode._Form
		//alert(yfield);
		retval = EventValue(YUCI,YUSER,Form,'FIX','COMGridEdit31A',yline,'6',yfield);
		if (retval == '') {
		    ycancel=1;
		} else {
		    document.getElementById('td'+yfield).innerHTML+=unescape(retval);
		}
	}
}
function SetLineDefaults(strTextId) {
	var retval=EventValue(YUCI,YUSER,YFORM,'FIX','OnGetText^COMGridEdit31Events',strTextId,'6','');
	if (confirm(retval)) {
		retval=EventValue(YUCI,YUSER,YFORM,'FIX','OnSetLineDefaults^COMGridEdit31Events','','6','');
	}
}
function Trim(pstrValue) {
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
function GetToggleField() {
	var objField = 'YFINAPInvD1';
	if (document.getElementById(objField)==null) {
		objField = 'YFINAPVoucherD15';
	}
	return objField;
}
function ToggleHeader() {
	var lngHeight;
	var objField;
	var strType='';
	var blnCall;
	var objFieldSet;
	var strFunction='';
	var strField
	if (arguments.length>0) {
		objField=arguments[0];
		blnCall=false;
		strFunction="ToggleHeader^COMViewFilter"
		strField='+' + objField;
	} else {
		objField = GetToggleField();
		blnCall=true;
		strFunction="ToggleHeader^FINAPInv"
		strField='';
	}
	if (blnCall) {
		objFieldSet=findObjectTagName(document.all[objField],'FIELDSET');
	} else {
		objFieldSet=document.getElementById(objField);
	}
	if (objFieldSet!=null) {
		if (objFieldSet.style.display!='none') {
			lngHeight=objFieldSet.offsetHeight;
			objFieldSet.style.display='none';
			gridDIV.style.posHeight+=lngHeight;
			EventValue(YUCI,YUSER,YFORM,"ToggleHeader",strFunction,"none","6",gridDIV.style.posHeight + strField);
		} else {
			objFieldSet.style.display='block';
			lngHeight=objFieldSet.offsetHeight;
			gridDIV.style.posHeight-=lngHeight;
			EventValue(YUCI,YUSER,YFORM,"ToggleHeader",strFunction,"block","6",gridDIV.style.posHeight + strField);
		}
	}	
}
function SetGridHeight(pintHeight) {	
	var objField;
	var objFieldSet;
	var blnCall;
	if (arguments.length>1) {
		objField=arguments[1];
		blnCall=false;
	} else {
		objField = GetToggleField();
		blnCall=true;
	}
	if (blnCall) {
		objFieldSet=findObjectTagName(document.all[objField],'FIELDSET');
	} else {
		objFieldSet=document.getElementById(objField);
	}
	if (objFieldSet!=null) {
		objFieldSet.style.display='none';
		gridDIV.style.posHeight=pintHeight;
	}
}
function findObjectTagName(objElement,tagName) {
	var returnValue=null;
	if (objElement!=null) {
		if (objElement.tagName==tagName) {
			returnValue=objElement;
		} else {
	//SR17253 returnValue=findObjectTagName(objElement.parentElement,tagName);
			returnValue=findObjectTagName(objElement.parentNode,tagName);		//SR17253 
		}
	}
	return returnValue;
}
function gridView() {
	var gridbody=document.getElementById('gridbody');           //SR17244
	if (gridbody!=null) {                                       //SR17244
		if (gridbody.rows[0].children[2].offsetWidth==0) {
			gridbody.rows[0].children[2].style.width=100;
			gridhead.rows[0].children[2].style.width=100;
		} else {
			gridbody.rows[0].children[2].style.width=0;
			gridhead.rows[0].children[2].style.width=0;
		}
	}
}	
function getGridHeight(pintMaximumHeight,pblnIgnoreMaximumHeight) {
	var intScrollbarHeight;
	var intHeight;
	var gridbodyDIV=document.getElementById('gridbodyDIV');     //SR17244
	var gridbody=document.getElementById('gridbody');           //SR17244
	var gridhead=document.getElementById('gridhead');           //SR17724.24
	//BR014962
	intHeight=0;
	if ((gridbodyDIV!=null) && (gridbody!=null)) {               //SR16492,SR17244
		if ((gridbodyDIV.scrollWidth-gridbodyDIV.clientWidth)>0) {
			intScrollHeight=17;
		} else {
			intScrollHeight=0;
		}
		if (pblnIgnoreMaximumHeight) {
			intHeight=Math.max(gridbody.clientHeight+gridhead.clientHeight+39+intScrollHeight,150)
		} else {
			intHeight=Math.min(Math.max(gridbody.clientHeight+gridhead.clientHeight+39+intScrollHeight,150),pintMaximumHeight);
		}
	}
	return intHeight;
}
 	//-->
	//</script>
	
