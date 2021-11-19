// Factor to speed up panning by with job button
var JOGFACTOR_PANNING = 4;

function initChannel() {
    // Creating views
    trackBank = host.createMainTrackBank(1, 1, 1);
    arrangerCursorTrack = host.createArrangerCursorTrack(1, 1);
    trackBank.followCursorTrack(arrangerCursorTrack);
    transport = host.createTransport();
    application = host.createApplication();

    // Publishing observers
    trackBank.getChannel(0).mute().addValueObserver(function(isMuted) {
        if (isMuted) {
            sendMidi(144, NOTE.MUTE, LIGHT_ON);
        } else {
            sendMidi(144, NOTE.MUTE, LIGHT_OFF);
        }
    });

    trackBank.getChannel(0).solo().addValueObserver(function(isSolo) {
        if (isSolo) {
            sendMidi(144, NOTE.SOLO, LIGHT_ON);
        } else {
            sendMidi(144, NOTE.SOLO, LIGHT_OFF);
        }
    });

    transport.isArrangerAutomationWriteEnabled().addValueObserver(function(isAutomationWrite) {
        if (isAutomationWrite) {
            sendMidi(144, NOTE.AUTOMATIONWRITE, LIGHT_ON);
        } else {
            sendMidi(144, NOTE.AUTOMATIONWRITE, LIGHT_OFF);
        }
    });

    transport.isAutomationOverrideActive().addValueObserver(function(isAutomationOverride) {
        if (isAutomationOverride) {
            sendMidi(144, NOTE.AUTOMATIONREAD, LIGHT_ON);
        } else {
            sendMidi(144, NOTE.AUTOMATIONREAD, LIGHT_OFF);
        }
    });

    trackBank.getTrack(0).arm().addValueObserver(function(isArmed) {
        if (isArmed) {
            sendMidi(144, NOTE.RECORDARM, LIGHT_ON);
        } else {
            sendMidi(144, NOTE.RECORDARM, LIGHT_OFF);
        }
    });

    trackBank.getTrack(0).monitor().addValueObserver(function(isMonitored) {
        if (isMonitored) {
            sendMidi(144, NOTE.INPUTMONITOR, LIGHT_ON);
        } else {
            sendMidi(144, NOTE.INPUTMONITOR, LIGHT_OFF);
        }
    });

    trackBank.getChannel(0).volume().value().addValueObserver(function(volumeValue) {
        var LSB = parseInt((volumeValue * 16383) % 128);
        var MSB = parseInt((volumeValue * 16383) / 128);
        sendMidi(224, LSB, MSB);
    });

    return onMidiChannel;
}

function onMidiChannel(status, data1, data2) {
    // Check if message is MIDI CC
    if (isChannelController(status)) {
        var changeValue = midiCcValueToInteger(data2);
        if (isJogActive)
            changeValue = JOGFACTOR_PANNING * changeValue;
        switch (data1) {
            case CC.PAN:
                trackBank.getChannel(0).pan().value().inc(changeValue, ENCODER_RESOLUTION);
                break;
        }
    } else if (isNoteOn(status) && data2 > 0) {
        switch (data1) {
            case NOTE.CHANNELSELECTRIGHT:
                arrangerCursorTrack.selectNext();
                break;
            case NOTE.CHANNELSELECTLEFT:
                arrangerCursorTrack.selectPrevious();
                break;
            case NOTE.MUTE:
                trackBank.getChannel(0).mute().toggle();
                break;
            case NOTE.SOLO:
                trackBank.getChannel(0).solo().toggle();
                break;
            case NOTE.AUTOMATIONWRITE:
                transport.isArrangerAutomationWriteEnabled().toggle();
                break;
            case NOTE.AUTOMATIONREAD:
                transport.resetAutomationOverrides();
                break;
            case NOTE.RECORDARM:
                trackBank.getTrack(0).arm().toggle();
                break;
            case NOTE.INPUTMONITOR:
                trackBank.getTrack(0).monitor().toggle();
                break;
            case NOTE.EBUTTON:
                application.toggleInspector();
                break;
            case NOTE.OPENVSTI:
                application.toggleDevices();
                break;
        }
    } else if (status == 224) {
        trackBank.getChannel(0).volume().value().set(data2 * 128 + data1, 16383);
    }
}
