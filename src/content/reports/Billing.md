# Billing

Gain a shell, find the way and escalate your privileges!

**Note:** Bruteforcing is out of scope for this room.

I started by running a Nmap scan on the target IP:

![nmap.png](/images/reports/billing/nmap.png)

Going to the IP address I was met with a login page for MagnusBilling which is a VOIP billing management system:

![page.png](/images/reports/billing/page.png)

Since in the description is mentioned that brute-forcing is out of scope, I skipped trying to brute force credentials for this login page. 

Next, I thought about researching exploits for MagnusBilling. 

![search.png](/images/reports/billing/search.png)

Since I found this exploit, I wanted to give it a try and see if I can get a shell back.

![run_exploit.png](/images/reports/billing/run_exploit.png)

The exploit worked! I got a shell. After looking through the directories I found the user flag:

![user flag.png](/images/reports/billing/user_flag.png)

In order to escalate my privileges, I started by looking at what can the user run as root:

![sudo -l.png](/images/reports/billing/sudo_-l.png)

The user can execute fail2ban-client as root. Looking online for possible exploits i found some commands that helped me root the machine:

![fail2.png](/images/reports/billing/fail2.png)