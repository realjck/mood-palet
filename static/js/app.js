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
const paletsElement = document.getElementById("palets");

showPalets();

/**
 * SHOW PALETS
 */
function showPalets(){

    fetch(name + "/get", {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((data) => {
        paletsElement.innerHTML = '';
        const palets = data['palets'];
        for (const palet of palets){
            const col = JSON.parse(palet.colors);
            let conteneur = document.createElement('div');
            conteneur.innerHTML = `
                    <div class="palet" id="p1">
                        <div class="palet-title">
                            <h3>`+ palet.title +`</h3>
                            <div class="btn-group">
                                <button class="btn btn-sm">
                                    <i class="fa-regular fa-trash-can"></i>
                                </button>
                                <button class="btn btn-sm">
                                    <i class="fa-solid fa-share-nodes"></i>
                                </button>
                            </div>
                        </div>
                        <div class="colors">
                            <div class="color1" style="background-color:rgba(`+ col[0][0] +`,`+ col[0][1] +`,`+ col[0][2] +`,1)"></div>
                            <div style="background-color:rgba(`+ col[1][0] +`,`+ col[1][1] +`,`+ col[1][2] +`,1)"></div>
                            <div style="background-color:rgba(`+ col[2][0] +`,`+ col[2][1] +`,`+ col[2][2] +`,1)"></div>
                            <div style="background-color:rgba(`+ col[3][0] +`,`+ col[3][1] +`,`+ col[3][2] +`,1)"></div>
                            <div class="color5" style="background-color:rgba(`+ col[4][0] +`,`+ col[4][1] +`,`+ col[4][2] +`,1)"></div>
                        </div>
                        <h6>`+ palet.date +`</h6>
                    </div>
                `;
            paletsElement.insertBefore(conteneur, paletsElement.firstChild);
        }
    });
}


/**
 * CLICK ADD PALET
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


/**
 * SAVE A PALET
 */
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

        const data = {};
        data.title = inputTitle.value;
        data.colors = colors;

        fetch("../api/palet", {
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(data)
        }).then((response) => {
            console.log(response.json());
            paletModal.hide();
            showPalets();
        })
    }
})


/**
 * GENERATE COLORS FROM LOADED FILE
 * with ColorThief.js
 */
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
