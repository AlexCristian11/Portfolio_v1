# Agent Sudo

### Task 2

Enumerate the machine and get all the important information

*How many open ports?*

Ans: 3

*How you redirect yourself to a secret page?*

Ans: user-agent

*What is the agent name?*

Use BurpSuite to intercept the request and modify the user agent to "C”, this redirects to a page where the name Chris appears.

Ans: chris

### Task 3

Hash cracking and brute-force 

*FTP password:*

Use hydra to get the login credentials. 

hydra -l chris -P /usr/share/wordlists/rockyou.txt ftp://10.10.238.4

Ans: crystal

*Zip file password:*

After getting the credentials for FTP, connect to the machine through FTP with the username and password. We need to get all the files on the server, to get multiple files we can use mget (multiple get) * to get all the file in one go. 

After getting the files, we run exiftool on the images , and one of them we get a warning "Trailer data after ONG IEND chunk”. We dump the file to hex using xxd. 

exiftool [picture_name]

xxd [picture_name] 

After running xxd, we see the text "To_agentR.txt”, which can be seen when running strings as well. 

Next step is to use binwalk. 

binwalk [picture_name] → to check the file

binwalk -e [picture_name] → to extract the files from the image

After extracting the fiels we get a zip file. We can use zip2john tool to convert the zip to a format suitable for john. 

zip2john 8702.zip > hash.txt 

Then we use John to crack the password

john hash.txt

Ans: alien

*Steg password:*

We can open the zip file by using:

7z e 8702.zip 

This will extract a text file with another code "QXJlYTUx” which decode from Base64 results in Area51. Using this as a passphrase we can check for hidden files inside the other image from before. 

steghide extract -sf cute-alien.jpg 

Using the passphrase gives a new txt file. 

Ans: Area51

*Who is the other agent (in full name)?*

Ans: James

*SSH password:*

We get it from the txt file

Ans: hackerrules!

### Task 4

*What is the user flag?*

We connect to use James's machine through SSH

ssh james@10.10.53.164 

Ans: -

*What is the incident of the photo called?*

Exit SSH and get the image to our host system

scp james@10.10.53.164:Alien_autospy.jpg .

Reverse image search on Google and go to FoxNews giving the answer

Ans: Roswell alien autopsy

### Task 5

*CVE number for the escalation:*

Ans: CVE-2019-14287

To get root access we can do the following:

sudo -u#-1 /bin/bash

*What is the root flag?*

Ans: Flag inside the root directory

*(Bonus) Who is Agent R?*

Ans: DesKel