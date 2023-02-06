/* Modified Date: 2014-03-28 09:15:30: */
/* Modified Language: 1742866665: */
//<script type='text/javascript'>
//<!--
if (2<2) {if (2<2) {if (2<2) {if (2<2) {if (2<2) x=1;}}}}  //hack
var CallBackTime=new Array();
var Columns=window.createPopup();
var Plan=window.createPopup();
var PopupWindow=window.createPopup();
var pos;
var size;
var CurrentColumn;
var CurrentRow=null;
var DragTimeOut=null;
var CallNow;
var CallBackDelay = 1;
var CurSearch;
var FirstFocus=null;
var KeyStrokeDelay=200;
var PrintWindow=null;
var GLOBALblnAllClicked=false;
var GLOBALblnMultiSelect;
var GLOBALstrFormName;
var GLOBALblnColSelect;		// SR16499
var GLOBALSliderMoving=false; //CORE-119
window.attachEvent('onload',HackSaveButton);
function HackSaveButton() {
	var objButton=document.getElementById('BUTTON_SEARCH');
	if (objButton!=null) {
	//SR17253 var objA=objButton.parentElement;
		var objA=objButton.parentNode;
		objA.onclick=null;
		objA.attachEvent('onclick',ShowSearch);
	}
} 
function ShowSearch(pEvent,pHeight,pblnReverse) {
	GLOBALSliderMoving=true; //CORE-119
	var Granulation=50;
	var objDIV=document.getElementById('objDIV');
	//alert(objDIV);
	//var bdyDiv=document.getElementById('bdyDiv');
	if (pHeight==null) {
		if (objDIV==null) {  //SR17253
			var value='';
			if (document.WWW.YFKEY!=null) {
				value=document.WWW.YFKEY.value;
			}
			CallBackNow('AfterDataFields^COMViewFilter',document.WWW.YFORM.value+',,'+value,1);
			objDIV=document.getElementById('objDIV');
		}
		//CORE-119 if ((objDIV!=null)&&(getBrowser()=='IE')) {
		//CORE-119 	//bdyDiv.style.setExpression('height','objDIV.offsetHeight-getPageOffsetTop(bdyDiv)-20','JScript');  //SR17469
		//CORE-119 	if (bdyDiv.style.setExpression!=undefined) {
		//CORE-119 		bdyDiv.style.setExpression('height','objDIV.offsetHeight-getPageOffsetTop(bdyDiv)-20','Javascript');  //SR17469 //17998
		//CORE-119 	} else {
		//CORE-119 		bdyDiv.style.height='150px'; //TODO find a standards compliant equivalent to setExpression
		//CORE-119 	}
		//CORE-119 }
	}
	if (objDIV!=null) {		//SR17253
		if (pHeight==null) {
			objDIV.style.overflow='hidden';				//SR17253
			document.getElementById('bdyDiv').style.overflow='hidden';	//SR17253
			if (objDIV.style.display=='none') {			//SR17253
				pHeight=Granulation; //CORE-276
				if (document.getElementById('menu')) objDIV.insertBefore(document.getElementById('menu'),objDIV.children[0]); //CORE-276
			} else {
				pHeight=BarHeight;
				pblnReverse=1
			}
		}
		objDIV.style.height=pHeight+'px';				//SR17253 //CORE-276
		if (pblnReverse==1) {
			if (pHeight<Granulation) {
				objDIV.style.display='none';		//SR17253
				document.getElementById('NOBR').insertBefore(document.getElementById('COOLBAR'),document.getElementById('NOBR').children[0]); //SR17998
				document.getElementById('NOBR').insertBefore(document.getElementById('FRAME_Header'),document.getElementById('NOBR').children[0]); //SR17998
				if (document.getElementById('menu')) {
					document.getElementById('MegaMenu').insertBefore(document.getElementById('menu'),document.getElementById('MegaMenu').children[0]); //CORE-276
				}
			}
			if (pHeight>0) {
				if (pHeight<Granulation) {
					pHeight=Granulation;
				}
				window.setTimeout('ShowSearch("",'+(pHeight-Granulation)+','+pblnReverse+')',2);
			}
			if (pHeight==0) GLOBALSliderMoving=false; //CORE-119
		} else {
			if (pHeight==Granulation) {
				objDIV.style.display='block';		//SR17253
			}
			if (pHeight<BarHeight) {
				if ((pHeight+Granulation)>BarHeight) {
					Granulation=BarHeight-pHeight
				}
				window.setTimeout('ShowSearch("",'+(pHeight+Granulation)+')',2);
			} else {
				if (bdyDiv.offsetTop) {  //resize result grid
					//bdyDiv.style.height = pHeight - bdyDiv.offsetTop - 50;  //SR17359  //SR17362???
				}
				bdyDiv.style.overflow='auto';
				objDIV.focus();							//SR17253
				if (FirstFocus!=null) {
					if (document.getElementById(FirstFocus)!=null) {
						document.getElementById(FirstFocus).focus();
					}
				}
				if ((typeof(GLOBALblnKeyStroke)!='undefined')&&(GLOBALblnKeyStroke==true)) { AddMore(1); }
				doBarResizeSetHeights(document.getElementById('objDIV').offsetHeight-25);  //SR17362
				GLOBALSliderMoving=false; //CORE-119
			}
		}
	}
	return false;
}
function CallBack(pstrExecute,pParam1,pParam2,pParam3,pParam4,pParam5,pParam6,pParam7,pParam8) {
	//pParam2=pParam2 ? pParam2+'' : '';
	//pParam1=pParam1 ? pParam1+'' : '';
	//alert(pParam2);
	if (CallNow!=1) {
		CallNow=1;
		var strExecute="CallBackNow('"+pstrExecute+"'"
		if (pParam1!=null) {
			strExecute+=",'"+pParam1;
			if (pParam2!=null) strExecute+="~"+pParam2;
			if (pParam3!=null) strExecute+="~"+pParam3;
			if (pParam4!=null) strExecute+="~"+pParam4;
			if (pParam5!=null) strExecute+="~"+pParam5;
			if (pParam6!=null) strExecute+="~"+pParam6;
			if (pParam7!=null) strExecute+="~"+pParam7;
			if (pParam8!=null) strExecute+="~"+pParam8;
			strExecute+="'";
		}
		strExecute+=")";
		ShowLoading(1);
		window.setTimeout(strExecute,CallBackDelay);
	}
}
function CallBackNow(pstrExecute,pParam1,pParam2,pParam3,pParam4,pParam5,pParam6,pParam7,pParam8) {
	if (document.getElementById('YUCI')!=undefined) { //CORE-373: We might be on the WWWINFO form where YUCI doesn't exist.
		var EventTime=new Date();
		var strParams='#NoParam#';
		if (pParam1!=null) strParams=pParam1;
		if (pParam2!=null) strParams+="~"+pParam2;
		if (pParam3!=null) strParams+="~"+pParam3;
		if (pParam4!=null) strParams+="~"+pParam4;	
	 	if (pParam5!=null) strParams+="~"+pParam5;
		if (pParam6!=null) strParams+="~"+pParam6;
		if (pParam7!=null) strParams+="~"+pParam7;
		if (pParam8!=null) strParams+="~"+pParam8;
		CallBackTime.Current=CallBackTime.length;
		CallBackTime[CallBackTime.Current-5]=null;
		CallBackTime[CallBackTime.Current] = {
			Execute : pstrExecute+'('+strParams+')',
			Time : '',
			Line : new Array(),
			LineTime : new Array()
		}
		EventValue(document.WWW.YUCI.value,document.WWW.YUSER.value,document.WWW.YFORM.value,"Start","CallBack^COMViewUtils",pstrExecute,"6",strParams);
		ShowLoading(0);
		CallNow=null;
		var TimeNow=new Date();
		if (isNaN((TimeNow-EventTime)/1000)==false) {
			CallBackTime[CallBackTime.Current].Time=((TimeNow-EventTime)/1000);
		}
	}
}
function HTTPRequest(request) {
   var httpRequest,
       blnUseGetMethod,
       data = '';
   if (arguments.length == 3) {
      blnUseGetMethod = arguments[2];
   } else {
      blnUseGetMethod = true;
   }
   if (arguments.length > 1) data = arguments[1];
   httpRequest = cspFindXMLHttp();
   if (httpRequest == null) {
      alert('Unable to locate XMLHttpObject.');
   } else {
      try {
         if (blnUseGetMethod) {
            if (data != '') request += '?' + data;
            httpRequest.open('GET', request, false);
            httpRequest.send();
         } else {
            httpRequest.open('POST', request, false);
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            httpRequest.send(cspEncodeUTF8(data));
         }
         return httpRequest.responseText;
      } catch (e) { alert(e)}
   }
   return null;
}
function ClearRows(GridBody) {
	while (GridBody.rows.length!=0) {GridBody.deleteRow(0);}
	GridBody.Finished=false;
}
function Add(GridBody,Row,Cells,Key,Align,Short,Group) {
	var Data,objCell
	var arrCells=Cells.split('~');
	var arrAlign=Align.split('~');
	var arrShort=Short.split('~');
	var objRow = document.createElement('tr');
	objRow.attachEvent("onclick",GridClick);
	objRow.attachEvent("onmouseover",SelectRow);
	objRow.attachEvent("onmouseout",RowMouseOut);
	objRow.Row=Row;
	objRow._clicked=GLOBALblnAllClicked;
	objRow.id='bdy'+Row;
	objRow.Key=Key;
	if (Row==1) {
		if (!GLOBALblnColSelect) {
			objRow.className = 'row-selected';
		} else {
			objRow.className = 'row-light';
		}
		CurrentRow=1;
	} else {
		if (!GLOBALblnAllClicked) {
			objRow.className = (Row%2==1) ? 'row-light':'row-dark';
		} else {
			if (!GLOBALblnColSelect) {
				objRow.className='row-clicked';
			}
		}
	}
	for (var i=0;i<arrCells.length;i++) {
		objCell = document.createElement('td');
		Data=arrCells[i];
		if (arrCells.length==1) {objCell.colSpan=document.getElementById('hdr').cells.length;}
		if (Data=='') {Data=' ';}
		if (Data==' ') {Data=' ';}
		//SR17620 objCell.innerHTML='<div name="bdy_all_' + i + '" style="overflow: hidden; width:' + document.getElementById('hdr').cells[i].style.width + '">' + Data + '</div>';  //SR17345
		objCell.innerHTML=Data; //SR17620
		objCell.style.textAlign=arrAlign[i];
		objCell.id='bdy'+Row+"_"+i;
		//objCell.style.border='1px solid black';
		objCell.style.padding='0px';														 //SR17253
		//objCell.style.display='table-cell';													 //SR17238
		//if (navigator.userAgent.indexOf('MSIE') == -1) objCell.style.display='-moz-deck';						 //SR17238  //SR17361
		objCell.style.overflow='hidden';				 //SR17238 ;SR17620
		//objCell.style.tableLayout='fixed';													 //SR17238
		if (Row==1) objCell.style.width=document.getElementById('hdr').cells[i].style.width; //SR17253
		objRow.appendChild(objCell);
		if (arrShort[i]=='1') {
			objCell.attachEvent("oncontextmenu",CompleteTextOption);
		} else {
			objCell.attachEvent("oncontextmenu",DefaultOption);
		}
		objCell.attachEvent("onmouseover",SelectCol);	// SR16499
		objCell.attachEvent("onmouseout",ColMouseOut);	// SR16499
		objCell.title='Clique com o botão direito para ver as opções disponíveis';  // "Right click cell to view available options"
	}
	if (Group!=null) {
	//	document.getElementById('bdy_'+Group).insertAdjacentElement("AfterEnd",objRow)    // SR17321
		doInsertAdjacentElement(document.getElementById('bdy_'+Group),'AfterEnd',objRow);
	} else {
		GridBody.appendChild(objRow);
	}
}
function DefaultOption() {
	return CellContextMenu(1);
}
function CompleteTextOption() {
	return CellContextMenu(2);
}
function FindCell(pElement,pstrNamePrefix) {
	if (pElement.id.substring(0,3)==pstrNamePrefix) {
		return pElement;
	} else {
		pElement=FindCell(pElement.parentNode,pstrNamePrefix);
	}
	return pElement;
}
function CellContextMenu(pintFlag) {
	var element=FindCell(event.srcElement,'bdy');
	var result=true;
	var idField=hdr.cells[element.id.split('_')[1]].Field;
	var Key=eval(element.parentNode.id+'.Key');
	if (DragTimeOut!=null) {
		window.clearTimeout(DragTimeOut);
		DragTimeOut=null;
	}
	CallBack("Show^COMViewColumnMenu",Key,idField,pintFlag,element.id);
 	showPopup('Columns',200); //SR17445.1
	//SR17445.1 Columns.show(event.screenX,event.screenY,200,120);
	//SR17445.1 window.setTimeout('Columns.show('+(event.pageX ? event.pageX : event.screenX)+','+(event.pageY ? event.pageY : event.screenY)+',200,Columns.document.body.children[0].offsetHeight);',1);  //SR17389
	event.returnValue=false;  //SR17253
	event.cancelBubble=true
	result=false;
	return result;
}
function showPopup(pPopup,pWidth,pHeight) { //SR17445.1
	if (pHeight==null) pHeight='(Columns.document.body.children[0].rows ? Columns.document.body.children[0].rows.length*25:-1)';
	window.setTimeout(pPopup+'.show('+(event.pageX ? event.pageX : event.screenX)+','+(event.pageY ? event.pageY : event.screenY)+','+pWidth+','+pHeight+');',1);  //SR17389 //SR17445.1
}
function AddMore(plngInitial) {
	//plngInitial:
	// '': Add More if scrolled to bottom
	// 1 : Add More if Not hit bottom yet
	// 2 : Add More no matter what
	// 3 : Add All no matter what
	var obj=document.getElementById('bdyDiv');
	var lngSize=obj.scrollTop+obj.clientHeight-obj.scrollHeight;
	//SR17747 if ((lngSize==0)||((lngSize>0)&&(plngInitial==1))||(plngInitial==2)||(plngInitial==3)) {
	if ((lngSize>-2)||((lngSize>0)&&(plngInitial==1))||(plngInitial==2)||(plngInitial==3)) {
		if (document.getElementById('bdy').Finished!=true) {
			var Rows=document.getElementById('bdy').rows.length
			var blnLoadAll = (plngInitial==3) ? 1 : 0;
			CallBackNow("DisplayGrid^COMViewFilter",Rows,blnLoadAll);
		}
	}
	document.getElementById('hdrDiv').scrollLeft=obj.scrollLeft;	
}
function RowEvent() {
	var KeyCode=event.keyCode;
	var Status=true;
	if (event.srcElement.type!='select-one') {			//SR17253
		if (document.getElementById('bdy').rows.length>0) {
			CurrentRow = (CurrentRow!=null) ? CurrentRow :1;
			Status=false;
			var objCurrent=document.getElementById("bdy"+CurrentRow);
			if (KeyCode == 13) {  //Enter
				//SubmitQuery();
				//GridClick('',objCurrent.Key);
			} else if (KeyCode==33) {  //Page Up
			    if (CurrentRow>10) {
				    SelectRow('',CurrentRow-10);
			    } else {
				    SelectRow('',1);
			    }
			} else if (KeyCode==34) {  //Page Down
				if (CurrentRow>bdy.rows.length-10) AddMore(2);
				if ((CurrentRow+10) > bdy.rows.length) {
					SelectRow('',bdy.rows.length);
				} else {
					SelectRow('',CurrentRow+10);
				}
			} else if (KeyCode==35) {  //End
				AddMore(2);
				SelectRow('',bdy.rows.length);
			} else if (KeyCode==36) {  //Home
				SelectRow('',1);
			} else if (KeyCode==38) {  //Up
				if (CurrentRow>1) SelectRow('',CurrentRow-1);
			} else if (KeyCode==40) {  //Down
				if (CurrentRow==bdy.rows.length) AddMore(2);
				if (CurrentRow<(bdy.rows.length)) SelectRow('',CurrentRow+1);
			} else if (KeyCode==120) {  //Search show/hide/F9
				//document.WWW.YOPEN.value="SAVESEAR"; SAVENOW();
				ShowSearch();
			} else {
				Status=true;
			}
		}
	}
	if (Status==false) {
		event.returnvalue=false;
		event.cancelBubble=true;
	}
	return Status;
}
function SelectCol(pEvent,pNewCol) {		//SR16499
	if (GLOBALblnColSelect) {
		//var element=FindCell(pEvent.srcElement,'bdy');
		var element=FindCell(window.event.srcElement,'bdy');	//SR17253
		element.className='column-clicked'
		//var idField=hdr.cells[element.id.split('_')[1]].Field;
	}
}
function SelectRow(pEvent,pNewRow) {								//SR17253
	if (!GLOBALblnColSelect) {		//SR16499
		if (pNewRow==null) {
			var objRow=findObjectForTag(window.event.srcElement,'TR');
			if (objRow!=null) {
				pNewRow=objRow.Row;
			}
		}
		if (pNewRow!=null) {
			CurrentRow = (CurrentRow!=null) ? CurrentRow :1;
			var objRow=document.getElementById("bdy"+CurrentRow);
			var bdyDiv=document.getElementById('bdyDiv');					//SR17253
			var blnClicked=(objRow._clicked)&&(GLOBALblnMultiSelect);
			if (blnClicked) {
				objRow.className = 'row-clicked';
			} else {
				objRow.className= (CurrentRow%2==1) ? 'row-light':'row-dark';
			}
			CurrentRow=pNewRow;
			var objRow=document.getElementById("bdy"+pNewRow);
			blnClicked=objRow._clicked
			if (blnClicked) {
				objRow.className='row-clicked-selected';
			} else {
				objRow.className= 'row-selected';
			}
			if ((objRow.offsetTop+objRow.offsetHeight)>bdyDiv.clientHeight+bdyDiv.scrollTop) {
				bdyDiv.scrollTop=objRow.offsetTop+objRow.offsetHeight-bdyDiv.clientHeight;
			} else if (objRow.offsetTop<bdyDiv.scrollTop) {
				bdyDiv.scrollTop=objRow.offsetTop;
			}		
		}
	}
}
function GridClick(pEvent,pKey) {			//SR17253
	var objRow,objCell						//SR17409
	if (pKey==null) {
		objRow=findObjectForTag(event.srcElement,'TR');
		if (objRow!=null) {
			pKey=objRow.Key;
		}
	}
	var Back='';
	if (document.WWW.YBACK!=null) {
		Back=document.WWW.YBACK.value;
	}
	var blnOk = (GLOBALblnMultiSelect)&&(!GLOBALblnColSelect)		//SR16499
	//if (GLOBALblnMultiSelect) {
	if (blnOk) {
		objRow=event.srcElement.parentNode;
		objRow._clicked=true;
		objRow.className='row-clicked-selected';
	}
	objCell=findObjectForTag(event.srcElement,'TD');				//SR17409
	var idField=objCell.id.split('_')[1];							//SR17409
	if (document.WWW.YFORM.value=='COMViewSearch') {
		CallBack("GridClick^COMViewFilter",pKey,Back,0,idField,1);		//SR17580
	} else {
		CallBack("GridClick^COMViewFilter",pKey,Back,0,idField,0);		//SR17580
	}
}
function SelectAll() {
	var objTable=document.getElementById('bdy');
	var objRow;
	GLOBALblnAllClicked=true;
	for (var i=0;i<objTable.rows.length;i++) {
		objRow=objTable.rows[i];
		objRow._clicked=true;
		objRow.className='row-clicked';
	}
	window.opener.CallBack('CallBack^COMViewCustom',"",1);
}
function SearchSetFocus(event) {
	if (!event) event=window.event;
	if (event.type=="click") {
		var strType=event.srcElement.type;
		if ((strType!='select-one')&&(strType!='radio')&&(strType!='text')) {
			var FocusSet=false;
			if (FirstFocus!=null) {
				if (document.getElementById(FirstFocus)!=null) {
					//document.getElementById(FirstFocus).focus();
					FocusSet=true;
				}
			}
			if (FocusSet==false) {
				//objDIV.focus();
			}
		}
	} else if (event.type=="focus") {
		FirstFocus=event.srcElement.id;		//SR17253
	} else if (event.type=="load") {
				//alert(FirstFocus);
		if (FirstFocus!=null) {
			if (document.getElementById(FirstFocus)!=null) {
				document.getElementById(FirstFocus).focus();
				if (typeof(document.getElementById(FirstFocus).select)!="undefined") {
					document.getElementById(FirstFocus).select();
				}
				FocusSet=true;
			}
		}
	}
}
function RowMouseOut() {
	var objRow=findObjectForTag(event.srcElement,'TR');
	if ((objRow!=null)&&(objRow.Row!=CurrentRow)) {
		objRow.className = (objRow.Row%2==1) ? 'row-light':'row-dark';
	}
}
function ColMouseOut() {	//SR16499
	if (GLOBALblnColSelect) {
		var objRow=findObjectForTag(event.srcElement,'TR');
		var objCol=FindCell(event.srcElement,'bdy');
		objCol.className = (objRow.Row%2==1) ? 'row-light':'row-dark';
	}
}
//function ControlBlur() { //SR16521  //16708 - Redundant
// 	var el = event.srcElement;
// 	var value = el.value;
// 	if (event.type == 'paste') {
//	 	value = clipboardData.getData('Text');
//	 	el.value = value;
//	}
//    if (TimeOut!=null) { //SR16521
//	    window.clearTimeout(TimeOut);
//	    TimeOut=null;
//	}
// 	CallBackNow('ControlBlur^COMViewFilterControl', el.id, value);
// 	return true;
//}
// -->
//</script>
 

