/**
 * MOOD PALET
 * app-palet.js
 */

function deletePalet(){

    fetch("../palet/delete", {
        headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({id: id})
    }).then((response) => {
        console.log(JSON.stringify({id: id}));
        window.location.href = "./../";
    });
}
