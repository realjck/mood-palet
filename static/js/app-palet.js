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
        method: 'DELETE',
        body: id
    }).then((response) => {
        window.location.href = "./../";
    });
}
