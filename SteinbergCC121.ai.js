// Keep selected AI knob function
var isLockActive = false;

// Factor to speed up scrolling by with job button
var JOGFACTOR_POSITION = 4;

function initAi() {
    // Creating views
    application = host.createApplication();
    transport = host.createTransport();

    return onMidiAi;
}

function onMidiAi(status, data1, data2) {
    // Check if message is MIDI CC from AI knob
    if (isChannelController(status) && data1 == CC.AIKNOB) {
        var knob_value = midiCcValueToInteger(data2);
        if (isLockActive) {
            if (knob_value < 0) {
                application.zoomOut();
            } else {
                application.zoomIn();
            }
        } else {
            if (isJogActive) {
                knob_value = JOGFACTOR_POSITION * knob_value;
            }
            transport.incPosition(knob_value, true);
        }
    } else if (isNoteOn(status) && data2 > 0) {
        switch (data1) {
            case NOTE.LOCK:
                isLockActive = !isLockActive;
                if (isLockActive) {
                    sendMidi(144, NOTE.LOCK, LIGHT_ON);
                } else {
                    sendMidi(144, NOTE.LOCK, LIGHT_OFF);
                }
                break;
            case NOTE.JOG:
                isJogActive = !isJogActive;
                if (isJogActive) {
                    sendMidi(144, NOTE.JOG, LIGHT_ON);
                } else {
                    sendMidi(144, NOTE.JOG, LIGHT_OFF);
                }
                break;
        }
    }
}