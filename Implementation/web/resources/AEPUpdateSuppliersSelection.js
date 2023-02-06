function Remove() {
			hold : for (i = 0; i < document.WWW2.SelectedSuppliersList.options.length; i++) {
				if (document.WWW2.SelectedSuppliersList.options[i].selected == true && document.WWW2.SelectedSuppliersList.options[i].value!="null") {
					newOption = new Option(document.WWW2.SelectedSuppliersList.options[i].text, document.WWW2.SelectedSuppliersList.options[i].value);
					for (j = 0; j < preferredSuppliers.length; j++) {
				    	if (preferredSuppliersCode[j] == document.WWW2.SelectedSuppliersList.options[i].value) {
						    document.WWW2.PreferredSuppliersList.options[document.WWW2.PreferredSuppliersList.options.length] = newOption;
							continue hold;
						}
					}
				    document.WWW2.AllSuppliersList.options[document.WWW2.AllSuppliersList.options.length] = newOption;
			    }
			}
			for (i = document.WWW2.SelectedSuppliersList.options.length - 1; i >= 0; i--) {
				if (document.WWW2.SelectedSuppliersList.options[i].selected == true) {
					document.WWW2.SelectedSuppliersList.options[i] = null;
				}
			}
			updateSelectedSupplier();
		}
function Add() {
			for (i=0; i < document.WWW2.PreferredSuppliersList.options.length; i++) {
				if (document.WWW2.PreferredSuppliersList.options[i].selected == true && document.WWW2.PreferredSuppliersList.options[i].value!="null") {
					newOption = new Option(document.WWW2.PreferredSuppliersList.options[i].text, document.WWW2.PreferredSuppliersList.options[i].value);
					document.WWW2.SelectedSuppliersList.options[document.WWW2.SelectedSuppliersList.options.length] = newOption;
				}
			}
			for (i=document.WWW2.PreferredSuppliersList.options.length - 1; i >= 0; i--) {
				if (document.WWW2.PreferredSuppliersList.options[i].selected == true) {
					document.WWW2.PreferredSuppliersList.options[i] = null;
				}
			}
			for (i=0; i < document.WWW2.AllSuppliersList.options.length; i++) {
				if (document.WWW2.AllSuppliersList.options[i].selected == true && document.WWW2.AllSuppliersList.options[i].value!="null") {
					newOption = new Option(document.WWW2.AllSuppliersList.options[i].text, document.WWW2.AllSuppliersList.options[i].value);
					document.WWW2.SelectedSuppliersList.options[document.WWW2.SelectedSuppliersList.options.length] = newOption;
				}
			}
			for (i=document.WWW2.AllSuppliersList.options.length - 1; i >= 0; i--) {
				if (document.WWW2.AllSuppliersList.options[i].selected == true) {
					document.WWW2.AllSuppliersList.options[i] = null;
				}
			}
			updateSelectedSupplier();
		}
		function updateSelectedSupplier() {
			suppliersToSave = '';
			for (i = 0; i < document.WWW2.SelectedSuppliersList.options.length; i++) {
				suppliersToSave += document.WWW2.SelectedSuppliersList.options[i].value;
				if (i != document.WWW2.SelectedSuppliersList.options.length - 1)
					suppliersToSave += ';';
			}
				document.WWW2.YAEPNegotiationSupplierD1.value = suppliersToSave;
				var retval;
		//alert('Suppliers to Save:' + suppliersToSave);
				retval = EventValue(YUCI,YUSER,"AEPNegotiationSupplier",'FIX'+YKEY,'YAEPNegotiationSupplierD1',suppliersToSave,'2','YAEPNegotiationSupplierD1');
		//alert('retval: ' + retval);
		}
