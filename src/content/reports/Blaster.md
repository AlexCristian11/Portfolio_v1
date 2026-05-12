# Blaster

### Task 2

![nmap_scan.png](/images/reports/blaster/nmap_scan.png)

*How many ports are open on our target system?*

Ans: 2

*Looks like there's a web server running, what is the title of the page we discover when browsing to it?*

Ans: IIS Windows Server

*Interesting, let's see if there's anything else on this web server by fuzzing it. What hidden directory do we discover?*

Ans: /retro

*Navigate to our discovered hidden directory, what potential username do we discover?*

Ans: Wade

*Crawling through the posts, it seems like our user has had some difficulties loggin in recently. What possible password do we discover?*

Ans: parzival

*Log into the machine via Microsoft Remote Desktop (MSRDP) and read user.txt. What are it's contents?*

xfreerdp /u:wade /p:parzival /v:10.80.186.49 /dynamic-resolution -compression +clipboard -themes

![rdp_connection.png](/images/reports/blaster/rdp_connection.png)

![wind.png](/images/reports/blaster/wind.png)

![flag1.png](/images/reports/blaster/flag1.png)

Ans: THM{HACK_PLAYER_ONE}

### Task 3

Now that we've gained access to our target system, let's see if we can find a way to escalate. To start, let's scout around the system to see if we can find anything of interest.

*When enumerating a machine, it's often useful to look at what the user was last doing. Look around the machine and see if you can find the CVE which was researched on this server.*

Ans: CVE-2019-1388

*Looks like an executable file is necessary for exploitation of this vulnerability and the user didn't really clean up very well after testing it. What is the name of this executable?*

Ans: hhupd

*Now that we've spawned a terminal, let's go ahead and run the command 'whoami’. What is the output of running this?*

To exploit this CVE, we need to run the executable left on Desktop, click on "Show more details” and then click "Show information about the publisher's certificate”. When clicking on the certificate, it spawns Internet Explorer in admin mode. Prerequisite for this attack is that the IE has to be the default browser. In IE, go to File setting → page → Save as.

Click ok on the error box. In the Save Webpage dialog, open "C:\Windows\System32\cmd.exe”. This in turn spawns a cmd with SYSTEM Privileges.

Ans: NT AUTHORITY\SYSTEM

*Now that we've confirmed that we have an elevated prompt, read the contents of root.txt on the Administrator's desktop. What are the contents? Keep your terminal up after exploitation so we can use it in task four!*

Ans: THM{COIN_OPERATED_EXPLOITATION}

### Task 4

*Return to your attacker machine for this next bit. Since we know our victim machine is running Windows Defender, let's go ahead and try a different method of payload delivery! For this, we'll be using the script web delivery exploit within Metasploit. Launch Metasploit now and select 'exploit/multi/script/web_delivery’ for use.*

*First, let's set the target to PSH (PowerShell). Which target number is PSH?*

Ans: 2

*After setting your payload, set your lhost and lport accordingly such that you know which port the MSF web server is going to run on and that it'll be running on the Tryhackme network.*

*Finally, let's set our payload. In this case, we'll be using a simple reverse HTTP payload. Do this now with the command: 'set payload windows/meterpreter/reverse_http'. Following this, launch the attack as a job with the command 'run -j’.*

*Return to the terminal we spawned with our exploit. In this terminal, paste the command output by Metasploit after the job was launched. In this case, I've found it particularly helpful to host a simple python web server (python3 -m http.server) and host the command in a text file as copy and paste between the machines won't always work. once you've run this command, return to our attacker machine and note taht our reverse shell has spawned.*

*Last but certainly not least, let's look at persistence mechanisms via Metasploit. What command can we run in our meterpreter console to setup persistence which automatically starts when the system boots?* 

Ans: run persistence -X

*Run this command now with options that allow it to connect back yo your host machine should the system reboot. Note, you'll need to create a listener via the handler exploit to allow for this remote connection in actual practice.*