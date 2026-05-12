# Boiler CTF

I started by enumerating the machine with nmap and gobuster:

![nmap.png](/images/reports/boiler_ctf/nmap.png)

![gobuster.png](/images/reports/boiler_ctf/gobuster.png)

After that I ran another gobuster search but on /joomla:

![gobuster2.png](/images/reports/boiler_ctf/gobuster2.png)

We got a lot of directories, most of them didn’t return anything and the ones that did were purposely misleading. The one that stood out was `/_test` . Searching on Google sar2html exploit lead to an exploit on dbexploit and it looks like this:

![ls.png](/images/reports/boiler_ctf/ls.png)

After the semicolon we can add our commands, we can see a log.txt which is the answer to the last question of task 1. And we can see what the log file contains:

![cat.png](/images/reports/boiler_ctf/cat.png)

And we can see SSH credentials. 

![shell.png](/images/reports/boiler_ctf/shell.png)

We got the shell and the credentials for the user ‘stoner’.

We switch to this user using the password we found in `backup.sh`:

![stoner.png](/images/reports/boiler_ctf/stoner.png)

And we get the user flag. Now, to get to privilege escalation, I started by running `sudo -l`:

![sudo -l.png](/images/reports/boiler_ctf/sudo_-l.png)

We get trolled again. Time to find another way.

Next, I tried looking for SUID binaries and what looked interesting was find, looking at the GTFObins page we see this:

![gtfo.png](/images/reports/boiler_ctf/gtfo.png)

And by running that command we get root access:

![root.png](/images/reports/boiler_ctf/root.png)