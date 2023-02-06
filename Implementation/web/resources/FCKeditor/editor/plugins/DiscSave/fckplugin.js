var objDiscSave = new Object();
var strDialogHeight='';
var strDialogWidth='';
var strHTML;

objDiscSave.Name='DiscSave';

objDiscSave.Execute = function()
{
	strHTML=FCK.GetXHTML();
	if (strHTML.length<=FCKConfig.DiscMaxSize) {
		//window.returnValue=strDialogHeight+'~'+strDialogWidth+'~'+strHTML;
		parent.returnValue=strDialogHeight+'~'+strDialogWidth+'~'+strHTML;
		alert(FCKConfig.DiscSaveAlert);
		
	} else {
	  alert(FCKConfig.DiscSaveError);
	}
	
}

objDiscSave.GetState = function()
{
	return FCK_TRISTATE_OFF;
}

FCKCommands.RegisterCommand('DiscSave',objDiscSave);

var objButton = new FCKToolbarButton('DiscSave', FCKLang.DlgImgUpload, null, null, false, true, 3);

FCKToolbarItems.RegisterItem( 'DiscSave', objButton);




//----------------------------------------------------------------------
var objDiscWindowSize = new Object();
objDiscWindowSize.Name='DiscWindowSize';

objDiscWindowSize.Execute = function()
{
	//strDialogHeight=window.dialogHeight;
	//strDialogWidth=window.dialogWidth;
	strDialogHeight = window.dialogHeight ? window.dialogHeight : document.body.clientHeight + 'px';
	strDialogWidth = window.dialogWidth ? window.dialogWidth : document.body.clientWidth + 'px';
	//window.returnValue=strDialogHeight+'~'+strDialogWidth;
	parent.returnValue=strDialogHeight+'~'+strDialogWidth;
	if (strHTML!=undefined) {
		;window.returnValue=window.returnValue+'~'+strHTML;
		parent.returnValue=window.returnValue+'~'+strHTML;
	}

}

objDiscWindowSize.GetState = function()
{
	return FCK_TRISTATE_OFF;
}

FCKCommands.RegisterCommand('DiscWindowSize',objDiscWindowSize);

var objButtonWindowSize = new FCKToolbarButton('DiscWindowSize', 'Size', null, null, false, true, 66);

FCKToolbarItems.RegisterItem( 'DiscWindowSize', objButtonWindowSize);