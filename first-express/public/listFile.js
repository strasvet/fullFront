function getSelected() {
    const $as = $("#albumSelects option:selected").val();
    if ($as == "") {
        $("#photos").html("");
    } else {

    console.log($as);
    const URL = `${location.origin}/album/${$as}`;
    console.log(URL);
    const $ph = $("#photos");
    $.get(URL, v => $ph.html(`${createLink(v, URL)}`));

        //const f = v => `<option value="${v.album_id}">${v.album_name}</option>`;
        //$.get(URL, a=>$ph.html(`<option/>${a.map(f).join("")}`));
        //$.get(URL, a=>console.log(`${a}`));
        //$.get(URL, a=>$ph.html(`${createLink(a,URL)}`));
    }
}
function createLink(array,URL){
    let url = URL;
    let res= [];
    for (v of array){
        //res.push("<a href="+url+"/"+v+">"+v+"</a>");
        res.push("<a href="+url+"/"+v+" target=\"_blank\">"+v.substring(0,v.length-4)+"</a>");
    }
    return res.join("<br>");
}
$(document).change("#albumSelects",getSelected);