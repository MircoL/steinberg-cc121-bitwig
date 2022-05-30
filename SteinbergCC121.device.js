// Current collection of devices in a channel
var deviceBank;

// Current collection of parameters in a device
var parameterBank;

// Factor to speed up scrolling by with job button
var JOGFACTOR_PARAMETER = 4;

// Device buttons "LOW", "LOW MID", "HIGH MID" and "HIGH"
var LOW_LOCKED = 0;
var LOWMID_LOCKED = 0;
var HIGHMID_LOCKED = 0;
var HIGH_LOCKED = 0;

function initDevice() {
    // Creating views
    arrangerCursorDevice = host.createEditorCursorDevice();

    arrangerCursorDevice.isEnabled().addValueObserver(function (deviceEnabled) {
        if (deviceEnabled) {
            sendMidi(144, NOTE.ALLBYPASS, LIGHT_ON);
        } else {
            sendMidi(144, NOTE.ALLBYPASS, LIGHT_OFF);
        }
    });

    arrangerCursorDevice.exists().markInterested();
    deviceBank = arrangerCursorDevice.deviceChain().createDeviceBank(1);

    parameterBank = arrangerCursorDevice.createCursorRemoteControlsPage(8);

    return onMidiDevice;
}

function onMidiDevice(status, data1, data2) {
    // Check if message is MIDI CC from AI knob
    if (isChannelController(status)) {
        var changeValue = midiCcValueToInteger(data2)
        if (isJogActive)
            changeValue = JOGFACTOR_PARAMETER * changeValue;
        var parameterNumber;
        switch (data1) {
            case CC.EQQ1:
                parameterBank.selectedPageIndex().set(0);
                parameterNumber = 0;
                break;
            case CC.EQQ2:
                parameterBank.selectedPageIndex().set(0);
                parameterNumber = 1;
                break;
            case CC.EQQ3:
                parameterBank.selectedPageIndex().set(0);
                parameterNumber = 2;
                break;
            case CC.EQQ4:
                parameterBank.selectedPageIndex().set(0);
                parameterNumber = 3;
                break;
            case CC.EQFREQUENCY1:
                parameterBank.selectedPageIndex().set(0);
                parameterNumber = 4;
                break;
            case CC.EQFREQUENCY2:
                parameterBank.selectedPageIndex().set(0);
                parameterNumber = 5;
                break;
            case CC.EQFREQUENCY3:
                parameterBank.selectedPageIndex().set(0);
                parameterNumber = 6;
                break;
            case CC.EQFREQUENCY4:
                parameterBank.selectedPageIndex().set(0);
                parameterNumber = 7;
                break;
            case CC.EQGAIN1:
                parameterBank.selectedPageIndex().set(1);
                parameterNumber = 0;
                break;
            case CC.EQGAIN2:
                parameterBank.selectedPageIndex().set(1);
                parameterNumber = 1;
                break;
            case CC.EQGAIN3:
                parameterBank.selectedPageIndex().set(1);
                parameterNumber = 2;
                break;
            case CC.EQGAIN4:
                parameterBank.selectedPageIndex().set(1);
                parameterNumber = 3;
                break;
            default:
                return;
        }
        parameterBank.getParameter(parameterNumber).inc(changeValue, ENCODER_RESOLUTION);
    } else if (isNoteOn(status) && data2 > 0) {
        switch (data1) {
            case NOTE.REWIND:
                arrangerCursorDevice.selectPrevious();
                break;
            case NOTE.FORWARD:
                arrangerCursorDevice.selectNext();
                break;
            case NOTE.ALLBYPASS:
                arrangerCursorDevice.isEnabled().toggle();
                break;
            case NOTE.EQTYPE:
                if (!arrangerCursorDevice.exists().get()) {
                    deviceBank.browseToInsertDevice(0);
                } else if (arrangerCursorDevice.isEnabled().get()) {
                    arrangerCursorDevice.browseToInsertAfterDevice();
                } else {
                    arrangerCursorDevice.browseToReplaceDevice();
                }
                break;
        }
    }
}

function toggleMidiCCValue(value) {
    // Flipping 0 <-> 127
    if (value <= 63) {
        return 127;
    } else {
        return 0;
    }
}