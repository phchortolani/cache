
; This script is automatically generated.
; This script loads all modified artifacts into Cache.
;
;History:
;2008-Jul-07    Soeiro  Created
;
logfile: C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\build/cache-update.log
timer 600
on error: $ERROR
goto: $BEGIN

multiwait for: =Username:=Usuário:
send: SYS<CR>

multiwait for: =Password:=Senha:
send: <CR>

; Begin script
$BEGIN:

wait for: >
send: zn "LEAN-PREV"<CR>

wait for: LEAN-PREV>
send: if (##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.services.SecondaryServicesMonitor")) do ##class(VAR.infra.services.SecondaryServicesMonitor).StopService()<CR>

wait for: LEAN-PREV>
send: if (##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.services.PrimaryServicesMonitor")) do ##class(VAR.infra.services.PrimaryServicesMonitor).StopService()<CR>

wait for: LEAN-PREV>
send: xecute "do Stop^COMSchedule()"<CR>

wait for: LEAN-PREV>
send: do ##class(SourceControl.Importer).JobImportAll("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\build\last-changes.log","C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\build\cache-update.ok")<CR>

$END:
wait for: Importing process finished
wait for: LEAN-PREV>
; If we use "closelog", the systems LOSES the last part of the log
;closelog
; Wait for the log to flush
pause: 30

send: <CR>
terminate
goto $END2

$ERROR:
send: write "An error occured during import process. Please check the log file.",!<CR>
goto $END

$END2:
