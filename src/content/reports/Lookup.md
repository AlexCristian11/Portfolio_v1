# Lookup

**Lookup** offers a treasure trove of learning opportunities for aspiring hackers. This intriguing machine showcases various real-world vulnerabilities, ranging from web application weaknesses to privilege escalation techniques. By exploring and exploiting these vulnerabilities, hackers can sharpen their skills and gain invaluable experience in ethical hacking. Through "Lookup," hackers can master the art of reconnaissance, scanning, and enumeration to uncover hidden services and subdomains. They will learn how to exploit web application vulnerabilities, such as command injection, and understand the significance of secure coding practices. The machine also challenges hackers to automate tasks, demonstrating the power of scripting in penetration testing.﻿

I started by running an Nmap scan to see what ports are open and what services are on that ports. This is the result of the scan:

![nmap.png](/images/reports/lookup/nmap.png)

I tried to go to the IP in the browser to look at the website. I ran into an issue first, as seen in the nmap scan, the browser is redirected to [http://lookup.thm](http://lookup.thm), which wasn’t inside the hosts file in my Kali machine. So I added the domain to my /etc/hosts file:

![hosts.png](/images/reports/lookup/hosts.png)

After reloading the website, I was presented with a login page:

![website.png](/images/reports/lookup/website.png)

Next, since I have a login page, I tried to see if I can find any SQL injection entry point, but to no avail. Nonetheless, I still had some success with testing usernames. Using Burp Intruder I tested some common usernames to see if I get a match:

![intruder.png](/images/reports/lookup/intruder.png)

The only valid username was admin, this lead me to use Hydra to try and brute force the login. This got me the password for the admin user:

![hydra.png](/images/reports/lookup/hydra.png)

This password doesn’t work, I don’t know why, but it doesn’t work neither on the web app nor inside Burp. 

I tried next to enumerate subdomains, but I got no hit. I researched online and found a Python script for enumerating users. I’ve done this in hope that I can find another user beside admin that might give me a correct login. 

![script.png](/images/reports/lookup/script.png)

After running the script I got 2 users, admin and jose. Next I used Hydra to brute force the login for jose. 

![usernames.png](/images/reports/lookup/usernames.png)

![hydra_jose.png](/images/reports/lookup/hydra_jose.png)

Using these credentials I logged in on the website and I was presented with the following errors:

![host_files.png](/images/reports/lookup/host_files.png)

This is a great sign, it means that “files” is the hidden subdomain. Next I added it to /etc/hosts.

After adding it, I got this page:

![files_subdomain.png](/images/reports/lookup/files_subdomain.png)

This looks like a file manager named elFinder. I check the version in order to look for potential exploits:

![ver.png](/images/reports/lookup/ver.png)

![exploits.png](/images/reports/lookup/exploits.png)

Next, I started msf console to try and execute the exploit:

![metasploit.png](/images/reports/lookup/metasploit.png)

The exploit was successful and I got a shell as www-data:

![shell.png](/images/reports/lookup/shell.png)

Looking inside the home directory I can see some directories, one being named “think”. Inside this folder we can see some file including user.txt that I can assume contains the user flag. Unfortunately, I don’t have yet the permission to read the file. Checking /etc/passwd we can see that “think” is an user, so I try to switch to this account using the password I found inside one of the file on elFinder (”nopassword”). This lead nowhere, so I started thinking about other ways to escalate my privileges to this user account. 

![files_thin.png](/images/reports/lookup/files_thin.png)

I first looked for SUID binaries:

`find / -perm /4000 2>/dev/null`

![perm.png](/images/reports/lookup/perm.png)

/usr/sbin/pwn looked interesting. The file is owned by root:

![ownership.png](/images/reports/lookup/ownership.png)

I ran the binary and got this:

![execute_binary.png](/images/reports/lookup/execute_binary.png)

From what I’ve read online, PATH hijacking is a viable method to get access to user “think”.

![passwords.png](/images/reports/lookup/passwords.png)

I saved these passwords inside a txt file and used them with Hydra to brute force the password for the user “think”:

![hydra_think.png](/images/reports/lookup/hydra_think.png)

Next, I logged in as “think” over SSH and read the user flag:

![ssh_think.png](/images/reports/lookup/ssh_think.png)

Finally, in order to get root access I ran `sudo -l`  to see which binaries have root privileges. We find the binary “look”. After looking t GTFOBins i used the following method to get the root’s private key:

![private key.png](/images/reports/lookup/private_key.png)

After saving the private key on my host machine, I changed the permissions to 600 and then used SSH with the key to gain root access, finally, I read the flag:

![root.png](/images/reports/lookup/root.png)