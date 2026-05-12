# Ice

### Task 2

*Scan the machine, once the scan completes, we'll see a number of interesting ports open on this machine. As you might have guessed, the firewall has been disabled (with the service completely shutdown), leaving very little to protect this machine. One of the more interesting ports that is open is Microsoft Remote Desktop (MSRDP). What port is this open on?*

![nmap.png](/images/reports/ice/nmap.png)

Ans: 3389

*What service did nmap identify as running on port 8000?* 

Ans: icecast

*What does Nmap identify as the hostname of the machine?*

Ans: DARK-PC

### Task 3

*The service identified: Icecast, or at least this version running on our target, is heavily flawed and has a high level vulnerability with a score of 7.5. What is the Impact Score for this vulnerability?* 

Ans: 6.4

*What is the CVE number for this vulnerability?* 

Ans: CVE-2004-1561

*After Metasploit has started, let's search for our target exploit using the command 'search icecast’. What is the full path for the exploitation module?*

![nmsf_search_exploit.png](/images/reports/ice/nmsf_search_exploit.png)

Ans: exploit/windows/http/icecast_header

*Following selecting our module, we now have to check what options we have to set. What is the required setting?*

![mf_options.png](/images/reports/ice/mf_options.png)

Ans: RHOSTS

### Task 4

*We've gained a foothold into our victim machine! What's the name of the shell we have now?*

Ans: meterpreter

*What user was running that Icecast process?* 

In meterpreter type getuid.

Ans: DARK

*What build of Windows is the system?*

Meterpreter command: sysinfo.

Ans: 7601

*Now that we have some of the finer details of the system we are working with, let's start escalating our privileges. First, what is the architecture of the process we're running?*

Ans: x64

Run the command: run post/multi/recon/local_exploit_suggester.

*Running the local exploit suggester will return quite a few results for potential escalation exploits. What is the full path for the first returned exploit?*

Ans: exploit/windows/local/bypassuac_eventvwr

![msf_suggester.png](/images/reports/ice/msf_suggester.png)

*Now that we've set our session number, further options will be revealed in the options menu. We'll have to set one more as our listener IP isn't correct. What is the name of this option?*

Ans: LHOST

*We can now verify that we have expanded permissions using the command 'getprivs’. What permission listed allows us to take ownership of files?*

Ans: SeTakeOwnershipPrivilege

### Task 5

Learn how to gather additional credentials and crack the saved hashes on the machine.

Prior to further action, we need to move to a process that actually has the permissions that we need to interact with the lsass service, the service responsible for authentication within Windows. First, let's list the processes using the command 'ps’. Note, we can see processes being run by NT AUTHORITY\SYSTEM as we have escalated permissions (even though our process doesn't).

In order to interact with lsass we need to be 'living in’ a process that is the same architecture as the lsass service (x64 in the case of this machine) and a process that has the same permissions as lsass. The printer spool service happens to meet our needs perfectly for this and it'll restart if we crash it! What's the name of the printer service?

Mentioned within this question is the term 'living in’ a process. Often when we take over a running program we ultimately load another shared library into the program (a dll) which includes our malicious code. From this, we can spawn a new thread that hosts our shell.

Ans: spoolsv.exe

![ps.png](/images/reports/ice/ps.png)

Migrate to this process now with the command 'migrate -N PROCESS_NAME’

Let's check what user we are now with the command 'getuid’. What user is listed?

Ans: NT AUTHORITY\SYSTEM

Now that we've made our way to full administrator permissions we'll set our sights on looting. Mimikatz is a rather infamous password dumping tool that is incredibly useful. Load it now using the command 'load kiwi' (Kiwi is the updated version of Mimikatz).

![migrate.png](/images/reports/ice/migrate.png)

Loading kiwi into our meterpreter session will expand our help menu, take a look at the newly added section of the help menu now via the command 'help’.

Which command allows up to retrieve all credentials?

Ans: creds_all

Run this command now. What is Dark's password? Mimikatz allows us to steal this password out ouf memory even without the user 'Dark’ logged in as there is a scheduled task that runs the Icecast as the user 'Dark’. It also helps that Window Defender isn't running on the box. 

Ans: Password01

### Task 6

Explore post-exploitation actions we can take on Windows.

*What command allows us to dump all of the password hashes stored on the system? We won't crack the Administrative password in this case as it's pretty strong (this is intentional to avoid password spraying attempts).*

Ans: hashdump

*While more useful when interacting with a machine being used, what command allows us to watch the remote user's desktop in real time?*

Ans: screenshare

*How about if we wanted to record from a microphone attached to the system?*

Ans: record_mic

*To complicate forensics efforts we can modify timestamps of files on the system. What command allows us to do this? Don't ever do this on a pentest unless you're explicitly allowed to do so! This is not beneficial to the defending team as they try to breakdown the events of the pentest after the fact.*

Ans: timestomp

*Mimikatz allows us to create what's called a 'golden ticket’, allowing us to authenticate anywhere with ease. What command allows us to do this?*

*Golden tickets attacks are a function within Mimikatz which abuses a component to Kerberos (the authentication system in Windows domains), the ticket-granting ticket. In short, golden ticket attacks allow us to maintain persistance and authenticate as any user on the domain.*

Ans: golden_ticket_create

One last thing to note. As we have the password for the user 'Dark’ we can now authenticate to the machine and access it via remote desktop (MSRDP). As this is a workstation, we'd likely kick whatever user is signed onto it off if we connect to it, however, it's always interesting to remote into machines and view them as their users do. If this hasn't already been enabled, we can enable it via the following Metasploit module: 'run post/windows/manage/enable_rdp’.