; Configuration of the basic globals that are needed for Alphalinc
; and for the development environment. This file should *NOT* be altered!
; The tokens are replaced with values from local.properties automatically by the system.
;
;History:
;2008-Jul-02    Soeiro  Added environment variables
;2008-Mar-23    Soeiro  Created
;
timer: 180
logfile: C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\build/cache-config-script.log
on error: $ERROR
goto: $BEGIN

multiwait for: =Username:=Usu�rio:
send: SYS<CR>

multiwait for: =Password:=Senha:
send: <CR>

; Start of the script
$BEGIN:

; Set all Alphalinc globals
send: <CR>
wait for: >
timer: 30
on error: $ERROR
send: zn "LEAN-PREV"<CR>

; Set globals for the source control and software development environment
wait for: LEAN-PREV>
send: set $piece(^WWW012(0,0,1),"~",44)="/LEAN-PREV/"<CR>

wait for: LEAN-PREV>
send: set $piece(^WWW012(0,0,1),"~",45)="C:/Alphalinc/LEAN-PREV/Resources"<CR>

wait for: LEAN-PREV>
send: set $piece(^WWW012(0,0,1),"~",46)="/LEAN-PREV/"<CR>

wait for: LEAN-PREV>
send: if ($length("") '= 0) set $piece(^WWW012(0,0,1),"~",47)="//"<CR>

wait for: LEAN-PREV>
send: if ($length("") = 0) set $piece(^WWW012(0,0,1),"~",47)="/LEAN-PREV/"<CR>

wait for: LEAN-PREV>
send: set $piece(^WWW012(0,0,1),"~",48)="/LEAN-PREV/"<CR>

wait for: LEAN-PREV>
send: set $piece(^WWW012(0,0,1),"~",49)="C:/Alphalinc/LEAN-PREV/Resources/"<CR>

wait for: LEAN-PREV>
send: set $piece(^WWW012(0,0,1),"~",98)="/LEAN-PREV/"<CR>

wait for: LEAN-PREV>
send: set $piece(^WWW012(0,0,1),"~",150)="/LEAN-PREV/"<CR>

wait for: LEAN-PREV>
send: if ($length("") '= 0) set $piece(^VARJasper(0,0,1),"~",1)="/"<CR>

wait for: LEAN-PREV>
send: if ($length("") = 0) set $piece(^VARJasper(0,0,1),"~",1)="C:/Alphalinc/LEAN-PREV/Reports/"<CR>

wait for: LEAN-PREV>
send: if ($length("") '= 0) set $piece(^VARJasper(0,0,1),"~",2)="//"<CR>

wait for: LEAN-PREV>
send: if ($length("") = 0) set $piece(^VARJasper(0,0,1),"~",2)="/LEAN-PREV/"<CR>

wait for: LEAN-PREV>
send: set $piece(^VARJasper(0,0,1),"~",3)="127.0.0.1"<CR>

wait for: LEAN-PREV>
send: set $piece(^VARJasper(0,0,1),"~",4)="8080"<CR>

wait for: LEAN-PREV>
send: set $piece(^VARJasper(0,0,1),"~",5)="127.0.0.1"<CR>

wait for: LEAN-PREV>
send: set $piece(^VARJasper(0,0,1),"~",6)="8080"<CR>

wait for: LEAN-PREV>
send: set $piece(^VARJasper(0,0,1),"~",7)="localhost/LEAN-PREV/"<CR>

wait for: LEAN-PREV>
send: if ('##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.util.Lists")) do $System.OBJ.Load("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\configuration\hooks\src-packages\cls\VAR.infra.util.Lists-31535.cls.xml", "cdfvuk")<CR>

wait for: LEAN-PREV>
send: if ('##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.util.Errors")) do $System.OBJ.Load("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\configuration\hooks\src-packages\cls\VAR.infra.util.Errors-51567.cls.xml", "cdfvuk")<CR>

wait for: LEAN-PREV>
send: if ('##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.util.Strings")) do $System.OBJ.Load("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\configuration\hooks\src-packages\cls\VAR.infra.util.Strings-8305.cls.xml", "cdfvuk")<CR>

wait for: LEAN-PREV>
send: if ('##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.util.DirectoryFile")) do $System.OBJ.Load("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\configuration\hooks\src-packages\cls\VAR.infra.util.DirectoryFile-52521.cls.xml", "cdfvuk")<CR>

wait for: LEAN-PREV>
send: set ^SourceControl("projectDir")=##class(VAR.infra.util.DirectoryFile).FixDirectory("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation")<CR>

wait for: LEAN-PREV>
send: set ^SourceControl("cspDir")=##class(VAR.infra.util.DirectoryFile).FixDirectory("C:/Alphalinc/LEAN-PREV/Csp/")<CR>

wait for: LEAN-PREV>
send: set ^SourceControl("onBeforeLoadActive")="0"<CR>

wait for: LEAN-PREV>
send: set ^SourceControl("deleteTmpXMLFilesActive")="1"<CR>

wait for: LEAN-PREV>
send: set ^SourceControl("buildOptionVAR")="1"<CR>

wait for: LEAN-PREV>
send: set ^SourceControl("buildOptionASDE")="0"<CR>

wait for: LEAN-PREV>
send: set ^SourceControl("runSourceLogging")="0"<CR>

; Execute local mapping, if necessary.
wait for: LEAN-PREV>
send: if (($length("")>0) && ($length("")>0) && ($length("")>0)) write $ZF(-1,"net use  \\  /user: /persistent:no")<CR>

wait for: LEAN-PREV>
send: if (($length("")>0) && ($length("")>0) && ($length("")>0)) write $ZF(-1,"net use  \\  /user: /persistent:no")<CR>

; Write the ok file (without using Source control because it might not be loaded yet)
wait for: LEAN-PREV>
send: set file=##class(%File).%New(##class(VAR.infra.util.DirectoryFile).ConcatPath(^SourceControl("projectDir"), "build\cache-config-script.ok"))<CR>

wait for: LEAN-PREV>
send: w file.Open("WSN")<CR>

wait for: LEAN-PREV>
send: w file.WriteLine("Finished ok at: "_$zdatetime($horolog))<CR>

wait for: LEAN-PREV>
send: do file.Close()<CR>

wait for: LEAN-PREV>
send: set file=""<CR>

$END:
wait for: LEAN-PREV>
send: write "Configuration finished."<CR>

wait for: LEAN-PREV>
send: write $ZDATETIME($ZTIMESTAMP,3,1,6)<CR>

wait for: LEAN-PREV>
closelog
terminate

$ERROR:
send: write "An error occured during configuration. Please check the log file.",!<CR>
goto: $END
