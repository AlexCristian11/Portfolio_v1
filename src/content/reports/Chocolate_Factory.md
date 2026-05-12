# Chocolate Factory

I started by enumerating the machine:

![nmap.png](/images/reports/chocolate_factory/nmap.png)

Running gobuster on the base URL didn’t return anything. So we start from what we see from the nmap scan. We have anonymous login in FTP, let’s start there:

![ftp.png](/images/reports/chocolate_factory/ftp.png)

We can get some hidden information from the image using steghide:

![image extract.png](/images/reports/chocolate_factory/image_extract.png)

We have a long base64 string that decoded gives us:

![decode.png](/images/reports/chocolate_factory/decode.png)

It seems it’s the `/etc/shadow` file. 

I am going to leave this for now, to answer the first question on the box regarding the key, if we look carefully in the nmap scan we can see this:

![message.png](/images/reports/chocolate_factory/message.png)

So, we just need to go to this URL to get the key. When doing this, we get a file downloaded, opening the file with nano we see this:

![key.png](/images/reports/chocolate_factory/key.png)

And so we get the first answer.

Now returning to the `/etc/shadow` file I copied the decoded hash for user ‘charlie’, saved it to a file on my machine and passed that file to john:

![pass.png](/images/reports/chocolate_factory/pass.png)

And we got the password for charlie.

Now we login on the main page of the webserver. After the login we see the following page:

![home.png](/images/reports/chocolate_factory/home.png)

Here we can execute commands, so we can try to get a reverse shell. I went to [r](http://revshell.com)evshells.com and got a PHP exec shell. After sending the command I got back the shell:

![shell.png](/images/reports/chocolate_factory/shell.png)

Changing to ‘charlie’ isn’t as simple, I though that the same password as before would work here, but apparently not. So I kept looking for something else. Looking inside charlie’s directory we can see an interesting file called ‘teleport’, this is a SSH key, this way we can authenticate as charlie.

![ssh key.png](/images/reports/chocolate_factory/ssh_key.png)

I copied the key and authenticated with it:

![login.png](/images/reports/chocolate_factory/login.png)

Next, I ran `sudo -l` and we can run vi as root, I went to GTFObins and got the escalation command from there leading to becoming root:

![escalation.png](/images/reports/chocolate_factory/escalation.png)

Unfortunately, it’s not that easy as to just become root, we have a Python file, where the flag is hidden:

![root.py.png](/images/reports/chocolate_factory/root.py.png)

I went into Pycharm and run the program, we need a key, but we already have the one we found earlier, entering the key, we get our final flag:

![flag.png](/images/reports/chocolate_factory/flag.png)