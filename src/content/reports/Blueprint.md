# Blueprint

I started with a nmap scan:

![nmap.png](/images/reports/blueprint/nmap.png)

Since we have a webserver I ran a Gobuster search, running the abse URL does give me a lot of sub-pages but all of the are forbidden. Going to the base URL in the browser we can see 2 directories ‘catalog’ and docs. Going to ‘catalog’ we are met with a e-commerce website. I ran another Gobuster scan but starting from the ‘catalog’ branch. Here are the 2 searches:

![gobuster1.png](/images/reports/blueprint/gobuster1.png)

![gobuster2.png](/images/reports/blueprint/gobuster2.png)

Going to these  sub-page I didn’t see a lot of interesting things besides the admin page that contains a login form. Next, I used searchsploit to look for possible exploits for oscommerce 2.3.4:

![searchsploit.png](/images/reports/blueprint/searchsploit.png)

I went to dbexploit and choose the RCE exploit, the code is simple I just have to specify the base URL and the installation URL and the php payload, for now I wanted to test if it will work so I deliberately left the payload as in the original exploit ( `system(”ls”)` ). 

![exploit.png](/images/reports/blueprint/exploit.png)

This didn’t work, since system is restricted for security reasons. So next I decided to go with Metasploit. There is one exploit for this version of oscommerce. Here is the setup for the exploit and the shell:

![msf.png](/images/reports/blueprint/msf.png)

Going through different directories I found the root flag:

![root flag.png](/images/reports/blueprint/root_flag.png)

Now we can’t use `kiwi` and for that we will need to create a payload using `msfvenom`:

![msfvenom.png](/images/reports/blueprint/msfvenom.png)

Then I returned to the meterpreter sessions and uploaded the payload:

![upload.png](/images/reports/blueprint/upload.png)

Next I opened another metasploit console, and used the `/exploit/multi/handler` to catch the elevated shell back:

![2nd msfconsole.png](/images/reports/blueprint/2nd_msfconsole.png)

And before exploiting here, back in the other console I executed the payload using: 

`execute -f shell.exe`

And I got back the elevated shell and I could read the NTLM hashes:

![hash.png](/images/reports/blueprint/hash.png)

Note to self: make sure to have the correct payload set in `multi/handler`.