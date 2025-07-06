const qrPreview = document.getElementById("qr-preview");
const generateBtn = document.getElementById("generateBtn");
const downloadOptions = document.getElementById("download-options");
const downloadBtn = document.getElementById("downloadBtn");
const formatSelect = document.getElementById("formatSelect");

let qrCode;

generateBtn.addEventListener("click", () => {
  const text = document.getElementById("qrText").value;
  const fg = document.getElementById("fgColor1").value;
  const bg = document.getElementById("bgColor1").value;
  const style = document.getElementById("qrStyle").value;
  const logoInput = document.getElementById("logoInput");
  const logoFile = logoInput.files[0];

  qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: text,
    image: "",
    dotsOptions: {
      color: fg,
      type: style
    },
    backgroundOptions: {
      color: bg
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 0, // will be handled manually
      imageSize: 0.25,
      hideBackgroundDots: true
    }
  });

  if (logoFile) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 150;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Draw white circle border
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Draw circular clipped image
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);
        ctx.restore();

        const circularLogo = canvas.toDataURL();
        qrCode.update({ image: circularLogo });
        qrPreview.innerHTML = "";
        qrCode.append(qrPreview);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(logoFile);
  } else {
    qrPreview.innerHTML = "";
    qrCode.append(qrPreview);
  }

  downloadOptions.style.display = "block";
});

downloadBtn.addEventListener("click", () => {
  const format = formatSelect.value;
  if (format === "pdf") {
    qrCode.getRawData("png").then((blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imgData = reader.result;
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 180);
        pdf.save("KyroQR.pdf");
      };
      reader.readAsDataURL(blob);
    });
  } else {
    qrCode.download({ name: "KyroQR", extension: format });
  }
});
