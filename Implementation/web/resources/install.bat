@echo off

:: Check to see parameters have been passed
:: first parameter should be the directory containing required files
:: second parameter is WWWROOT directory

if "%1"=="" goto error
if not exist "%1" goto error
if "%2"=="" goto error
if not exist "%2" goto error

:: Extract all files into required directory
%1\unzip.exe -o -qq %1\files.zip -d %2
goto end

:error
echo Invalid arguments provided

:end