/* ------------------------------------------------------------------------------------- */
/*
   Autor   : Andreas Zierhut
   Stand   : 20.01.1999, V1.04
   Homepage: http://home.t-online.de/home/javascript/
   E-Mail  : Andreas.Zierhut@t-online.de
   Hinweis : Das Script darf kostenlos weiterverwendet werden, solange dieser Kommentar
             im Script verbleibt. Evtl. Updates sind auf meiner Homepage zu finden.
             Bei Fehlern bitte ein E-Mail an mich schreiben.
                                                                                         */
/* ------------------------------------------------------------------------------------- */

var ns = document.layers ? true : false;
var ie = document.all ? true : false;

var mCount = 0;
var mList = new Array();

function Menu(links, oben)
{
  mList[mList.length] = this.name;

  this.itemList = new Array();

  this.bgColor = 'lightgrey';
  this.aborderColor = 'dimgray';
  this.aborderWidth = 1;

  this.iborderColor = 'whitesmoke';
  this.iborderWidth = 1;

  this.align = 'left';
  this.valign = 'top';
  this.alignTD = 'left';

  this.color = '#000000';
  this.fontFamily = 'Arial,Helvetica,Sans-Serif';
  this.fontSize = '80%';
  this.textDecoration = 'none';
  this.fontStyle = 'normal';
  this.fontWeight = '100';

  this.hoverOn = true;
  this.hoverColor = this.bgColor;
  this.hoverbgColor = 'dimgray';

  if (links && oben) {
    this.left = links;
    this.top = oben;
  }
  else {
    this.left = 0;
    this.top = 0;
  }

  this.SP = '<img src="spacer.gif" width="' + this.iborderWidth + '" height="' + this.iborderWidth + '" alt="-">';

}

function MenuInit()
{
  if (lMenu.align == 'center') {
    if (ns)
      document.Menue0.left = document.Menue0.pageX + (window.innerWidth - document.Menue0.pageX) / 2 - (document.Menue0.document.width / 2);
    else if (ie)
      document.all.Menue0.style.posLeft = document.all.MenuePosition.offsetLeft + (document.body.clientWidth - document.all.MenuePosition.offsetLeft) / 2 - (document.all.Menue0.offsetWidth / 2);
  }
  else if (ie)
    document.all.Menue0.style.posLeft = document.all.MenuePosition.offsetLeft;

  if (lMenu.valign == 'center') {
    if (ns)
      document.Menue0.top = document.Menue0.pageY + (window.innerHeight - document.Menue0.pageY) / 2 - (document.Menue0.document.height / 2);
    else if (ie)
      document.all.Menue0.style.posTop = document.all.MenuePosition.offsetTop + (document.body.clientHeight - document.all.MenuePosition.offsetTop) / 2 - (document.all.Menue0.offsetHeight / 2);
  }
  else if (ie)
    document.all.Menue0.style.posTop = document.all.MenuePosition.offsetTop;
}

if (ie || ns) {
  Menu.prototype.addMenu = paddMenu;
  Menu.prototype.addMenuItem = paddMenuItem;
  Menu.prototype.build = pbuild;
  Menu.prototype.create = pcreate;
}

function paddMenu(Name, Link, Target, Bezeichnung)
{
  window[Name] = new Menu();
  this.itemList[this.itemList.length] = window[Name];

  window[Name].link = Link;
  window[Name].target = Target;
  window[Name].bez = Bezeichnung;
}

function paddMenuItem(Link, Target, Bezeichnung)
{
  this.itemList[this.itemList.length] = Link + ';' + Target + ';' + Bezeichnung;
}

function pbuild()
{
  this.idx = mCount;
  this.name = 'Menue' + mCount;

  window['Menue' + mCount++] = this;

  if (!this.idx) {
    this.ModX = (ie ? document.all.MenuePosition.offsetLeft : document.MenuePosition.pageX);
    this.ModY = (ie ? document.all.MenuePosition.offsetTop : document.MenuePosition.pageY);
  }

  this.Style = '<style type="text/css">\n';

  this.Dok = '';
  this.create(-1);

  if (ns && this.hoverOn)
    for (var i=0; i < this.itemList.length; i++)
      this.create(i);

  this.Style += '  .L' + this.name + ' { color: ' + this.color + '; font-family: ' + this.fontFamily + '; font-size: ' + this.fontSize + '; text-decoration: ' + this.textDecoration + '; font-style: ' + this.fontStyle + '; font-weight: ' + this.fontWeight + '; }\n';
  this.Style += '  .H' + this.name + ' { color: ' + this.hoverColor + '; font-family: ' + this.fontFamily + '; font-size: ' + this.fontSize + '; text-decoration: ' + this.textDecoration + '; font-style: ' + this.fontStyle + '; font-weight: ' + this.fontWeight + '; }\n';
  this.Style += '</style>';

  document.write (this.Style + this.Dok);


}

