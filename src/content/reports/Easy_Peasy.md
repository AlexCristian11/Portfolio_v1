# Easy Peasy

### Task 1

Target IP: 10.10.205.216

nmap -p- -sC -sV 10.10.205.216

*Enumeration through Nmap*

How many ports are open?

Ans: 3

*What is the version of nginx?*

Ans: 1.16.1

*What is running on the highest port?*

Ans: Apache

### Task 2

*Using GoBuster, find flag 1*

gobuster dir -u htt://10.10.205.216 -w /usr/share/dirb/wordlists/common.txt

Ans: flag{f1rs7_fl4g}

*Further enumerate the machine, what is flag 2?*

Go to [http://10.10.205.216:65524/robots.txt](http://10.10.205.216:65524/robots.txt) → User-Agent is a MD5 hash, decrpyt to get the flag. 

Ans: flag{1m_s3c0nd_fl4g}

*Crack the hash with easypeasy.txt, what is flag 3?*

Inspect the page (http://10.10.205.216/), flag is hidden through the content

Ans: flag{9fdafbd64c47471a8f54cd3fc64cd312}

*What is the hidden directory?\*

On the same page, inspect the elements, here we have an encoded text: 0bsJmP17N2X6d0rAgEAL0Vu. This string is encoded with Base62.

Ans: /n0th1ng3ls3m4tt3r

*Using the wordlist that provideed to you in this task crack the hash. What is the password?*

Hash is stored in the content of the webpage (http://10.10.205.216:65524/n0th1ng3ls3m4tt3r). It is a GOST hash that can be cracked with either an online tool or by JohnTheRipper:

john —wordlist=[the wordlist provided] —format=gost [the file containing the hash]

Ans: mypasswordforthatjob

*What is the password to login to the machine via SSH?*

Download the image from the page above, the same hash could be cracked by using:

stegseek [image] [wordlist]

To get the password we need to pass the image into steghide to extract hidden data. After extraction we get a secrettext.txt file where the username and password in binary are stored. After the decryption we get the password.

steghide extract -sf [image] -v

Ans: iconvertedmypasswordtobinary

*What is the user flag?*

SSH with the credentials found and cat the user.txt to get the flag

ssh boring@10.10.205.216 -p 6498 

Ans: flag{n0wits33msn0rm4l}

*What is the root flag?*

We need to elevate our privileges through a cron job. cat /etc/crontab → we see that we have a cronjob named .mysecretcronjob.sh. Nano the file and add a reverse shell created with [https://www.revshells.com](https://www.revshells.com). Put the reverse shell into the cronjob and add as well chmod +s /bin/bash in order to make everyone that runs bin/bash root. Listen on the port given in the reverse shell:

nc -lvnp [port] 

and wait for the reverse shell, after that we have root access to the machine.

Ans: flag{63a9f0ea7bb98050796b649e85481845}