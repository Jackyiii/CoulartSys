window.onresize = window.onload = function() {
    // var a = <%= user["uid"] %>;
    // alert(a);
    var a = <%= user["uid"] %>;
    alert(a);
    $(".circular-portrait").height($(".circular-portrait").width());
    $("#profil_personal").attr("src", path.student_img);
    $('#nav').css('background-image', path.nav_teacher);
    $("#background_personal").attr('src', path.nav_teacher);
    //$('.active_menu_personal').css('background-image', 'url(' + path.active_menu + ')');
    // $("#edit_profil").attr("src",path.edit_profil);
    // let edit_value=($("#profil").height()-$("#info_personal").height());
    // $("#edit_profil").offset({top:edit_value,right:0});
}

function SetScale(ele, target_ele, attribute, factor) {
    if (attribute == "height") {
        if ($(target_ele).height()) {
            let target_height = $(target_ele).height();
            $(ele).height(target_height - factor);
        }
    }
}