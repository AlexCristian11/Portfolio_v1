# VulnNet: Internal

VulnNet Entertainment is a company that learns from its mistakes. They quickly realized that they can't make a properly secure web application so they gave up on that idea. Instead, they decided to set up internal services for business purposes. As usual, you're tasked to perform a penetration test of their network and report your findings.

I started by running a nmap scan on the target machine:

![nmap_scan.png](/images/reports/vulnet_internal/nmap_scan.png)

Since I saw that both ports 139 and 445 were open for Samba I first tried to see if I can access the Samba shares.

I first listed all of the SMB shares to see what shares are on the server. I found the "shares” share and I then connected to this share through smbclient:

![smb.png](/images/reports/vulnet_internal/smb.png)

Inside the share we have 2 folders named "temp” and "data”, inside them we have 3 txt file which I downloaded to my machine. Reading the **services.txt** file results in finding the first flag. 

Next I explored NFS (Network File System), service that was open on port 2049. I used the showmount command, this revealed the NFS share /opt/conf. I created a new directory inside /tmp and mounted the /opt share inside that directory. After inspecting the contents of the /conf directory, we see a redis directory. Looking inside we see a configuration file for redis. This conf file holds the master password for the Redis service. This leads to next exploiting Redis. 

![nfs.png](/images/reports/vulnet_internal/nfs.png)

![redis_pass.png](/images/reports/vulnet_internal/redis_pass.png)

After connecting to Redis, I listed all of the keys. Immediately, I found the "internal flag”, which answers the 2nd question on this box. Beside this key, I found the key "authlist”. Checking the contents revealed base64 encoded data. After deconding I got the following string of text:

![redis.png](/images/reports/vulnet_internal/redis.png)

**Authorization for rsync://rsync-connect@127.0.0.1 with password Hcg3HP67@TW@Bc72v**

![rsync.png](/images/reports/vulnet_internal/rsync.png)

Next, since I found the credentials for rsync I connected to it. When connected I saw that we have the directory called "files” and inside it we have "sys-internal”, therefore I downloaded the "sys-internal” to my machine. 

![rsync_sys.png](/images/reports/vulnet_internal/rsync_sys.png)

After the download I looked inside the directory, thus finding the user flag stored inside the **user.txt** file. 

The "sys-internal” directory also contains a .ssh directory, this gives me the opportunity to gain a shell by generating and uploading an SSH key. 

I generated an SSH key on my machine:

![rsa_key.png](/images/reports/vulnet_internal/rsa_key.png)

Then, I uploaded the the public key via Rsync:

![upload_rsa.png](/images/reports/vulnet_internal/upload_rsa.png)

After the upload, I connected to the machine via SSH:

![connection_ssh.png](/images/reports/vulnet_internal/connection_ssh.png)

Next, I ran a quick check for listening services:

![services.png](/images/reports/vulnet_internal/services.png)

I found a TeamCity instance on one of the ports. After setting up port forwarding, I accessed the web interface:

![port_forwarding.png](/images/reports/vulnet_internal/port_forwarding.png)

Navigating to [http://localhost:8111](http://localhost:8111) brought me to the TeamCity login page. The login requires administrator credentials, so I began looking for the TeamCity installation directory on the machine.

![teamcity.png](/images/reports/vulnet_internal/teamcity.png)

Inside the logs directory of the TeamCity installation, I found a log file containing the super user token. Using this token, I logged in as the administrator. 

 

![logs.png](/images/reports/vulnet_internal/logs.png)

![token.png](/images/reports/vulnet_internal/token.png)

Once I logged in, I created a new project and configured a build script to grant root privileges. Running the build executed my script, elevating my shell privileges to root.

![login.png](/images/reports/vulnet_internal/login.png)

I created a new project.

![create_project.png](/images/reports/vulnet_internal/create_project.png)

After this, we need to create a build configuration.

![build_config.png](/images/reports/vulnet_internal/build_config.png)

After creating the build configuration, we go back to the project and edit this configuration file. 

Navigate to Build Steps, and Add Build Step. 

![build_step.png](/images/reports/vulnet_internal/build_step.png)

Finally click save and then run to execute the script. We now can go back to the user shell and confirm the root access of the shell.

![run.png](/images/reports/vulnet_internal/run.png)

![root.png](/images/reports/vulnet_internal/root.png)