# ColddBox: Easy

I started by running an nmap scap, which found 2 ports open: 80 (http) and 4512 (ssh).

Also in the nmap scan I found that the WordPress version is 4.1.31 . 

Next I ran GoBuster which found an interesting directory called "/hidden”. When going to that page, we see the following text: "U-R-G-E-N-T / C0ldd, you changed Hugo's password, when you can send it to him so he can continue uploadning his articles. Philip”. From this we can assume there are at least 3 users: c0ldd, hugo and philip. 

Next I ran WPScan, which confirmed the users from before. 

Since I discovered some users, I though to brute-force the passwords. Using hydra with the web request lead nowhere, I couldn't get it to work, even though I saw some write-ups online where it worked. I tried next:

wpscan —url [http://10.82.151.46/](http://10.82.151.46/) —passwords /usr/share/wordlists/rockyou.txt

 This worked (after a long time) getting me the login c0lld:9876543210 .

Using this I logged in on the WordPress page. 

Next since we are Administrators as seen in the Users tab, we can change themes inside Appearance. I copied the php-reverse-shell.php from pentestmonkey and inside the templates I change the code for 404 Template to the reverse shell. 

Next I starte a listener on my machine to catch the shell.

To trigger the reverse shell, we need to go back to the website. When we hit the title of the first post, we see in the URL ?p=1, meaning the website goes to the post number 1. To trigger the error we can just change the number to any other number, this resulting in an error since that page doesn't exist and spawning a shell. Since the shell is not stable we need to stabilize it:

python3 -c 'import pty;pty.spawn("/bin/bash”)’

After that I tried to read user.txt but I got permission denied. So next, I looked inside the /var/www/html directory for a config file, which I found wp-config.php. When reading we see the username c0ldd and password cybersecurity, with which I logged inside the shell as the c0ldd user. This user has the privieleges to read user.txt giving the first flag. 

To escalate my privileges, I tried to see which binaries can the user run as SUDO using sudo -l. This gave me 3 binaries: vim, chmod and ftp. I looked on GTFObins for vim, where I found the command:

sudo vim -c ':!/bin/sh’

This spawned a root shell, escalating my privileges. Finally i read the root.txt file to get the second and last flag, thus finishing this box.