//<script type='text/javascript'><!--
if (2<2) {if (2<2) {if (2<2) {if (2<2) {if (2<2) x=1;}}}}  //hack
//----------------------------------
//Field Chooser functions
// 04-May-2010	shobby	SR17253: W3C standards.
//----------------------------------
function ChooseShow() {
	if (DragTimeOut==null) {
		var fldChooseBar=document.getElementById('fldChooseBar');		//SR17253
		var fldChoose   =document.getElementById('fldChoose');	    	//SR17253
	//	if (fldChooseBar.innerHTML==4) {       //currently hidden
		if (fldChoose.style.display=='none') { //currently hidden
			if (fldChoose.innerHTML=='') {
				 CallBackNow("Show^COMViewChoose");
			}
		//	fldChoose.style.display='inline';
			doSetDisplay(fldChoose,'inline');			//SR17253
	//SR17293 fldChooseBar.innerHTML='3';
			fldChooseBar.innerHTML='&#'+'x25C4;';				//SR17293 (Left Arrow)		
			fldChooseBar.style.cursor='col-resize';
			fldChooseBar.attachEvent("onmousedown",ChooseResizeStart);
		} else {
			fldChoose.style.display='none';		
			fldChooseBar.style.cursor='';	
	//SR17293 fldChooseBar.innerHTML='4';
			fldChooseBar.innerHTML='&#'+'x25BA;';				//SR17293 (Right Arrow)			
			fldChooseBar.detachEvent("onmousedown",ChooseResizeStart);
		}
		doBarResizeSetHeights(document.getElementById('objDIV').offsetHeight-25);  //SR17430
	}
	DragTimeOut=null;
}
function ChooseHighLight() {
	document.getElementById('fldChooseBar').style.color='steelblue';
}
function ChooseNormal() {
	document.getElementById('fldChooseBar').style.color='';
}
function ChooseResizeStart() {		//SR17253
	DragTimeOut=null;
	CurrentColumn=event.srcElement.parentNode.cellIndex;
	var el=document.getElementById('fldChooseBar');
	pos = event.clientX;
	size = document.getElementById('fldChoose').offsetWidth;
	el.setCapture();	//SR17354
	el.attachEvent("onmousemove", ChooseResize);
	el.attachEvent("onmouseup", ChooseResizeEnd);
	el.attachEvent("onlosecapture", ChooseLoseCapture);		//SR17354
	el = null;
}
function ChooseLoseCapture() { //SR17354
	ChooseResizeEnd();
}
function ChooseResize() {
	if (event.clientX!=pos) {
		DragTimeOut=1;
	}
	var sz = size + event.clientX - pos;
	sz = sz < 100 ? 100 : sz;
	document.getElementById('fldChoose').style.width = sz+'px';			//SR17253
}
function ChooseResizeEnd() {
	DragTimeOut=null;
	var el=document.getElementById('fldChooseBar');
	el.detachEvent("onmousemove", ChooseResize);
	el.detachEvent("onmouseup", ChooseResizeEnd);
	el.detachEvent("onlosecapture", ChooseLoseCapture);				//SR17354
	el.releaseCapture();
	ChooseResize();	
											//SR17253
	var width = size + event.clientX - pos;
	if (width < 100) {width = 100}
	document.getElementById('fldChoose').style.width = width;
	CallBack("SetWidth^COMViewChoose",width);
	el = null;
}
function AddChooseField(ChooserBody,pidField,pstrDesc,pstrRelation,pblnDrag) {
	var objRow=document.createElement('tr');ChooserBody.appendChild(objRow);
	if (pblnDrag==1) {
		objRow.attachEvent("onmousedown",ChooseField);
	}
	//SR17477 if (ChooserBody.id!='1ChooserSub3Field') {
	objRow.attachEvent("onmousedown",ChooseFieldSelect);
	//SR17477 }
	var objCell=document.createElement('td');objRow.appendChild(objCell);
	objCell.innerHTML=pstrDesc;
	if (pstrRelation!='') { objCell.title = pstrRelation; }
	objCell.style.fontSize=12;
	objCell.style.border='1px outset';
	objCell.Field=pidField;
	objCell.id=ChooserBody.id+"_"+objRow.rowIndex;
	objCell.attachEvent("ondragstart",ChooseFieldDragStart);
	objCell.draggable=true;		//SR17361
	objCell.Relation=pstrRelation;
	if (pblnDrag!=1) {objCell.unselectable='on'; }
}
function ChooseField() {
	var objCell=event.srcElement;
	posX = event.clientX;
	sizeX=getPageOffsetLeft(objCell);
	posY = event.clientY;
	sizeY=getPageOffsetTop(objCell);
	if (getBrowser()=='IE') DragTimeOut=window.setTimeout(objCell.id+'.dragDrop();',1);  //SR17361.1
}
function ChooseFieldDragStart() {
	detachAllEvents();											//HEVA-1077
	event.dataTransfer.effectAllowed='copy';					//SR17358
	event.dataTransfer.setData("Text",event.srcElement.Field);  //SR17358
	document.getElementById('hdrDiv').attachEvent('ondragover',ChooseFieldDragOver1);
	document.getElementById('hdrDiv').attachEvent('ondragenter',ChooseFieldDragEnter1);
	document.getElementById('hdrDiv').attachEvent('ondrop',ChooseFieldDragEnd1);
	document.getElementById('ctrl').attachEvent('ondragover',ChooseFieldDragOver2);
	document.getElementById('ctrl').attachEvent('ondragenter',ChooseFieldDragEnter2);
	document.getElementById('ctrl').attachEvent('ondrop',ChooseFieldDragEnd2);
    document.getElementById('bdy').attachEvent('ondragover',ChooseFieldDragOver3);
	document.getElementById('bdy').attachEvent('ondragenter',ChooseFieldDragEnter3);
	document.getElementById('bdy').attachEvent('ondrop',ChooseFieldDragEnd3);
	document.attachEvent('ondragend',ChooseFieldDragEnd4);
}
function ChooseFieldDragOver1() { ChooseFieldDrag() }		//SR17361
function ChooseFieldDragEnter1() { ChooseFieldDrag() }		//SR17361
function ChooseFieldDragEnd1() { ChooseFieldEnd() }			//SR17361
function ChooseFieldDragOver2() { ChooseFieldDrag() }		//SR17361
function ChooseFieldDragEnter2() { ChooseFieldDrag() }		//SR17361
function ChooseFieldDragEnd2() { ChooseFieldEnd() }			//SR17361
function ChooseFieldDragOver3() { ChooseFieldDrag() }		//SR17361
function ChooseFieldDragEnter3() { ChooseFieldDrag() }		//SR17361
function ChooseFieldDragEnd3() { ChooseFieldEnd() }			//SR17361
function ChooseFieldDragEnd4() { detachAllEvents() }		//SR17361
function ChooseFieldDrag() {
	event.dataTransfer.dropEffect='copy';
	event.returnValue=false;
}
function SelectRegionSize(pstr) { //CORE-119
	if (GLOBALSliderMoving==false) {
		if (document.getElementById('FRAME_Header')!=null) {  //No FRAME_Header means it's a popup window so ignore
			if (document.getElementById('objDIV').getAttribute('InForm')!=1) { //Ignore if Inform
				var objDIVHeight = document.getElementById('objDIV').offsetHeight;
				var bdyDIVHeight = document.getElementById('bdyDiv').offsetHeight;
				var bdyDIVTop    = document.getElementById('bdyDiv').offsetTop;
				sz=objDIVHeight-bdyDIVTop-19;
				if (!(document.getElementById('searchbar') && document.getElementById('searchbar').style.display!='none')) {  //CORE-215
					sz=sz+17;			  //SR17898																	  //CORE-215
				}																											  //CORE-215
					//alert(sz+':'+objDIVHeight);
				if (sz<30) {
					BarHeight=objDIVHeight+(30-sz);  //SR17362
					document.getElementById('objDIV').style.height=BarHeight+'px';
					sz=30;
					CallBackNow("SetSearchHeight^COMView",BarHeight);
				}
				document.getElementById('bdyDiv').style.height = sz+'px';
			}
		}
	}
	return true;
} 
function ChooseFieldEnd() { //CORE-119
	// User has dropped a field from the Chooser.
	var Field=event.dataTransfer.getData('Text');
	var idElem = event.srcElement.parentNode.id   //SR17361
	// Set status if later on we will submit (see Select^COMViewChoose)
	if (GLOBALblnKeyStroke || (-1==idElem.search(/(select|comp|value|ctrl)/))) {
		Searching();
	}
	CallBackNow("Select^COMViewChoose",Field,idElem);
	SelectRegionSize();  //CORE-119
	detachAllEvents(); //SR17361
	window.event.returnValue=false; //SR17768
}
function detachAllEvents() { //SR17361
	document.getElementById('hdrDiv').detachEvent('ondragover',ChooseFieldDragOver1);
	document.getElementById('hdrDiv').detachEvent('ondragenter',ChooseFieldDragEnter1);
	document.getElementById('hdrDiv').detachEvent('ondrop',ChooseFieldDragEnd1);
	document.getElementById('ctrl').detachEvent('ondragover',ChooseFieldDragOver2);
	document.getElementById('ctrl').detachEvent('ondragenter',ChooseFieldDragEnter2);
	document.getElementById('ctrl').detachEvent('ondrop',ChooseFieldDragEnd2);
    document.getElementById('bdy').detachEvent('ondragover',ChooseFieldDragOver3);
	document.getElementById('bdy').detachEvent('ondragenter',ChooseFieldDragEnter3);
	document.getElementById('bdy').detachEvent('ondrop',ChooseFieldDragEnd3);
	document.detachEvent('ondragend',ChooseFieldDragEnd4);
	event.cancelBubble=true;	//SR17367
}
function ChooseFieldSelect() {
	var objCell=event.srcElement;
	var Level=parseInt(objCell.id.split('ChooserSub')[1])+1;
	var Chooser=document.getElementById(objCell.id.split('_')[0]);
	var Current=ChooserCurrentRow(Chooser);
	if (Current!=objCell.parentNode.rowIndex) {
		if (Current!=null) {
			Chooser.rows[Current].Selected=null;
			Chooser.rows[Current].cells[0].style.border='1px outset';
		}
		objCell.parentNode.Selected=1;
		objCell.style.border='1px inset';
		document.getElementById('ChooserSub'+Level).innerHTML='';
		if (objCell.Relation!='') {
			CallBack('LoadSubClass^COMViewChoose',objCell.Relation,objCell.Field,Level);
		}
	}
}
function ChooserCurrentRow(Chooser) {
	var Current=null;
	for (var i=0;i!=Chooser.rows.length;i++) {
		if (Chooser.rows[i].Selected!=null) {
			Current=i;
		}
	}
	return Current;
}
function ChooserClassChanged() {
	CallBack('LoadChooserType^COMViewChoose',document.getElementById('ChooserClass').value,0);
}
function ChooserTypeChanged() {
	ChooserSub1.innerHTML='';
	CallBack('LoadFields^COMViewChoose','',document.getElementById('ChooserType').value,"ChooserSub0Field",0);
}
function ChooserSubTypeChanged(pintLevel) {  //SR17477
	var CSF='ChooserSub'+(pintLevel-1)+'Field';
	document.getElementById('ChooserSub'+(pintLevel+1)).innerHTML='';
	CallBack('LoadFields^COMViewChoose',
		document.getElementById(CSF).rows[ChooserCurrentRow(document.getElementById(CSF))].cells[0].Relation,
		document.getElementById('ChooserSub'+pintLevel+'Type').value,
		"ChooserSub"+pintLevel+"Field",
		pintLevel);
}
// -->
//</script>
 