function pcreate(Index)
{

  var LayerName = (Index == -1 ? this.name : this.name + 'Item' + Index);

  this.Style += '  #' + LayerName + ' { position: absolute; left: ' + (this.idx ? 0 : this.left + this.ModX) + '; top: ' + (this.idx ? 0 : this.top + this.ModY) + '; width: 1; visibility: ' + (this.idx || Index != -1 ? 'hidden' : 'visible') + '; z-Index: 2; }\n';

  this.Dok += '<span id="' + LayerName + '">\n' +
              '<table border=0 cellspacing=0 cellpadding=' + this.aborderWidth + '><tr><td bgColor="' + this.aborderColor + '">\n' +
              '  <table border=0 cellspacing=0 cellpadding=0>\n' +
              '    <tr>\n' +
              (!this.idx ? '      <td colspan="' + (this.itemList.length*2+1) + '" bgColor="' + this.iborderColor + '">' + this.SP + '</td>\n' +
              '    </tr>\n' +
              '    <tr>\n' : '');

  for (var i=0; i < this.itemList.length; i++) {

    this.Dok += (this.idx ? '      <td bgColor="' + this.iborderColor + '">' + this.SP + '</td><td bgColor="' + this.iborderColor + '">' + this.SP + '</td><td bgColor="' + this.iborderColor + '" align="right"><a name="aM' + this.idx + 'Pos' + i + '">' + this.SP + '</a></td>\n' +
                '    </tr>\n' +
                '    <tr>\n' : '') +
                '      <td bgColor="' + this.iborderColor + '" valign="bottom">' + (!this.idx ? '<a name="aM' + this.idx + 'Pos' + i + '">' : '') + this.SP + '</a></td>\n';

    if (i != Index)
      this.Dok += '      <td align="' + this.alignTD + '" ' + (ns ? 'bgColor="' + this.bgColor + '"' : 'id="' + this.name + 'Hintergrund' + i + '" style="background-color: ' + this.bgColor + ';"') + '><nobr>';
    else
      this.Dok += '      <td align="' + this.alignTD + '" bgColor="' + this.hoverbgColor + '"><nobr>';

    if (typeof(this.itemList[i]) == 'string')
      this.Dok += '&nbsp;<a href="' + this.itemList[i].split(';')[0] + '" target="' + this.itemList[i].split(';')[1] + '" class="' + (i != Index ? 'L' : 'H') + this.name + '"' + (Index == -1 ? ' onMouseOver=" if (window.Menue' + this.idx + '.hoverOn) hoverMenu(' + this.idx + ', ' + i + ');checkMenu(' + this.idx + ')"' : '') + ' name="' + this.name + 'A' + i + '">' + this.itemList[i].split(';')[2] + '</a>&nbsp;';

    else {
      this.Dok += '&nbsp;<a href="' + this.itemList[i].link + '" target="' + this.itemList[i].target + '" class="' + (i != Index ? 'L' : 'H') + this.name + '"' + (Index == -1 ? ' onMouseOver="if (window.Menue' + this.idx + '.hoverOn) hoverMenu(' + this.idx + ', ' + i + ');checkMenu(' + this.idx + ');showMenu(' + this.idx + ', ' + i + ', ' + mCount + ')"' : '') + ' name="' + this.name + 'A' + i + '">' + this.itemList[i].bez + '</a>&nbsp;';
      if (Index == -1)
        this.itemList[i].build();
    }

    this.Dok += '</nobr></td>\n' +
                (this.idx ? '      <td bgColor="' + this.iborderColor + '">' + this.SP + '</td>' +
                '    </tr>\n' : '');

  }

  this.Dok += (this.idx ? '    <tr>\n' +
              '      <td bgColor="' + this.iborderColor + '" colspan="3">' + this.SP + '</td>\n' : '<td bgColor="' + this.iborderColor + '">' + this.SP + '</td>') +
              (!this.idx ? '    <tr>\n' +
              '      <td colspan="' + (this.itemList.length*2+1) + '" bgColor="' + this.iborderColor + '">' + this.SP + '</td>\n' : '') +
              '    </tr>\n' +
              '  </table>\n' +
              '</td></tr></table>\n' +
              '</span>\n';

}

