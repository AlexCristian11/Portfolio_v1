# Brooklyn Nine Nine

### Task 1

By viewing the page source, we have a text hinting at stenography. By downloading the image by using:

wget [http://10.10.180.144/brookly](http://10.10.180.144/brooklyn)n99.jpg 

we can then pass it to steghide to extract hidden data. But this requires a passphrase that we can brute-force using stegseek:

stegseek brooklyn99.jpg /usr/share/wordlists/rockyou.txt

Inside we found Holt's password that can be used to SSH into the machine:

ssh holt@10.10.180.144 

Inside we can find the user.txt flag 

*User flag*

Ans: Flag inside the machine accessed through SSH

For the Root Access, we can run sudo -l to see what sudo permission this user holds. We can see that nano can be used with sudo. Going to GTFOBins we can find a privilege escalation for nano bu running:

sudo nano 

CTRL + R 

CTRL + X

and typing inside the box command to execute:

reset; sh 1>&0 2>&0

After hitting enter we get the root shell to find the root flag.

*Root flag*

Ans: Flag inside the root directory