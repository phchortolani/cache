Attribute VB_Name = "Modul3"
Sub ImportWWSPPSScreen()
Attribute ImportWWSPPSScreen.VB_Description = "Makro am 21.10.2002 von INTRAPREND aufgezeichnet"
Attribute ImportWWSPPSScreen.VB_ProcData.VB_Invoke_Func = " \n14"
'
' Loeschen160b Makro
' Makro am 25.10.2002 von INTRAPREND GmbH Michael Zeimer erstellt
' Am 10.09.2003 von Intraprend GmbH Dominik Fischer ge�ndert: Der 3.Schritt wurde hinzugef�gt.
'
'
' Ergebnis:
' Aus einem, aus der Zwischenablage eingef�gten, markierten Bereich der WWS/PPS-Software
' (z.B.: Bildschirmausschnitt Unterteile eines Artikels), werden die Hyperlinks entfernt
' und alle Zellinhalte in das jeweilige Format umgeschrieben: Zahlenwerte in Zahlen,
' Stunden in Uhrzeit, Text in Text
'
' Version 1.0
' Getestet unter Windows XP Professional (5.1.2600 Build 2600) und MS Excel 2002 (10.2614.2625)
'
' Funktionsweise:
' Nach Einkopieren des Bildschirmausschnittes durch den Anwender
' und Start des Makros wird durchgef�hrt
' a) Erstellung einer Kopie aller Zellen der Vorlage
' b) In einem neuem Worksheet wird die Kopie PasteSpecial = nur Values eingef�gt,
'    dadurch werden die Hyperlinks, Formatvorgaben (Farbe, Schrift etc.) entfernt
' c) An alle Zellinhalte hat Excel Charakters Code 160 und Code 32 angeh�ngt.
'    Durch ca) die Cdbl-Funktion in der For Each-Schleife werden alle sofort lesbaren
'              Zahleneintr�ge in Zahlenformate umgewandelt
'          cb) Die Selection.Replace-Funktion ersetzt dann noch die �brigen Code 160
'              Characters gegen blanks. Excel kann dann die restlichen Zelleintr�ge
'              im gew�nschtem Format lesen.
' d) Das Worksheet der Vorlage wird gel�scht und das Ergebnis-Sheet erh�lt den Namen
'    der Vorlage
'
    Dim cell As Range                           ' Variable f�r CDbl
    Dim Puffer As Range                         ' Variable f�r CDbl
'
    Application.ScreenUpdating = False          ' Bearbeitung nicht anzeigen
    OrigSheetname = ActiveCell.Worksheet.Name   ' Speichern Name Originalsheet
    Cells.Select                                ' Alle Zellen im Original ausw�hlen
    Selection.Copy                              ' markierte Zellen kopieren in Zwischenablage
'
    Worksheets.Add                              ' Arbeitsblatt Ergebnis-Sheet neu anlegen
    Ergebnissheet = ActiveCell.Worksheet.Name   ' Speichern Name Zwischensheet
'
    Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks _
        :=False, Transpose:=False               ' Einf�gen kopierter Originalbereich
'
'   Zellinhalte werden alle als Text erkannt, die Umwandlung in Zahlen findet
'   im 1. Schritt hier durch CDbl �ber alle sofort erkennbaren Zahlen statt
'
    On Error Resume Next                        ' Fehlermeldung des CDbl = Zellinhalt = Text
    For Each cell In Selection.Cells.SpecialCells(xlConstants, xlTextValues)
        cell.Value = CDbl(cell.Value)
    Next cell
'
'   2. Schritt: Restlichen Zellinhalte noch mit code 160 behaftet, werden hier entfernt
'
    Selection.Replace What:=Chr(160), Replacement:=" ", LookAt:=xlPart, _
        SearchOrder:=xlByRows, MatchCase:=False, SearchFormat:=False, _
        ReplaceFormat:=False                    ' Ersetzen alle Code 160 gegen blank

'   3. Schritt: Dieser Schritt entfernt alle "Doppel-Blanks" aus dem Text, d.h. alle
'               doppelten Leerzeichen am Ende des Textes/der Zahlen.
'               Zus�tzlich werden alle Zahlen formatiert (von 45,00 auf 45), damit
'               es bei Kalkulationen/Rechnungen keine Probleme gibt.
    
    Selection.Replace What:=Chr(160) + Chr(32), Replacement:=""
    Selection.Replace What:=",00", Replacement:=""
        
    For Each cell In Selection.Cells.SpecialCells(xlConstants)
      If Mid(Right(cell.Value, 3), 1, 1) = "," Then
        cell.Value = CDbl(cell.Value)
      End If
    Next cell

'
    Application.DisplayAlerts = False           ' Abschalten Warn-Dialoge f�r:
    Worksheets(OrigSheetname).Delete            ' Originalsheet l�schen
    Application.DisplayAlerts = True            ' Einschalten Warn-Dialoge
    Worksheets(Ergebnissheet).Name = OrigSheetname ' Neues Sheet mit altem Namen versehen
'
    Cells(1, 1).Select                         ' In die A1-Zelle springen
    Application.ScreenUpdating = True           ' Anzeige aktualisieren wieder an
    Application.Calculation = xlCalculationAutomatic ' autom.Berechnen an
'
End Sub
