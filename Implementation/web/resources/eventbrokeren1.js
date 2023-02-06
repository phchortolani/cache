

function retvalcheck(retval,Value,Funct,Field,htmlform) {
	
   if (htmlform == "") htmlform = "WWW";
   
   
   /*	SR15384 - unneccessary addition
   if (Funct == "3") {
      alert(retval);
     // return false;
   } */
   
   charat = retval.charAt(0);
   alerttext = retval.substr(1,retval.length);

   strDocument='document.';

   //SR15878
   if (Field == 'BeforeSave^WWWFORMValidation' && typeof(SaveAction) == 'function') {
      if (retval.search(/DefaultSubmit.+/g) == -1) {
         setTimeout('SaveAction(0)',100);
      }
   }

   if (charat=='þ') {
	charat='#';
        strDocument='window.parent.document.';
   }

   /* MOVE OVER TO USING THIS LAYOUT
   switch(charat) {
      case '!':
         alert(alerttext);
         retval = "";
         break;

      case '§':
         alert(alerttext);
         retval = " ";
         try {
	    document.getElementById(Field).focus();
         } catch(e) {}
         break;

      case '&':
         check = confirm(alerttext);
         retval = "";
         if (check == false) {
            retval = " ";
            try {
  	    	document.getElementById(Field).focus();
          } catch(e) {}
         }
         break;

      case '?':
         retval = "";
         retval = prompt(alerttext,Value);
         if (retval == null) retval = "";
         break;

      case '@':
         if (Funct == "1") {
            OPENNOW();
            alerttext = " ";
            charat = "";
         }
         if (alerttext == "") SAVENOW();
         break;

      case '#':
         while (x < 1000) {
            
            switch() {
               case '!':
                  break;
               case '@':
                  break;
               case '&':
                  break;
               case '':
                  break;
               default:
                  
            }
         }
         break;

      default:
   }
   return retval;
   */

   if (charat == "!") {
	  alert(alerttext);
      return("");
   }
   
   if (charat == "§") {
      alert(alerttext);
      
	
      document.getElementById(Field).value='';
      document.getElementById(Field).focus();
      return("");
   }
   if (charat == "&") {
	  selvalue = piece(alerttext,"~",2);
	  alerttext = piece(alerttext,"~",1);
	  
      check = confirm(alerttext);
      if (check == false) {
  	    document.getElementById(Field).value='';
	    document.getElementById(Field).focus();
      } else {
	     //SR17486 eval("document." + htmlform + "." + Field + ".value = '" + selvalue + "'");	// SR15384
	     if (document.getElementById(selfield)!=null) {
	         document.getElementById(Field).value = selvalue;	// SR15384  //SR17253 //SR17486 
	     }
      }
      return("");
   }
	   
   /* 		SR15384 - rewritten above
   if (charat == "§") {
      alert(alerttext);
      retval = " ";
 	document.getElementById(Field).focus();
       return(retval);
   }
   if (charat == "&") {
      check = confirm(alerttext);
      retval = "";
      if (check == false) {
         retval = " ";
	    document.getElementById(Field).focus();
      }
      return(retval);
   } */	   
   
   if (charat == "?") {		//SR15384 - this won't work with my changes. Doesn't look like it's in use though.
      retval = prompt(alerttext,Value);
      if (retval == null) retval = "";
      return(retval);
   }
   if (charat == "@") {
	  OPENNOW();
	  return("");		 		//SR15384
	  
      //if (Funct == "1") { OPENNOW(); alerttext = " "; charat = ""; }
      //if (alerttext == "") SAVENOW();
   }
   if (charat == "#") {
      var x = 0, check, okabbruch, selset, selfield, selvalue, retval, selvalue1, selvalue2, newoption, result;
      okabbruch = 1;
      alerttext = RemoveEscapedSign(EscapeTheUnescaped(alerttext)); // SR13792
      while (x < 1000) {
         selset = unescape(piece(alerttext,"#",x+1)); // SR13792 - included unescape
         if (selset == "") break; 
         charat = selset.charAt(0);
         if (charat == "!") {
            alert(selset.substr(1,selset.length));
            selset = "";
         }
         if (charat == "@") {
	        OPENNOW();				//SR15384
            //if (Funct == "1") { OPENNOW(); break; }
            //SAVENOW();
            break;
         }
         
         if (charat == "&") {
            check = confirm(selset.substr(1,selset.length));
            okabbruch = 1;
            if (check == false) okabbruch = 0;
            x++;
            selset = unescape(piece(alerttext,"#",x+1)); // SR13792 - included unescape
            charat = selset.charAt(0);
         }
         if (selset != "") {
            selfield = piece(selset,"~",1);
            if (okabbruch == 1) {
               selvalue = piece(selset,"~",2);
               selvalue1 = piece(selset,"~",3);
               selvalue2 = piece(selset,"~",4);
            }
            if (okabbruch == 0) {
               selvalue = piece(selset,"~",5);
               selvalue1 = piece(selset,"~",6);
               selvalue2 = piece(selset,"~",7);
            }
            if (selfield == "") break;
            if (selfield == "FUNCTION") { eval(selvalue); break; }
            if (selvalue2 == "") selvalue2 = x;
            if (selvalue == "BACKGROUND") {
               document.getElementById(selfield).style.background=selvalue1; //SR18182
               //SR18182 eval(strDocument + htmlform + "." + selfield + ".style.background = '" + selvalue1 + "'");
               selvalue1 = "";
            }
            if (selvalue == "REMOVE") {
	       selelem=document.getElementById(selfield);
               selmax = selelem.length;
               for (i = 1; i <= selmax; ++i) selelem.remove(0);
               selvalue = "";
            }
            if (selvalue1 != "") {
               newoption = new Option(selvalue1, selvalue, false, false);
		document.getElementById(selfield).options[selvalue2] = newoption;
            }
            if (selvalue1 == "") {
               if (selvalue == " ") selvalue = "";
               if (selvalue == "WRITE") {
                  if (eval(strDocument + htmlform + "." + selfield + ".type.indexOf('checkbox') > -1")) {
                     eval(strDocument + htmlform + "." + selfield + ".disabled = 0");
                     selvalue = "";
                  } else {
                     eval(strDocument + htmlform + "." + selfield + ".style.background = 'white'");
                     eval(strDocument + htmlform + "." + selfield + ".readOnly = false");
                     selvalue = "BACKGROUND";
                  }
               }
               if (selvalue == "READ") {
                  if (eval(strDocument + htmlform + "." + selfield + ".type.indexOf('checkbox') > -1")) {
                     eval(strDocument + htmlform + "." + selfield + ".disabled = 1");
                     selvalue = "";
                  } else {
                     eval(strDocument + htmlform + "." + selfield + ".style.background = 'lightgrey'");
                     eval(strDocument + htmlform + "." + selfield + ".readOnly = true");
                     selvalue = "";
                  }
               }
               if (selvalue != "UNCHECKED") {
                  if (selvalue != "BACKGROUND") {
	                 try {		// SR15384 - may not exist
	                  	//SR17486 eval(strDocument + htmlform + "." + selfield + ".value = selvalue");
				if (document.getElementById(selfield)!=null) {
		                  	document.getElementById(selfield).value = selvalue;	//SR17253  //SR17486
				}
                  	 } catch (e) { }
                  }
               }
               if (selvalue == "UNCHECKED") {
                  eval(strDocument + htmlform + "." + selfield + ".checked = 0");
                  eval(strDocument + htmlform + "." + selfield + ".value = 0");
               } 
               if (selvalue == "CHECKED") {
                  eval(strDocument + htmlform + "." + selfield + ".checked = 1");
                  eval(strDocument + htmlform + "." + selfield + ".value = 1");
               }
               if (selvalue == "BACKGROUND") selvalue = "";
            }
         }
         x++;
      }
      return "";
   } else return unescape(RemoveEscapedSign(EscapeTheUnescaped(retval)));
}



