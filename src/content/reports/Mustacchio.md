# Mustacchio

I started by enumerating the machine:

![nmap.png](/images/reports/mustaccio/nmap.png)

![gobuster.png](/images/reports/mustaccio/gobuster.png)

By going to /custom/js we can see a really insteresting file called ‘users.bak’ so we have a backup file for the users, reading the file we get this:

![backup file.png](/images/reports/mustaccio/backup_file.png)

So this looks like a hash for the user ‘admin‘, going to Crackstation we can decrypt this hash:

![hash.png](/images/reports/mustaccio/hash.png)

I tried next to use these credentials for SSH, but they do not work. Looking back at the nmap scan, we can see another http port that seems to have a login page, using there these credentials, we are met with this page:

![admin page.png](/images/reports/mustaccio/admin_page.png)

I submited a basic ‘test’ comment to see what would happen and this is what I saw in Burp:

![request.png](/images/reports/mustaccio/request.png)

So we have a user named ‘Barry’ and we can see a hidden URL `/auth/dontforget.bak`, another backup file. After getting the file and reading it, we don’t have anything of use in it, besides the XML format. After researching online I found a payload to try and see if we can exploit an LFI. 

After inputting this code in the XLM parameter inside the request:

```
<%3fxml+version%3d"1.0"+encoding%3d"UTF-8"%3f>
<!DOCTYPE+foo+[
+++<!ELEMENT+foo+ANY+>
+++<!ENTITY+xxe+SYSTEM++"file%3a///etc/passwd"+>]>
<comment>
++<name>Joe+Hamd</name>
++<author>Barry+Clad</author>
++<com>%26xxe%3b</com>
</comment>
```

we got back the `passwd` file:

![passwd.png](/images/reports/mustaccio/passwd.png)

Bingo! It works.

Now since we know that the user ‘Barry’ exists, we can try and get their private SSH key.

And by changing the file location to `/home/barry/.ssh/id_rsa` we get the private key:

![key.png](/images/reports/mustaccio/key.png)

We can see that the key is encrypted, so I used ss2john and then passed it to john to get the passphrase:

![john.png](/images/reports/mustaccio/john.png)

Now we can log into SSH using the private key and the passphrase:

![shell.png](/images/reports/mustaccio/shell.png)

For the privilege escalation I looked for SUID binaries and I saw an interesting file called ‘live_log’ inside `/home/joe` directory. I used strings to read the binary and it executes the `tail` command to read the contents of `/var/log/nginx/access.log` file:

![binary.png](/images/reports/mustaccio/binary.png)

To exploit this, we can create our tail binary inside /tmp and add the following commands:

![exploit.png](/images/reports/mustaccio/exploit.png)

And so we get root access:

![root.png](/images/reports/mustaccio/root.png)