//<script type='text/javascript'><!--
if (2<2) {if (2<2) {if (2<2) {if (2<2) {if (2<2) x=1;}}}}  //hack
//----------------------------------
//Header/Column Specific functions
//----------------------------------
function ShowHeaderColumn() {
	if (DragTimeOut!=null) {
		window.clearTimeout(DragTimeOut);
		DragTimeOut=null;
	}
	CallBackNow("Show^COMViewColumnMenu","",event.srcElement.Field);  //SR17253
	//Columns.show(event.screenX,event.screenY,200,120);
	Columns.show((event.pageX ? event.pageX : event.screenX), (event.pageY ?event.pageY : event.screenY), 200, -1);  //SR17253
	//window.setTimeout('Columns.show('+event.screenX+','+event.screenY+',200,Columns.document.body.children[0].offsetHeight);',50);
	window.setTimeout('Columns.show('+(event.pageX ? event.pageX : event.screenX)+','+(event.pageY ?event.pageY : event.screenY)+',200,Columns.document.body.children[0].offsetHeight);',50);  //SR17253
	window.event.returnValue=false;
	window.event.cancelBubble=true;
	return false;
}
function ColumnClick(Row) {
	Searching();				//SR14763
	CallBack("SelectColumn^COMViewFilterColumn",Row);
	return false;
}
function SortColumn(event,pField,pDirection) { //SR17388
	if (DragTimeOut!=null) {
		Searching();				//SR14763
		window.clearTimeout(DragTimeOut);
		DragTimeOut=null;
	}
	if (pField==null) { pField=window.event.srcElement.Field;}		//SR17253
	CallBack("SortColumn^COMViewFilterColumn",pField,pDirection);
}
function ColumnName(pField) {
	if (pField==null) { pField=event.srcElement.Field;}	//SR17025
	CallBack("ColumnName^COMViewFilterColumn",pField);
}
function ClearCol() {
	var hdr=document.getElementById('hdr');						//SR17253
	var hdrbdy=document.getElementById('hdrbdy');				//SR17253
	while (hdr.cells.length>0) {hdr.deleteCell(0);}
	while (hdrbdy.cells.length>0) {hdrbdy.deleteCell(0);}
}
function AddCol(GridHead,Text,Width,SortDirection,ColNumber,pstrTitle) {
	Width= Width ? Width : 120;
	SortDirection = SortDirection ? SortDirection : '';
	var objHdr = document.createElement('th');
	objHdr.className='head';
 	objHdr.style.width=Width+'px';
 	objHdr.id='head'+ColNumber;
 	objHdr.Field=ColNumber;
 	objHdr.unselectable='on';
 		objHdr.innerHTML=Text;					//SR17328
 	objHdr.title=pstrTitle;
 	objHdr.style.border='1px outset white';			//SR17253 (to be removed?) //SR17328
 	objHdr.style.padding='0px';						//SR17253
 	objHdr.style.cssFloat='left';					//SR17328
 	//var display='inline-block';
 	var objResize = document.createElement('div');
	objResize.className = 'resize';
	objResize.style.right='-6px';					//SR17328
	objResize.style.width='10px';
	//objResize.innerHTML = ' ';				//SR17328
	objResize.style.cssFloat='right';				//SR17328
	objResize.style.position='absolute';			//SR17328
	objResize.style.height='200px';
	objResize.style.overflowx='auto';
	objHdr.appendChild(objResize);
	var SortClass='sort';
	if (SortDirection==1) {SortClass='sort-ascending';}
	if (SortDirection==-1) {SortClass='sort-descending';}
	var objSort = document.createElement('span');
	objSort.className=SortClass;
	objSort.Field=ColNumber;
	objHdr.appendChild(objSort);
	if (ColNumber!='') {
		objHdr.attachEvent("onclick",SortColumn);
 		objHdr.attachEvent("onmousedown",DragColumn);
 		objResize.attachEvent("onmousedown",startColumnResize); 
	}
 	GridHead.appendChild(objHdr);
 	var objHdr = document.createElement('th');
 	objHdr.style.width=Width;
 	objHdr.innerHTML=Text;
 	document.getElementById('hdrbdy').appendChild(objHdr);		//SR17253
}
//----------------------------------
//Column Resizing
//----------------------------------
function startColumnResize() {
	CurrentColumn=event.srcElement.parentNode.cellIndex;
	var el=document.getElementById('hdr').cells[CurrentColumn];		//SR17355
	pos = event.clientX;
	size = el.offsetWidth;
	el.setCapture();												//SR17253
	el.attachEvent("onmousemove", doResize);
	el.attachEvent("onmouseup", endResize);
	el.attachEvent("onlosecapture", doLoseCaptureResize);					//SR17355
	el = null;
	event.cancelBubble = true;
}
function doLoseCaptureResize() {
	endResize()		//SR17355
}
function doResize(){
	var sz = size + event.clientX - pos;
	sz = sz < 5 ? 5 : sz;
	if (document.getElementById('hdr').cells[CurrentColumn].style.width!=sz) {
		document.getElementById('hdr').cells[CurrentColumn].style.width = sz+'px';		//SR17355
		if (document.getElementById('bdy').rows.length>0) {
			document.getElementById('bdy1_'+CurrentColumn).style.width=sz+'px';		//SR17253
			//SR17620 code removed from here
			document.getElementById('hdrbdy').cells[CurrentColumn].style.width=sz+'px';	//SR17355
		}
	}
}
function endResize() {										//SR17253
	var hdr=document.getElementById('hdr');
	//SR17620 code removed
	var el=hdr.cells[CurrentColumn];
	el.detachEvent("onmousemove", doResize);
	el.detachEvent("onmouseup", endResize);
	el.detachEvent("onlosecapture", doLoseCaptureResize);		//SR17355
	el.releaseCapture();
	doResize();											//SR17253
	var width = size + event.clientX - pos;
	if (width < 5) {width = 5}
	CallBack("SetColumnWidth^COMViewFilterColumn",el.id,width);
	el = null;
}
//-----------------------------------
// Search Resizing
//-----------------------------------
function startBarResize() {										//SR17253
	CurrentColumn=event.srcElement.parentNode.cellIndex;			//SR17253
	pos = event.clientY;
	size = document.getElementById('objDIV').offsetHeight;		//SR17253  //SR17362
	document.body.setCapture();			//SR17253
	document.body.attachEvent("onmousemove", doBarResize);
	document.body.attachEvent("onmouseup", endBarResize);
	document.body.attachEvent("onlosecapture", doLoseCaptureBarResize);
	event.cancelBubble = true;
	event.returnValue=false;		//SR17362
}
function doLoseCaptureBarResize() {
	endBarResize()		//SR17355
}
function doBarResize() {		//SR17253
	var sz = size + event.clientY - pos;
	var min=300;
	var min=document.getElementById('bdyDiv').offsetTop+50;
	sz = sz < min ? min : sz;
	document.getElementById('objDIV').style.height = sz;  //SR17362
	//resize result grid  ;SR17359
	AddMore(1);
	doBarResizeSetHeights(sz-25);
	event.cancelBubble=true //SR17263
	event.returnValue=false;		//SR17362
}
function doBarResizeSetHeights(sz) {	//SR17362
	//alert(parseInt(getPageOffsetTop(bdyDiv))+'.'+document.height);
	//SR17425 (Don't do this when in a form)
	if (navigator.userAgent.indexOf('MSIE') != -1) return 1;  //SR17499
	if ((document.getElementById('objDIV').getAttribute('InForm')==1)&&(navigator.userAgent.indexOf('MSIE') == -1)) {
		return 1;
	}
	//window.status=window.status+'.'+sz;
	doBarResizeSetHeightItem('bdyDiv',sz);
	return 1; //CORE-119
	if (navigator.userAgent.indexOf('MSIE') != -1) return 1;
	doBarResizeSetHeightItem('fldChoose',sz);
	doBarResizeSetHeightItem('fldChooseBar',sz);
	doBarResizeSetHeightItem('fldChooseDiv',sz+15);
}
function doBarResizeSetHeightItem(pstrId,sz) {
	var elem=document.getElementById(pstrId);
	if (elem) {
		if (elem.offsetTop!=null) {
			sz=sz-elem.offsetTop;
		}
		if (parseInt(sz)<0) { sz=0;};  //17490
		elem.style.height=sz+'px';
	}
}
function endBarResize() {			//SR17253
	document.body.detachEvent("onmousemove", doBarResize);
	document.body.detachEvent("onmouseup", endBarResize);
	document.body.detachEvent("onlosecapture", doLoseCaptureBarResize);
	document.body.releaseCapture();
	doBarResize();
	BarHeight=document.getElementById('objDIV').offsetHeight;  //SR17362
	CallBack("SetSearchHeight^COMView",BarHeight);
	event.cancelBubble=true //SR17362
	event.returnValue=false;		//SR17362
} 
//----------------------------------
//Column Dragging
//----------------------------------
function DragColumn() {
	var objHdr=event.srcElement;	//SR17253
	pos = event.clientX;
	size=getPageOffsetLeft(objHdr);
	DragTimeOut=window.setTimeout('DragColumnNow("'+objHdr.id+'")',500);
}
function DragColumnNow(pidElement) {
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
	el.style.left=size;
	//SR17315 el.style.fontSize='x-small';
	el.style.fontSize='13px';						//SR17315 
	el.style.fontFamily='Arial';
	el.style.fontWeight='bold';
	el.style.textAlign='center';
	el.style.border='1px outset';
	el.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=40)";
	el.style.opacity="0.60";													//SR17326
	document.body.setCapture();
	document.body.attachEvent("onmousemove", doDragColumn);
	document.body.attachEvent("onmouseup", endDragColumn);
	document.body.attachEvent("onlosecapture", doLoseCaptureDragColumn);					//SR17355
	//17355 document.body.attachEvent("onlosecapture", endDragColumn);
	document.body.appendChild(el);
	el = null;
}
function doLoseCaptureDragColumn() {
	endDragColumn();//SR17355
}
function doDragColumn() {
	var sz = size + event.clientX - pos;
	document.getElementById('move').style.left= sz;  //SR17326
}
function endDragColumn() {
	var InsertElement='';
	var strValue='';
	var sz = size + event.clientX - pos;
	var hdr=document.getElementById('hdr');	//SR17355
	for (i=0;i<hdr.cells.length;i++) {
		if (getPageOffsetLeft(hdr.cells[i])<sz) {
			InsertElement=hdr.cells[i].id;
		}
	}
	if (InsertElement!='') {
		if (document.getElementById('move').moveElement!=InsertElement) { //SR17326
			Searching();						//SR14763
			CallBack("SwapColumns^COMViewFilterColumn",document.getElementById('move').moveElement,InsertElement); //SR17326
		}
	}
	document.body.detachEvent("onmousemove", doDragColumn);
	document.body.detachEvent("onmouseup", endDragColumn);
	document.body.detachEvent("onlosecapture", doLoseCaptureDragColumn);		//SR17355
	document.body.releaseCapture();
	document.getElementById('move').outerHTML='';		//SR17326
	//alert(document.getElementById('move'));
	//move=null;				//SR17253
	return false;
	event.cancelBubble=true;		// FIXME JW - this does not get run
}
// -->
//</script>
 

