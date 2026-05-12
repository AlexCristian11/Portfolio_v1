# Archangel

I stated by enumerating the machine:

![nmap.png](/images/reports/archangel/nmap.png)

![gobuster.png](/images/reports/archangel/gobuster.png)

When I went to /flag I got RickRolled so yeah :) . 

The first question is about a different hostname, on the main page I saw this:

![hostname.png](/images/reports/archangel/hostname.png)

And mafialive.thm is the correct answer. I added this domain to my `/etc/hosts` file. 

![subdomain.png](/images/reports/archangel/subdomain.png)

Here is the first flag. Next, we are asked to look for another page under the ‘under development’ page, so I started another gobuster scan:

![gobuster2.png](/images/reports/archangel/gobuster2.png)

We can see robots.txt, let’s see what does it contain:

![robots.png](/images/reports/archangel/robots.png)

There we have our hiddent page, it looks like this:

![test.php.png](/images/reports/archangel/test.php.png)

This looks like text-book LFI. I tried some basic payloads but nothing worked. I next got the request in Burp to further investigate.

I figured that if I can’t access pages from outside this directory, I could at least access the php code to see how it works, that also what the hint said. So to get the php script, we have to change the URL to contain PHP filters and encoding for it to work, after sending the request we get the base64 encoded PHP file:

 

![lfi.png](/images/reports/archangel/lfi.png)

And the decoded code looks like this:

![decoded.png](/images/reports/archangel/decoded.png)

From what I’ve read online we can do log poisoning here. We can bypass the condition by adding `/var/www/html/development_testing` in the request and to bypass the check for the ‘../’ , we can just add ‘..//’ since it’s treated the same way. By doing this we get the access.log:

![burp.png](/images/reports/archangel/burp.png)

We can see that the User-Agent is being logged out, and apparently we can inject code there. 

![cmd.png](/images/reports/archangel/cmd.png)

Now we can inject a reverse shell here.

![wget.png](/images/reports/archangel/wget.png)

![trigger.png](/images/reports/archangel/trigger.png)

And after that we get the shell back:

![shell.png](/images/reports/archangel/shell.png)

And with this we can find the user flag.

Next, in order to find the other user, I first looked at crontab, and lo and behold, we have a binary running as a cronjob. We can just add a reverse shell to the file and get the priviledged shell back.

![script.png](/images/reports/archangel/script.png)

And we got our shell back and the 2nd user flag:

![archangle.png](/images/reports/archangel/archangle.png)

Now, for the privilege escalation, we see in the secret folder also a ‘backup’ binary that has the SUID bit checked. Running the binary gives out this:

![binary.png](/images/reports/archangel/binary.png)

The baniary tries to copy from one directory to another. Since `cp` doesn’t have an absolute path, we can create our own `cp` binary and point $PATH to our directory which will give us root. 

We need to run the following command:

`cd /tmp`

`echo ‘/bin/bash -p’ > cp`

`chmod 777 cp`

`cd ~/secret`

`./backup`

After running again the binary we get root access and the root flag:

![root.png](/images/reports/archangel/root.png)