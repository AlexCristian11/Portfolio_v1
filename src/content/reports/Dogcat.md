# Dogcat

I started with a nmap scan:

![nmap.png](/images/reports/dogcat/nmap.png)

This doesn’t lead to much, nor does Gobuster, it only found `/cats` and `/dogs`, but they are forbidden resources. We know from the description of the box that we need to do some kind of LFI attack. Since on the main page we can see in the URL `/?view=` we can try and add there our LFI attack. After a bit of help from write-ups I found out that there are 2 files `dog.php` and `cat.php`, the `/?view` query checks to see if the word ‘dog’ or ‘cat’ is present, the site automatically adds .php to the parameter adn there is a base64 php filter on the query. So the bypass should look like this:

`/?view=php://filter/read=convert.base64-encode/resource=./dog/../index`

After running this query we get back on the page a base64 string:

![string.png](/images/reports/dogcat/string.png)

Putting the string into Cyberchef we get this:

![decoded.png](/images/reports/dogcat/decoded.png)

And so we get the actual php function. 

So, if we add ‘ext’ the script will not add ‘.php’. From what I read I need to try the following URL:

[`http://10.67.147.96///?view=./dog/../../../../../../../var/log/apache2/access.log&ext`](http://10.67.147.96///?view=./dog/../../../../../../../var/log/apache2/access.log&ext&cmd=whoami)

Next, we can input inside the User-Agent a php script in order to get a reverse shell on the server. I opened Burp and changed the user agent:

![burp.png](/images/reports/dogcat/burp.png)

I set up a python server where I have the [shell.ph](http://shell.ph)p file, and send the request. To trigger the php code we’ve put in Burp, we can just refresh the page wth the URL from above (access.log).

![log.png](/images/reports/dogcat/log.png)

And we can see in the log that the file transfered.

To trigger the reverse shell, we just need to go to the base URL /shell.php and we get our shell back:

![shell.png](/images/reports/dogcat/shell.png)

Going to /var/www we get the 2nd flag, and by going to /var/www/html we get the 1st flag. 

To gain root access, I first looked at sudo -l, and we can see that /env can be ran as root. So the command is:

`sudo env /bin/sh`

And get gain root acces and get the 3rd flag. 

In order to get the final flag, we need to break out of the Docker container. If we go to /opt we can see a directory called backups. Inside there is a [`backup.sh`](http://backup.sh) script and `backup.tar` . We can change the script with a bash reverse shell to get back a root shell outside of the container. 

![backups.png](/images/reports/dogcat/backups.png)

![flag4.png](/images/reports/dogcat/flag4.png)