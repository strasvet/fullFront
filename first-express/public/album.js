const URL = `${location.origin}/album`;

/*
function initPage() {
    const $as = $("#albumSelects");
    $.get(URL,v=>$as.html(`<option></option><option>${v.join("</option><option>")}</option>`));
}
//window.onload = initPage;
$(initPage);
*/
/*function albumSelected() {
    const $photo = $("#photos").html("");
    const album = this.val();

    album && $.get(`${URL}/${album}`, v=>{
        for (const s of a){
            $photo.append($(`<img src="${URL}/${album}/${s}">`));
        }
    });
}*/

function initPage() {
    const $as = $("#albumSelects");//.change(albumSelected);
    //$.get(URL,v=>$as.html(`<option></option><option>${v.join("</option><option>")}</option>`));
    const f = v => `<option value="${v.album_id}">${v.album_name}</option>`;
    $.get(URL, a => $as.html(`<option/>${a.map(f).join("")}`));
}
//window.onload = initPage;
$(initPage);