/* Escape any percent signs that are not immediately preceeded by ASCII nul. - SR13792
 */

function EscapeTheUnescaped(strRaw) {

   for (var i = 0; i < strRaw.length; i++) {
      if (strRaw.charAt(i) == '%') {
         if (i > 0 && strRaw.charAt(i-1) != String.fromCharCode(255)) {
            strRaw = strRaw.substring(0,i) + escape('%') + strRaw.substring(i+1,strRaw.length);
         } else if (i == 0) {
            strRaw = escape('%') + strRaw.substring(1,strRaw.length);
         }
      }
   }

   return (strRaw);
}

/* Remove any ASCII nuls that are followed by a string that matches the form of a javascript escaped string. - SR13792
 * ie. /%[\dA-F]{2}/i
 */

function RemoveEscapedSign(strRaw) {

   for (var i = 0; i < strRaw.length; i++) {
      if (strRaw.charAt(i) == '%' && i > 0 && strRaw.charAt(i-1) == String.fromCharCode(255) && unescape(strRaw.substr(i,3)) != strRaw.substr(i,3)) {
         if (i > 1) {
            strRaw = strRaw.substring(0,i-1) + strRaw.substring(i,strRaw.length);
         } else {
            strRaw = strRaw.substring(1,strRaw.length);
         }
      }
   }

   return (strRaw);
}

