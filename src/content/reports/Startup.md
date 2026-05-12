# Startup

### Task 1

*What is the secret spicy soup recipe?*

We can login anonymously with FTP. After logging in we see some different file and also we have access to the ftp directory that can be access through the web. Upload a php reverse shell in the ftp directory, next start a netcat listener and access the reverse shell from the web,  we get a shell. We cat the recipe.txt file to get the answer.

Ans: love

*What are the contents of user.txt?*

Inside the incidents directory we have a file named suspicious.pcapng. We move it to the ftp directory in order to access it from the web. After downloading and opening the file, we can follow the TCP stream in WireShark, in the stream #7 we find the credentials for lennie. We SSH into lennie's machine with the credentials and cat the user.txt file.

Ans: Flag in user.txt

*What are the contents of root.txt?*

Running sudo -l returns nothing. Searching through directories we find the scripts directory, where we have the file [planner.sh](http://planner.sh). We see that this scripts executes another [print.sh](http://print.sh) inside /etc, we have acces to this file. nano the file and add a reverse shell inside. Start a netcat listener and wait for the root shell. Cat root.txt 

Ans: root.txt