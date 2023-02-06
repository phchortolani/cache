SYS


; This script is automatically generated.
; This script loads all modified artifacts into Cache.
;
;History:
;2008-Jul-07    Soeiro  Created
;

; Begin script
zn "LEAN-PREV"

if (##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.services.SecondaryServicesMonitor")) do ##class(VAR.infra.services.SecondaryServicesMonitor).StopService()
if (##class(%Dictionary.ClassDefinition).%ExistsId("VAR.infra.services.PrimaryServicesMonitor")) do ##class(VAR.infra.services.PrimaryServicesMonitor).StopService()
xecute "do Stop^COMSchedule()"

do ##class(SourceControl.Importer).JobImportAll("C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\build\last-changes.log","C:\Projetos\LEAN-PREV\prod-v1.0.0\Implementation\build\cache-update.ok")

halt
