# Anonymous

I started as always with the nmap scan:

![nmap.png](/images/reports/anonymous/nmap.png)

Next, I looked over at Samba, we have the ‘pics’ partition that contains 2 images, I tried to see if they contain some hidden information, but nothing interesting showed up. I moved on to FTP since we can log in anonymously. Here we have a directory called ‘scripts’ and in it we have 3 files I got them on my machine and started investigating:

![ftp.png](/images/reports/anonymous/ftp.png)

![files.png](/images/reports/anonymous/files.png)

So we can see that the user is aware that the anonymous login might pose a threat in terms of security and we have a clenup script that checks to see if there are temporary file to be deleted and does so, or in case there are none it just echo “Running cleanup script: nothing to delete” to the removed_files.log file. We also got that file as well and it looks like this:

![log.png](/images/reports/anonymous/log.png)

It seems that the script ran quite a few times, but removed nothing. 

So for now, we didn’t get much information. The first time I saw the [cleanup.sh](http://cleanup.sh) script I immediately though about cronjobs, maybe the machine has one set up for this script and since we have write permissions as anonymous for the script I decide to change the actual script with a reverse shell.

![put.png](/images/reports/anonymous/put.png)

And then I waited to get the shell back. 

![login.png](/images/reports/anonymous/login.png)

And we get our user flag:

![user flag.png](/images/reports/anonymous/user_flag.png)

And to elevate my privileges, I searched for SUID binaries and I found /env:

![env.png](/images/reports/anonymous/env.png)

Next I went to GTFObins and searched for env and I went with the following command:

`/usr/bin/env /bin/sh -p` 

And with that I got root access and the root flag:

![root.png](/images/reports/anonymous/root.png)