# Tomghost

I started with a nmap scan:

![nmap.png](/images/reports/tomghost/nmap.png)

Searching online for the Apache Jserv I found that there is the vulnerability ‘Ghostcat’ which is implied also by the box’s name. I found a script online and I ran the command below:

`python3 [ajpShooter.py](http://ajpshooter.py/) [http://10.66.169.121:8080](http://10.66.169.121:8080/) 8009 /WEB-INF/web.xml read`

This will read the web.xml file and to my luck there is a user there:

![user.png](/images/reports/tomghost/user.png)

After loggin into SSH inside /merlin we can find the user flag. 

Now for the escalation, inside skyfuck’s directory we have 2 files that are encrpyted so first I transfered the files on my machine in order to attempt to decrypt them. 

First, after getting the file we convert the tryhackme.asc file to gpg using gpg2john:

![convert.png](/images/reports/tomghost/convert.png)

And then use John to decrypt it:

![decrypt.png](/images/reports/tomghost/decrypt.png)

Next I decrypted the credential.pgp file. Note: I needed to do this inside the SSH logged as skyfuck, the tryhackme.asc key was not imported so I needed to do that and after I could use the command: `gpg —decrypt credential.pgp` 

After decryption I got the credentials for merlin, I switched to their account. 

I tested sudo -l and I got this:

![sudo.png](/images/reports/tomghost/sudo.png)

So we can run zip as root, I went to GTFObins and I found this command that worked, note: it is slightly different than on the website, what’s changed is that I first created a blank txt file, and then for the command I needed to put first the filename.zip and filename.txt in the command for it to work, like this:

![root.png](/images/reports/tomghost/root.png)

And we got root.