const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;

function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

function endDrawing() {
  isDrawing = false;
  ctx.beginPath(); // Reset path for future drawing
}

function draw(e) {
  if (!isDrawing) return;

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";

  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", endDrawing);
canvas.addEventListener("mouseout", endDrawing);

// Download signature as image
function downloadSignature() {
  const dataURL = canvas.toDataURL("image/png");

  // Check if the canvas is empty
  if (dataURL === canvas.toDataURL()) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.textContent =
      "Error: The canvas is empty. Please draw or upload a signature.";
    document.body.appendChild(errorDiv);

    // Hide the error message after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);

    return; // Stop the download process
  }

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "signature.png";
  link.click();
}

// Upload document to sign
document
  .getElementById("uploadFile")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      clearCanvas();
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = e.target.result;
      };
      if (file.type === "application/pdf") {
        // Handle PDF files
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  });
//Clear Canvas
function clearCanvas() {
  const canvas = document.getElementById("signatureCanvas");
  const ctx = canvas.getContext("2d");

  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-theme");

  const themeIcon = document.getElementById("themeIcon");
  const currentIcon = themeIcon.src.includes("light")
    ? "dark-icon.png"
    : "light-icon.png";
  themeIcon.src = currentIcon;
}
