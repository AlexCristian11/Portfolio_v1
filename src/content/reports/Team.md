# Team

I started by enumerating the machine:

![nmap.png](/images/reports/team/nmap.png)

![gobuster.png](/images/reports/team/gobuster.png)

On the `robots.txt` we only have the word ‘dale’, maybe it will be of use later. I started another search from `/scripts`:

![script.txt.png](/images/reports/team/script.txt.png)

In the meantime I looked at the first hint and it mentions a ‘dev’ site, so I added the dev.team.thm domain to my /etc/hosts file and we got a page:

![page.png](/images/reports/team/page.png)

We have a parameter called ‘page’ so I tried LFI to see if it works, and I was lucky:

![lfi.png](/images/reports/team/lfi.png)

I did a wfuzz search for potential files since I couldn’t access access.log in order to get a RCE. I found an interesting file that contains the prive SSH key for ‘dale’:

![wfuzz.png](/images/reports/team/wfuzz.png)

![wfuzz1.png](/images/reports/team/wfuzz1.png)

![key.png](/images/reports/team/key.png)

After getting the key on my machine I saved it, changed the permissions to 600 and connected to the server. Note: The hashtag signs need to be removed for the key to work.

![user flag.png](/images/reports/team/user_flag.png)

We found the user flag, now we need to find a way to escalate.

Running `sudo -l` we can see this file:

![sudo -l.png](/images/reports/team/sudo_-l.png)

Running `/bin/bash` as the `date` variable gives us the shell as ‘gyles’:

![gyles.png](/images/reports/team/gyles.png)