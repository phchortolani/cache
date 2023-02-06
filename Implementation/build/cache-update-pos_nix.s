SYS


; This script is automatically generated.
; This script starts all services in Cache.
;
;History:
;2011-Ago-01    Pablo  Created
;

; Begin script
zn "LEAN-PREV"

xecute "do Start^COMSchedule"

if ($length("jasper") '= 0) do ##class(VAR.infra.cache.SQL).GrantOnAllTables("LEAN-PREV", "jasper", 1, 1, 1, 1, 1)
if ($length("") '= 0) do ##class(VAR.infra.cache.SQL).GrantOnAllTables("LEAN-PREV", "", 1, 1, 1, 1, 1)

halt