//<script type='text/javascript'><!--
if (2<2) {if (2<2) {if (2<2) {if (2<2) {if (2<2) x=1;}}}}  //hack
// Search bar Status
function Searching(pblnCheckSetup) {
	if (!pblnCheckSetup || GLOBALblnKeyStroke) {
		SetStatus('Pesquisando... ');	// Searching...
	}
}
function SetStatus(pstrStatus) {
	var objStatus = document.getElementById('bdystatus');
	objStatus.innerHTML = pstrStatus;
}
//----------------------------------
// Views/Favourites functions
//----------------------------------
function RemoveViews() {
	if (document.getElementById('filt')!=null) {
		document.getElementById('filt').innerHTML='';
	}
}
function SubmitQuery() {
	Searching();
	CallBack("ManualSubmit^COMViewFilter");
	if (typeof(RedrawDynTable) != 'undefined') RedrawDynTable();
}
function AddView(pValue,pText,pSelected,pDistribute) {
	var obj=document.createElement('input');
	var objFilt=document.getElementById('filt');
	obj.type='radio';
	obj.name='Filter';
	obj.id='Filter'+pValue;
	obj.checked = (pSelected==1) ? true : false;
	obj.value=pValue;
	obj.attachEvent("onmousedown",ViewChanged);
	objFilt.appendChild(obj);
	var el=document.createElement('span');
	el.style.fontSize='10pt';
	el.style.fontWeight='bold';
	if (pDistribute==0) el.style.color='darkblue';
	el.innerHTML=' '+pText;
	el.value=pValue;
	objFilt.appendChild(el);
}
function AddView2(pValue,pText,pSelected,pDistribute) {
	var objSelect=document.getElementById('objSelect');
	if (objSelect==null) {
		var objSelect=document.createElement('select');
		objSelect.id='objSelect';
		objSelect.attachEvent("onchange",ViewChanged);
		filt.appendChild(objSelect);
	}
	var objOption=document.createElement('option');
	objOption.value=pValue;
	objOption.innerHTML=pText;
	if (!pDistribute) objOption.style.backgroundColor='skyblue';
	objSelect.appendChild(objOption);	
}
function NewView() {
	ViewName=window.prompt('Informe aqui a descrição do registro'+":",'Novo favorito ');  //"Enter Description"  "New Favourite"
	if (ViewName!=null) {
		CallBack("NewView^COMView",ViewName);
	}		
}
function SaveView() {
	YDIVHEIGHT=null;  									//SR17898
	var ViewName=''
	var CurrentView=GetCurrentView();
	CallBack("SaveCurrentView^COMView",CurrentView);
	YDIVHEIGHT=objDIV.offsetHeight;  					//SR17898
	if (isFF()) YDIVHEIGHT=YDIVHEIGHT-19;				//SR17898
	window.setTimeout(function() { CVResize(); SetWindowSize(true); },100);	//SR17898
}
function EditView() {
	var CurrentView=GetCurrentView();
	YDIVHEIGHT=objDIV.offsetHeight;  					//SR17898
	if (isFF()) YDIVHEIGHT=YDIVHEIGHT-19;				//SR17898
	CallBack("EditCurrentView^COMView",CurrentView);
	window.setTimeout(function() {CVResize(); SetWindowSize(true);},100);	//SR17898
}
function cvResize() {
	//window.status=window.status+'.resize'; //SR17378
}
function DeleteView() {
	var CurrentView=GetCurrentView();
	var ViewDescription=document.getElementById('Filter'+CurrentView).nextSibling.innerText
	var result=VBConfirm('Tem certeza de que deseja excluir o favorito '+ViewDescription+"?",33,'Excluir confirmação ');  // "Are you sure you want to delete favourite:"  "Delete Confirm"
	if (result==1) {
		Searching();
		CallBack("DeleteCurrentView^COMView",CurrentView);
	}
}
function ViewChanged(pEvent,pstrValue) {
	var obj;
	var objFilt=document.getElementById('filt');
	if (pstrValue!=null) {
		var value= pstrValue;
	} else {
		value=event.srcElement.value;  //SR17439
	}
	for (i=0;i<objFilt.children.length;i++) {
		obj=objFilt.children[i];
		if (obj.tagName=='INPUT') {
			obj.checked = (value==obj.value) ? true : false;
		}
	}
	if (pstrValue==null) {
		Searching();
		CallBackNow("ViewChanged^COMView",value);  //CORE-119
		SelectRegionSize();						   //CORE-119
	}
}
function GetCurrentView() {
	var filt=document.getElementById('filt');
	for (i=0;i<filt.children.length;i++) {
		var obj=filt.children[i];
		if (obj.tagName=='INPUT') {
			if (obj.checked) {
				return obj.value;
			}
		}
	}
}
//----------------------------------
// Miscellaneous functions...
//----------------------------------
function getPageOffsetLeft(Object) {  
 var x=Object.offsetLeft;
 if ((Object.offsetParent != null)&&(Object.style.position !='absolute')) x += getPageOffsetLeft(Object.offsetParent);
 return x;
}
function getPageOffsetTop(Object) {
 var y=Object.offsetTop;
 if ((Object.offsetParent != null)&&(Object.style.position !='absolute')) y += getPageOffsetTop(Object.offsetParent);
 return y;
}
function DoNothing() {
	//Hack for Buttons in @Net
}
function ShowLoading(pShow) {
	if (document.getElementById('COMViewSearch_1')!=null) {
		var Current=document.getElementById('COMViewSearch_1').src;
		var Previous=Current;
		var exp="loading";
		var Replace="loaded";
		if (pShow==1) {
			exp="loaded";
			Replace="loading";
		}
		Current=Current.split(exp);
		Current=Current.join(Replace);
		document.getElementById('COMViewSearch_1').src=Current;
	}
}
function ShowPlan() {
	CallBack("ShowPlan^COMViewPlan");
}
var TimeOut=null;
function SetWindowSize(pblnForce) { //SR17898
	if ((pblnForce)||(document.body.offsetHeight!=document.body.LastHeight)||
		(document.body.offsetWidth!=document.body.LastWidth)) {
		var sz=document.body.clientHeight-getPageOffsetTop(document.getElementById('bdyDiv'));	//SR17418
		if (sz<1) sz=1;  //SR17418
		document.getElementById('bdyDiv').style.height=sz;
		if (DragTimeOut!=null) {
			window.clearTimeout(DragTimeOut);
			DragTimeOut=null;
		}
		document.body.LastWidth=document.body.offsetWidth;
		document.body.LastHeight=document.body.offsetHeight;
		DragTimeOut=window.setTimeout("CallBack('SetSize^COMView',"+document.body.offsetHeight+","+document.body.offsetWidth+")",200);
	}
}
function SetWindowPosition() {
	CallBackNow('SetPostion^COMView',top.screenTop,top.screenLeft);
}
//-----------------------------------
// Control Functions
//-----------------------------------
function ControlChanged() {
    var el=event.srcElement;
    var value=el.value;
    var blnContinue=true;
    var Status=false;
    var idFilter = el.id;
    var blnSubmit = GLOBALblnKeyStroke;
	if (event.type == 'paste') {
		value = clipboardData.getData('Text');
		if (isFF()) {
			// for some reason firefox will put the value in twice without this.  //SR17663
			el.value = '';
		} else {
			el.value = value;
		}
	}
    if (event.keyCode==13) {
    	Searching();
	    CallBack('ControlChanged^COMViewFilterControl',el.id,value,true,true);
	} else if (el.type=='checkbox') {
		if (el.checkbox=='tristate') {
			value= el.parentNode.checked;	
		} else {
			value= el.checked==true ? 1 : 0;
		}
	    Status=true;
	    if (blnSubmit) Searching();
	    CallBack('ControlChanged^COMViewFilterControl',idFilter,value,blnSubmit);
	} else {
	    if (el.type=='select-multiple') {
		    value='';
		    for (var i=0; i<el.options.length;i++) {
			    if (el.options[i].selected==true) {
				    if (value!='') {
					    value+=',';
				    }
				    value+=el.options[i].value;
			    }
		    }
	    }
		if (value!=el.initialValue) {
		    if (blnSubmit && (idFilter.search(/(value|comp|group)/)!=-1)) {
		        Searching();
    		}
		    el.initialValue=value;
			value=escape(value);
	   		if (event.type=="keyup" || event.type=="paste") {
	    	    if (TimeOut!=null) {
				    window.clearTimeout(TimeOut);
				    TimeOut=null;
		    	}
		    	var ExecuteString="CallBack('ControlChanged^COMViewFilterControl','"+el.id+"','"+value+"','"+blnSubmit+"')"
	    		TimeOut=window.setTimeout(ExecuteString,KeyStrokeDelay);
	   		} else {
			    CallBack('ControlChanged^COMViewFilterControl',idFilter,value,blnSubmit);
	   		}
	    }
	}
    if (Status==false) {
    	el=null;
    	event.cancelBubble=true;
    }
    return Status;
}
function FormOnlyTicked() {
	CallBack('FormOnlyChecked^COMViewFilterControl',event.srcElement.checked?1:0);
}
function CreateControl(pidControl,pidField,pblnEnableRemove) {
   	var objRow = document.createElement('tr');
   	objRow.id='ctrl'+pidControl;
   	objRow.Field=pidField;
   	var objCell = document.createElement('td');objRow.appendChild(objCell);
   	objCell.id='ctrl'+pidControl+'_1';
   	objCell.style.fontSize=12;
	if (pblnEnableRemove == true) objCell.attachEvent('ondblclick',RemoveControl);
   	var objCell = document.createElement('td');
   	objCell.id='ctrl'+pidControl+'_2';
   	objRow.appendChild(objCell);
   	var objCell = document.createElement('td');
   	objCell.id='ctrl'+pidControl+'_3';
   	objRow.appendChild(objCell);
	var objCell = document.createElement('td');
   	objCell.id='ctrl'+pidControl+'_4';
   	objCell.style.display='none';
   	objCell.style.fontSize=12;
   	objRow.appendChild(objCell);
   	var objCheck= document.createElement('input');
   	objCheck.attachEvent('onclick',ControlChanged);
   	objCheck.type='checkbox';
   	objCheck.id='display'+pidControl;
	objCell.appendChild(objCheck);
   	var objSpan= document.createElement('span');
   	objSpan.innerHTML='Mostrar? ';  // "Display"
   	objCell.appendChild(objSpan);
   	var objCheck= document.createElement('input');
   	objCheck.attachEvent('onclick',ControlChanged);
   	objCheck.type='checkbox';
   	objCheck.id='group'+pidControl;
	objCell.appendChild(objCheck);
   	var objSpan= document.createElement('span');
   	objSpan.innerHTML='Agrupar? ';  // "Group?"
   	objCell.appendChild(objSpan);
   	var objCheck= document.createElement('input');
   	objCheck.attachEvent('onclick',RadioChanged);
   	objCheck.type='radio';
   	objCheck.name='default';
   	objCheck.value=pidField;
   	objCheck.id='default'+pidControl;
	objCell.appendChild(objCheck);
   	var objSpan= document.createElement('span');
   	objSpan.innerHTML='Padrão? ';  // "Default?"
   	objCell.appendChild(objSpan);
   	document.getElementById('ctrl').appendChild(objRow);
}
function RadioChanged() {
	var Selected=event.srcElement;
	for (var i=1;(document.getElementById('default'+i)!=null);i++) {
		var el=document.getElementById('default'+i)
		el.checked = (el.id==Selected.id) ? true : false;
	}
	ControlChanged();
}
function RemoveControl() {
	Searching(true);
    CallBack('RemoveControl^COMViewFilterControl',event.srcElement.id);
}
function ExecLine(pstrLine) {
    var t=new Date();
	eval(pstrLine);
	var c=CallBackTime.Current;
	if (c!=null) {
		var l=CallBackTime[CallBackTime.Current].Line.length;
		var n=new Date();
		CallBackTime[c].Line[l]=pstrLine;
		CallBackTime[c].LineTime[l]=((n-t)/1000);
	}
}
function PrintSelection (){
    CallBack('Print^COMViewPrint');
}
function PrintOptions(){
	if (typeof(event) == 'undefined') {
		event = new Object();
		event['pageX'] = ctxtmenu.clientX;
		event['pageY'] = ctxtmenu.clientY;
	}
    CallBack('PrintOptions^COMViewPrint');
	event.returnValue=false;
	event.cancelBubble=true
   	Columns.show((event.pageX ? event.pageX : event.screenX),(event.pageY ?event.pageY : event.screenY),200,120);
	window.setTimeout('Columns.show('+(event.pageX ? event.pageX : event.screenX)+','+(event.pageY ?event.pageY : event.screenY)+',200,Columns.document.body.children[0].offsetHeight);',50);
    return true;
}
function CopySelection() {
    CallBack('Copy^COMViewPrint');
}
function ExportToExcel() {
	CallBack('ExportToExcel^COMViewPrint');
}
function ExportToCSV() {
	CallBack('ExportToCSV^COMViewPrint');
}
function ShowNormalGrid() {
    CallBack('Hide^COMViewLocnTree');
}
function ShowLocnTree() {
    CallBack('Show^COMViewLocnTree');
}
function TranslateFavourite() {
	var CurrentView = GetCurrentView();
	CallBack('TranslateFavourite^COMView', CurrentView);
} 
function COMViewHelp(event) {
	if (!event) event=window.event;
	CallBack('FormHelp^COMViewHelp',event.shiftKey);
}
function cvBack() {
	var split=document.getElementById('YBACK').value.split(',');
	CallBack('GoToForm^COMUtilForm',split[split.length-2]+'~'+document.getElementById('YBKEY').value);
}
function SearchHelp() {
    var strField=event.srcElement.Field;
    if (strField==null) {strField=event.srcElement.parentNode.Field;}
    if (strField==null) {strField=event.srcElement.parentNode.parentNode.Field;}
    if (strField==null) {strField=event.srcElement.parentNode.parentNode.parentNode.Field;}
    if (strField==null) {strField='';}
    CallBack('ShowHelp^COMViewHelp',event.srcElement.id,strField);
    event.cancelBubble=true;
    return false;
}
function findObjectForTag(objElement,tagName)
{
	var returnValue=null;
	if (objElement!=null) {
		if (objElement.tagName==tagName) {
			returnValue=objElement;
		} else {
			returnValue=findObjectForTag(objElement.parentNode,tagName);
		}
	}
	return returnValue;
}
//----------------------------------
// Custom Command callbacks
//----------------------------------
function CommandClick(pintCommand,pstrConfirmText) {
	var confirmed=1
	var Key=event.srcElement.parentNode.parentNode.Key
	if (pstrConfirmText!='') {
		confirmed=confirm(Key+' '+pstrConfirmText);
	}
	if (confirmed) {
		Searching();
		CallBack('CallBack^COMViewCommand',Key,pintCommand);
	}
	event.cancelBubble = true;
	return false;
}
//-->
//</script>
	

