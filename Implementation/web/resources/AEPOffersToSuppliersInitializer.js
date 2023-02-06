	label1 : for (i = 0; i < preferredSuppliersCode.length; i++) {
		for (j = 0; j < selectedSuppliersCode.length; j++) {
			if (selectedSuppliersCode[j] == preferredSuppliersCode[i]) {
				document.WWW2.OfferedSupplierList.options[document.WWW2.OfferedSupplierList.length] = new Option(selectedSuppliers[j], selectedSuppliersCode[j]);
				continue label1;
			}
		}
		document.WWW2.PreferredSupplierList.options[document.WWW2.PreferredSupplierList.length] = new Option(preferredSuppliers[i], preferredSuppliersCode[i]);
	}
	label2 : for (i = 0; i < suppliersCode.length; i++) {
		for (j = 0; j < selectedSuppliersCode.length; j++) {
			if (selectedSuppliersCode[j] == suppliersCode[i]) {
				document.WWW2.OfferedSupplierList.options[document.WWW2.OfferedSupplierList.length] = new Option(selectedSuppliers[j], selectedSuppliersCode[j]);
				continue label2;
			}
		}
		document.WWW2.SupplierList.options[document.WWW2.SupplierList.length] = new Option(suppliers[i], suppliersCode[i]);
	}
