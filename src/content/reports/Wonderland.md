# Wonderland

I started  by enumerating the machine:

![nmap.png](/images/reports/wonderland/nmap.png)

![gobister1.png](/images/reports/wonderland/gobister1.png)

Going to img and poem doesn’t show anything promising, but when I wen to /r I was met with this page:

![r.png](/images/reports/wonderland/r.png)

So I followed the message and started another gobuster search but starting from ‘r’:

![gobuster2.png](/images/reports/wonderland/gobuster2.png)

Now I remembered the message on the main page ‘Follow the rabbit’. This URL started to look like the word ‘rabbit’ spelled out. So I changed to URL to /r/a/b/b/i/t and got here:

![page.png](/images/reports/wonderland/page.png)

Looking at the source code we can see this:

![code.png](/images/reports/wonderland/code.png)

These look like credentials. And I was right, these are the correct SSH credentials:

![shell.png](/images/reports/wonderland/shell.png)

After looking a bit in the directories, I could see that the flag are reversed as the hint says, the root flag is in alice’s directory and the user flag is in the root directory that we can access. So I just read the user flag:

![user flag.png](/images/reports/wonderland/user_flag.png)

Now for the privilege esccalation, when running sudo -l we see this:

![sudo -l.png](/images/reports/wonderland/sudo_-l.png)

We can run the script inside alice’s directory to get access to the user rabbit. The script imports the ‘random’ library and just gets random lines from a poem. We can create our own python random file that generates a shell. This way we get access to the user rabbit:

![rabbit.png](/images/reports/wonderland/rabbit.png)

Now we look inside rabbit’s directory and there we have a binary, looking at it we can see that we can perform the same type of attack as before on the ‘date’ since it doesn’t have an absolute path. 

![date.png](/images/reports/wonderland/date.png)

![script.png](/images/reports/wonderland/script.png)

These are the command to do the attack:

![hatter.png](/images/reports/wonderland/hatter.png)

We’ve create a ‘date’ file that just spanws a bash shell, we’ve added the folder to PATH and finally, we just run the binary to get access to user hatter.

Now to escalate, I read a bit online since I couldn’t figure it out, and apparently I nedd to look for **'cap_setuid+ep'.** 

After that it is pretty easy, we just need to go to GTFObins and get the command from there:

![root.png](/images/reports/wonderland/root.png)