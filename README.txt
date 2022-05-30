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
There is an explanation what each knob and button does (assignment.pdf).  

Changelog:
Version 1.2:
- changed behaviour for various elements
- fixed track focus and selection
- tested with Bitwig 4.0.8

Version 1.1:
- fixed float to int conversion for volumeValue, causing script to cease working in bitwig 3.3

About:

Author: Philipp Winniewski
Date: 28/05/2022
