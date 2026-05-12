# Light

I started by connecting to the host with netcat, just like the description and I got the password the the user ‘smokey’:

![nc.png](/images/reports/light/nc.png)

I wasted some time trying different things such I looking in the nmap scan for a different port or trying this password for the SSH service. Instead, everything is done in netcat. Since it is metioned that this box has something to do with databases, we should look into SQLi. 

![sqli.png](/images/reports/light/sqli.png)

I tried multiple SQLi payloads, given that we have some responses, at least we are on a good track. The application does filter characters like “—” and looks for specific words, changing the case of the words helped. Since we get this error again, I tried to close the statement again with `‘` , this lead to a successful UNION injection:

![success.png](/images/reports/light/success.png)

Now we can search for the type of database:

![type.png](/images/reports/light/type.png)

And now we know that we are dealing with a sqlite database. Next we can query from `sqlite_master` to get the database structure:

![struture.png](/images/reports/light/struture.png)

Since we are asked to find the username of the admin and we have a table called ‘admintable’ we can start there:

![flag.png](/images/reports/light/flag.png)

And we get everything we need, the username of admin, the password and the flag.