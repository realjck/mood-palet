/**
 * MOOD PALET
 * app.js
 */

const colorThief = new ColorThief();
const customFile = document.getElementById('uploadedFile');
const uploadedImage = document.getElementById('uploadedImage');

const paletModal = new bootstrap.Modal(document.getElementById("paletModal"), {});

/**
 * ADD PALET
 */

let colors;

document.getElementById('bt-add-palet').addEventListener('click', () => {
    paletModal.show();
    fetch("/palet", {
        headers: {
            "Authorization": `Bearer ${key}`,
        },
    }).then((response) => {
        console.log(response);
    })
})

document.getElementById('bt-generate').addEventListener('click', ()=>{
    colors = colorThief.getPalette(uploadedImage, 5);
    for (let i= 0; i < 5 ; i++) {
        const r = colors[i][0];
        const g = colors[i][1];
        const b = colors[i][2];
        $(".edit .color"+(i+1)).css("background-color", "rgba("+r+","+g+","+b+",1)");
    }
})

/**
 * IMAGE UPLOADER
 */
customFile.addEventListener('change', function(event) {
    const uploadedFile = event.target.files[0];

    if (uploadedFile?.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function(e) {
            uploadedImage.src = e.target.result;
        };

        reader.readAsDataURL(uploadedFile);
    } else {
        uploadedImage.src = "";
        alert("Please select an image file.");
    }
});
