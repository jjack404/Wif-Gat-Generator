
var imageLoader = document.getElementById('imageLoader');
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var template = new Image();
var userImage = new Image();
var userImageX = 0;
var userImageY = 0;
var userImageWidth, userImageHeight;
var dragging = false;
var resizing = false;
var dragStartX, dragStartY;
var resizeCorner, aspectRatio;

template.onload = function () {
  ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
};
template.src = 'wifgattemplate.png'; // Path to your template

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(userImage, userImageX, userImageY, userImageWidth, userImageHeight);
  ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

  // Draw corner boxes for resizing
  var cornerSize = 10; // Size of the corner box
  var corners = getCornerPositions();
  ctx.fillStyle = 'yellow'; // Color of the corner boxes
  for (var key in corners) {
      ctx.fillRect(corners[key].x - cornerSize / 2, corners[key].y - cornerSize / 2, cornerSize, cornerSize);
  }
}

// Helper function to get the positions of corners
function getCornerPositions() {
  return {
      topLeft: { x: userImageX, y: userImageY },
      topRight: { x: userImageX + userImageWidth, y: userImageY },
      bottomLeft: { x: userImageX, y: userImageY + userImageHeight },
      bottomRight: { x: userImageX + userImageWidth, y: userImageY + userImageHeight }
  };
}

imageLoader.addEventListener('change', handleImage, false);
document.getElementById('saveBtn').addEventListener('click', saveImage, false);

function isMouseOnCorner(x, y) {
  var cornerSize = 10;
  // Check if the mouse is over one of the corners of the image
  var corners = {
    topLeft: { x: userImageX, y: userImageY },
    topRight: { x: userImageX + userImageWidth, y: userImageY },
    bottomLeft: { x: userImageX, y: userImageY + userImageHeight },
    bottomRight: { x: userImageX + userImageWidth, y: userImageY + userImageHeight }
  };
  for (var key in corners) {
    if (x >= corners[key].x - cornerSize && x <= corners[key].x + cornerSize &&
      y >= corners[key].y - cornerSize && y <= corners[key].y + cornerSize) {
      return key;
    }
  }
  return null;
}

canvas.addEventListener('mousedown', function (e) {
  var mouseX = e.clientX - canvas.offsetLeft;
  var mouseY = e.clientY - canvas.offsetTop;
  var corner = isMouseOnCorner(mouseX, mouseY);
  if (corner) {
    resizing = true;
    resizeCorner = corner;
    aspectRatio = userImageWidth / userImageHeight;
  } else

    if (mouseX >= userImageX && mouseX <= userImageX + userImageWidth &&
      mouseY >= userImageY && mouseY <= userImageY + userImageHeight) {
      dragging = true;
      dragStartX = mouseX - userImageX;
      dragStartY = mouseY - userImageY;
    }
});

canvas.addEventListener('mousemove', function (e) {
  var mouseX = e.clientX - canvas.offsetLeft;
  var mouseY = e.clientY - canvas.offsetTop;
  if (resizing) {
    switch (resizeCorner) {
      case 'topLeft':
        userImageWidth += userImageX - mouseX;
        userImageHeight = userImageWidth / aspectRatio;
        userImageX = mouseX;
        userImageY -= userImageHeight - (userImageWidth / aspectRatio);
        break;
      case 'topRight':
        userImageWidth = mouseX - userImageX;
        userImageHeight = userImageWidth / aspectRatio;
        userImageY -= userImageHeight - (userImageWidth / aspectRatio);
        break;
      case 'bottomLeft':
        userImageWidth += userImageX - mouseX;
        userImageHeight = userImageWidth / aspectRatio;
        userImageX = mouseX;
        break;
      case 'bottomRight':
        userImageWidth = mouseX - userImageX;
        userImageHeight = userImageWidth / aspectRatio;
        break;
    }
    userImageWidth = Math.max(userImageWidth, 10); // Minimum size
    userImageHeight = Math.max(userImageHeight, 10); // Minimum size
    draw();
  } else if (dragging) {
    userImageX = mouseX - dragStartX;
    userImageY = mouseY - dragStartY;
    draw();
  }
});

canvas.addEventListener('mouseup', function (e) {
  dragging = false;
  resizing = false;
});

canvas.addEventListener('mouseout', function (e) {
  dragging = false;
  resizing = false;
});

function handleImage(e) {
  var reader = new FileReader();
  reader.onload = function (event) {
    userImage.onload = function () {
      aspectRatio = userImage.width / userImage.height;
      if (userImage.width > userImage.height) {
        userImageWidth = canvas.width;
        userImageHeight = userImageWidth / aspectRatio;
      } else {
        userImageHeight = canvas.height;
        userImageWidth = userImageHeight * aspectRatio;
      }
      userImageX = (canvas.width - userImageWidth) / 2;
      userImageY = (canvas.height - userImageHeight) / 2;
      draw();
    }
    userImage.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
}

function saveImage() {
  var dataURL = canvas.toDataURL('image/png');
  var link = document.createElement('a');
  link.download = 'my-image.png';
  link.href = dataURL;
  link.click();
}