function makevisible(cur,which) {
   if (which == 0) {
      cur.filters.alpha.opacity = 100;
   } else {
      cur.filters.alpha.opacity = 60;
   }
}

function piece(txt,tr,nr) { //fis;11.05.05
   txt = txt + tr;
   var array = txt.split(tr);
   fpiece = array[nr-1];
   if (!(fpiece)) return('');
   return(fpiece);
}

function newModalDialog(url,para,height,width,resize) {  //fis;07.12.2004

   if (url == null) url = '';
   if (para == null) para = '';
   if (height == null || height == '') height = 450;
   if (width == null || width == '') width = 300;
   if (resize == 1) resize = 'yes'; else resize = 'no';

   if (url != '') {
      if (document.all) {
         url = url + '&YSEC='+new Date().getSeconds() + '&YRANDOM='+Math.random();
         var result = window.showModalDialog (url,para,'DialogHeight: ' + height + 'px; DialogWidth: ' + width + 'px; resizable: ' + resize + '; status: no; center: yes; help: no;');
         return result;
      } else {
         modalDialog = window.open(String(url),'','width=' + width + ', height=' + height + ', resizeable=' + resize + ', status=no, directories=no, menubar=no, titlebar=no, toolbar=no');
         if (para != '') modalDialog.dialogArguments = para;
         return 0;
      }
   }
}



function BEARB(wert,blnNoChange) {
	//alert('start BEARB');
	if (document.WWW.YBEARB!=null)  {
		if (typeof(CSPstartClock) != "undefined") {
		   CSPstartClock();
		}
	   	blnChanges = (blnNoChange != 1); 		// SR13195: boolean from cache to js
	   	//document.WWW.YBEARB.changes = blnChanges;
	   	parent.window.changes = blnChanges;		// SR14235 - save on parent window instead
	   
	   	if (wert!='') {
		   	document.WWW.YBEARB.value = wert;
			
		   	if (blnChanges) {
		    	  document.WWW.YBEARB.style.color="red";
		   	} else {
		    	  document.WWW.YBEARB.style.color="black";
		   	}
	   	}
   	}
   	//alert('end BEARB');
}

function SAVEKEY(funct) {
   if (funct == "NEXT") {
      document.WWW.target = "";
      document.WWW.YRICHT1 = "NEXT";
   } else if (funct == "BACK") {
      document.WWW.target = "";
      document.WWW.YRICHT1 = "BACK";
   } else if (funct == "SEARCH") {
      document.WWW.target = "";
      document.WWW.YOPEN.value = "SAVESEAR";
   }
   SAVENOW();
}

function SAVENOW(pYOPEN) {
  if (pYOPEN != 2) SaveAction(1);  //SR15878
	//DefaultSAVENOW(pYOPEN);
  //setTimeout('DefaultSAVENOW('+pYOPEN+')',1);
  setTimeout('DefaultSAVENOW("'+pYOPEN+'")',1); //SR15899
}

function DefaultSAVENOW(pYOPEN) {		//SR13195
    //alert('start DefaultSAVENOW');
    
	if (pYOPEN == "undefined" || typeof(pYOPEN) == "undefined" || pYOPEN=="") pYOPEN=0;  //SR15953
	if (pYOPEN==null) pYOPEN=0;
	
	if (pYOPEN==0) {		//SR13594
		with (document.WWW) {
			retval = EventValue(YUCI.value,YUSER.value,YFORM.value,'FIX','BeforeSave^WWWFORMValidation',YSEITE.value,'6','');
		}
	} else {
		DefaultSubmit(pYOPEN);
	}
	//alert('start DefaultSAVENOW');
}


//SR15878
function SaveAction(pFlag) {
  barElem = document.getElementById('HideButtons') ? document.getElementById('HideButtons') : null;
  if (barElem) {
    if (pFlag == 1) {
      barElem.style.height=document.body.clientHeight+200;
      barElem.style.width=document.body.clientWidth;
      barElem.style.visibility='visible';
    } else {
      barElem.style.visibility='hidden';
    }
  }
}

function DefaultSubmit(pYOPEN) {
	//alert('start DefaultSubmit');
	
	document.WWW.style.cursor = 'wait';
	window.focus();
	//document.WWW.submit();		//SR13195
	setTimeout('waitSAVE(\''+pYOPEN+'\')',300);
	//alert('end DefaultSubmit');
}


