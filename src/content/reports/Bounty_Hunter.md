# Bounty Hunter

I started with a nmap scan:

![nmap.png](/images/reports/bounty_hunter/nmap.png)

Given that we can login anonymously to FTP I started there. On the FTP server we have 2 files:

![ftp files.png](/images/reports/bounty_hunter/ftp_files.png)

So I downloaded these files and read them which gave me this:

![locks file.png](/images/reports/bounty_hunter/locks_file.png)

This seem like a dicionary list that may be used to brute force something, I suspect SSH. 

![task.png](/images/reports/bounty_hunter/task.png)

This second file answers the first question:

**Who wrote the task list?  -  Lin** 

And since the second question is about bruteforce I tried my assumed answer and my intuition was right:

**What service can you bruteforce with the text file found?  -  SSH**

So the next step is to try and bruteforce the password with the given wordlist:

![hydra.png](/images/reports/bounty_hunter/hydra.png)

And we got a hit!

I logged in as Lin and got the user.txt flag:

![user.txt.png](/images/reports/bounty_hunter/user.txt.png)

For the root I first ran sudo -l to see what sudo permissions does Lin have:

![sudo .png](/images/reports/bounty_hunter/sudo_.png)

We can see they have access to /bin/tar. I went to GTFObins where I got the following command:

`sudo /bin/tar cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh`

This gave me root access and the ability to read the root flag:

![root.png](/images/reports/bounty_hunter/root.png)