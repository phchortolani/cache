	function showPRLineItems(manualLink) {
		//alert('Offer ID: ['+offerID+'] -> Line Item ID: ['+lineItemID+']');
		//alert('Manual Link: '+manualLink);
		//alert('Location: '+window.location+'\n\n'+'Manual Link: '+manualLink);
		//var result = window.showModalDialog(manualLink,window.name,'DialogWidth: 780px; DialogHeight: 400px; resizable: yes; status: no');
		window.open(manualLink,window.name+'_Aggregation', "height=400,width=780,status=no,left=0,top=0,toolbar=no,menubar=no,location=no,resizable=yes");
		//alert('antes');
		//SAVENOW();
		//alert('depois');
	}