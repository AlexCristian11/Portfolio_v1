# Retro

This box is the initial version of the box Blaster. This box can be solved the same way as Blaster.

There is another way to escalate privileges. After RDP-ing into the machine, we can open up an Powershell. Get system information through 'systeminfo’, searching online for exploits for this build version of Windows (14393) leads to CVE-2017-0213. We can find an exe exploit. 

I tried getting the exe by searching for it on the victim machine, but that didn't work, so I started a Python server on my machine to try to get the exploit on the victim machine. Using the command Invoke-WebRequest didn't work for some reason. I got it to work by going in Google Chrome on the victim and going to my Python server. This way I could download the exploit. 

After downloading I ran the exploit and I got the cmd shell with elevated privileges. The only thing remaining was to read the root.txt file to get the flag.