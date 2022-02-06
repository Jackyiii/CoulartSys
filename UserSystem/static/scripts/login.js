window.onresize = window.onload = function() {
    let role_img = document.querySelector("#roles_img");
    $(role_img).height($(role_img).width());
}

function SetScale(ele, target_ele, attribute, factor) {
    if (attribute == "height") {
        if ($(target_ele).height()) {
            let target_height = $(target_ele).height();
            $(ele).height(target_height - factor);
        }
    }
}