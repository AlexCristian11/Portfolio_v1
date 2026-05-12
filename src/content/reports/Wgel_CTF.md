# Wgel CTF

I started with nmap:

![nmap.png](/images/reports/wgel/nmap.png)

At the same time I started a Gobuster scan, the only interesting sub-page is /sitemap which leads to a website. I did another scan but changed the URL to [http://IP/sitemap/](http://IP/sitemap/). This showed a sub-page ‘.ssh’ going to that location I was met with a private SSH key. I copied the key to my machine and changed the permissions to 600. Now I need to find a user to be able to use the SSH key. 

![gobuster1.png](/images/reports/wgel/gobuster1.png)

![gobuster2.png](/images/reports/wgel/gobuster2.png)

![key.png](/images/reports/wgel/key.png)

I tried every name I could find on the website but nothing worked, I then went back to the Apache page and looked inside the HTML only to find a comment:

![jessie.png](/images/reports/wgel/jessie.png)

So I tried Jessie as the username for SSH. 

![login.png](/images/reports/wgel/login.png)

Getting the user flag was a matter of finding the right directory, it was hidden inside the Documents directory. Now we need to get root access to find the root flag. 

Running sudo -l gives this:

![sudo -l.png](/images/reports/wgel/sudo_-l.png)

So we can exploit wget to get the root flag. I went to GTFObins and used the file read, since the root flag should be in the root directory and the name used for the user flag was ‘user_flag.txt’ I tried the following command:

`sudo wget -i /root/root_flag.txt` 

This gave me back the root flag.