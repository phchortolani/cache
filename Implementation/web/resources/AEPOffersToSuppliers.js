	function Remove(type) {
		hold : for (i = 0; i < document.WWW2.OfferedSupplierList.options.length; i++) {
			if (document.WWW2.OfferedSupplierList.options[i].selected == true && document.WWW2.OfferedSupplierList.options[i].value!="null") {
				newOption = new Option(document.WWW2.OfferedSupplierList.options[i].text, document.WWW2.OfferedSupplierList.options[i].value);
				for (j = 0; j < preferredSuppliers.length; j++) {
			    	if (preferredSuppliers[j] == document.WWW2.OfferedSupplierList.options[i].text) {
					    document.WWW2.PreferredSupplierList.options[document.WWW2.PreferredSupplierList.options.length] = newOption;
						continue hold;
					}
				}
			    document.WWW2.SupplierList.options[document.WWW2.SupplierList.options.length] = newOption;
		    }
		}
		for (i = document.WWW2.OfferedSupplierList.options.length - 1; i >= 0; i--) {
			if (document.WWW2.OfferedSupplierList.options[i].selected == true) {
				document.WWW2.OfferedSupplierList.options[i] = null;
			}
		}
		updateSelectedSupplier(type);
	}
	function Add(type) {
		for (i=0; i < document.WWW2.PreferredSupplierList.options.length; i++) {
			if (document.WWW2.PreferredSupplierList.options[i].selected == true && document.WWW2.PreferredSupplierList.options[i].value!="null") {
				newOption = new Option(document.WWW2.PreferredSupplierList.options[i].text, document.WWW2.PreferredSupplierList.options[i].value);
				document.WWW2.OfferedSupplierList.options[document.WWW2.OfferedSupplierList.options.length] = newOption;
			}
		}
		for (i=document.WWW2.PreferredSupplierList.options.length - 1; i >= 0; i--) {
			if (document.WWW2.PreferredSupplierList.options[i].selected == true) {
				document.WWW2.PreferredSupplierList.options[i] = null;
			}
		}
		for (i=0; i < document.WWW2.SupplierList.options.length; i++) {
			if (document.WWW2.SupplierList.options[i].selected == true && document.WWW2.SupplierList.options[i].value!="null") {
				newOption = new Option(document.WWW2.SupplierList.options[i].text, document.WWW2.SupplierList.options[i].value);
				document.WWW2.OfferedSupplierList.options[document.WWW2.OfferedSupplierList.options.length] = newOption;
			}
		}
		for (i=document.WWW2.SupplierList.options.length - 1; i >= 0; i--) {
			if (document.WWW2.SupplierList.options[i].selected == true) {
				document.WWW2.SupplierList.options[i] = null;
			}
		}
		updateSelectedSupplier(type);
	}
	function updateSelectedSupplier(type) {
		suppliersToSave = '';
		for (i = 0; i < document.WWW2.OfferedSupplierList.options.length; i++) {
			suppliersToSave += document.WWW2.OfferedSupplierList.options[i].value;
			if (i != document.WWW2.OfferedSupplierList.options.length - 1)
				suppliersToSave += ';';
		}
		if (type==0) {
			document.WWW2.YAEPOfferBuyerD16.value = suppliersToSave;
			EventValue(YUCI,YUSER,YFORM,'FIX1','YAEPOfferBuyerD16',document.WWW2.YAEPOfferBuyerD16.value,'2','YAEPOfferBuyerD16');
		} else {
			document.WWW2.YAEPLotD26.value = suppliersToSave;
			EventValue(YUCI,YUSER,YFORM,'FIX1','YAEPLotD26',document.WWW2.YAEPLotD26.value,'2','YAEPLotD26');
		}
	}
