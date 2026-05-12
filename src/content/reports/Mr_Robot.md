# Mr. Robot

I started by performing a nmap scan:

![nmap.png](/images/reports/mr_robot/nmap.png)

So we are dealing with a web server as mentioned in the description as well. The next step was to do a gobuster search in order to see if there are other sub-pages on the server, this resulted in quite a lot of interesting results:

![gobuster.png](/images/reports/mr_robot/gobuster.png)

Going to the ‘0’ sub-page we are met with a WordPress blog site:

![blog.png](/images/reports/mr_robot/blog.png)

Next I went to every sub-page to try and look for something interesting. Most of them were either not interesting or were forbidden, until I got to ‘license’, we see a message directed to us and looking inside the code we see a hidden base64 string:

![base64.png](/images/reports/mr_robot/base64.png)

Decoding the string we get this:

![decoded string.png](/images/reports/mr_robot/decoded_string.png)

These look like credentials, and I was right. Login into WordPress using these credentials logs us as Elliot Anderson:

![login.png](/images/reports/mr_robot/login.png)

But before I tried anything here I decide to further investigate the sub-pages from gobuster. We I got to ‘robots.txt’ I was met with this:

![robots.png](/images/reports/mr_robot/robots.png)

So somewhere here is the first key of the box, I decided to go to /fsocity.dic to see what it does. It seems like a really big dictionary, and since going to every entry to look for a key would take a long time I first tried different combinations for the sub-pages. What eventually worked was /key-1-of-3.txt:

![first key.png](/images/reports/mr_robot/first_key.png)

Next up I got stuck trying to do something with the fsocity.dic dictionary but to no avail. I later learned it was used to bruteforce the password for Elliot which I found by other means. So the next logical option was to try and get a reverse shell by editing the theme and changing it to a PHP reverse shell:

![php reverse shell.png](/images/reports/mr_robot/php_reverse_shell.png)

I added the reverse shell to the 404 page and to trigger the shell I went on an non-existing page to trigger the error and therefore the shell:

![shell.png](/images/reports/mr_robot/shell.png)

Going in the home directory and robot we see our second key, but I don’t have the permission to read it. But we have another file that we are able to read, this file gives us everything we need, the user robot and the password hash for this user. Going to a md5 decrypt tool online we get the decrypted password. The only thing remaining is to switch the user and log in:

![password-md5.png](/images/reports/mr_robot/password-md5.png)

![reverse md5.png](/images/reports/mr_robot/reverse_md5.png)

The only thing remaining is to read the second key. 

Finally, in order to get the last key we need to elevate our privileges, so I search for SUID binaries:

![suid.png](/images/reports/mr_robot/suid.png)

Out of these, nmap looked interesting. I went to GTFObins to get the commands to get root, but I had some issues, on GTFObins it said after running `nmap —interactive` to run `!/bin/sh` which for me didn’t work, apparently I needed to run `!sh`, this got me the root shell and the final key. 

![root.png](/images/reports/mr_robot/root.png)