# Lian_Yu

I started with nmap:

![nmap.png](/images/reports/lian_yu/nmap.png)

Next I did a Gobuster scan:

![gobuster.png](/images/reports/lian_yu/gobuster.png)

Going to `/island` gave this:

![island.png](/images/reports/lian_yu/island.png)

We might have a use for this code word at some point. Unfortunately, this is not the answer to the first questions for the box, of what is the hidden directory on the web server, so we still need to look for something else. 

I tried various other wordlists, looking at the hint we have for this task we learn that the name of the directory is ‘in numbers’ and we now that we length of the answer is 4, so we need a directory made from a number with 4 digits. 

![2100.png](/images/reports/lian_yu/2100.png)

Going to this directory we are met with the following page:

![page_2100.png](/images/reports/lian_yu/page_2100.png)

Next, we need to find the name of a file, looking in the html we see this:

![html.png](/images/reports/lian_yu/html.png)

So we need to find a file with the extension `.ticket` . I started another Gobuster search with the flag `-x .ticket` for the extension. 

After a while, we get a hit for ‘green_arrow.ticket’, going to the page we see the following:

![ticket.png](/images/reports/lian_yu/ticket.png)

To get the answer to the next question (What is the FTP password?) we need to decrypt this string. I tried multiple bases, until I got to base 58 and so we got the FTP password. 

Since the code word ‘vigilante’ wasn’t coincidental I figured that this is the username for FTP:

![ftp.png](/images/reports/lian_yu/ftp.png)

And we got 3 files from the FTP server.

Out of the 3 images, Leave_me_alone.png had the incorrect header and couldn’t be opened up. So using hexedit I changed the header to the correct PNG header and I got this image:

![leave.png](/images/reports/lian_yu/leave.png)

Now using this password as the passphrase for aa.jpg using steghide we get a zip file:

![zip.png](/images/reports/lian_yu/zip.png)

Unziping the compressed directory we get 2 files, one contains a text regarding booby traps set on the island, which likely refers to the SSH server, so we keep that in mind. And we have another file that contains a SSH password. Now testing for the usernames ‘oliver’, ‘shado’ and ‘vigilante’ didn’t work, but we looking inside the FTP server I found another user:

![ftp2.png](/images/reports/lian_yu/ftp2.png)

Trying the password for slade worked, we are logged into SSH:

![ssh.png](/images/reports/lian_yu/ssh.png)

The user flag is inside our current directory. 

To get root access we just need to run sudo -l, we can see that pkexec can be run as root. Going to GTFObins gives our command pkexec /bin/sh, running this makes us root and we get the final flag:

![root.png](/images/reports/lian_yu/root.png)