# Source

I started by enumerating the machine using nmap:

![nmap.png](/images/reports/source/nmap.png)

It’s said in the box’s description that we need to exploit a Webmin vulnerability. I used searchsploit to look for an exploit:

![searchsploit.png](/images/reports/source/searchsploit.png)

So we can use metasploit to perform this attack:

![msf.png](/images/reports/source/msf.png)

After setting the following options I started the exploit:

![options.png](/images/reports/source/options.png)

After running the exploit I got root access, then it was only a matter of finding the 2 flags to finish this box:

![root.png](/images/reports/source/root.png)