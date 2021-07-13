const whiteboardButton = document.querySelector('.board-icon');
const whiteboardCont = document.querySelector('.whiteboard-cont');
const canvas = document.querySelector("#whiteboard");
const content = canvas.getContext('2d');

whiteboardCont.style.visibility = 'hidden';

let boardvisible = false;
let isDrawing = 0;
let x = 0;
let y = 0;
let color = "black";
let colorRemote = "black";
let drawsize = 3;
let drawsizeRemote = 3;

/* to toggle whote board on or off */
whiteboardButton.addEventListener('click', () => {
    if (boardvisible) {
        whiteboardCont.style.visibility = 'hidden';
        boardvisible = false;
    }
    else {
        whiteboardCont.style.visibility = 'visible';
        boardvisible = true;
    }
})

/* to avoid abrupt canvas set dimensions crctly */
function fitToContainer(canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

fitToContainer(canvas);

/* getCanvas call is under join room call */
socket.on('getCanvas', url => {
    let img = new Image();
    img.onload = start;
    img.src = url;

    function start() {
        content.drawImage(img, 0, 0);
    }
    //console.log('got canvas', url)
})

/* for erase function */
function setEraser() {
    color = "white";
    drawsize = 10;
}

/* to set new color */
function setColor(newcolor) {
    color = newcolor;
    drawsize = 3;
}

/* To adjust */
function reportWindowSize() {
    fitToContainer(canvas);
}

window.onresize = reportWindowSize;

/* to clear board */
function clearBoard() {
    if (window.confirm('Are you sure you want to clear board? This cannot be undone')) {
        content.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit('store canvas', canvas.toDataURL());
        socket.emit('clearBoard');
    }
    else return;
}

socket.on('clearBoard', () => {
    content.clearRect(0, 0, canvas.width, canvas.height);
})

// drawing
function draw(newx, newy, oldx, oldy) {
    content.strokeStyle = color;
    content.lineWidth = drawsize;
    content.beginPath();
    content.moveTo(oldx, oldy);
    content.lineTo(newx, newy);
    content.stroke();
    content.closePath();

    socket.emit('store canvas', canvas.toDataURL());

}

function drawRemote(newx, newy, oldx, oldy) {
    content.strokeStyle = colorRemote;
    content.lineWidth = drawsizeRemote;
    content.beginPath();
    content.moveTo(oldx, oldy);
    content.lineTo(newx, newy);
    content.stroke();
    content.closePath();

}
// draw starts from here
canvas.addEventListener('mousedown', e => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = 1;
})
// moving -> drawing curves
canvas.addEventListener('mousemove', e => {
    if (isDrawing) {
        draw(e.offsetX, e.offsetY, x, y);
        socket.emit('draw', e.offsetX, e.offsetY, x, y, color, drawsize);
        x = e.offsetX;
        y = e.offsetY;
    }
})
// stopping drawing
window.addEventListener('mouseup', e => {
    if (isDrawing) {
        isDrawing = 0;
    }
})

socket.on('draw', (newX, newY, prevX, prevY, color, size) => {
    colorRemote = color;
    drawsizeRemote = size;
    drawRemote(newX, newY, prevX, prevY);
})