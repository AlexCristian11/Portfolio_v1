# Publisher

The "**Publisher**" CTF machine is a simulated environment hosting some services. Through a series of enumeration techniques, including directory fuzzing and version identification, a vulnerability is discovered, allowing for Remote Code Execution (RCE). Attempts to escalate privileges using a custom binary are hindered by restricted access to critical system files and directories, necessitating a deeper exploration into the system's security profile to ultimately exploit a loophole that enables the execution of an unconfined bash shell and achieve privilege escalation.

I started by performing a Nmap scan to discover open ports and services. Here is the output of the scan:

![nmap.png](/images/reports/publisher/nmap.png)

Next, since port 80 is open, I started a gobuster scan to see if there are any possible subdirectories on the web app, these are the results:

![gobuster.png](/images/reports/publisher/gobuster.png)

On the initial web page there are not many interesting things, so I navigated to /spip, the page looks like this:

![page.png](/images/reports/publisher/page.png)

I performed a gobuster scan once again but on the /spip subdirectory, this resulted in quite a lot of subdirectories, the most interesting being ecrire, since this leads to a login page:

![gobuster2.png](/images/reports/publisher/gobuster2.png)

![login_page.png](/images/reports/publisher/login_page.png)

The box description gives us some useful insights, mainly that we need to identify the service version in order to find an RCE exploit. Looking through the subdirectories, specifically /local, we have a config.txt file where the spip version it’s listed as 4.2.0. Searching for an exploit for SPIP, we have an RCE exploit for version 4.2.0:

![version.png](/images/reports/publisher/version.png)

![exploit.png](/images/reports/publisher/exploit.png)

I downloaded the exploit on my host machine and run the exploit. In order to get a reverse shell, I needed to place a reverse shell inside the command field of the exploit:

![rev_shell.png](/images/reports/publisher/rev_shell.png)

This resulted in a reverse shell on my host machine:

![shell.png](/images/reports/publisher/shell.png)

After connect, I navigated to the folder “think” where the user flag was stored. Since “think” is an user, I copied the SSH private key of the user and used it to log via SSH as this user:

![ssh_key.png](/images/reports/publisher/ssh_key.png)

![connect.png](/images/reports/publisher/connect.png)

I started by listing the SUID binaries and the interesting one is /usr/sbin/run_container, checking the strings of the binary I got this:

![binary.png](/images/reports/publisher/binary.png)

It seems that this binary is running run_container.sh.

From the hint on TryHackMe I learned about AppArmor. Researching online I saw some commands that helped disable the restrictions. 

![apparmor1.png](/images/reports/publisher/apparmor1.png)

![root.png](/images/reports/publisher/root.png)

By following the commands I manged to change the restricted shell to a bash shell and reas the root flag.