// Modified Date: 2006-07-24 14:51:56
// Modified Language: 1248268296
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
var CurSearch;
var FirstFocus=null;
var KeyStrokeDelay=200;
var PrintWindow=null;
window.attachEvent('onload',HackSaveButton);
function HackSaveButton() {
	var objButton=document.getElementById('BUTTON_SEARCH');
	if (objButton!=null) {
		var objA=objButton.parentElement;
		objA.onclick=null;
		objA.attachEvent('onclick',ShowSearch);
	}
}
function SAVENOW(pYOPEN) {		// Remove this function when SR13195 is done
	if (document.WWW.YOPEN.value=='SAVESEAR') {
		ShowSearch();
	} else {
		DefaultSAVENOW(pYOPEN);
	} 
}
function ShowSearch(pEvent,pHeight,pblnReverse) {
	var Granulation=50;
	if (pHeight==null) {
		if (document.getElementById('objDiv')==null) {
			var value='';
			if (document.WWW.YFKEY!=null) {
				value=document.WWW.YFKEY.value;
			}
			CallBackNow('AfterDataFields^COMViewFilter',document.WWW.YFORM.value+',,'+value,1);
		}
		if (document.getElementById('objDiv')!=null) {
			bdyDiv.style.setExpression('height','objDiv.offsetHeight-getPageOffsetTop(bdyDiv)-20','JScript');
		}
	}
	if (document.getElementById('objDiv')!=null) {
		if (pHeight==null) {
			objDiv.style.overflow='hidden';
			bdyDiv.style.overflow='hidden';
			if (objDiv.style.display=='none') {
				pHeight=0;
			} else {
				pHeight=BarHeight;
				pblnReverse=1
			}
		}
		objDiv.style.height=pHeight;
		if (pblnReverse==1) {
			if (pHeight<Granulation) {
				objDiv.style.display='none';
			}
			if (pHeight>0) {
				if (pHeight<Granulation) {
					pHeight=Granulation;
				}
				window.setTimeout('ShowSearch("",'+(pHeight-Granulation)+','+pblnReverse+')',2);
			}
		} else {
			if (pHeight==Granulation) {
				objDiv.style.display='block';
			}
			if (pHeight<BarHeight) {
				if ((pHeight+Granulation)>BarHeight) {
					Granulation=BarHeight-pHeight
				}
				window.setTimeout('ShowSearch("",'+(pHeight+Granulation)+')',2);
			} else {
				bdyDiv.style.overflow='auto';
				objDiv.style.overflow='auto';
				objDiv.focus();
				if (FirstFocus!=null) {
					if (document.getElementById(FirstFocus)!=null) {
						document.getElementById(FirstFocus).focus();
					}
				}
				AddMore(1);
			}
		}
	}
	return false;
}
function CallBack(pstrExecute,pParam1,pParam2,pParam3,pParam4) {
	//pParam2=pParam2 ? pParam2+'' : '';
	//pParam1=pParam1 ? pParam1+'' : '';
	if (CallNow!=1) {
		CallNow=1;
		var strExecute="CallBackNow('"+pstrExecute+"'"
		if (pParam1!=null) {
			strExecute+=",'"+pParam1;
			if (pParam2!=null) strExecute+="~"+pParam2;
			if (pParam3!=null) strExecute+="~"+pParam3;
			if (pParam4!=null) strExecute+="~"+pParam4;
			strExecute+="'";
		}
		strExecute+=")";
		ShowLoading(1);
		window.setTimeout(strExecute,1);
	}
}
function CallBackNow(pstrExecute,pParam1,pParam2,pParam3,pParam4) {
	var EventTime=new Date();
	var strParams='#NoParam#';
	if (pParam1!=null) strParams=pParam1;
	if (pParam2!=null) strParams+="~"+pParam2;
	if (pParam3!=null) strParams+="~"+pParam3;
	if (pParam4!=null) strParams+="~"+pParam4;	
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
function HTTPRequest(request) { // SR13077
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
      } catch (e) { }
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
	objRow.id='bdy'+Row;
	objRow.Key=Key;
	if (Row==1) {
		objRow.className = 'row-selected';
		CurrentRow=1;
	} else {
		objRow.className = (Row%2==1) ? 'row-light':'row-dark';
	}
	for (var i=0;i<arrCells.length;i++) {
		objCell = document.createElement('td');
		Data=arrCells[i];
		if (arrCells.length==1) {objCell.colSpan=hdr.cells.length;}
		if (Data=='') {Data='&nbsp;';}
		if (Data==' ') {Data='&nbsp;';}
		objCell.innerHTML=Data;
		objCell.style.textAlign=arrAlign[i];
		objCell.id='bdy'+Row+"_"+i;
		objRow.appendChild(objCell);
		if (arrShort[i]=='1') {
			objCell.attachEvent("oncontextmenu",CompleteTextOption);
		} else {
			objCell.attachEvent("oncontextmenu",DefaultOption);
		}
		objCell.title='Com00165';  //Right click cell to view available options 
	}
	if (Group!=null) {
		document.getElementById('bdy_'+Group).insertAdjacentElement("AfterEnd",objRow)
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
	Columns.show(event.screenX,event.screenY,200,120);
	window.setTimeout('Columns.show('+event.screenX+','+event.screenY+',200,Columns.document.body.children[0].offsetHeight);',50);
	event.returnvalue=false;
	event.cancelBubble=true
	result=false;
	return result;
}
function AddMore(plngInitial) {
	//plngInitial:
	// '': Add More if scrolled to bottom
	// 1 : Add More if Not hit bottom yet
	// 2 : Add More no matter what
	// 3 : Add All no matter what
	var obj=bdyDiv;
	var lngSize=obj.scrollTop+obj.clientHeight-obj.scrollHeight;
	if ((lngSize==0)||((lngSize>0)&&(plngInitial==1))||(plngInitial==2)||(plngInitial==3)) {
		if (bdy.Finished!=true) {
			var Rows=bdy.rows.length
			var blnLoadAll = (plngInitial==3) ? 1 : 0;
			CallBackNow("DisplayGrid^COMViewFilter",Rows,blnLoadAll);
		}
	}
	hdrDiv.scrollLeft=obj.scrollLeft;	
}
function RowEvent() {
	var KeyCode=event.keyCode;
	var Status=true;
	if (event.srcElement.type!='select-one') {
		if (bdy.rows.length>0) {
			CurrentRow = (CurrentRow!=null) ? CurrentRow :1;
			Status=false;
			var objCurrent=document.getElementById("bdy"+CurrentRow);
			if (KeyCode == 13) {  //Enter
				SubmitQuery();
				//GridClick('',objCurrent.Key);	//SR14613
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
				ShowSearch();	//SR13195
			} else {
				Status=true;
			}
		}
		if (Status==false) {
			event.returnvalue=false;
			event.cancelBubble=true;
		}
	}
	return Status;
}
function SelectRow(pEvent,pNewRow) {
	if (pNewRow==null) {
		var objRow=findObjectForTag(event.srcElement,'TR');
		if (objRow!=null) {
			pNewRow=objRow.Row;
		}
	}
	if (pNewRow!=null) {
		CurrentRow = (CurrentRow!=null) ? CurrentRow :1;
		var objRow=document.getElementById("bdy"+CurrentRow);
		objRow.className= (CurrentRow%2==1) ? 'row-light':'row-dark';
		CurrentRow=pNewRow;
		var objRow=document.getElementById("bdy"+pNewRow);
		objRow.className= 'row-selected';
		if ((objRow.offsetTop+objRow.offsetHeight)>bdyDiv.clientHeight+bdyDiv.scrollTop) {
			bdyDiv.scrollTop=objRow.offsetTop+objRow.offsetHeight-bdyDiv.clientHeight;
		} else if (objRow.offsetTop<bdyDiv.scrollTop) {
			bdyDiv.scrollTop=objRow.offsetTop;
		}
	}
}
function GridClick(pEvent,pKey) {
	if (pKey==null) {
		var objRow=findObjectForTag(event.srcElement,'TR');
		if (objRow!=null) {
			pKey=objRow.Key;
		}
	}
	var Back='';
	if (document.WWW.YBACK!=null) {
		Back=document.WWW.YBACK.value;
	}
	CallBack("GridClick^COMViewFilter",pKey,Back);
}
function SelectAll() {
	window.opener.CallBack('CallBack^COMViewCustom',"",1);
}
function SearchSetFocus() {
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
				//objDiv.focus();
			}
		}
	} else if (event.type=="focus") {
		FirstFocus=event.srcElement.id;
	} else if (event.type=="load") {
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
// -->
//</script>
 

//<script type='text/javascript'><!--
if (2<2) {if (2<2) {if (2<2) {if (2<2) {if (2<2) x=1;}}}}  //hack
//----------------------------------
//Field Chooser functions
//----------------------------------
function ChooseShow() {
	if (DragTimeOut==null) {
		if (fldChooseBar.innerHTML==4) { //currently hidden
			if (fldChoose.innerHTML=='') {
				 CallBackNow("Show^COMViewChoose");
			}
			fldChoose.style.display='inline';
			fldChooseBar.innerHTML=3;
			fldChooseBar.style.cursor='col-resize';
			fldChooseBar.attachEvent("onmousedown",ChooseResizeStart);
		} else {
			fldChoose.style.display='none';		
			fldChooseBar.style.cursor='';	
			fldChooseBar.innerHTML=4;
			fldChooseBar.detachEvent("onmousedown",ChooseResizeStart);
		}
	}
	DragTimeOut=null;
}
function ChooseHighLight() {
	fldChooseBar.style.color='steelblue';
}
function ChooseNormal() {
	fldChooseBar.style.color='';
}
function ChooseResizeStart() {
	CurrentColumn=event.srcElement.parentNode.cellIndex;
	var el=fldChooseBar;
	pos = event.clientX;
	size = fldChoose.offsetWidth;
	el.attachEvent("onmousemove", ChooseResize);
    el.attachEvent("onmouseup", ChooseResizeEnd);
    el.attachEvent("onlosecapture", ChooseResizeEnd);
    el.setCapture();
    el = null;
}
function ChooseResize() {
	if (event.clientX!=pos) {
		DragTimeOut=1;
	}
	var sz = size + event.clientX - pos;
	sz = sz < 100 ? 100 : sz;
	fldChoose.style.width = sz;
}
function ChooseResizeEnd() {
	DragTimeOut=null;
	var el=fldChooseBar;
    el.detachEvent("onmousemove", ChooseResize);
    el.detachEvent("onmouseup", ChooseResizeEnd);
    el.detachEvent("onlosecapture", ChooseResizeEnd);
    el.releaseCapture();
	ChooseResize();
    var width = size + event.clientX - pos;
	if (width < 100) {width = 100}
    CallBack("SetWidth^COMViewChoose",width);
    el = null;
}
function AddChooseField(ChooserBody,pidField,pstrDesc,pstrRelation,pblnDrag) {
	var objRow=document.createElement('tr');ChooserBody.appendChild(objRow);
	if (pblnDrag==1) {
		objRow.attachEvent("onmousedown",ChooseField);
	}
	if (ChooserBody.id!='ChooserSubField') {
		objRow.attachEvent("onmousedown",ChooseFieldSelect);
	}
	var objCell=document.createElement('td');objRow.appendChild(objCell);
	objCell.innerHTML=pstrDesc;
	if (pstrRelation!='') { objCell.title = pstrRelation; } // SR10965
	objCell.style.fontSize=12;
	objCell.style.border='1px outset';
	objCell.Field=pidField;
	objCell.id=ChooserBody.id+"_"+objRow.rowIndex;
	objCell.attachEvent("ondragstart",ChooseFieldDragStart);
	objCell.Relation=pstrRelation;
	if (pblnDrag!=1) {objCell.unselectable='on'; }
}
function ChooseField() {
	var objCell=event.srcElement;
	posX = event.clientX;
	sizeX=getPageOffsetLeft(objCell);
	posY = event.clientY;
	sizeY=getPageOffsetTop(objCell);
	DragTimeOut=window.setTimeout(objCell.id+'.dragDrop();',1);
}
function ChooseFieldDragStart() {
	event.dataTransfer.effectAllowed='copy';
	event.dataTransfer.setData("Text",event.srcElement.Field);
	hdrDiv.attachEvent('ondragover',ChooseFieldDrag);
	hdrDiv.attachEvent('ondragenter',ChooseFieldDrag);
	hdrDiv.attachEvent('ondrop',ChooseFieldEnd);
	ctrl.attachEvent('ondragover',ChooseFieldDrag);
	ctrl.attachEvent('ondragenter',ChooseFieldDrag);
	ctrl.attachEvent('ondrop',ChooseFieldEnd);
    bdy.attachEvent('ondragover',ChooseFieldDrag);
	bdy.attachEvent('ondragenter',ChooseFieldDrag);
	bdy.attachEvent('ondrop',ChooseFieldEnd);
}
function ChooseFieldDrag() {
	event.dataTransfer.dropEffect='copy';
	event.returnValue=false;
}
function ChooseFieldEnd() {
	var Field=event.dataTransfer.getData('Text');
	CallBack("Select^COMViewChoose",Field,event.srcElement.id);
	hdrDiv.detachEvent('ondragover',ChooseFieldDrag);
	hdrDiv.detachEvent('ondragenter',ChooseFieldDrag);
	hdrDiv.detachEvent('ondrop',ChooseFieldEnd);
	ctrl.detachEvent('ondragover',ChooseFieldDrag);
	ctrl.detachEvent('ondragenter',ChooseFieldDrag);
	ctrl.detachEvent('ondrop',ChooseFieldEnd);
    bdy.detachEvent('ondragover',ChooseFieldDrag);
	bdy.detachEvent('ondragenter',ChooseFieldDrag);
	bdy.detachEvent('ondrop',ChooseFieldEnd);	
}
function ChooseFieldSelect() {
	var objCell=event.srcElement;
	var Current=ChooserCurrentRow();
	if (Current!=objCell.parentNode.rowIndex) {
		if (Current!=null) {
			ChooserField.rows[Current].Selected=null;
			ChooserField.rows[Current].cells[0].style.border='1px outset';
		}
		objCell.parentNode.Selected=1;
		objCell.style.border='1px inset';
		ChooserSub.innerHTML='';
		if (objCell.Relation!='') {
			CallBack('LoadSubClass^COMViewChoose',objCell.Relation,objCell.Field);
		}
	}
}
function ChooserCurrentRow() {
	var Current=null;
	for (var i=0;i!=ChooserField.rows.length;i++) {
		if (ChooserField.rows[i].Selected!=null) {
			Current=i;
		}
	}
	return Current;
}
function ChooserClassChanged() {
	CallBack('LoadChooserType^COMViewChoose',ChooserClass.value);
}
function ChooserTypeChanged() {
	ChooserSub.innerHTML='';
	CallBack('LoadFields^COMViewChoose','',ChooserType.value,"ChooserField");
}
function ChooserSubTypeChanged() {
	CallBack('LoadFields^COMViewChoose',ChooserField.rows[ChooserCurrentRow()].cells[0].Relation,ChooserSubType.value,"ChooserSubField");
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
	CallBackNow("Show^COMViewColumnMenu","",event.srcElement.Field);
	Columns.show(event.screenX,event.screenY,200,120);
	window.setTimeout('Columns.show('+event.screenX+','+event.screenY+',200,Columns.document.body.children[0].offsetHeight);',50);
	event.returnvalue=false;
	event.cancelBubble=true
	return false;
}
function ColumnClick(Row) {
	CallBack("SelectColumn^COMViewFilterColumn",Row);
	return false;
}
function SortColumn(pEvent,pField,pDirection) {
	if (DragTimeOut!=null) {
		window.clearTimeout(DragTimeOut);
		DragTimeOut=null;
	}
	if (pField==null) { pField=pEvent.srcElement.Field;}
	CallBack("SortColumn^COMViewFilterColumn",pField,pDirection);
}
function ClearCol() {
	while (hdr.cells.length>0) {hdr.deleteCell(0);}
	while (hdrbdy.cells.length>0) {hdrbdy.deleteCell(0);}
}
function AddCol(GridHead,Text,Width,SortDirection,ColNumber,pstrTitle) {
	Width= Width ? Width : 120;
	SortDirection = SortDirection ? SortDirection : '';
	var objHdr = document.createElement('th');
	objHdr.className='head';
 	objHdr.style.width=Width;
 	objHdr.id='head'+ColNumber;
 	objHdr.Field=ColNumber;
 	objHdr.unselectable='on';
 	objHdr.innerHTML=Text;
 	objHdr.title=pstrTitle;
	var objResize = document.createElement('div');
	objResize.className = 'resize';
	objResize.innerHTML = '&nbsp;';
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
 	hdrbdy.appendChild(objHdr);
}
//----------------------------------
//Column Resizing
//----------------------------------
function startColumnResize() {
	CurrentColumn=event.srcElement.parentNode.cellIndex;
	var el=hdr.cells[CurrentColumn];
	pos = event.clientX;
	size = el.offsetWidth;
	el.attachEvent("onmousemove", doResize);
    el.attachEvent("onmouseup", endResize);
    el.attachEvent("onlosecapture", endResize);
    el.setCapture();
    el = null;
    event.cancelBubble = true;
}
function doResize(){
	var sz = size + event.clientX - pos;
	sz = sz < 5 ? 5 : sz;
	hdr.cells[CurrentColumn].style.width = sz;
	if (bdy.rows.length>0) {
		hdrbdy.cells[CurrentColumn].style.width=sz;
	}
}
function endResize() {
	var el=hdr.cells[CurrentColumn];
    el.detachEvent("onmousemove", doResize);
    el.detachEvent("onmouseup", endResize);
    el.detachEvent("onlosecapture", endResize);
    el.releaseCapture();
	doResize();
    var width = size + event.clientX - pos;
	if (width < 5) {width = 5}
    CallBack("SetColumnWidth^COMViewFilterColumn",el.id,width);
    el = null;
}
//-----------------------------------
// Search Resizing
//-----------------------------------
function startBarResize() {
	CurrentColumn=event.srcElement.parentNode.cellIndex;
	pos = event.clientY;
	size = objDiv.offsetHeight;
	document.body.attachEvent("onmousemove", doBarResize);
    document.body.attachEvent("onmouseup", endBarResize);
    document.body.attachEvent("onlosecapture", endBarResize);
    document.body.setCapture();
    event.cancelBubble = true;
}
function doBarResize() {
	var sz = size + event.clientY - pos;
	var min=300;
	sz = sz < min ? min : sz;
	objDiv.style.height = sz;
	AddMore(1);
}
function endBarResize() {
    document.body.detachEvent("onmousemove", doBarResize);
    document.body.detachEvent("onmouseup", endBarResize);
    document.body.detachEvent("onlosecapture", endBarResize);
    document.body.releaseCapture();
	doBarResize();
	BarHeight=objDiv.offsetHeight;
    CallBack("SetSearchHeight^COMView",BarHeight);
}
//----------------------------------
//Column Dragging
//----------------------------------
function DragColumn() {
	var objHdr=event.srcElement;
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
 	el.style.fontSize='x-small';
 	el.style.fontFamily='Arial';
 	el.style.fontWeight='bold';
 	el.style.textAlign='center';
 	el.style.border='1px outset';
 	el.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=60)";
    document.body.attachEvent("onmousemove", doDragColumn);
    document.body.attachEvent("onmouseup", endDragColumn);
    document.body.attachEvent("onlosecapture", endDragColumn);
    document.body.setCapture();
 	document.body.appendChild(el);
 	el = null;
}
function doDragColumn() {
	var sz = size + event.clientX - pos;
	move.style.left= sz;
}
function endDragColumn() {
	var InsertElement='';
	var strValue='';
	var sz = size + event.clientX - pos;
	for (i=0;i<hdr.cells.length;i++) {
		if (getPageOffsetLeft(hdr.cells[i])<sz) {
			InsertElement=hdr.cells[i].id;
		}
	}
	if (InsertElement!='') {
		if (move.moveElement!=InsertElement) {
			CallBack("SwapColumns^COMViewFilterColumn",move.moveElement,InsertElement);
		}
	}
	document.body.detachEvent("onmousemove", doDragColumn);
    document.body.detachEvent("onmouseup", endDragColumn);
    document.body.detachEvent("onlosecapture", endDragColumn);
    document.body.releaseCapture();
	move.outerHTML='';
	return false;
	event.cancelBubble=true;
}
// -->
//</script>
 

