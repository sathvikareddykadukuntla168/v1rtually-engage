const chatRoom = document.querySelector('.chat-cont');
const chatfull = document.querySelector('.chatt');
const attendiesRoom = document.querySelector('.attendies-cont')
const sendButton = document.querySelector('.chat-send');
const messageField = document.querySelector('.chat-input');
const clearButton = document.querySelector('.clear-chat');
const chatButton = document.querySelector('.chat');
const attendiesButton = document.querySelector('.attendies');
const leftcont = document.querySelector('left-cont');
const gamebutton = document.querySelector('.game');
const bodycont = document.querySelector('.container-room');
const backbtngame = document.querySelector('.back-draw-battle');
const game = document.querySelector('.draw-battle');
const music = document.querySelector('.music-list');
const musicbutton = document.querySelector('.music');
const backmusic = document.querySelector('.back-music');

let chatvisible=false;
let attendiesvisible=false;
let gamevisible=false;
let musicon=false;

const professional = params.get("prof");
//console.log(`isprof `+ professional);

attendiesRoom.style.display="none";
chatfull.style.display="none";
document.querySelector('.right-cont').style.display="none";
document.querySelector('.left-cont').style.width="100%";
game.style.display="none";
music.style.display="none";
 

if(professional=="true"){
    //console.log("i am turning off music and games");
    gamebutton.style.display="none";
    musicbutton.style.display="none";
}
else{
    gamebutton.style.display="block";
    musicbutton.style.display="block";
}


/* Chat send button */
sendButton.addEventListener('click', () => {
    const msg = messageField.value;
    if(msg!=""){
        messageField.value = '';
        socket.emit('message', msg, username, roomid);
    }
})

/* Chat zone activated */
messageField.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendButton.click();
    }
});

/* Scroll chat when filled */
socket.on('message', (msg, sendername, time) => {
    chatRoom.scrollTop = chatRoom.scrollHeight;
    chatRoom.innerHTML += `<div class="message">
    <div class="info">
        <div class="username">${sendername}</div>
        <div class="time">${time}</div>
    </div>
    <div class="content">
        ${msg}
    </div>
</div>`
});


/* clear chat */
clearButton.addEventListener('click', () => {
    //console.log("clear chat btn clicked");
    chatRoom.innerHTML=``;
})

/* Render Attendies list */
socket.on('attendies',(attendieslist)=>{
    attendiesRoom.innerHTML=`<div>Total Members: ${attendieslist.length}</div>`;
    for(var peer in attendieslist){
        attendiesRoom.innerHTML += `<div class="message">
        <div class="info">
            <div class="username">${attendieslist[peer]}</div>
        </div></div>`
    } 
});

/* Game managing */
gamebutton.addEventListener('click',()=>{
        game.style.display="block";
        bodycont.style.display="none";
});

backbtngame.addEventListener('click', () => {
        game.style.display="none";
        bodycont.style.display="block";
})

/* Music managing */
musicbutton.addEventListener('click',()=>{
    if(musicon){music.style.display="none";musicon=false;}
    else{music.style.display="block";musicon=true;}
});

/* UI managing on button clicks */
attendiesButton.addEventListener('click', () => {
    //console.log("attendies btn clicked");
    attendiesRoom.style.display="block";
    chatfull.style.display="none";
    if(attendiesvisible){
        attendiesvisible=false;
        chatvisible=false;
        attendiesRoom.style.display="none";
        chatfull.style.display="none";
        document.querySelector('.right-cont').style.display="none";
        document.querySelector('.left-cont').style.width="100%";
    }
    else if(chatvisible){
        attendiesvisible=true;
        chatvisible=false;
        attendiesRoom.style.display="block";
        chatfull.style.display="none";
        document.querySelector('.right-cont').style.display="block";
        document.querySelector('.left-cont').style.width="70%";
    }
    else{
        attendiesvisible=true;
        attendiesRoom.style.display="block";
        document.querySelector('.right-cont').style.display="block";
        document.querySelector('.left-cont').style.width="70%";
    }
    socket.emit("attendies", roomid);
    
});

chatButton.addEventListener('click', () => {
    //console.log("chat btn clicked");
    if(attendiesvisible){
        attendiesvisible=false;
        chatvisible=true;
        attendiesRoom.style.display="none";
        chatfull.style.display="block";
        document.querySelector('.right-cont').style.display="block";
        document.querySelector('.left-cont').style.width="70%";
    }
    else if(chatvisible){
        chatvisible=false;
        chatfull.style.display="none";
        document.querySelector('.right-cont').style.display="none";
        document.querySelector('.left-cont').style.width="100%";
    }
    else{
        chatvisible=true;
        chatfull.style.display="block";
        document.querySelector('.right-cont').style.display="block";
        document.querySelector('.left-cont').style.width="70%";
    }
})