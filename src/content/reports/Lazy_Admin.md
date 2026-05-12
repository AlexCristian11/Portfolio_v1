# Lazy Admin

I started with nmap:

![nmap.png](/images/reports/lazy_admin/nmap.png)

At the same time I also did a Gobuster scan:

![gobuster.png](/images/reports/lazy_admin/gobuster.png)

The only interesting sub-page here is the content one which looks like this:

![page.png](/images/reports/lazy_admin/page.png)

Seeing that this website uses SweetRice CMS I first searched for exploits to see what it may be vulnerable to:

![exploits.png](/images/reports/lazy_admin/exploits.png)

First I looked at the Backup Disclosure exploit, reading the instruction I learned that I needed to got the this URL: http://server/inc/mysql_backup, but since the CMS is inside the /content directory I needed to put that before /inc to work. This led to finding a mysql backup file, after reading it I noticed an interesting line were we learn the credentials for the admin that being the username ‘manager’ and the hashed password. I then went to CrackStation to reveal the real password and I got this:

![sql_backup.png](/images/reports/lazy_admin/sql_backup.png)

![password.png](/images/reports/lazy_admin/password.png)

Using these credentials I navigate to /content/as and logged in:

![sweetrice.png](/images/reports/lazy_admin/sweetrice.png)

Next, I looked at the RCE vulnerability and followed the steps given on dbexploit. I copied the code for the ad and change the php code to be a reverse shell. After completing the ad I went to /content/inc/ad/rce.php to trigger the RCE and I got the shell back and the user flag:

![shell.png](/images/reports/lazy_admin/shell.png)

Now in order to escalate our privileges I ran `sudo -l`   and I got this:

![sudo -l.png](/images/reports/lazy_admin/sudo_-l.png)

We can read the file, it’s only 1 line and it runs another script located in /etc. We can’t write anything to this file, but since this file runs the other script we can check to see if we can change the other script, and we can:

![permissions.png](/images/reports/lazy_admin/permissions.png)

So the only thing remaining is to change the script to another reverse shell to get the elevated shell.

![script.png](/images/reports/lazy_admin/script.png)

![root.png](/images/reports/lazy_admin/root.png)

And we got root shell and root flag.