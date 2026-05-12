# Soupedecode 01

I started by performing a nmap scan:

![nmap.png](/images/reports/soupecode/nmap.png)

We can see services mentioned in the description of the box such as Kerberos and SMB, so we already know that these things will need to be exploited.

From the scan also we learn the hostname and domain name so I decided to add them to /etc/hosts.

Using nxc (netexec) I managed to login as the guest and enumerate the SMB shares:

![shares.png](/images/reports/soupecode/shares.png)

Since we have the permission to read the IPC$ share I found online that nxc has a function to do a RID bruteforce attack to discover domain users:

![users.png](/images/reports/soupecode/users.png)

We can filter the output to create a clean list of usernames,  `nxc smb 10.65.146.59 -u 'guest' -p '' --rid-brute 3000 | grep SidTypeUser | cut -d '\' -f 2 | cut -d ' ' -f 1 > valid_usernames.txt`:

![usernames.png](/images/reports/soupecode/usernames.png)

Next, from what I learned it is not a good idea to try and bruteforce since the accounts might get locked, so we should try for bad password practices such as having the same password as the username:

![hit.png](/images/reports/soupecode/hit.png)

And we get a hit for the user ybob317!

We then login as this user in smbclient to get the user flag:

![user flag.png](/images/reports/soupecode/user_flag.png)