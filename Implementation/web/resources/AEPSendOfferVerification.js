function verifySendingOffer() {
 //alert('verifySendingOffer');

 var returnMessage='';

 // Checking Offer's date.
 var effectiveFromFormDate = new String(WWW2.YAEPOfferD5.value);
 var effectiveToFormDate = new String(WWW2.YAEPOfferD6.value); 
 
 if ( (effectiveFromFormDate.length == 0) || (effectiveToFormDate.length == 0) ) {
  returnMessage = returnMessage + err03 + '\n';
 } else {
 
  var effectiveFrom = new Date();
  var actualDate = new Date();
  var effectiveTo = new Date();
  
  effectiveTo.setFullYear(effectiveToFormDate.substring(6,10));
  effectiveFrom.setFullYear(effectiveFromFormDate.substring(6,10));
  if (isEuropeanFormatDate) {
   effectiveFrom.setMonth(effectiveFromFormDate.substring(3,5) - 1);
   effectiveFrom.setDate(effectiveFromFormDate.substring(0,2));
   effectiveTo.setMonth(effectiveToFormDate.substring(3,5) - 1);
   effectiveTo.setDate(effectiveToFormDate.substring(0,2));
  } else {
   effectiveFrom.setMonth(effectiveFromFormDate.substring(0,2) - 1);
   effectiveFrom.setDate(effectiveFromFormDate.substring(3,5));
   effectiveTo.setMonth(effectiveToFormDate.substring(0,2) - 1);
   effectiveTo.setDate(effectiveToFormDate.substring(3,5));
  }

  if (effectiveFrom.getTime() > effectiveTo.getTime()) {
   returnMessage = returnMessage + err04 + '\n';
  } else if (effectiveTo.getTime() < actualDate.getTime()) {
   returnMessage = returnMessage + err05 + '\n';
  }
 }

 //alert('Effective From: ' + effectiveFrom);
 //alert('Effective To: ' + effectiveTo);

 // Checking destination values.
 var destinationType = WWW2.YAEPOfferD14.value;
 var offeredTo = '';
 if (destinationType==destinationTypeCustomer) {
   var offeredTo;
   offeredTo="";
   for(x=0;x<document.WWW2.YAEPOfferD15.length;x++)
   {
     offeredTo = offeredTo + document.WWW2.YAEPOfferD15.options[x].value + ";";
   }
   if (offeredTo.length==0) {
     offeredTo = WWW2.YAEPOfferD15.value;
   }
 } else if (destinationType==destinationTypeSupplier) {
   var offeredTo;
   offeredTo="";
   for(x=0;x<document.WWW2.YAEPOfferD16.length;x++)
   {
     offeredTo = offeredTo + document.WWW2.YAEPOfferD16.options[x].value + ";";
   }
   if (offeredTo.length==0) {
     offeredTo = WWW2.YAEPOfferD16.value;
   }
 } else {
  returnMessage = returnMessage + err01 + '\n';
 }
 
 if (offeredTo.length==0) {
  returnMessage = returnMessage + err02 + '\n';
 }

 // Checking if the Supplier or Customer is registered.
 var offeredList = offeredTo.split(';');
 var i,j;
 for (i = 0; i < offeredList.length; i++) {
  
  if (offeredList[i].length == 0) {
   continue;
  }

  if (destinationType==destinationTypeSupplier) { 
   var isSupplierRegistered = 0; 
   for (j = 0; j < suppliersRegistered.length; j++) {
    if (offeredList[i] == suppliersRegistered[j]) {
     isSupplierRegistered = 1;
     break;
    }
   }
   if (isSupplierRegistered == 0) {
    returnMessage = returnMessage + err17 + '(' + offeredList[i] + ')' + '\n';
   }
  } 
  
  else if (destinationType==destinationTypeCustomer) {
   var isCustomerRegistered = 0; 
   for (j = 0; j < customersRegistered.length; j++) {
    if (offeredList[i] == customersRegistered[j]) {
     isCustomerRegistered = 1;
     break;
    }
   }
   if (isCustomerRegistered == 0) {
    returnMessage = returnMessage + err17 + '(' + offeredList[i] + ')' + '\n';
   }
  }
 }

 //alert('Return Message: \n\n' + returnMessage);
 return returnMessage;
}
