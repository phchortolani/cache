
	<style>
	.fldChoose {
		display:none;
	}
	.fldChooseBar {
		font-family:webdings;
		text-align:left;
		padding:0px;
		height:100%;
		width:15px;
		display: inline;
		border:2px outset;
	}
	.SearchDiv {
		width:100%;
		display:inline;
	}
	.resize {
		position: absolute;
		overflow: hidden;
		top: 15%;
		right: -5px;
		width: 10px;
		height: 70%;
		font-size: 100px;
		background: url(/Development/grid.png) -75px 0px no-repeat;
		cursor: col-resize;
	}
	.search-bar {
		cursor:row-resize;
		width:80%;
		align:center;
		height:3px;
		border:2px outset darkgray;
		postion:relative;
	}
	.sort {
		display: none;
		overflow: hidden;
		width: 0px;
		height: 100%;
		vertical-align: top;
	}
	.sort-ascending {
		width: 16px;
		background: url(/Development/grid.png) -20px 50% no-repeat;
	}
	.sort-descending{
		width: 16px;
		background: url(/Development/grid.png) -40px 50% no-repeat;
	}
	.head {
		position: relative;
		overflow: hidden;
		height: 18px;
		vertical-align: top;
		border-width: 1px;
		border-style: none none solid none;
		border-color: #cbc7b8;
		padding-bottom: 1px;
		cursor:hand;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.row-light     {background-color: white;}
	.row-dark      {background-color: lightgrey;}
	.row-highlight {background-color: lightgreen;}
	.row-selected  {background-color: limegreen;}
	.desc {
		font-size:12pt;
		font-weight:bold;
		width:100%;
		background-color:steelblue;
		color:white;
		border: 1px outset darkslateblue;
		padding: 1px;
	}
	.fieldset-filt {
		position:relative;
		display:inline;
		width:70%;
	}
	.fieldset-save {
		position:relative;
		display:inline;
		width:25%;
		v-align:absbottom;
	}
	.fieldset-ctrl {
		position:relative;
		width:100%;
	}
	.legend {
		font-size:10pt;
		font-weight:bold;
	}
	.ctrltable {
		position:relative;
	}
	.hdr-div {
		width:100%;
		overflow:hidden;
		background-color: #d6d2c2!important;
	}
	.hdr-table {
		font-size:x-small;
		table-layout:fixed;
		position:relative;
	}
	.bdy-div {
		border:1px inset;
		position:relative;
		width:100%;
		overflow-x:auto;
		overflow-y:auto;
	}
	.bdy-table {
		cursor:hand;
		font-size:x-small;
		empty-cells:show;
		table-layout:fixed;
		position:relative;
	}
	.obj-div {
		overflow:auto;
	 	z-Index:'1';
	 	position:relative;
	 	width:100%;
	}
	thead {display:table-header-group;}
	@media print {	
   		.fieldset-save {display:none;}
   		.fieldset-filt {display:none;}
   		.fieldset-ctrl {display:none;}
   		.search-bar {display:none;}
   		.WWW-print {display:none;}
   		.bdy-div {overflow:visible!important;}
   		.row-light {background-color:white;}
   		.row-dark {background-color:white;}
   		.row-highlight {background-color:white;}
   		.row-selected {background-color:white;}
   		obj-div {background-color:white!important;}
   		obj-div {overflow:visible!important;}
   		bdy-head {display:table-header-group;}
   		hdr-div {display:none;}
   		BODY {background-color:white;}
	}
	</style>
	
