function initFunction() {
    // Creating views
    application = host.createApplication();
    transport = host.createTransport();

    return onMidiFunction;
}

function onMidiFunction(status, data1, data2) {
    // Check if message is MIDI CC
    if (isChannelController(status)) {
        switch (data1) {
            case CC.VALUE:
                transport.metronomeVolume().inc(midiCcValueToInteger(data2), ENCODER_RESOLUTION);
                break;
        }
    } else if (isNoteOn(status) && data2 > 0) {
        switch (data1) {
            case NOTE.FUNCTION1:
                application.undo();
                break;
            case NOTE.FUNCTION2:
                application.redo();
                break;
            case NOTE.FUNCTION3:
                application.remove();
                break;
            case NOTE.FUNCTION4:
                application.duplicate();
                break;
            case NOTE.VALUEENCODERBUTTON:
                transport.isMetronomeEnabled().toggle();
                break;
            case NOTE.EQENABLE1:
                application.createAudioTrack(-1);
                break;
            case NOTE.EQENABLE2:
                application.createInstrumentTrack(-1);
                break;
            case NOTE.EQENABLE3:
                application.createEffectTrack(-1);
                break;
            case NOTE.EQENABLE4:
                application.rename();
                break;
        }
    }
}