//<script type='text/javascript'><!--
if (2<2) {if (2<2) {if (2<2) {if (2<2) {if (2<2) x=1;}}}}  //hack
//----------------------------------
//Views/Favourites functions
//----------------------------------
function RemoveViews() {
	filt.innerHTML='';
}
function SubmitQuery() { //SR14613
	CallBack("ManualSubmit^COMViewFilter");
}
function AddView(pValue,pText,pSelected) {
	var obj=document.createElement('input');
	obj.type='radio';
	obj.name='Filter';
	obj.id='Filter'+pValue;
	obj.checked = (pSelected==1) ? true : false;
	obj.value=pValue;
	obj.attachEvent("onmousedown",ViewChanged);
	filt.appendChild(obj);
	var el=document.createElement('span');
	el.style.fontSize='10pt';
	el.style.fontWeight='bold';
	el.innerHTML=' '+pText;
	el.value=pValue;
	filt.appendChild(el);
}
function NewView() {
	ViewName=window.prompt('Com00198'+":",'Com00199');  //Enter Description  //New Favourite
	if (ViewName!=null) {
		CallBack("NewView^COMView",ViewName);
	}		
}
function SaveView() {
	var ViewName=''
	var CurrentView=GetCurrentView();
	CallBack("SaveCurrentView^COMView",CurrentView);
}
function DeleteView() {
	var CurrentView=GetCurrentView();
	var ViewDescription=document.getElementById('Filter'+CurrentView).nextSibling.innerText
	var result=VBConfirm('Com00197'+ViewDescription+"?",33,'Com00196');  //;Are you sure you want to delete favourite:  //Delete Confirm
	if (result==1) {
		CallBack("DeleteCurrentView^COMView",CurrentView);
	}
}
function EditView() {
	var CurrentView=GetCurrentView();
	CallBack("EditCurrentView^COMView",CurrentView);
}
function ViewChanged(pEvent,pstrValue) {
	var obj;
	if (pstrValue!=null) {
		var value= pstrValue;
	} else {
		value = pEvent.srcElement.value;
	}
	for (i=0;i<filt.children.length;i++) {
		obj=filt.children[i];
		if (obj.tagName=='INPUT') {
			obj.checked = (value==obj.value) ? true : false;
		}
	}
	if (pstrValue==null) CallBack("ViewChanged^COMView",value);
}
function GetCurrentView() {
	for (i=0;i<filt.children.length;i++) {
		obj=filt.children[i];
		if (obj.tagName=='INPUT') {
			if (obj.checked) {
				return obj.value;
			}
		}
	}
}
//----------------------------------
//Miscellaneous functions...
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
function SetWindowSize() {
	if ((document.body.offsetHeight!=document.body.LastHeight)||
		(document.body.offsetWidth!=document.body.LastWidth)) {
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
//Control Functions
//-----------------------------------
function ControlChanged() {
    var el=event.srcElement;
    var value=el.value;
    var blnContinue=true;
    var Status=false;
	if (event.type == 'paste') { // SR14245
		value = clipboardData.getData('Text');
		el.value = value;
	}
	if (el.type=='checkbox') {
		value= el.checked==true ? 1 : 0;
	    Status=true;
	    CallBack('ControlChanged^COMViewFilterControl',el.id,value,event.keyCode);
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
		    el.initialValue=value;
			value=escape(value);
	   		if (event.type=="keyup" || event.type=="paste") { // SR14245
	    	    if (TimeOut!=null) {
				    window.clearTimeout(TimeOut);
				    TimeOut=null;
		    	}
		    	var ExecuteString="CallBack('ControlChanged^COMViewFilterControl','"+el.id+"','"+value+"','"+event.keyCode+"')"
	    		TimeOut=window.setTimeout(ExecuteString,KeyStrokeDelay);
	   		} else {
			    CallBack('ControlChanged^COMViewFilterControl',el.id,value,event.keyCode);
	   		}
	    } else {
		    if (event.keyCode==13) { //SR14613
		    	CallBack('ControlChanged^COMViewFilterControl',el.id,value,event.keyCode);
		    }
	    }
	}
    if (Status==false) {
    	el=null;
    	event.cancelBubble=true;
    }
    return Status;
}
function CreateControl(pidControl,pidField,pblnEnableRemove) { // SR14250
   	var objRow = document.createElement('tr');
   	objRow.id='ctrl'+pidControl;
   	objRow.Field=pidField;
   	var objCell = document.createElement('td');objRow.appendChild(objCell);
   	objCell.id='ctrl'+pidControl+'_1';
   	objCell.style.fontSize=12;
	if (pblnEnableRemove == true) objCell.attachEvent('ondblclick',RemoveControl) // SR14250
   	var objCell = document.createElement('td');
   	objCell.id='ctrl'+pidControl+'_2';
   	objRow.appendChild(objCell);
   	var objCell = document.createElement('td');
   	objCell.id='ctrl'+pidControl+'_3';
   	objRow.appendChild(objCell);
	var objCell = document.createElement('td');
   	objCell.id='ctrl'+pidControl+'_4';
   	objCell.style.display='none';
   	objRow.appendChild(objCell);
   	var objCheck= document.createElement('input');
   	objCheck.attachEvent('onclick',ControlChanged);
   	objCheck.type='checkbox';
   	objCheck.id='display'+pidControl;
	objCell.appendChild(objCheck);
   	var objSpan= document.createElement('span');
   	objSpan.innerHTML='Com00202';  //Display
   	objCell.appendChild(objSpan);
   	var objCheck= document.createElement('input');
   	objCheck.attachEvent('onclick',ControlChanged);
   	objCheck.type='checkbox';
   	objCheck.id='group'+pidControl;
	objCell.appendChild(objCheck);
   	var objSpan= document.createElement('span');
   	objSpan.innerHTML='Com00201';  //Group?
   	objCell.appendChild(objSpan);
   	var objCheck= document.createElement('input');
   	objCheck.attachEvent('onclick',RadioChanged);
   	objCheck.type='radio';
   	objCheck.name='default';
   	objCheck.value=pidField;
   	objCheck.id='default'+pidControl;
	objCell.appendChild(objCheck);
   	var objSpan= document.createElement('span');
   	objSpan.innerHTML='Com00200';  //Default?;
   	objCell.appendChild(objSpan);
   	ctrl.appendChild(objRow);
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
    CallBack('PrintOptions^COMViewPrint');
   	Columns.show(event.screenX,event.screenY,200,120);
	window.setTimeout('Columns.show('+event.screenX+','+event.screenY+',200,Columns.document.body.children[0].offsetHeight);',50);
	event.returnvalue=false;
	event.cancelBubble=true
    return false;
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
function SearchHelp() {
    var strField=event.srcElement.Field;
    if (strField==null) {strField=event.srcElement.parentElement.Field;}
    if (strField==null) {strField=event.srcElement.parentElement.parentElement.Field;}
    if (strField==null) {strField=event.srcElement.parentElement.parentElement.parentElement.Field;}
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
			returnValue=findObjectForTag(objElement.parentElement,tagName);
		}
	}
	return returnValue;
}
//----------------------------------
//Custom Command callbacks
//----------------------------------
function CommandClick(pintCommand,pstrConfirmText) {
	var confirmed=1
	var Key=event.srcElement.parentElement.parentElement.Key
	if (pstrConfirmText!='') {
		confirmed=confirm(Key+' '+pstrConfirmText);
	}
	if (confirmed) {CallBack('CallBack^COMViewCommand',Key,pintCommand);}
	event.cancelBubble = true;
	return false;
}
//-->
//</script>
	

	function BuildCOMViewStructure() {
	 var obj,obj2,obj3,obj4,objDiv1
	 objDiv=document.createElement('div');
	 WWW.insertAdjacentElement('BeforeBegin',objDiv);
	 objDiv.style.display='none';
	 objDiv.style.backgroundColor=NetBorderColor;
	 objDiv.className='obj-div'; 
	 objDiv.id='objDIV';
	 objDiv.attachEvent('onkeydown',RowEvent);
	 objDiv.attachEvent('onclick',SearchSetFocus);
	 objDiv.attachEvent('onhelp',SearchHelp);
	 obj=document.createElement('table');objDiv.appendChild(obj);
	 obj.id='maintable';
	 obj.style.tableLayout='fixed';
	 obj.style.width='100%';
	 obj.style.height='100%';
	  obj2=document.createElement('tbody');obj.appendChild(obj2);
	   obj3=document.createElement('tr');obj2.appendChild(obj3);
	    obj4=document.createElement('td');obj3.appendChild(obj4);
	    obj4.className='fldChoose'; 
	    obj4.id='fldChoose';
	    obj4.vAlign='top';
	    obj4=document.createElement('td');obj3.appendChild(obj4);
	    obj4.className='fldChooseBar'; 
	    obj4.id='fldChooseBar';
	    obj4.innerHTML=4;
	    obj4.title='Com00157'  //Field Chooser
	    obj4.attachEvent("onmouseover",ChooseHighLight);
	    obj4.attachEvent("onmouseout",ChooseNormal);
	    obj4.attachEvent("onclick",ChooseShow);
	    objDiv1=document.createElement('td');obj3.appendChild(objDiv1);
	 	objDiv1.className='SearchDiv'; 
	 	objDiv1.vAlign='top';
	  obj=document.createElement('span');objDiv1.appendChild(obj);
	  obj.className='desc';
	  obj.id='desc';
	  obj=document.createElement('fieldset');objDiv1.appendChild(obj);
	  obj.className='fieldset-filt';
	   obj2=document.createElement('legend');obj.appendChild(obj2);
	   obj2.className='legend';
	   obj2.innerHTML='Com00109';  //Favourites
	   obj2=document.createElement('div');obj.appendChild(obj2);
	   obj2.className='filt';
	   obj2.id='filt';
	  obj=document.createElement('span');objDiv1.appendChild(obj);
	  obj.className='fieldset-save';
	  obj.id='buttonpanel';
	   cvCreateButton(obj,'new.gif','Com00185',NewView,'newFavourite'); // SR14249
	   cvCreateButton(obj,'open.gif','Com00191',EditView,'openFavourite'); // SR14249
	   cvCreateButton(obj,'save.gif','Com00192',SaveView,'saveFavourite'); // SR14249
	   cvCreateButton(obj,'del.gif','Com00193',DeleteView,'deleteFavourite'); // SR14249
	   obj2=document.createElement('img');obj.appendChild(obj2);
	   obj2.src=FilePath+'delimiter.gif';
	   obj2=cvCreateButton(obj,'print.gif','Com00170',PrintSelection,'printResultset'); // SR14249
	   obj2.attachEvent('oncontextmenu',PrintOptions);
	   obj2=cvCreateButton(obj,'copy.gif','Com00194',CopySelection,'copyResultset'); // SR14249
	   obj2=cvCreateButton(obj,'selectall.gif','Com00195',SelectAll,'selectallResultset'); // SR14249
	   obj2.style.display='none';
	   obj2.id='SelectAll';
obj2=cvCreateButton(obj,'property.gif','Export To Excel',ExportToExcel,'ExportToExcel');
obj2=cvCreateButton(obj,'grid.gif','Export To CSV',ExportToCSV,'ExportToCSV');
	   obj=document.createElement('br');objDiv1.appendChild(obj);
	  obj=document.createElement('fieldset');objDiv1.appendChild(obj);
	  obj.className='fieldset-ctrl';
	   obj2=document.createElement('legend');obj.appendChild(obj2);
	   obj2.className='legend';
	   obj2.innerHTML='Com00110';    //Field Selection
	   obj.appendChild(obj2);
	   obj2=document.createElement('div');obj.appendChild(obj2);
	   obj2.className='HdrCtrl';
	   obj2.id='hdrctrl';
	   obj2=document.createElement('table');obj.appendChild(obj2);
	   obj2.className='ctrltable';
	    obj3=document.createElement('tbody');obj2.appendChild(obj3);
		obj3.id='ctrl';
	  obj=document.createElement('div');objDiv1.appendChild(obj);
	  obj.className='hdr-div';
	  obj.style.setExpression('width','bdyDiv.clientWidth','JScript');
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
	  obj=document.createElement('hr');objDiv1.appendChild(obj);
	  obj.attachEvent("onmousedown",startBarResize);
	  obj.className='search-bar';
	  obj.id='searchbar';
	}
	function cvCreateButton(obj,src,title,event,pid) { // SR14249
	   var obj2=document.createElement('img');obj.appendChild(obj2);
	   obj2.src=FilePath+src;
	   obj2.className='coolButton';
	   obj2.title=title;  //SR12689
	   obj2.attachEvent('onclick',event);
	   obj2.id = pid
	   return obj2;
	}
// -->
//</script>
	
