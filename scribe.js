
function loadExternalScript(url, callback) {
  // create script elem using provided url as src
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;

  // Register callback function to run after script loaded.
  // There are several events for cross browser compatibility.
  script.onreadystatechange = callback;
  script.onload = callback;
  script.onerror = (e) => {
    console.log("Error loading " + this.src);
    reportFailure(
      "Oopps.. something went wrong. Failed to join scripts from Jitsi. Was the domain correct?"
    );
  };

  // Add script elem to head to trigger loading
  document.head.appendChild(script);
}


const reportFailure = message => {
  console.error(message);

  // This really shouldn't be here. This file should know nothing about the UI
  $('<div>', {class: 'text-danger mt-1', html: '&#9888; ' + message})
    .prependTo($('#panel'));

};


function jitsiJoin(params) {
  const {domain, room, token, parentNode, onEventCallback, onLoadCallback} = params;

  let options = {
    roomName: room,
    parentNode: parentNode,
    height: 300,
    userInfo: {
      displayName: "Jitsi Scribe"
    },
    onload: onLoadCallback,
    configOverwrite: {
      prejoinConfig: {
        enabled: false,
      },
      startAudioOnly: true,  // do not send or receive video
      startSilent: true,  // disable audio output
      startWithAudioMuted: true,  // disable mic
      startWithVideoMuted: true,  // disable camera
      disableInitialGUM: true,  // don't ask for media permissions
      toolbarButtons: ['hangup'], // disable all buttons except hangup
      notifications: [],  // do not receive any notifications
      disabledSounds: [  // disable sounds
        'ASKED_TO_UNMUTE_SOUND',
        'E2EE_OFF_SOUND',
        'E2EE_ON_SOUND',
        'INCOMING_MSG_SOUND',
        'KNOCKING_PARTICIPANT_SOUND',
        'LIVE_STREAMING_OFF_SOUND',
        'LIVE_STREAMING_ON_SOUND',
        'NO_AUDIO_SIGNAL_SOUND',
        'NOISY_AUDIO_INPUT_SOUND',
        'OUTGOING_CALL_EXPIRED_SOUND',
        'OUTGOING_CALL_REJECTED_SOUND',
        'OUTGOING_CALL_RINGING_SOUND',
        'OUTGOING_CALL_START_SOUND',
        'PARTICIPANT_JOINED_SOUND',
        'PARTICIPANT_LEFT_SOUND',
        'RAISE_HAND_SOUND',
        'REACTION_SOUND',
        'RECORDING_OFF_SOUND',
        'RECORDING_ON_SOUND',
        'TALK_WHILE_MUTED_SOUND',
      ]
    }
  }

  if (token) {
    options['jwt'] = token
  }

  const api = new JitsiMeetExternalAPI(domain, options);

  window.addEventListener("beforeunload", function() {
    api.dispose();
  });

  // Register listeners
  let closed = false;

  api.addListener("videoConferenceJoined", function () {

    // TODO: use api.getRoomsInfo() to load current state
    onEventCallback({
      event: 'start',
    })
  });


  function onClose() {
    if (closed) return;  // reject duplicate readyToClose events
    closed = true;

    onEventCallback({
      event: 'end',
    });

    // TODO: remove all listeners
  }
  api.addListener("readyToClose", onClose);

  // we need this too because on meet.jit.si, readyToClose is not triggered until promo closed.
  api.addListener("videoConferenceLeft", onClose);

  api.addListener("incomingMessage", function (e) {
    onEventCallback({
      event: 'chat',
      data: {
        fromId: e.from,
        fromName: e.nick,
        isPrivateMessage: e.privateMessage,
        message: e.message,
      }
    });
  });

  // TODO: handle subjectChange
  // TODO: handle participantJoined
  // TODO: handle participantLeft
  // TODO: handle participantKickedOut
  // TODO: handle participantRoleChanged

}