const chatRoom = document.querySelector('.chat-cont');
const chatfull = document.querySelector('.chatt');
const attendiesRoom = document.querySelector('.attendies-cont')
const sendButton = document.querySelector('.chat-send');
const messageField = document.querySelector('.chat-input');
const chatButton = document.querySelector('.chat');
const clearButton = document.querySelector('.clear-chat');
const chatsButton = document.querySelector('.chats');
const attendiesButton = document.querySelector('.attendies');
const leftcont = document.querySelector('left-cont');

let chatvisible=false;
let attendiesvisible=false;
attendiesRoom.style.display="none";
chatfull.style.display="none";
// if(!chatvisible && !attendiesvisible){
//     leftcont.style.width=100%;
// }
sendButton.addEventListener('click', () => {
    const msg = messageField.value;
    if(msg!=""){
        messageField.value = '';
        socket.emit('message', msg, username, roomid);
    }
})

messageField.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendButton.click();
    }
});

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

socket.on('attendies',(attendieslist)=>{
    attendiesRoom.innerHTML=`<div>Total Members: ${attendieslist.length}</div>`;
    for(var peer in attendieslist){
        attendiesRoom.innerHTML += `<div class="message">
        <div class="info">
            <div class="username">${attendieslist[peer]}</div>
        </div></div>`
    } 
});

attendiesButton.addEventListener('click', () => {
    console.log("attendies btn clicked");
    attendiesRoom.style.display="block";
    chatfull.style.display="none";
    if(attendiesvisible){
        attendiesvisible=false;
        chatvisible=false;
        attendiesRoom.style.display="none";
        chatfull.style.display="none";
    }
    else if(chatvisible){
        attendiesvisible=true;
        chatvisible=false;
        attendiesRoom.style.display="block";
        chatfull.style.display="none";
    }
    else{
        attendiesvisible=true;
        attendiesRoom.style.display="block";
    }
    socket.emit("attendies", roomid);
});

chatButton.addEventListener('click', () => {
    console.log("chat btn clicked");
    if(attendiesvisible){
        attendiesvisible=false;
        chatvisible=true;
        attendiesRoom.style.display="none";
        chatfull.style.display="block";
    }
    else if(chatvisible){
        chatvisible=false;
        chatfull.style.display="none";
    }
    else{
        chatvisible=true;
        chatfull.style.display="block";
    }

})

chatsButton.addEventListener('click', () => {
    console.log("chat btn clicked");
    if(attendiesvisible){
        attendiesvisible=false;
        chatvisible=true;
        attendiesRoom.style.display="none";
        chatfull.style.display="block";
    }
    else if(chatvisible){
        chatvisible=false;
        chatfull.style.display="none";
    }
    else{
        chatvisible=true;
        chatfull.style.display="block";
    }
})

clearButton.addEventListener('click', () => {
    console.log("clear chat btn clicked");
    chatRoom.innerHTML=``;
})