/**
 * MOOD PALET
 * app-palets.js
 */

const colorThief = new ColorThief();
const uploadedFile = document.getElementById('uploadedFile');
const uploadedImage = document.getElementById('uploadedImage');
const btSave = document.getElementById('bt-save');
const inputTitle = document.getElementById('input-title');
const paletModal = new bootstrap.Modal(document.getElementById("paletModal"), {});
const paletsElement = document.getElementById("palets");
const btAdd = document.getElementById('bt-add-palet');
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
        const url = data['url'];
        const palets = data['palets'];
        for (const palet of palets){
            const url = palet.url;
            const col = JSON.parse(palet.colors);
            let conteneur = document.createElement('div');
            conteneur.innerHTML = `
                    <div class="palet" id="p1">
                        <div class="palet-title">
                            <h3>`+ palet.title +`</h3>
                            <a href="../palet/` + url + `">
                                <button class="btn btn-sm">
                                    <i class="fa-solid fa-square-arrow-up-right"></i> Link
                                </button>
                            </a>
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
        showColorValues();
    });
}

/**
 * SHOW HEX VALUES IN COLOR BOXES
 */
function showColorValues(){
    const colorDivs = document.querySelectorAll('#palets .colors');
    colorDivs.forEach((colorDiv) => {
        const cols = colorDiv.querySelectorAll('div');
        cols.forEach((col) => {
            // Faire quelque chose avec la div incluse
            const resp = rgbToHexLum(col.style.backgroundColor);
            if (resp.lum){
                col.style.color = "var(--color)";
            } else {
                col.style.color = 'white';
            }
            col.innerText = resp.value;
        });
    });
}

/**
 * CONVERT RGB TO HEX AND CALCULATE LUMINOSITY
 * @param rgb string
 * @returns {value, lum}
 */
function rgbToHexLum(rgb) {
    let lum = 0;
    const components = rgb.match(/\d+/g);
    const hex = components.map(component => {
        lum += parseInt(component, 10);
        const hexValue = parseInt(component, 10).toString(16);
        return hexValue.length === 1 ? `0${hexValue}` : hexValue;
    });
    lum = lum > 384;
    const value = `#${hex.join('')}`;
    const response = {};
    response.value = value.toUpperCase();
    response.lum = lum;
    return response;
}


/**
 * CLICK ADD PALET
 */
let colors;
if (btAdd){
    document.getElementById('bt-add-palet').addEventListener('click', () => {
        inputTitle.value = '';
        uploadedFile.value = '';
        uploadedImage.src = '';
        colors = null;
        $("#input-title").css("border", "1px solid var(--color)");
        $("#bt-generate").css("color", "");
        for (let i= 0; i < 5 ; i++) {
            $(".edit .color"+(i+1)).css("background-color", "rgba(0,0,0,0.1)");
        }
        paletModal.show();
    })
}


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
        $("#bt-generate").css("color", "");

        const data = {};
        data.title = inputTitle.value;
        data.colors = colors;

        fetch("../palet/create", {
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(data)
        }).then((response) => {
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
