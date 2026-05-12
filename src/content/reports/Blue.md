# Blue

### Task 1

*How many ports are open with a port number under 1000?*

Ans: 3

*What is this machine vulnerable to?*

Ans: ms17-010 (EternalBlue)

### Task 2

*Find the exploitation code we will run against the machine.*

Ans: exploit/windows/smb/ms17_010_eternalblue

*Show options and set the one required value.* 

Ans: RHOSTS

### Task 3

*What is the name of the post module we will use?*

Ans: post/multi/manage/shell_to_meterpreter

*Show options, what option are we required to change?*

Ans: SESSION

Verify that we have escalated ti NT AUTHORITY\SYSTEM. Run getsystem to confirm this. Feel free to open a dos shell via the command 'shell’ and run 'whoami’. This should return that we are indeed system. Background this shell afterwards and select our meterpreter session for usage again. 

List all the processes running via the 'ps’ command. Just because we are system doesn't mean our process is. Find a process towards the bottom of this list that is running at NT AUTHORITY\SYSTEM and write down the process id. 

process: smss.exe

Migrate to this process using the 'migrate PROCESS_ID’ command where the process id is the one you just wrote down in the previous step. This may take several attempts, migrating processes is not very stable. If this fails, you may need to re-run the conversion process or reboot the machine and start once again. If this happens, try a different process next time. 

### Task 4

*Within our elevated meterpreter shell, run the command 'hashdump’. This will dump all of the passwords on the machine as long as we have the correct privileges to do so. What is the name of the non-default user?*

Ans: Jon

*Copy this password hash to a file and research how to crack it. What is the cracked password?*

Instead of using the host machine, backgrounding the meterpreter sessions, we can use nano inside msfconsole. Paste the hashes inside the file and use John with this file.

john —format=NT —wordlist=/usr/share/wordlists/rockyou.txt blue_hash.txt

Ans: alqfna22

### Task 5

*Flag1? This flag can be found at the system root.*

Inside meterpreter use search -f flag1.txt . 

Ans: flag{access_the_machine}

*Flag2? This flag can be found at the location where passwords are stored within Windows.* 

Ans: flag{sam_database_elevated_access}

*Flag3? This flag can be found in an excellent location to loot. After all, Administrators usually have pretty interesting things saved.*

Ans: flag{admin_documents_can_be_valuable}