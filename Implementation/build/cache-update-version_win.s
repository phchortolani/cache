
; This script is automatically generated.
; This script loads all modified artifacts into Cache.
;
;History:
;2008-Jul-07    Soeiro  Created
;
logfile: C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\build/cache-update-version.log
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
send: do ##class(SourceControl.Importer).UpdateVersion("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\build\cache-update-version.ok")<CR>

$END:
wait for: Update process finished
wait for: LEAN-PREV>
; If we use "closelog", the systems LOSES the last part of the log
;closelog
; Wait for the log to flush
pause: 30

send: <CR>
terminate
goto $END2

$ERROR:
send: write "An error occured during configuration. Please check the log file.",!<CR>
goto $END

$END2:
