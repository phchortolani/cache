var objDiscSave = new Object();
objDiscSave.Name='DiscSave';

objDiscSave.Execute = function()
{
	strHTML=FCK.GetXHTML();
	if (strHTML.length<=FCKConfig.DiscMaxSize) {
		window.returnValue=FCK.GetXHTML();
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

var objButton = new FCKToolbarButton('DiscSave', 'Save', null, null, false, true, 3);

FCKToolbarItems.RegisterItem( 'DiscSave', objButton);