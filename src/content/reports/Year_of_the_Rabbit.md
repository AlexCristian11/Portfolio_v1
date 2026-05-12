# Year of the Rabbit

I started with a nmap scan:

![nmap.png](/images/reports/year_of_the_rabbit/nmap.png)

At the same time I started a Gibuster scan:

![gobuster.png](/images/reports/year_of_the_rabbit/gobuster.png)

Going to /assets we see this:

![assets.png](/images/reports/year_of_the_rabbit/assets.png)

Going to RickRolled.mp4 it’s obvious what is going to happen :) .

Checking style.css we find something interesting:

![style.png](/images/reports/year_of_the_rabbit/style.png)

Going to this page we see this:

![secret page.png](/images/reports/year_of_the_rabbit/secret_page.png)

So we need to turn off Javascript, doing so results in:

![js disabled.png](/images/reports/year_of_the_rabbit/js_disabled.png)

At the 0:56 mark, we can hear a voice telling us that we are not looking in the correct place, thus being a rabbit hole. 

Technically I should be able to find a hidden directory in a Burp response, but I don’t get it no matter what I do, this should haev been the hidden directory:

![hidden.png](/images/reports/year_of_the_rabbit/hidden.png)

I downloaded the photo and first used exiftool to see if there is some metadata and there seems to be some trailing data. I used strings and got this:

![strings.png](/images/reports/year_of_the_rabbit/strings.png)

So we got the user for the FTP server but we have to do something regarding the password. 

I saved all of the passwords in a text file and used hydra to test every password for the login, I got this:

![hydra.png](/images/reports/year_of_the_rabbit/hydra.png)

And then I logged into the FTP server:

![ftp.png](/images/reports/year_of_the_rabbit/ftp.png)

Reading the file that we’ve got gives us an brainfuck encoded text:

![brainfuck.png](/images/reports/year_of_the_rabbit/brainfuck.png)

![decoded.png](/images/reports/year_of_the_rabbit/decoded.png)

With these credentials I got logged into SSH and we see an interesting message:

![SSH.png](/images/reports/year_of_the_rabbit/SSH.png)

The user flag was easy to find, but we can’t read it since it’s in Gwendoline’s directory. Now we need to escalate our privileges, so we need to do something about the message from the log in. I tried to locate everything that had in the name ‘s3cr3t’:

![locate.png](/images/reports/year_of_the_rabbit/locate.png)

![pass.png](/images/reports/year_of_the_rabbit/pass.png)

With the found password I switched users and got the user flag.

Now we running sudo -l we see this:

![sudo -l.png](/images/reports/year_of_the_rabbit/sudo_-l.png)

And to exploit it we do this:

![root.png](/images/reports/year_of_the_rabbit/root.png)

After inputting the command a vim console will pop up, we just need to write :!/bin/sh and hit enter to get the root shell.