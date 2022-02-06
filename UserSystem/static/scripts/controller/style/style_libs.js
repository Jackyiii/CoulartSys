function getUiForgot() {
    let ui_black = document.querySelector("#window_alert");
    let ui_content = document.querySelector("#content_alert");

}

function SetScale(ele, target_ele, attribute, factor) {
    if (attribute == "height") {
        if ($(target_ele).height()) {
            let target_height = $(target_ele).height();
            $(ele).height(target_height - factor);
        }
    }
}