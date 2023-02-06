SYS


; Configuration of the basic globals that are needed for Alphalinc
; and for the development environment. This file should *NOT* be altered!
; The tokens are replaced with values from local.properties automatically by the system.
;
;History:
;2008-Jul-02    Soeiro  Added environment variables
;2008-Mar-23    Soeiro  Created
;

; Set all Alphalinc globals
zn "LEAN-PREV"

; Set globals for the source control and software development environment
set $piece(^WWW012(0,0,1),"~",44)="/LEAN-PREV/"
set $piece(^WWW012(0,0,1),"~",45)="C:/Alphalinc/LEAN-PREV/Resources"
set $piece(^WWW012(0,0,1),"~",46)="/LEAN-PREV/"
if ($length("") '= 0) set $piece(^WWW012(0,0,1),"~",47)="//"
if ($length("") = 0) set $piece(^WWW012(0,0,1),"~",47)="/LEAN-PREV/"
set $piece(^WWW012(0,0,1),"~",48)="/LEAN-PREV/"
set $piece(^WWW012(0,0,1),"~",49)="C:/Alphalinc/LEAN-PREV/Resources/"
set $piece(^WWW012(0,0,1),"~",98)="/LEAN-PREV/"
set $piece(^WWW012(0,0,1),"~",150)="/LEAN-PREV/"
if ($length("") '= 0) set $piece(^VARJasper(0,0,1),"~",1)="/"
if ($length("") = 0) set $piece(^VARJasper(0,0,1),"~",1)="C:/Alphalinc/LEAN-PREV/Reports/"
if ($length("") '= 0) set $piece(^VARJasper(0,0,1),"~",2)="//"
if ($length("") = 0) set $piece(^VARJasper(0,0,1),"~",2)="/LEAN-PREV/"
set $piece(^VARJasper(0,0,1),"~",3)="127.0.0.1"
set $piece(^VARJasper(0,0,1),"~",4)="8080"
set $piece(^VARJasper(0,0,1),"~",5)="127.0.0.1"
set $piece(^VARJasper(0,0,1),"~",6)="8080"
set $piece(^VARJasper(0,0,1),"~",7)="localhost/LEAN-PREV/"

if ('##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.util.Lists")) do $System.OBJ.Load("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\configuration\hooks\src-packages\cls\VAR.infra.util.Lists-31535.cls.xml", "cdfvuk")
if ('##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.util.Errors")) do $System.OBJ.Load("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\configuration\hooks\src-packages\cls\VAR.infra.util.Errors-51567.cls.xml", "cdfvuk")
if ('##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.util.Strings")) do $System.OBJ.Load("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\configuration\hooks\src-packages\cls\VAR.infra.util.Strings-8305.cls.xml", "cdfvuk")
if ('##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.util.DirectoryFile")) do $System.OBJ.Load("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\configuration\hooks\src-packages\cls\VAR.infra.util.DirectoryFile-52521.cls.xml", "cdfvuk")

set ^SourceControl("projectDir")=##class(VAR.infra.util.DirectoryFile).FixDirectory("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation")
set ^SourceControl("cspDir")=##class(VAR.infra.util.DirectoryFile).FixDirectory("C:/Alphalinc/LEAN-PREV/Csp/")
set ^SourceControl("onBeforeLoadActive")="0"
set ^SourceControl("deleteTmpXMLFilesActive")="1"
set ^SourceControl("buildOptionVAR")="1"
set ^SourceControl("buildOptionASDE")="0"
set ^SourceControl("runSourceLogging")="0"

; Write the ok file (without using Source control because it might not be loaded yet)
set file=##class(%File).%New(##class(VAR.infra.util.DirectoryFile).ConcatPath(^SourceControl("projectDir"), "build\cache-config-script.ok"))
w file.Open("WSN")
w file.WriteLine("Finished ok at: "_$zdatetime($horolog))
do file.Close()
set file=""

write "Configuration finished."
write $ZDATETIME($ZTIMESTAMP,3,1,6)

halt
