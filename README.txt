Installation: 

Move all JavaScript files into the controller folder of Bitwig like i.e. "Bitwig Studio/Controller Scripts/Steinberg/CC121". 
The files are: 

- SteinbergCC121.control.js (starting point of the script)
- SteinbergCC121.ai.js (AI knob, zoom, jog)
- SteinbergCC121.channel.js (channel functions)
- SteinbergCC121.device.js (device functions)
- SteinbergCC121.function.js (function buttons, shortcuts)
- SteinbergCC121.transport.js (transport functions)

When using Linux, the script should automaticly find and subscribe the controller. It can be necessary for other operating systems to manually choose the controller script and select the right MIDI-IN and MIDI-OUT devices in the Bitwig settings.

Information:

Script was tested in Linux Mint 18 64-bit with Bitwig 2 and uses API version 5. There is an explanation what each knob and button does (assignment.pdf).  

Known issues: 

When changing a device parameter on parameter page 1, the LEDs of the parameter buttons (parameters 5-8 on page 2) light up like the parameters 5-8 on page 1. This seems inevitable with the current API due to the face that one can only set a callback for a parameter of the parameter view. When the view changes its page, the callback is activated. Moveover, increasing the amount of parameters per page seems not to work for values greater than 8, so that page scrolling is necessary. 
However, the button function itself works fine - it is only the LEDs. 

About:

Author: Philipp Winniewski
Date: 22/06/2018