function BuildCOMViewStructure(pblnInForm,pblnIsSuperUser,pblnUseKeyStroke) {
 var obj,obj2,obj3,obj4,objDiv1,objDIV;
 var blnShow = (pblnInForm==0) || ((pblnInForm==1) && (pblnIsSuperUser==1));
 objDIV=document.createElement('div');
 if (pblnInForm==1) {  gridDIV.parentNode.insertBefore(objDIV,gridDIV);  obj=document.createElement('hr');objDIV.appendChild(obj);
 } else {  document.getElementById('WWW').parentNode.insertBefore(objDIV,document.getElementById('WWW'));
} if (pblnInForm==0) objDIV.style.display='none';
 objDIV.style.backgroundColor=NetBorderColor;
 if(!isIE()) objDIV.style.paddingRight=25;
 objDIV.className='obj-div'; 
 objDIV.id='objDIV';
 objDIV.style.overflow='hidden';
 objDIV.setAttribute('InForm',pblnInForm);
 objDIV.onresize=function() { CVResize(); };
 objDIV.attachEvent('onkeydown',RowEvent);
 objDIV.attachEvent('onclick',SearchSetFocus);
 objDIV.attachEvent('onhelp',SearchHelp);
 obj=document.createElement('table');objDIV.appendChild(obj);
 obj.id='maintable';
 obj.style.tableLayout='fixed';
 obj.style.width='100%';
 if ((pblnInForm==0)||(isIE()))obj.style.height='100%';
 obj2=document.createElement('tbody');obj.appendChild(obj2);
 obj3=document.createElement('tr');obj2.appendChild(obj3);
 if (!isIE()) {
   obj3.style.display='table';
 } else {
   obj3.style.display='block';
 }
 obj3.style.width='100%';
 if (blnShow) {  obj4=document.createElement('td');obj3.appendChild(obj4);
  obj4.className='fldChoose'; 
  obj4.id='fldChoose';
  obj4.vAlign='top';
  obj4.style.display='none';  obj4=document.createElement('td');obj3.appendChild(obj4);
  obj4.className='fldChooseBar'; 
  obj4.id='fldChooseBar';
  obj4.innerHTML='&#x25BA;';
  obj4.style.fontSize=10;
  obj4.title='Selecionador de Campos'
  obj4.attachEvent("onmouseover",ChooseHighLight);
  obj4.attachEvent("onmouseout",ChooseNormal);
  obj4.attachEvent("onclick",ChooseShow);
 }  var objTD=document.createElement('td');obj3.appendChild(objTD);
  objTD.style.verticalAlign='top';  objDiv1=document.createElement('div');objTD.appendChild(objDiv1);
  objDiv1.className='SearchDiv'; 
  objDiv1.id='SearchDiv'; 
 objDiv1.onresize=function() { SelectRegionSize(); };
 if (pblnInForm!=1) {  obj=document.createElement('span');objDiv1.appendChild(obj);
  obj.className='desc';
  obj.id='desc';
  obj.style.display='inline-block'; } var objA=document.createElement('table');objDiv1.appendChild(objA);
 objA.width='100%';
 var objB=objA.insertRow(-1);
 var objC=objB.insertCell(0);
 obj=document.createElement('fieldset');objC.appendChild(obj);
 obj.className='fieldset-filt';
 obj.style.display='inline'; obj.style.width='100%';
 obj2=document.createElement('legend');obj.appendChild(obj2);
 obj2.className='legend';
 obj2.innerHTML='Favoritos';
 obj2=document.createElement('div');obj.appendChild(obj2);
 obj2.className='filt';
 obj2.id='filt';
objC=objB.insertCell(1);
 objD=document.createElement('div'); objC.appendChild(objD);
 objD.style.cssFloat='right';
 obj=document.createElement('span');objD.appendChild(obj);
 obj.className='fieldset-save';
 obj.id='buttonpanel';
 obj.style.width='100%';
 obj.style.paddingLeft='5px';
 if (blnShow) {
  cvCreateButton(obj,'new.gif','Novo ',NewView,'newFavourite');
  cvCreateButton(obj,'open.gif','Abrir',EditView,'openFavourite');
  cvCreateButton(obj,'save.gif','Salvar ',SaveView,'saveFavourite');
  cvCreateButton(obj,'del.gif','Excluir ',DeleteView,'deleteFavourite');
  obj2=document.createElement('img');obj.appendChild(obj2);
  obj2.src=FilePath+'delimiter.gif';
 }
 if (pblnInForm==0) {
  obj2=cvCreateButton(obj,'print.gif','Imprimir ',PrintSelection,'printResultset');
  obj2.attachEvent('oncontextmenu',PrintOptions);
  obj2=cvCreateButton(obj,'copy.gif','Copiar ',CopySelection,'copyResultset');
  obj2=cvCreateButton(obj,'selectall.gif','Selecionar ',SelectAll,'selectallResultset');
  obj2.style.display='none';
  obj2.id='SelectAll';
 } obj2=cvCreateButton(obj,'property.gif','Exportar para excel',ExportToExcel,'ExportToExcel');
 obj2=cvCreateButton(obj,'grid.gif','Exportar para CSV',ExportToCSV,'ExportToCSV');
 obj2=cvCreateButton(obj,'text.gif','Tradução',TranslateFavourite,'TranslateFavourite');
 obj2=cvCreateButton(obj,'help.gif','Ajuda-'+GLOBALstrFormName,COMViewHelp,'COMViewHelp');
 obj2=cvCreateButton(obj,'hback.gif','Voltar',cvBack,'cvBackButton');
 if ((pblnInForm==1) || !pblnUseKeyStroke) { cvCreateButton(obj,'ok.gif','Pesquisar',SubmitQuery,'SubmitQuery'); }
 GLOBALblnKeyStroke = pblnUseKeyStroke;  obj=document.createElement('fieldset');objDiv1.appendChild(obj);
 obj.className='fieldset-ctrl';
 obj2=document.createElement('legend');obj.appendChild(obj2);
 obj2.className='legend';
 obj2.innerHTML='Seleção de Campos';
 obj.appendChild(obj2);
 obj2=document.createElement('div');obj.appendChild(obj2);
 obj2.className='HdrCtrl';
 obj2.id='hdrctrl';
 obj2=document.createElement('table');obj.appendChild(obj2);
 obj2.className='ctrltable';
 obj3=document.createElement('tbody');obj2.appendChild(obj3);
 obj3.id='ctrl';
 obj2=document.createElement('span'); objDiv1.appendChild(obj2);
 obj2.innerHTML = ' <strong>Status</strong>: ';
 obj2.className='HdrCtrl';
 obj2=document.createElement('span'); objDiv1.appendChild(obj2);
 obj2.id = 'bdystatus'; 
 obj2.className='HdrCtrl';
 obj=document.createElement('div');objDiv1.appendChild(obj);
 obj.className='hdr-div';
 obj.id='hdrDiv';
 obj.attachEvent("oncontextmenu",ShowHeaderColumn);
 obj2=document.createElement('table');obj.appendChild(obj2);
 obj2.border=1;
 obj2.borderColor=NetBorderColor;
 obj2.borderColorDark=NetBorderColorDark;
 obj2.borderColorLight=NetBorderColorLight;
 obj2.cellSpacing=0;
 obj2.className='hdr-table';
 obj3=document.createElement('tbody');obj2.appendChild(obj3);
 obj4=document.createElement('tr');obj3.appendChild(obj4);
 obj4.id='hdr';
 obj=document.createElement('div');objDiv1.appendChild(obj);
 obj.attachEvent("onscroll",AddMore);
 obj.className='bdy-div';
 obj.id='bdyDiv';
 obj.height='100px';
 obj2=document.createElement('table');obj.appendChild(obj2);
 obj2.border=1;
 obj2.borderColor=NetBorderColor;
 obj2.borderColorDark=NetBorderColorDark;
 obj2.borderColorLight=NetBorderColorLight;
 obj2.cellSpacing=0;
 obj2.className='bdy-table';
 obj2.id='bdytable';
 obj3=document.createElement('thead');obj2.appendChild(obj3);
 obj3.className='bdy-head';
 obj4=document.createElement('tr');obj3.appendChild(obj4);
 obj4.id='hdrbdy';
 obj4.style.display='none';
 obj3=document.createElement('tbody');obj2.appendChild(obj3);
 obj3.id='bdy';
 obj3.style.border='1px white inset';
 if (pblnInForm==0) {
  obj=document.createElement('hr');objDiv1.appendChild(obj);
  obj.attachEvent("onmousedown",startBarResize);
  obj.className='search-bar';
  obj.id='searchbar';
 }
}
function cvCreateButton(obj,src,title,event,pid) {
   var obj2=document.createElement('img');obj.appendChild(obj2);
   obj2.src=FilePath+src;
   obj2.className='coolButton';
   obj2.title=title;
   obj2.attachEvent('onclick',event);
   obj2.id = pid
   return obj2;
}

    	function CVResize() {
    	var divHeight;
     	if (document.getElementById('WWW2')==null) {
	    	document.getElementById('objDIV').style.height=''; //CORE-308
    	} else {
	 		if ((typeof(YDIVHEIGHT)!='undefined')&&(YDIVHEIGHT!=null)) {
		    		divHeight=YDIVHEIGHT;
		    	} else {
			    	divHeight=document.getElementById('objDIV').offsetHeight;
		    	}
	    	//SR17898 var height=document.getElementById('objDIV').offsetHeight-getPageOffsetTop(bdyDiv)-3;
	    		var height=divHeight-getPageOffsetTop(bdyDiv)-2; //SR17898 
			//	if (document.getElementById('searchbar').style.display!='none') {
			//SR17530
				if (document.getElementById('searchbar') && document.getElementById('searchbar').style.display!='none') {
					height=height-17;			  //SR17898
				}
				if (document.getElementById('NOBR')==null) {							//CORE-143
					height=height+getPageOffsetTop(document.getElementById('objDIV'));	//CORE-143
					height=bdyDiv.offsetHeight-(height-bdyDiv.offsetHeight);			//CORE-143
				}																	//CORE-143
				if (height<0) YDIVHEIGHT=null;
				var height=Math.max(0,height);	  //SR17898
				if (bdyDiv.style.height==height) {
					YDIVHEIGHT=null;
				}
				bdyDiv.style.height=height;
			}
    	}
	
// -->
//</script>

