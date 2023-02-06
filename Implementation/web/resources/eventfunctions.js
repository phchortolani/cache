function eventSource(e) {
   var source;

   if (e.target) source = e.target;
   else if (e.srcElement) source = e.srcElement;

   return source;
}

function AttachArgs(objSrc) {
   if (typeof(objSrc) == "object") {
      objSrc.arguments = new Array();
      for (var i = 1; i < arguments.length; i++) {
         objSrc.arguments[i-1] = arguments[i];
      }
   }
}

function KeyDown_1(e) {
   if (!e) e = window.event;

   if (e.keyCode == 13) e.keyCode = 9;
}

function KeyDown_2(e) {
   if (!e) e = window.event;

   if (e.keyCode == 13) e.returnValue = false;
}

function Help(e) {
   var objSrc,
       YKEY,
       THISVALUE,
       YVARIA;

   if (!e) e = window.event;
   objSrc = eventSource(e);

   if (objSrc.arguments.length == 3) {
      YKEY = objSrc.arguments[0];
      THISVALUE = objSrc.arguments[1];
      YVARIA = objSrc.arguments[2];

      e.returnValue = false;
      e.cancelBubble = true;

      with(document.WWW) {
         retval = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,THISVALUE,"3",YVARIA);
      }
   }
}

function Change_1(e) {
   var objSrc,
       field1,
       field2;

   if (!e) e = window.event;
   objSrc = eventSource(e);

   if (objSrc.arguments.length == 2) {
      field1 = objSrc.arguments[0];
      field2 = objSrc.arguments[1];

      if (field1.value == "") {
         field2.value = objSrc.value;
      }
   }
}

function Blur_1(e) {
   var objSrc,
       YKEY,
       THISVALUE,
       YVARIA,
       condition1,
       field1,
       retval;

   if (!e) e = window.event;
   objSrc = eventSource(e);

   if (objSrc.arguments.length == 5) {
      YKEY = objSrc.arguments[0];
      THISVALUE = objSrc.arguments[1];
      YVARIA = objSrc.arguments[2];
      condition1 = objSrc.arguments[3];
      field1 = objSrc.arguments[4];

      with(document.WWW) {
         retval = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,THISVALUE,"2",YVARIA);
      }

      if (!condition1 && retval != "") field1.value = retval;
   }
}

function Blur_2(e) {
   var objSrc,
       YKEY,
       YVARIA,
       condition1,
       field1,
       field2,
       retval;

   if (!e) e = window.event;
   objSrc = eventSource(e);

   if (objSrc.arguments.length == 5) {
      YKEY = objSrc.arguments[0];
      YVARIA = objSrc.arguments[1];
      condition1 = objSrc.arguments[2];
      field1 = objSrc.arguments[3];
      field2 = objSrc.arguments[4];

      with(document.WWW) {
         retval = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,objSrc.checked,"2",YVARIA);
      }

      if (condition1 && retval != "") {
         field1.value = retval;
         if (retval == " ") field2.value = "";
      }
   }
}

function Blur_3(e) {
   var objSrc,
       YKEY,
       YVARIA,
       condition1,
       condition2,
       field1,
       selval;

   if (!e) e = window.event;
   objSrc = eventSource(e);

   if (objSrc.arguments.length == 5) {
      YKEY = objSrc.arguments[0];
      YVARIA = objSrc.arguments[1];
      condition1 = objSrc.arguments[2];
      field1 = objSrc.arguments[3];
      field2 = objSrc.arguments[4];
      selval = objSrc.value;

      if (!condition1 && selval.length < 50 || condition1) {
         var nach = String.fromCharCode(124),
             selval0 = selval.replace(/\r\n/g,nach);

         if (condition2) selval = selval0.substring(0,1000);

         with(document.WWW) {
            retval = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,selval,"2",YVARIA);
            if (retval != "") field1.value = retval;

            if (condition1 && condition2) {
               retval = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,"","6","LOCKSTART");

               for(var x = 1; x < 32; x++) {
                  selval = selval0.substring((x*1000),(x*1000+1000));
                  if (selval != "") {
                     retval = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,selval,"2","PLUS");
                  } else {
                     retval = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,"","6","LOCKEND");
                     break;
                  }
               }
            }
         }
      }
   }
}

function ClickOrBlur_1(e) {
   var objSrc,
       YKEY,
       YVARIA;

   if (!e) e = window.event;
   objSrc = eventSource(e);

   if (objSrc.arguments.length == 2) {
      YKEY = objSrc.arguments[0];
      YVARIA = objSrc.arguments[1];

      with(document.WWW) {
         retval = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,objSrc.checked,"2",YVARIA);
      }
   }
}

