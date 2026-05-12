# Blog

First I ran an nmap scan. I found the following ports open: 22, 80, 139, 445.

I first looked into SMB, ran enum4linux, and I got the SBM shre named 'BillySMB’. This indeed contained 3 interesting file, but they lead nowhere, or as the author called it, a rabbit hole. 

Next I ran GoBuster, this gave out multiple results, namely a WordPress login page. 

NOTE: In order for the wordpress page to work correctly I needed to add this to my /etc/hosts file:

echo "[ip_address] blog.thm" >> /etc/hosts

Since i found the user bjoel in the enum4linux report, I tried it inside the login form. This reuslted in the message "ERROR: The password you entered for the username bjoel is incorrect”. This means that the user bjoel exists. Researching online, I found that using hydra wasn't really an option, and everybody suggested WPScan. 

docker run -it —rm wpscanteam/wpscan —url [ip_address] —enumerate u

By doing this we found some interesting things: There are two users, bjoel (Billy Joel) and kwheel (Karen Wheeler); and the CMS is WordPress 5.0 which is vulnerable.

So, the next step was to brute-force the credentials for kwheel using hydra, but first I went on the login page entered the username and a random password in order to get the request to pass it to hydra (the request can be obtain either from the network tab in the developer tools, or by using Burp):

hydra -l kwheel -P /usr/share/wordlists/rockyou.txt [ip_address] http-post-form "/wp-login.php:log=ˆUSERˆ&pwd=ˆPASSˆ&wp-submit=Log+In&redirect_to=(here is the original request which is pretty long, the important part was for the user and pass, where it was swaped with ^ for hydra to work)F=The password you entered for the username” -V

NOTE: The F: is intended for the error message that is displayed on the web page, this lets hydra know if the password currently tried is good or not, if the message appears it means that the tested password is incorrect and moves on!

Since we now have the credentials for the user (kwheel:cutiepie1), we can search for an exploit in metasploit:

search wordpress 5.0

This give an exploit named wp_crop_rce. We select this exploit and set up the options for this particular exploit (USERNAME, PASSWORD, RHOSTS, LHOST).

After that we hit run and we let the exploit do its thing, finally we get the meterpreter shell. 

There is another caveat on this box, the same as the rabbit hole. When searching for the user.txt we get a hit, but when reading the txt file, we see that the author lead us to another rabbit hole. This means that the next step is to elevate our privileges. 

We start by trying to find SUID files. One interesting binary is /usr/sbin/checker.

To test what it is doing we run:

ltrace checker

This binary gets the "admin” environment variable and prints out "Not an Admin”. So if we change the env variable we should be a shell back.

export admin=1

checker

And we get the root shell! Now we just need to find the 2 text files associated with the flags and the box is done.