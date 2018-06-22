// Note: blinking "READY LED" can not be avoided, CC121 needs F043103E150001F7 every second...
loadAPI(5);
load("SteinbergCC121.transport.js");
load("SteinbergCC121.function.js");
load("SteinbergCC121.ai.js");
load("SteinbergCC121.channel.js");
load("SteinbergCC121.device.js");

// Constants and magic numbers

// Encoder resolution in steps
var ENCODER_RESOLUTION = 256;

// Controller does not send absolut values but relative changes
var ENCODER_POS_LO = 1; // + 1
var ENCODER_POS_HI = 15; // + 15
var ENCODER_NEG_LO = 65; // - 1
var ENCODER_NEG_HI = 79; // - 15

// Data values for button LEDs
var LIGHT_ON = 127;
var LIGHT_OFF = 0;

// Midi note number for buttons
var NOTE = {
    RECORDARM: 0x00,
    SOLO: 0x08,
    MUTE: 0x10,
    CHANNELSELECTLEFT: 0x30,
    CHANNELSELECTRIGHT: 0x31,
    EBUTTON: 0x33,
    FUNCTION1: 0x36,
    FUNCTION2: 0x37,
    FUNCTION3: 0x38,
    FUNCTION4: 0x39,
    VALUEENCODERBUTTON: 0x3A,
    FOOTSWITCH: 0x3B,
    AUTOMATIONREAD: 0x4A,
    AUTOMATIONWRITE: 0x4B,
    LOOP: 0x56,
    TOSTART: 0x58,
    TOEND: 0x5A,
    REWIND: 0x5B,
    FORWARD: 0x5C,
    STOP: 0x5D,
    PLAY: 0x5E,
    RECORD: 0x5F,
    EQENABLE1: 0x70,
    EQENABLE2: 0x71,
    EQENABLE3: 0x72,
    EQENABLE4: 0x73,
    EQTYPE: 0x74,
    ALLBYPASS: 0x75,
    JOG: 0x76,
    LOCK: 0x77,
    INPUTMONITOR: 0x78,
    OPENVSTI: 0x79
};

// Midi CC number for knobs
var CC = {
    PAN: 0x10,
    EQQ1: 0x20,
    EQQ2: 0x21,
    EQQ3: 0x22,
    EQQ4: 0x23,
    EQFREQUENCY1: 0x30,
    EQFREQUENCY2: 0x31,
    EQFREQUENCY3: 0x32,
    EQFREQUENCY4: 0x33,
    EQGAIN1: 0x40,
    EQGAIN2: 0x41,
    EQGAIN3: 0x42,
    EQGAIN4: 0x43,
    VALUE: 0x50,
    AIKNOB: 0x3C
}

// Array of midi listeners
var midiListeners;

// Job button is for parameter acceleration;
var isJogActive = false;

// Company, product, script version, UUID, author
host.defineController("Steinberg", "CC121", "1.0", "A1068940-6B61-11E8-B566-0800200C9A66", "Philipp Winniewski");
host.defineMidiPorts(1, 1);
// For Windows
host.addDeviceNameBasedDiscoveryPair(["Steinberg CC121-1"], ["Steinberg CC121-1"]);
// For Linux
host.addDeviceNameBasedDiscoveryPair(["Steinberg CC121 MIDI 1"], ["Steinberg CC121 MIDI 1"]);

function init() {
    // Configuring MIDI device
    host.getMidiInPort(0).setMidiCallback(onMidi);

    // Initializing controller sections
    midiListeners = [
        initTransport(),
        initFunction(),
        initAi(),
        initChannel(),
        initDevice()
    ];
}

function exit() {
    for (i = 0; i < 128; i++) {
        sendMidi(144, i, LIGHT_OFF);
    }
}

function onMidi(status, data1, data2) {
    for (i = 0; i < midiListeners.length; i++) {
        midiListeners[i](status, data1, data2);
    }
}

function midiCcValueToInteger(ccValue) {
    if (ccValue >= ENCODER_POS_LO && ccValue <= ENCODER_POS_HI) {
        return ccValue - ENCODER_POS_LO + 1;
    } else if (ccValue >= ENCODER_NEG_LO && ccValue <= ENCODER_NEG_HI) {
        return -(ccValue - ENCODER_NEG_LO + 1);
    } else {
        return 0;
    }
}