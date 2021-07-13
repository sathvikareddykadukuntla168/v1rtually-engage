const createRoomButton = document.querySelector("#createroom");
const videoCont = document.querySelector('.video-self');
const roomCodeCont = document.querySelector('#roomcode');
const joinRoomButton = document.querySelector('#joinroom');
const mic = document.querySelector('#mic');
const cam = document.querySelector('#webcam');
const profbtn= document.querySelector('.prof');

let micAllowed = 1;
let camAllowed = 1;
let professional=false;

let mediaConstraints = { video: true, audio: true };

navigator.mediaDevices.getUserMedia(mediaConstraints)
    .then(localstream => {
        videoCont.srcObject = localstream;
})

/* Professional needed or not */

profbtn.addEventListener('click',()=>{
   // console.log("Professional button clicked");
    professional=!professional;
})

/*  serve join room request from first end through room id*/

joinRoomButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (roomCodeCont.value.trim() == "") {
        roomCodeCont.classList.add('roomcode-error');
        return;
    }
    const code = roomCodeCont.value;
    location.href = `/room.html?room`+code+`&prof=`+professional;
})

const createroomtext = 'Creating Room...';

/* CREATE UNIQUE ROOMID */
function uuidv4() {
    return 'xxyxyx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/* Create room button request */
createRoomButton.addEventListener('click', (e) => {
    e.preventDefault();
    createRoomButton.disabled = true;
    createRoomButton.innerHTML = 'Creating Room';
    createRoomButton.classList = 'createroom-clicked';

    setInterval(() => {
        if (createRoomButton.innerHTML < createroomtext) {
            createRoomButton.innerHTML = createroomtext.substring(0, createRoomButton.innerHTML.length + 1);
        }
        else {
            createRoomButton.innerHTML = createroomtext.substring(0, createRoomButton.innerHTML.length - 3);
        }
    }, 500);
    location.href = `/room.html?room=${uuidv4()}&prof=${professional}`;
});

/* change room id already one is created on name of it */
roomCodeCont.addEventListener('change', (e) => {
    e.preventDefault();
    if (roomCodeCont.value.trim() !== "") {
        roomCodeCont.classList.remove('roomcode-error');
        return;
    }
})

/* MEDIA MANAGING - VIDEO  AUDIO */
cam.addEventListener('click', () => {
    if (camAllowed) {
        mediaConstraints = { video: false, audio: micAllowed ? true : false };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localstream => {
                videoCont.srcObject = localstream;
            })

        cam.classList = "nodevice";
        cam.innerHTML = `<i class="fas fa-video-slash"></i>`;
        camAllowed = 0;
    }
    else {
        mediaConstraints = { video: true, audio: micAllowed ? true : false };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localstream => {
                videoCont.srcObject = localstream;
            })

        cam.classList = "device";
        cam.innerHTML = `<i class="fas fa-video"></i>`;
        camAllowed = 1;
    }
})

mic.addEventListener('click', () => {
    if (micAllowed) {
        mediaConstraints = { video: camAllowed ? true : false, audio: false };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localstream => {
                videoCont.srcObject = localstream;
            })

        mic.classList = "nodevice";
        mic.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
        micAllowed = 0;
    }
    else {
        mediaConstraints = { video: camAllowed ? true : false, audio: true };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localstream => {
                videoCont.srcObject = localstream;
            })

        mic.innerHTML = `<i class="fas fa-microphone"></i>`;
        mic.classList = "device";
        micAllowed = 1;
    }
})