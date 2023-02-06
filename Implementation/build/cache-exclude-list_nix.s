SYS


; This script sets up all artifacts that reside inside Cache but must be excluded from version control.
; Some tokens are replaced with values from local.properties automatically by the system.
;
;History:
;2008-Jul-21	Soeiro	Created
;

; Set all Alphalinc globals
zn "LEAN-PREV"

; Erases everything in the exclude list
kill ^SourceControl("excludeList")

; Create on line for each exclusion *prefix*. You can have any number of lines for mac,inc,gbl and cls
set ^SourceControl("excludeList","mac","idx.")=""
set ^SourceControl("excludeList","mac","CacheSql")=""
set ^SourceControl("excludeList","inc","%")=""
set ^SourceControl("excludeList","cls","%")=""

; Classes that are in the package csp are to be ignored 
set ^SourceControl("excludeList","cls","csp.")=""

; Ensemble classes are to be ignored 
set ^SourceControl("excludeList","cls","Ens")=""

;Projects that start with "user-" are ignored.
set ^SourceControl("excludeList","prj","user-")=""

;Projects that start with "Default" are ignored.
set ^SourceControl("excludeList","prj","Default")=""

;Now the code checks if there is a NM class with this name
;send: set ^SourceControl("excludeList","cls","User.")=""
;send: set ^SourceControl("excludeList","gbl","yyy")=""

;Exceptions. Items in this list will not be ignored (it overrides the excludeList)
;Notice that the extension *MUST BE* in UPPERCASE letters for this case:
;Also notice that this list also overrides other methods of ignoring files
kill ^SourceControl("excludeExceptions")

;This table is generated by @NM but must be present to allow it to generate others!
set ^SourceControl("excludeExceptions","User.COMQuickSearch.CLS")=""

; Write the ok file (without using Source control because it might not be loaded yet)
set file=##class(%File).%New(##class(VAR.infra.util.DirectoryFile).ConcatPath(^SourceControl("projectDir"), "build\cache-exclude-list.ok"))
w file.Open("WSN")
w file.WriteLine("Finished ok at: "_$zdatetime($horolog))
do file.Close()
set file=""

WRITE "Configuration finished."
WRITE $ZDATETIME($ZTIMESTAMP,3,1,6)

HALT