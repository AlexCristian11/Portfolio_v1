# Bugged

I started by performing a nmap scan. The interesting port was 1883 which runs the mosquitto service. Researching online I discovered that mosquitto is a service used by devices to connect and transmit information using a subscriber and broker type of communication. 

![nmap.png](/images/reports/bugged/nmap.png)

I then installed the mosquitto module using:

`apt install mosquitto mosquitto-clients` 

To get all of the network traffic I subscribed to every client using the command below:

![mosquitto_sub.png](/images/reports/bugged/mosquitto_sub.png)

A particular string stands out, and seeing that it has the double equal at the end it is safe to assume that it is a base64 string. After decoding I got this message:

![base64.png](/images/reports/bugged/base64.png)

We have an unknown device to which we know what it is subscribed to. To test what the traffic is between the subscriber and the broker, I first subscribed to the topic:

![2nd_base64.png](/images/reports/bugged/2nd_base64.png)

And then I published a message to the sub_topic:

![message.png](/images/reports/bugged/message.png)

This way we get another base64 encoded string as a response in the terminal where I subscribed to the device. Decoding gives the following message:

![2nd_decoded.png](/images/reports/bugged/2nd_decoded.png)

From this we can conclude that the message should follow a specific format. Matching this format and changing the input like this:

`{"id": "cdd1b1c0–1c40–4b0f-8e22–61b357548b7d", "cmd": "CMD", "arg": "ls"}`

And then encoding to base64:

`eyJpZCI6ICJjZGQxYjFjMOKAkzFjNDDigJM0YjBmLThlMjLigJM2MWIzNTc1NDhiN2QiLCAiY21kIjogIkNNRCIsICJhcmciOiAibHMifQ==`

This will result in the final message. Now repeating the same step as with the ‘Hello!’ message, we just change the message to the encoded one. This returns in the sub window another encoded message:

![3rd_encoded.png](/images/reports/bugged/3rd_encoded.png)

Decoding this message results in:

![response.png](/images/reports/bugged/response.png)

Given that the cmd command was ‘ls’ this means that it listed what was in the current directory and that being the flag txt file. The next obvious step was to change the cmd command to `cat flag.txt` in order to receive back the contents of the file and submit the flag.

![flag.png](/images/reports/bugged/flag.png)