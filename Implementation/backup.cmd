@Echo OFF
REM This is a simple backup procedure. It maintains
REM a copy of the last three backups.
REM History
REM   2008-07-22  Soeiro  Created
del C:/Projetos/LEAN-PREV/prod-v1.0.0/Implementation/bkp\LEAN-PREV-old2.7z
ren C:/Projetos/LEAN-PREV/prod-v1.0.0/Implementation/bkp\LEAN-PREV-old1.7z LEAN-PREV-old2.7z
ren C:/Projetos/LEAN-PREV/prod-v1.0.0/Implementation/bkp\LEAN-PREV.7z LEAN-PREV-old1.7z
7z a C:/Projetos/LEAN-PREV/prod-v1.0.0/Implementation/bkp\LEAN-PREV.7z -x!*tmp -x!build* -x!*bak -x!.bzr* -x!*.log