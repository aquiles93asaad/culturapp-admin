Set WshShell = WScript.CreateObject("WScript.Shell")
Return = WshShell.Run("cmd.exe /C forever start --minUptime 1000 --spinSleepTime 1000 server/index.js", 0, true)