var offen = '0,';
if (ns) document.captureEvents(Event.CLICK);
document.onclick = new Function ('hideHoverMenu(); checkMenu(0)');
var hoverMenuOn = -1;
var hoverMenuAktuell = -1;

function hoverMenu(Aktuell, AnkerPos)
{
  if (hoverMenuOn != AnkerPos) {

    hideHoverMenu();

    hoverMenuAktuell = Aktuell;
    hoverMenuOn = AnkerPos;
    var Menue = window['Menue'+Aktuell];

    if (ns) {

      var LN = Menue.name + 'Item' + AnkerPos;

      with (document[LN]) {
        left = window.document['Menue'+Aktuell].pageX;
        top  = window.document['Menue'+Aktuell].pageY;
        visibility = 'visible';
      }

      HoverObj = document['Menue'+Aktuell].document.links[AnkerPos];
      HoverObj2 = document[LN].document.links[AnkerPos];

    }
    else if (ie) {
      document.all['Menue'+Aktuell+'Hintergrund'+AnkerPos].style.backgroundColor = Menue.hoverbgColor;
      document.all['Menue'+Aktuell+'A'+AnkerPos].style.color = Menue.hoverColor;
    }

    if (ns) document.captureEvents(Event.MOUSEMOVE);
    document.onmousemove = hideHoverMenu;

  }

}

var HoverObj = null;
var HoverObj2 = null;

function hideHoverMenu(evt)
{

  if ((ie && hoverMenuAktuell != -1 && event.srcElement.style.color != window['Menue'+hoverMenuAktuell].hoverColor.toLowerCase()) || (ns && hoverMenuAktuell != -1 && hoverMenuOn != -1 && (!evt || evt.target != HoverObj && evt.target != HoverObj2))) {

    if (ie) {

      var Menue = window['Menue'+hoverMenuAktuell];
      document.all['Menue'+hoverMenuAktuell+'Hintergrund'+hoverMenuOn].style.backgroundColor = Menue.bgColor;
      document.all['Menue'+hoverMenuAktuell+'A'+hoverMenuOn].style.color = Menue.color;

    }

    if (ns)
      document['Menue'+hoverMenuAktuell+'Item'+hoverMenuOn].visibility = 'hidden';

    document.onmousemove = null;

    hoverMenuAktuell = -1;
    hoverMenuOn = -1;
    HoverObj = null;
    HoverObj2 = null;

  }

}

function checkMenu(Vorgaenger)
{
  offen = offen.substring(0, offen.length-1);
  var offeneMenues = offen.split(',');

  for (var i=offeneMenues.length-1; i >= 0; i--) {

    if (Vorgaenger == parseInt(offeneMenues[i])) {

      offen = '';
      for (var j=0; j <= i; j++)
        offen += offeneMenues[j] + ',';
      break;

    }
    else
      with (ns ? document['Menue'+offeneMenues[i]] : document.all['Menue'+offeneMenues[i]].style)
        visibility = 'hidden';

  }
}

function showMenu(Vorgaenger, AnkerPos, Aktuell)
{
  var Menue = window['Menue'+Aktuell];

  var ModX = (Vorgaenger ? Menue.aborderWidth + Menue.iborderWidth : -1 * Menue.aborderWidth);
  var ModY = (Vorgaenger ? -1 * Menue.aborderWidth : 2 * Menue.iborderWidth + Menue.aborderWidth);

  if (offen.indexOf(''+Aktuell) == -1)
    offen += Aktuell + ',';

  if (ns) {

    var anker = document['Menue'+Vorgaenger].document.anchors['aM'+Vorgaenger+'Pos'+AnkerPos];

    with (document['Menue'+Aktuell]) {
      left = anker.x + window.document['Menue'+Vorgaenger].pageX + ModX;
      top = anker.y + window.document['Menue'+Vorgaenger].pageY + ModY;
      visibility = 'visible';
    }

  }
  else if (ie) {

    var LinksWert = 0;
    var TopWert = 0;
    var AObj = 'document.all["aM'+Vorgaenger+'Pos'+AnkerPos+'"]';

    for ( ; eval(AObj); AObj += '.offsetParent') {
      LinksWert += eval(AObj).offsetLeft;
      TopWert += eval(AObj).offsetTop;
    }

    with (document.all['Menue'+Aktuell].style) {
      posLeft = LinksWert + ModX;
      posTop = TopWert + ModY;
      visibility = 'visible';
    }

  }

}