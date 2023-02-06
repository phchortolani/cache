function DynTable_CreateHeader(table_section, row) {
	var curTR = document.createElement('TR'), curTH, b;
	table_section.appendChild(curTR);
	for (var i = 0; i < row.cells.length; i++) {
		curTR.appendChild(row.cells[i]);
	}
	curTR.className = 'THkey';
}
function DynTable_CreateRow(table_section, row, idrow, exec, Key) {
	var curTR = document.createElement('TR'), curTD, e, i, j;
	table_section.appendChild(curTR);
	for (i = 0; i < row.cells.length; i++) {
		curTR.appendChild(row.cells[i]);
	}
	curTR.className = (idrow%2==1) ? 'row-dark':'row-light';
	if (exec!=null)	{
		curTR.attachEvent("onclick",DynTable_RowClick);
	}
	curTR.attachEvent("onmouseover",DynTable_SelectRow);
	curTR.attachEvent("onmouseout",DynTable_RowMouseOut);
	curTR.Row=idrow;
	curTR.id='Dynbdy'+idrow;
	curTR.Key=Key;
	curTR.exec=exec;
}
function DynTable_SelectRow(pEvent,pNewRow) {
	if (pNewRow==null) {
		var objRow=findObjectForTag(event.srcElement,'TR');
		if (objRow!=null) {
			pNewRow=objRow.Row;
		}
	}
	if (pNewRow!=null) {
		var objRow=document.getElementById("Dynbdy"+pNewRow);
		objRow.className= 'row-selected';
	}
}
function DynTable_RowMouseOut() {
	var objRow=findObjectForTag(event.srcElement,'TR');
	if (objRow!=null) {
		objRow.className = (objRow.Row%2==1) ? 'row-dark':'row-light';
	}
}
function DynTable_RowClick(pEvent,pKey,exec) {
	var objRow
	var exec
	if (pKey==null) {
		objRow=findObjectForTag(event.srcElement,'TR');
		if (objRow!=null) {
			pKey=objRow.Key;
			exec=objRow.exec;
		}
	}
	var idrow=getRowNum(getFocusField());
	CallBack("RowClick^WWW120DynTable",exec,idrow,pKey);
}
function DynTable_AddHeaderCell(row, align, display, color) {
	var i = row.cells.length;
	row.cells[i] = document.createElement('th');
	if (color!="") {
	  row.cells[i].style.background = color;
	}
	row.cells[i].style.fontSize = 12;
	row.cells[i].align = align;
	e = document.createElement('b');
	e.innerHTML = display;
	row.cells[i].appendChild(e);
	row.cells[i].className='TDfld';
}
function DynTable_AddDataCell(row, align, display, color) {
	var i = row.cells.length, e;
	row.cells[i] = document.createElement('td');
	if (color!="") {
	  row.cells[i].style.background = color;
	}
	row.cells[i].style.fontSize = 12;
	row.cells[i].align = align;
	e = document.createElement('span');
	e.innerHTML = display;
	row.cells[i].appendChild(e);
	row.cells[i].className='DIVtxt';
}
function DynTable_AddDataCellWithLink(row, data, align, href, onclick, display, color) {
	var i = row.cells.length, j, e;
	row.cells[i] = document.createElement('td');
	if (color!="") {
	  row.cells[i].style.background = color;
	}
	row.cells[i].style.fontSize = 12;
	row.cells[i].align = align;
	e = document.createElement('a');
	e.DiscData = new Array();
	for (j = 0; j < data.length; j++) { e.DiscData[j] = data[j]; }
	
	e.innerHTML = display;
	e.href = href;
	e.onclick = onclick;
	row.cells[i].appendChild(e);
	row.cells[i].className='DIVtxt';
}
function DebugShowAlert(i) {
	alert(i);
}
