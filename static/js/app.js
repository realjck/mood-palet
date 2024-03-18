/**
 * MOOD PALET
 * app.js
 */

const colorThief = new ColorThief();
const uploadedFile = document.getElementById('uploadedFile');
const uploadedImage = document.getElementById('uploadedImage');
const btSave = document.getElementById('bt-save');
const inputTitle = document.getElementById('input-title');

const paletModal = new bootstrap.Modal(document.getElementById("paletModal"), {});

/**
 * ADD PALET
 */

let colors;

document.getElementById('bt-add-palet').addEventListener('click', () => {
    inputTitle.value = '';
    uploadedFile.value = '';
    uploadedImage.src = '';
    colors = null;
    $("#input-title").css("border", "1px solid var(--color)");
    $("#bt-generate").css("color", "var(--color)");
    for (let i= 0; i < 5 ; i++) {
        $(".edit .color"+(i+1)).css("background-color", "rgba(0,0,0,0.1)");
    }
    paletModal.show();
})

btSave.addEventListener('click', () => {
    let is_valid = true;
    if (inputTitle.value === ''){
        $("#input-title").css("border", "3px solid red");
        is_valid = false;
    }
    if (!colors){
        $("#bt-generate").css("color", "red");
        is_valid = false;
    }
    if (is_valid){

        $("#input-title").css("border", "1px solid var(--color)");
        $("#bt-generate").css("color", "var(--color)");

        fetch("../api/palet", {
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(colors)
        }).then((response) => {
            console.log(response.json());
            paletModal.hide();
        })
    }
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
uploadedFile.addEventListener('change', function(event) {
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