function Blur_4(e) {
   var objSrc,
       YKEY,
       YVARIA,
       selval,
       retval;

   if (!e) e = window.event;
   objSrc = eventSource(e);

   if (objSrc.arguments.length == 3) {
      YKEY = objSrc.arguments[0];
      YVARIA = objSrc.arguments[1];
      selval = objSrc.arguments[2];

      with(document.WWW) {
         retval = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,selval,"2",YVARIA);
      }
   }
}

function ChangeClickOrBlur_1(e) {
   var objSrc,
       YKEY,
       THISVALUE,
       YVARIA,
       field1,
       condition1,
       retval;

   if (!e) e = window.event;
   objSrc = eventSource(e);

   if (objSrc.arguments.length == 5) {
      YKEY = objSrc.arguments[0];
      THISVALUE = objSrc.arguments[1];
      YVARIA = objSrc.arguments[2];
      field1 = objSrc.arguments[3];
      condition1 = objSrc.arguments[4];

      with(document.WWW) {
         retval = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,THISVALUE,"2",YVARIA);
      }
      if (condition1 && retval != null) {
         charat = retval.charAt(0);
         if (retval != "") {
            field1.value = retval;
            if (retval == "") field1.value = "";
         }
      }
   }
}

function KeyDown_3(e) {
   var objSrc,
       YKEY,
       YVARIA;

   if (!e) e = window.event;
   objSrc = eventSource(e);

   if (objSrc.arguments.length == 2) {
      YKEY = objSrc.arguments[0];
      YVARIA = objSrc.arguments[1];

      if (e.keyCode == 13 || e.keyCode == 9) {
         if (e.keyCode == 13) e.keyCode = 9;
         with(document.WWW) {
            if (EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,objSrc.value,"1",YVARIA) == "1") {
               e.returnValue = false;
               OPENNOW();
            }
         }
      }
   }
}

function Change_2(e) {
   var objSrc,
       YKEY,
       YVARIA;

   if (!e) e = window.event;
   objSrc = eventSource(e);

   if (objSrc.arguments.length == 2) {
      YKEY = objSrc.arguments[0];
      YVARIA = objSrc.arguments[1];

      with(document.WWW) {
         if (EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,objSrc.value,"1",YVARIA) == "1") {
            e.keyCode = 0;
            OPENNOW();
         }
      }
   }
}

function KeyDown_4(e) {
   var objSrc,
       YKEY,
       YVARIA;

   if (!e) e = window.event;
   objSrc = eventSource(e);

   if (objSrc.arguments.length == 2) {
      YKEY = objSrc.arguments[0];
      YVARIA = objSrc.arguments[1];

      with(document.WWW) {
         if (e.keyCode == 13 || e.keyCode == 9) {
            if (e.keyCode == 13) e.keyCode = 9;
            if (EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX"+YKEY,objSrc.name,objSrc.value,"1",YVARIA) == "1") {
               e.returnValue = false;
               OPENNOW();
            }
         }
      }
   }
}

function MULTISELECT(objSrc) {
   var boxLength = objSrc.length,
       fieldinput = "",
       count = 0;

   for (i = 0; i < boxLength; i++) {
      if (objSrc.options[i].selected==true) {
         if (objSrc.options[i].value != "") {
            fieldinput = fieldinput + objSrc.options[i].value + ";";
         }
      }
      count++;
   }
   return fieldinput;
}

function DoDelItem(objSrc,objOSrc) {
   var option,
       options = objSrc.options,
       optionsX = objOSrc.options,
       newOption = new Array(),
       count = 0,
       length = options.length;

   for (i = length-1; i > -1; i--) {
      option = options[i];
      if (option.selected) {

 // newOption[count]=new Option(option.text,option.value,false,false);

         option.selected = false;
         newOption[count++] = option;
         options[i] = null;
      }
   }
   length = newOption.length-1;
   for (i = length; i > -1; i--) {
      optionsX[optionsX.length] = newOption[i];
   }
}