function waitSAVE(pYOPEN) {		// SR13195: Catch error if stopping submit.
	//alert('start waitSAVE');
	try {
		if (pYOPEN==0 || pYOPEN==2) BEARB('',1);
		document.WWW.YOPEN.value=pYOPEN;
		document.WWW.submit();
	} catch(e) {
		document.WWW.style.cursor='auto';
	}
}

function OPENNOW() {
	//alert('start OPENNOW');
	DefaultSubmit(1);		//SR13195
	//alert('end OPENNOW');
}


var lastpress = null;
var searchtext = '';
var waittime = 1000;

function QUICKSELECT(obj, event) {
   var keyno = event.keyCode;
   if (keyno != 40) {
      for (var k = 0; k < 10; k++) {
         if (keyno == (96+k)) keyno=(48+k);
      }
      var c = String.fromCharCode(keyno);
      var timestamp = new Date().getTime();
      var newpress = lastpress? timestamp - lastpress : waittime;
      if (newpress >= waittime) searchtext = c; else searchtext += c;
      lastpress = timestamp;
      var ret = new RegExp("^" + searchtext);
      for (var i = 0; i < obj.options.length; i++) {
         if (obj.options[i].value.match(ret)) {
            obj.selectedIndex = i;
            break;
         }
      }
   }
}

	


function PopulateComboBox(pstrRelationClass, pstrRelationKeys, pstrFormName, pstrFieldName, parrValues, parrKeys, pstrValue) {

	var valueToSelect = '';
	//var oldObj = eval('document.' + pstrFormName + '.' + pstrFieldName);
	var oldObj = document.getElementById(pstrFieldName);

	if (oldObj.type=='hidden') return false;



	var blnUpdateValue = false;
	if (oldObj.tagName != "SELECT") { //CORE-208
		var newSelect = document.createElement("select");
		var strName = oldObj.getAttribute('name');
		oldObj.setAttribute('name', strName + 'old');
		newSelect.setAttribute('id', strName);
		oldObj.parentNode.replaceChild(newSelect, oldObj);
 
		newSelect.setAttribute('tabIndex', oldObj.getAttribute('tabIndex')); 
		newSelect.setAttribute('name', oldObj.getAttribute('name')); 
		newSelect.setAttribute('onkeydown', oldObj.getAttribute('onkeydown')); 
		newSelect.setAttribute('onhelp', oldObj.getAttribute('onhelp')); 
		newSelect.setAttribute('onblur', oldObj.getAttribute('onblur')); 
		newSelect.setAttribute('onmouseover', oldObj.getAttribute('onmouseover')); 
		newSelect.setAttribute('onmouseout', oldObj.getAttribute('onmouseout')); 
		newSelect.setAttribute('onkeyup',function() { QUICKSELECT(this, event); });

		blnUpdateValue = true;
 	}

 	var objSelect = eval('document.' + pstrFormName + '.' + pstrFieldName);
 	if ((objSelect.getAttribute('relationClass') != pstrRelationClass) || (objSelect.getAttribute('relationKeys') != pstrRelationKeys)) {
 
		objSelect.setAttribute('relationClass', pstrRelationClass);
		objSelect.setAttribute('relationKeys', pstrRelationKeys);

		for (var idx = objSelect.length - 1; idx >= 0; idx--) {
			objSelect.options[idx] = null;
		}
	
		objSelect.options[0] = new Option("", "");
		for (var idx = 0; idx < parrValues.length; idx++) {
			objSelect.options[idx + 1] = new Option(parrValues[idx], parrKeys[idx]);
			//CORE-114
			blnUpdateValue=true;
	 		if (blnUpdateValue) {
				//if (parrKeys[idx] == pstrValue) {
				var strValue=';'+pstrValue+';';
				if (strValue.indexOf(';'+parrKeys[idx]+';')>-1) {
					objSelect.options[idx+1].selected='selected';
					//objSelect.selectedIndex = idx + 1;
				}
			} else {
				objSelect.value = "";
				//objSelect.onblur();
			}
		}
		//if (parrValues.length == 0) {
		//	objSelect.value = "";
			if (objSelect.onblur) objSelect.onblur();
		//}
	}
 }


document.write("<style>");
document.write(".coolBar	{background: buttonface;border-top: 1px solid buttonhighlight;	border-left: 1px solid buttonhighlight;	border-bottom: 1px solid buttonshadow; border-right: 1px solid buttonshadow; padding: 2px; font: menu;}");
document.write(".coolButton {border: 1px solid buttonface; padding: 1px; text-align: center; cursor: default;}");
<!--document.write(".coolButton IMG	{filter: gray();}");--!>
document.write("</style>");
