/*** ZEN Client Class Definitions ***/
/*** Package:   alZEN.Component ***/
/*** Namespace:   SESDF-V3 ***/
/*** Generated: 2014-04-08 07:11:10 ***/

// version number: must match %ZENVersion
js_alZEN_Component = 14;

// ================================================================================
_zenClassIdx['http://www.disclinc.com/AlphalincComponent/Menu'] = 'alZEN_Component_Menu';
function alZEN_Component_Menu(index,id) {
	if (index>=0) {alZEN_Component_Menu__init(this,index,id);}
}

function alZEN_Component_Menu__init(o,index,id) {
	('undefined' == typeof _ZEN_Component_composite__init) ?zenMaster._ZEN_Component_composite__init(o,index,id):_ZEN_Component_composite__init(o,index,id);
	o.ExpandWidth = '';
	o.TreeHeight = '';
	o.TreeWidth = '';
	o.Version = '';
}
function alZEN_Component_Menu_serialize(set,s)
{
	s[0]='3819671443';s[1]=this.index;s[2]=this.id;s[3]=this.name;s[4]=set.addObject(this.parent,'parent');s[5]=set.addObject(this.composite,'composite');s[6]=this.ExpandWidth;s[7]=this.TreeHeight;s[8]=this.TreeWidth;s[9]=this.Version;s[10]=this.align;s[11]=this.aux;s[12]=this.cellAlign;s[13]=this.cellSize;s[14]=this.cellStyle;s[15]=this.cellVAlign;s[16]=set.serializeList(this,this.children,true,'children');s[17]=(this.childrenCreated?1:0);s[18]=this.containerStyle;s[19]=(this.disabled?1:0);s[20]=(this.dragEnabled?1:0);s[21]=(this.dropEnabled?1:0);s[22]=(this.dynamic?1:0);s[23]=this.enclosingClass;s[24]=this.enclosingStyle;s[25]=this.error;s[26]=this.groupClass;s[27]=this.groupStyle;s[28]=this.height;s[29]=(this.hidden?1:0);s[30]=this.hint;s[31]=this.hintClass;s[32]=this.hintStyle;s[33]=this.label;s[34]=this.labelClass;s[35]=this.labelPosition;s[36]=this.labelStyle;s[37]=this.layout;s[38]=this.onafterdrag;s[39]=this.onbeforedrag;s[40]=this.onclick;s[41]=this.ondrag;s[42]=this.ondrop;s[43]=this.onhide;s[44]=this.onrefresh;s[45]=this.onshow;s[46]=this.onupdate;s[47]=this.overlayMode;s[48]=this.renderFlag;s[49]=(this.showLabel?1:0);s[50]=this.slice;s[51]=this.title;s[52]=this.tuple;s[53]=this.valign;s[54]=(this.visible?1:0);s[55]=this.width;
}
function alZEN_Component_Menu_getSettings(s)
{
	s['name'] = 'string';
	s['ExpandWidth'] = 'string';
	s['TreeHeight'] = 'string';
	s['TreeWidth'] = 'string';
	s['Version'] = 'string';
	this.invokeSuper('getSettings',arguments);
}

function alZEN_Component_Menu_onlayoutHandler(load) {
alert(2);
}

function alZEN_Component_Menu_onmenuclick(menu) {
var result;
result=1;
if (zenThis.composite!="") {
switch(menu) {
case 'About':
result=this.onmenuclickAbout();
break;
case 'Refresh':
result=zenThis.composite.onmenuclickRefresh();
default:
result=1;
}
}
return result;
}

function alZEN_Component_Menu_onmenuclickRefresh() {
alert('onrefreshclick');
return 1;
}

function alZEN_Component_Menu_setProperty(property,value,value2) {
switch(property) {
case 'height':
document.getElementById(this.id).height=(value-50)+'px';
var height=value-2-document.getElementById(this.id+'.cMenuHeader').offsetHeight;
document.getElementById(this.id+'.cMenuBody').style.height=(height-60)+'px';
break;
default:
return this.invokeSuper('setProperty',arguments);
}
return true;
}

function alZEN_Component_Menu_treeClick(tree) {
var Form=tree.getProperty('value').split('~')[2];
if (Form!=undefined) {
tree.setProperty('value',Form)
zenPage.treeClick(tree);
} else {
var cMenuBody=zenPage.getComponentById(this.id+'.cMenuBody');
cMenuBody.toggleExpanded(cMenuBody.getSelectedIndex());
}
return 1;
}

function alZEN_Component_Menu_DoRefresh() {
	return zenInstanceMethod(this,'DoRefresh','','STATUS',arguments);
}

function alZEN_Component_Menu_ReallyRefreshContents() {
	zenInstanceMethod(this,'ReallyRefreshContents','','',arguments);
}

function alZEN_Component_Menu_onmenuclickAbout() {
	return zenInstanceMethod(this,'onmenuclickAbout','','STATUS',arguments);
}
function alZEN_Component_Menu__Loader() {
	zenLoadClass('_ZEN_Component_composite');
	alZEN_Component_Menu.prototype = zenCreate('_ZEN_Component_composite',-1);
	var p = alZEN_Component_Menu.prototype;
	p.constructor = alZEN_Component_Menu;
	p.superClass = ('undefined' == typeof _ZEN_Component_composite) ? zenMaster._ZEN_Component_composite.prototype:_ZEN_Component_composite.prototype;
	p.__ZENcomponent = true;
	p._serverClass = 'alZEN.Component.Menu';
	p._type = 'Menu';
	p.serialize = alZEN_Component_Menu_serialize;
	p.getSettings = alZEN_Component_Menu_getSettings;
	p.DoRefresh = alZEN_Component_Menu_DoRefresh;
	p.ReallyRefreshContents = alZEN_Component_Menu_ReallyRefreshContents;
	p.onlayoutHandler = alZEN_Component_Menu_onlayoutHandler;
	p.onmenuclick = alZEN_Component_Menu_onmenuclick;
	p.onmenuclickAbout = alZEN_Component_Menu_onmenuclickAbout;
	p.onmenuclickRefresh = alZEN_Component_Menu_onmenuclickRefresh;
	p.setProperty = alZEN_Component_Menu_setProperty;
	p.treeClick = alZEN_Component_Menu_treeClick;
}
/* EOF */