/* CODE ONLY USED IF blnFastMultiple equates to true */

   function DelItem(objSrc) { // No longer used due to SR11027
      var boxLength = objSrc.length,
          i,
          x;
      arrSelected = new Array();

      for (i = 0; i < boxLength; i++) {
         arrSelected[i] = objSrc.options[i].value;
      }
      for (i = 0; i < boxLength; i++) {
         for (x = 0; x < arrSelected.length; x++) {
            if (objSrc.options[i].value == arrSelected[x]) {
               objSrc.options[i] = null;
            }
         }
         boxLength = objSrc.length;
      }
   }

   function NewItem(objSrc,objOSrc,YHYPER) { // No longer used due to SR11027
      var x=0,
          selvalue,
          seltext,
          selvalue1, // Should seltext2 & seltext3 be declared ?
          seltext1,
          mode = (objSrc.name == objOSrc.name ? "5": "4");

      with(document.WWW) {
         selvalue = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX",objSrc.name,0,mode,"VALUE");
         seltext = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX",objSrc.name,0,mode,"TEXT1");

         if (YHYPER == 0) {
            seltext1 = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX",objSrc.name,0,mode,"TEXT2");
            seltext2 = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX",objSrc.name,0,mode,"TEXT3");
            seltext3 = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX",objSrc.name,0,mode,"TEXT4");
            seltext = seltext + seltext1 + seltext2 + seltext3;
         }
      }

      while (x < 1000) {
         selvalue1 = piece(selvalue,";",x+1);
         if (selvalue1 == "") break;
         seltext1 = piece(seltext,"|",x+1);
         if (seltext1 == "") seltext1 = selvalue1 + " - ";
         newoption = new Option(seltext1, selvalue1, false, false);
         objOSrc.options[x++] = newoption;
      }
   }

/**/

function SelectItem(objSrc,objOSrc,YHYPER,blnFastMultiple) {
   var satz = "",
       mode = (arguments.length == 5 ? "5" : "4");

   // document.WWW.style.cursor = 'wait';

   for(x = 0; x < objOSrc.options.length; x++) {
      if(objOSrc.options[x].selected == true) {
         satz = satz + objOSrc.options[x].value + ";";
      }
   }

   with(document.WWW) {
      retval = EventValue(YUCI.value,YUSER.value,YFORM.value,"FIX",(mode==4?objSrc.name:objOSrc.name),satz,mode,"");
   }

   if (blnFastMultiple) {

      DoDelItem(objOSrc,objSrc);

   } else {

      if (mode == "4") {
         DelItem(objSrc,objOSrc,YHYPER);
         NewItem(objSrc,objOSrc,YHYPER);
         DelItem(objSrc,objSrc,YHYPER);
         NewItem(objSrc,objSrc,YHYPER);
      } else {
         DelItem(objSrc,objSrc,YHYPER);
         NewItem(objSrc,objSrc,YHYPER);
         DelItem(objSrc,objOSrc,YHYPER);
         NewItem(objSrc,objOSrc,YHYPER);
      }

   }

   // document.WWW.style.cursor = 'auto';

}

function UnselectItem(objSrc,objOSrc,YHYPER,blnFastMultiple) {

  // simply a wrapper for SelectItem and passes in objects switched around

   SelectItem(objOSrc,objSrc,YHYPER,blnFastMultiple,"");

}

function EventCheckup(LOCKCHCK,TIMEOUT,pstrMessage_1,pstrMessage_2,pstrMessage_3) {

   retval = EventValue(document.WWW.YUCI.value,document.WWW.YUSER.value,document.WWW.YFORM.value,'FIX','WWWEVENT4',LOCKCHCK,'6','EventRequest');

   if (retval == 'REFRESH') {
      window.history.go(0);
   } else if (retval == 'RELOAD') {
      if (confirm(unescape(pstrMessage_1))) {
         retval = EventValue(document.WWW.YUCI.value,document.WWW.YUSER.value,document.WWW.YFORM.value,'FIX','WWWEVENT4',LOCKCHCK,'6','DataRequest');
      } else {
         alert(unescape(pstrMessage_2));
         retval = EventValue(document.WWW.YUCI.value,document.WWW.YUSER.value,document.WWW.YFORM.value,'FIX','WWWEVENT4',LOCKCHCK,'6','DeleteLock');
      }
      window.setTimeout('EventCheckup('+LOCKCHCK+','+TIMEOUT+')',TIMEOUT*1000);
   } else if (retval == 'INVALID') {
      if (confirm(unescape(pstrMessage_3))) {
         window.history.go(0);
      }
   } else {
      window.setTimeout('EventCheckup('+LOCKCHCK+','+TIMEOUT+')',TIMEOUT*1000);
   }
}

function RefreshCheck(pdkey,pstrMessage) {

   pdkey = unescape(pdkey);

   retval = EventValue(document.WWW.YUCI.value,document.WWW.YUSER.value,document.WWW.YFORM.value,'FIX','WWWEVENT4',pdkey,'6','RefreshCheck');

   if (retval !='' && retval == pdkey) {
      alert(unescape(pstrMessage));
      window.history.go(0);
   }
}

