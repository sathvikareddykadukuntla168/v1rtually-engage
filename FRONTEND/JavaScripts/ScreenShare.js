let isScreenStreaming = false;
let isVideoOnFullScreen = false;
let isDocumentOnFullScreen = false;
let screenShareBtn;
screenShareBtn = getId("screenShareBtn");

tippy(screenShareBtn, {
    content: "START screen sharing",
    placement: "right-start",
});

function manageLeftButtons() {
    setScreenShareBtn();
}
/**
 * Check if can share a screen,
 * if yes show button else hide it
 */
 function setScreenShareBtn() {
    if (
      !isMobileDevice &&
      (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia)
    ) {
      // share screen on - off button click event
      screenShareBtn.addEventListener("click", (e) => {
        toggleScreenSharing();
      });
    } else {
      screenShareBtn.style.display = "none";
    }
}

setScreenShareBtn();

function refreshMyLocalStream(stream, localAudioTrackChange = false) {
    stream.getVideoTracks()[0].enabled = true;
  
    // enable audio
    if (localAudioTrackChange && myAudioStatus === false) {
      audioBtn.className = "fas fa-microphone";
      setMyAudioStatus(true);
      myAudioStatus = true;
    }
  
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
    const newStream = new MediaStream([
      stream.getVideoTracks()[0],
      localAudioTrackChange
        ? stream.getAudioTracks()[0]
        : localMediaStream.getAudioTracks()[0],
    ]);
    localMediaStream = newStream;
  
    // log newStream devices
    console.log("refreshMyLocalStream", {
      audio: localMediaStream.getAudioTracks()[0].label,
      video: localMediaStream.getVideoTracks()[0].label,
    });
  
    // attachMediaStream is a part of the adapter.js library
    attachMediaStream(myVideo, localMediaStream); // newstream
  
    // on toggleScreenSharing video stop
    stream.getVideoTracks()[0].onended = () => {
      if (isScreenStreaming) toggleScreenSharing();
    };
  
    /** when you stop the screen sharing, on default i turn back to the webcam with video stream ON.
     *  if you want the webcam with video stream OFF, just disable it with the button (click to video OFF),
     *  before to stop the screen sharing.
     */
    if (myVideoStatus === false) {
      localMediaStream.getVideoTracks()[0].enabled = false;
    }
  }
/**
 * Enable - disable screen sharing
 */
 function toggleScreenSharing() {
    const constraints = {
      video: true,
    };
  
    let screenMediaPromise;
  
    if (!isScreenStreaming) {
      // on screen sharing start
      if (navigator.getDisplayMedia) {
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
        screenMediaPromise = navigator.getDisplayMedia(constraints);
      } else if (navigator.mediaDevices.getDisplayMedia) {
        screenMediaPromise = navigator.mediaDevices.getDisplayMedia(constraints);
      } else {
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        screenMediaPromise = navigator.mediaDevices.getUserMedia({
          video: {
            mediaSource: "screen",
          },
        });
      }
    } else {
      // on screen sharing stop
      const audioSource = audioInputSelect.value;
      const videoSource = videoSelect.value;
      const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: { deviceId: videoSource ? { exact: videoSource } : undefined },
      };
      screenMediaPromise = navigator.mediaDevices.getUserMedia(constraints);
      // if screen sharing accidentally closed
      if (isStreamRecording) {
        stopStreamRecording();
      }
    }
    screenMediaPromise
      .then((screenStream) => {
        // stop cam video track on screen share
        stopLocalVideoTrack();
        isScreenStreaming = !isScreenStreaming;
        refreshMyStreamToPeers(screenStream);
        refreshMyLocalStream(screenStream);
        myVideo.classList.toggle("mirror");
        setScreenSharingStatus(isScreenStreaming);
        //setMyVideoStatusTrue();
      })
      .catch((err) => {
        console.error("[Error] Unable to share the screen", err);
        userLog("error", "Unable to share the screen " + err);
      });
  }
 
  /**
   * Set Screen Sharing Status
   * @param {*} status
   */
   function setScreenSharingStatus(status) {
    screenShareBtn.className = status ? "fas fa-stop-circle" : "fas fa-desktop";
    // only for desktop
    if (!isMobileDevice) {
      tippy(screenShareBtn, {
        content: status ? "STOP screen sharing" : "START screen sharing",
        placement: "right-start",
      });
    }
  }
  function refreshMyLocalStream(stream, localAudioTrackChange = false) {
  stream.getVideoTracks()[0].enabled = true;

  // enable audio
  if (localAudioTrackChange && myAudioStatus === false) {
    audioBtn.className = "fas fa-microphone";
    setMyAudioStatus(true);
    myAudioStatus = true;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
  const newStream = new MediaStream([
    stream.getVideoTracks()[0],
    localAudioTrackChange
      ? stream.getAudioTracks()[0]
      : localMediaStream.getAudioTracks()[0],
  ]);
  localMediaStream = newStream;

  // log newStream devices
  console.log("refreshMyLocalStream", {
    audio: localMediaStream.getAudioTracks()[0].label,
    video: localMediaStream.getVideoTracks()[0].label,
  });

  // attachMediaStream is a part of the adapter.js library
  attachMediaStream(myVideo, localMediaStream); // newstream

  // on toggleScreenSharing video stop
  stream.getVideoTracks()[0].onended = () => {
    if (isScreenStreaming) toggleScreenSharing();
  };

  /** when you stop the screen sharing, on default i turn back to the webcam with video stream ON.
   *  if you want the webcam with video stream OFF, just disable it with the button (click to video OFF),
   *  before to stop the screen sharing.
   */
  if (myVideoStatus === false) {
    localMediaStream.getVideoTracks()[0].enabled = false;
  }
}
