var switch_lan = false;

function languageButtonIndex(page) {
    let button_fr = document.querySelector("#fr_option");
    let button_ch = document.querySelector("#ch_option");
    let button_en = document.querySelector("#en_option");
    button_fr.onclick = function() {
        $("#fr_option").parent().addClass("lan_active");
        $("#ch_option").parent().removeClass("lan_active");
        $("#en_option").parent().removeClass("lan_active");
        getContentLanguage("fr", page);
    }
    button_ch.onclick = function() {
        $("#ch_option").parent().addClass("lan_active");
        $("#en_option").parent().removeClass("lan_active");
        $("#fr_option").parent().removeClass("lan_active");
        getContentLanguage("ch", page);
    }
    button_en.onclick = function() {
        $("#en_option").parent().addClass("lan_active");
        $("#ch_option").parent().removeClass("lan_active");
        $("#fr_option").parent().removeClass("lan_active");
        getContentLanguage("en", page);
    }
}

function languageButtonNormal(page) {

    let button_fr = document.querySelector("#fr_option");
    let button_ch = document.querySelector("#ch_option");
    let button_en = document.querySelector("#en_option");
    let list_language = document.querySelector("#list_language");
    let language_active = document.querySelector("#language_active");
    button_fr.onclick = function() {
        $("#lan_active").attr('src', path.fr_language_img);
        SwitchController(switch_lan, list_language);
        getContentLanguage("fr", page);
    }
    button_ch.onclick = function() {
        $("#lan_active").attr('src', path.ch_language_img);
        SwitchController(switch_lan, list_language);
        getContentLanguage("ch", page);
    }
    button_en.onclick = function() {
        $("#lan_active").attr('src', path.en_language_img);
        SwitchController(switch_lan, list_language);
        getContentLanguage("en", page);
    }
    language_active.onclick = function() {
        var olan_high = $("#btn_pull_down").height();
        $('.txt_lan').css("line-height", (olan_high + "px"));
        SwitchController(switch_lan, list_language);
    }
}