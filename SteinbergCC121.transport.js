function initTransport() {
    // Creating views
    transport = host.createTransport();
    application = host.createApplication();

    // Publishing observers
    transport.isPlaying().addValueObserver(function(play) {
        if (play) {
            sendMidi(144, NOTE.PLAY, LIGHT_ON);
        } else {
            sendMidi(144, NOTE.PLAY, LIGHT_OFF);
        }
    });

    transport.isArrangerRecordEnabled().addValueObserver(function(record) {
        if (record) {
            sendMidi(144, NOTE.RECORD, LIGHT_ON);
        } else {
            sendMidi(144, NOTE.RECORD, LIGHT_OFF);
        }
    })

    transport.isArrangerLoopEnabled().addValueObserver(function(loop) {
        if (loop) {
            sendMidi(144, NOTE.LOOP, LIGHT_ON);
        } else {
            sendMidi(144, NOTE.LOOP, LIGHT_OFF);
        }
    })

    return onMidiTransport;
}

function onMidiTransport(status, data1, data2) {
    // Check if message is MIDI CC
    if (isChannelController(status)) {

    } else if (isNoteOn(status) && data2 > 0) {
        switch (data1) {
            case NOTE.PLAY:
                transport.play(); // And Pause
                break;
            case NOTE.STOP:
                transport.stop();
                break;
            case NOTE.RECORD:
                transport.record();
                break;
            case NOTE.TOSTART:
                transport.rewind();
                break;
            case NOTE.LOOP:
                transport.toggleLoop();
                break;
            case NOTE.TOEND:
                transport.fastForward();
                break;
        }
    }
}