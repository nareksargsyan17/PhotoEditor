const global = document.querySelector('#global');
const upload = document.querySelector('.upload');
const download = document.querySelector('#download');
const remove = document.querySelector('#remove');
const hiddenUpload = document.querySelector('.hiddenUpload');
const img = document.querySelector('#img');
const changeImg = document.querySelector('#change');
const forResImg = document.querySelector('#forRes');
const cut = document.querySelector('#cut');
const crop = document.querySelector('#crop');
const save = document.querySelector('#save');
const reset = document.querySelector('#reset');
const rightOpt = document.querySelector('#right');
const cropOpt = document.querySelector('.crop');
const width = document.querySelector('#width');
const height = document.querySelector('#height');
const check = document.querySelector('#check');
const cursor = document.querySelector('#cursor');
const right = document.querySelector('#right');
const rotate = document.querySelector('#rotate');
const rotOpt = document.querySelector('.rotate');
const range = document.querySelector('#range');
const pDiv = document.querySelector('#parent');
const rotElems = document.querySelectorAll('.rotate > ul > li');
const filter = document.querySelector('#filter');
const filtOpt = document.querySelector('.filter');
const contrast = document.querySelector('#contrast');
const brightness = document.querySelector('#brightness');
const blurEl = document.querySelector('#blur');
const invert = document.querySelector('#invert');
const gray = document.querySelector('#gray');
const sepia = document.querySelector('#sepia');
const opacity = document.querySelector('#opacity');
const draw = document.querySelector('#draw');
const drawOpt = document.querySelector('.draw');
const color = document.querySelector('#forColor');
const size = document.querySelector('#size');
const tools = document.querySelectorAll('#left>div>img');
const resetFil = document.querySelector('#resetFil');
let cropper;
let croppedImage;
let degree = 0;
upload.addEventListener("click", () => {
    hiddenUpload.click()
    hiddenUpload.onchange = () => {
        let file = hiddenUpload.files[0];
        let url = window.URL.createObjectURL(new Blob([file], { type: "image/jpg" }));
        img.src = url;
        changeImg.src = url;
        forResImg.src = url
        if (img.src == url) {
            upload.style.display = "none";
            cut.parentElement.parentElement.style.display = "flex";
            right.style.display = "block";
            save.parentElement.style.display = "flex";
            download.parentElement.style.display = "inline-block"
        }
    }
})
save.addEventListener("click", () => {
    if (pDiv.lastElementChild.tagName == "CANVAS") {
        pDiv.lastElementChild.remove()
    }
    img.style.display = "block"
    for (let i = 0; i < right.children.length; i++) {
        right.children[i].style.display = "none"
    }
    try {
        croppedImage = cropper.getCroppedCanvas().toDataURL("image/png" || "image/jpg", 1.0);
        img.src = croppedImage;
        cropper.destroy();
    } catch {

    }
    changeImg.src = img.src
})
reset.addEventListener("click", () => {
    save.click();
    img.src = forResImg.src;
    degree = 0;
    if (pDiv.lastElementChild.tagName == "CANVAS") {
        pDiv.removeChild(pDiv.lastElementChild);
        img.style.display = "block"
    }
    if (cropper != null) {
        cropper.destroy();
    }
    document.querySelectorAll("input").forEach((elem) => {
        if (elem.name) {
            elem.value = elem.name;
            elem.nextElementSibling.textContent = elem.name + "%"
        }
    })
})
download.addEventListener("click", async () => {
    const link = document.createElement("a");
    link.download = "image1.png"
    link.href = img.src
    link.click();
})
remove.addEventListener("click", () => {
    window.location.reload();
})
tools.forEach((elem, index) => {
    elem.addEventListener("mouseenter", () => {
        elem.nextElementSibling.style.display = "inline-block";
    })
    elem.addEventListener("mouseout", () => {
        elem.nextElementSibling.style.display = "none";
    })
})
cursor.addEventListener("click", () => {
    save.click()
})
cut.addEventListener("click", () => {
    save.click();
    cropper = new Cropper(img, {
        aspectRatio: 0
    })
})
crop.addEventListener("click", () => {
    save.click();
    if (cropper != null) {
        cropper.destroy();
    }
    cropOpt.style.display = "block";
    width.value = img.naturalWidth;
    height.value = img.naturalHeight;
    let natWidth = img.naturalWidth;
    let natHeight = img.naturalHeight;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    width.addEventListener("input", () => {
        if (check.checked) {
            height.value = parseInt(width.value / natWidth * natHeight);
        }
        canvas.width = width.value;
        canvas.height = height.value;
        context.imageSmoothingQuality = "high"
        context.clearRect(0, 0, natWidth, natHeight);
        context.drawImage(changeImg, 0, 0, canvas.width, canvas.height);
        img.src = canvas.toDataURL("image/png", 1.0);
    })
    height.addEventListener("input", () => {
        if (check.checked) {
            width.value = parseInt(height.value / natHeight * natWidth);
        }
        canvas.width = width.value;
        canvas.height = height.value;
        context.imageSmoothingQuality = "high"
        context.clearRect(0, 0, natWidth, natHeight);
        context.drawImage(changeImg, 0, 0, width.value, height.value);
        img.src = canvas.toDataURL("image/png", 1.0);
    })
})
rotate.addEventListener("click", () => {
    save.click();
    if (img.width < pDiv.clientWidth && img.height < pDiv.clientHeight) {
        rotOpt.style.display = "flex";
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        range.addEventListener("input", () => {
            if (img.width > pDiv.clientWidth || img.height > pDiv.clientHeight || img.width != img.height) {
                canvas.width = img.width * 2;
                canvas.height = img.height * 2;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.translate(canvas.width / 2, canvas.height / 2);
            context.imageSmoothingQuality = "high";
            context.rotate(Math.PI / 180 * range.value);
            range.nextElementSibling.textContent = `${range.value}°`
            context.drawImage(changeImg, -img.width / 2, -img.height / 2, img.width, img.height);
            img.src = canvas.toDataURL("image/png", 1.0);
        })
        rotElems.forEach((elem, index) => {
            elem.addEventListener("click", () => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                if (index == 0 || index == 1) {
                    canvas.width = img.height;
                    canvas.height = img.width;
                    context.save();
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.translate(canvas.width / 2, canvas.height / 2);
                    if (index == 1) {
                        degree += 90 * Math.PI / 180;
                        context.rotate(degree);
                    }
                    else {
                        degree -= 90 * Math.PI / 180
                        context.rotate(degree);
                    }
                    if (degree % Math.PI == 0) {
                        context.drawImage(changeImg, -img.height / 2, -img.width / 2);
                    } else {
                        context.drawImage(changeImg, -img.width / 2, -img.height / 2);
                    }
                    context.restore();
                    img.src = canvas.toDataURL("image/png", 1.0);
                } else if (index == 2 || index == 3) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    if (index == 2) {
                        context.translate(0, canvas.height);
                        context.scale(1, -1);
                    } else {
                        context.translate(canvas.width, 0);
                        context.scale(-1, 1);
                    }
                    context.drawImage(img, 0, 0);
                    img.src = canvas.toDataURL("image/png", 1.0);
                }
            })
        })
    } else {
        alert("crop image")
    }
})
filter.addEventListener("click", () => {
    save.click();
    filtOpt.style.display = "flex";
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    function drawingImg() {
        context.drawImage(changeImg, 0, 0, canvas.width, canvas.height);
        img.src = canvas.toDataURL("image/png", 1.0);
        context.clearRect(0, 0, canvas.width, canvas.height)
    }
    contrast.addEventListener("input", function () {
        this.nextElementSibling.textContent = this.value + "%";
        context.filter = `contrast(${contrast.value}%) brightness(${brightness.value}%) blur(${blurEl.value}px) invert(${invert.value}%) grayscale(${gray.value}%) sepia(${sepia.value}%) opacity(${opacity.value}%)`;
        drawingImg();
    })
    brightness.addEventListener("input", function () {
        this.nextElementSibling.textContent = this.value + "%";
        context.filter = `contrast(${contrast.value}%) brightness(${brightness.value}%) blur(${blurEl.value}px) invert(${invert.value}%) grayscale(${gray.value}%) sepia(${sepia.value}%) opacity(${opacity.value}%)`;
        drawingImg();
    })
    blurEl.addEventListener("input", function () {
        this.nextElementSibling.textContent = this.value * 10 + "%";
        context.filter = `contrast(${contrast.value}%) brightness(${brightness.value}%) blur(${blurEl.value}px) invert(${invert.value}%) grayscale(${gray.value}%) sepia(${sepia.value}%) opacity(${opacity.value}%)`;
        drawingImg();
    })
    invert.addEventListener("input", function () {
        this.nextElementSibling.textContent = this.value + "%";
        context.filter = `contrast(${contrast.value}%) brightness(${brightness.value}%) blur(${blurEl.value}px) invert(${invert.value}%) grayscale(${gray.value}%) sepia(${sepia.value}%) opacity(${opacity.value}%)`;
        drawingImg();
    })
    gray.addEventListener("input", function () {
        this.nextElementSibling.textContent = this.value + "%";
        context.filter = `contrast(${contrast.value}%) brightness(${brightness.value}%) blur(${blurEl.value}px) invert(${invert.value}%) grayscale(${gray.value}%) sepia(${sepia.value}%) opacity(${opacity.value}%)`;
        drawingImg();
    })
    sepia.addEventListener("input", function () {
        this.nextElementSibling.textContent = this.value + "%";
        context.filter = `contrast(${contrast.value}%) brightness(${brightness.value}%) blur(${blurEl.value}px) invert(${invert.value}%) grayscale(${gray.value}%) sepia(${sepia.value}%) opacity(${opacity.value}%)`;
        drawingImg();
    })
    opacity.addEventListener("input", function () {
        this.nextElementSibling.textContent = this.value + "%";
        context.filter = `contrast(${contrast.value}%) brightness(${brightness.value}%) blur(${blurEl.value}px) invert(${invert.value}%) grayscale(${gray.value}%) sepia(${sepia.value}%) opacity(${opacity.value}%)`;
        drawingImg();
    })
    resetFil.addEventListener("click", () => {
        document.querySelectorAll('.filter > input').forEach((elem) => {
            elem.value = elem.name;
            elem.nextElementSibling.textContent = elem.name + "%"
        });
        context.filter = "none";
        drawingImg();
    })
})
draw.addEventListener("click", () => {
    save.click();
    drawOpt.style.display = "flex";
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    img.style.display = "none";
    if (pDiv.lastElementChild.tagName != "CANVAS") {
        pDiv.append(canvas)
    }
    let prevX;
    let prevY;
    let currX;
    let currY;
    let flag = true;
    function draw() {
        if (flag) {
            context.beginPath();
            context.moveTo(prevX, prevY);
            context.lineTo(currX, currY);
            context.strokeStyle = color.value;
            if (size.value > 0 && size.value <= 10) {
                context.lineWidth = size.value;
            }
            context.stroke();
            context.closePath();
            img.src = canvas.toDataURL("image/png", 1.0);
        }
        if (prevX) {
            prevX = currX;
            prevY = currY;
        }
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(changeImg, 0, 0, canvas.width, canvas.height)
    canvas.addEventListener("mousedown", (e) => {
        prevX = e.clientX - (global.firstElementChild.clientWidth + (pDiv.clientWidth - canvas.width) / 2);
        prevY = e.clientY - ((pDiv.clientHeight - canvas.height) / 2);
        flag = true;
        draw()
    })
    canvas.addEventListener("mousemove", (e) => {
        currX = e.clientX - (global.firstElementChild.clientWidth + (pDiv.clientWidth - canvas.width) / 2);
        currY = e.clientY - ((pDiv.clientHeight - canvas.height) / 2);
        canvas.style.cursor = "cell";
        draw()
    })
    canvas.addEventListener("mouseup", (e) => {
        flag = false;
        draw()
    })
    canvas.addEventListener("mouseout", (e) => {
        flag = false;
        canvas.style.cursor = "default";
        draw()
    })
})