
; This script is automatically generated.
; This script starts all services in Cache.
;
;History:
;2011-Ago-01    Pablo  Created
;
logfile: C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\build/cache-update-pos.log
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
send: xecute "do Start^COMSchedule"<CR>

wait for: LEAN-PREV>
send: if ($length("jasper") '= 0) do ##class(VAR.infra.cache.SQL).GrantOnAllTables("LEAN-PREV", "jasper", 1, 1, 1, 1, 1)<CR>

wait for: LEAN-PREV>
send: if ($length("") '= 0) do ##class(VAR.infra.cache.SQL).GrantOnAllTables("LEAN-PREV", "", 1, 1, 1, 1, 1)<CR>

$END:
wait for: LEAN-PREV>
; If we use "closelog", the systems LOSES the last part of the log
;closelog
; Wait for the log to flush
pause: 30

send: <CR>
terminate
goto $END2

$ERROR:
send: write "An error occured during service starting. Please check the log file.",!<CR>
goto $END
 
$END2:
