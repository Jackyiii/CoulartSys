//create app.module
let mod = angular.module("CoulartlabAPP", []); //数组数组里装着父亲模块
let path_language_cn = path.content_cn;
let path_language_fr = path.content_fr;
let path_language_en = path.content_en;
let path_lan_num = path.config_lan;
let path_lan = [path_language_cn, path_language_fr, path_language_en];
let num_languageSwitch = 2; //0代表中文，1代表法语，2代表英文
// sessionStorage.setItem('key', 'value');
// let data = sessionStorage.getItem('key');
//document.cookie = "lang=" + num_languageSwitch.toString();
var myCookie = parseInt(document.cookie.replace(/(?:(?:^|.*;\s*)lang\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
// alert(document.cookie);
// alert(myCookie);
mod.controller("ctrl_1", ctrl_content);
mod.controller("ctrl_2", ctrl_content_2);

function ctrl_content_2($scope, $http) {
    var language_active = document.querySelector("#language_active");
    var switch_lan = false;
    var list_language = document.querySelector("#list_language");
    var language_height = $("#list_language").height();
    var oCH = document.querySelector("#ch_option");
    var oEN = document.querySelector("#en_option");
    var oFR = document.querySelector("#fr_option");
    //var id_btn_lan="#languageOption";
    var id_btn_ch = "#ch_option";
    var id_btn_en = "#en_option";
    var id_btn_fr = "#fr_option";
    var oBtn_lang_ch = document.querySelector(id_btn_ch);
    var oBtn_lang_en = document.querySelector(id_btn_en);
    var oBtn_lang_fr = document.querySelector(id_btn_fr);
    //var oBtn_lang=document.querySelector(id_btn_lan);
    // oBtn_lang.onclick=function(){
    //     $http.get(path_lan[1]).then($scope.Contentdata);
    // }
    oBtn_lang_ch.onclick = function() {
        $("#lan_active").attr('src', path.ch_language_img);
        SwitchController(switch_lan, list_language);
        $http.get(path_lan[0]).then($scope.Contentdata);
    }
    oBtn_lang_fr.onclick = function() {
        $("#lan_active").attr('src', path.fr_language_img);
        SwitchController(switch_lan, list_language);
        $http.get(path_lan[1]).then($scope.Contentdata);
    }
    oBtn_lang_en.onclick = function() {
        $("#lan_active").attr('src', path.en_language_img);
        SwitchController(switch_lan, list_language);
        $http.get(path_lan[2]).then($scope.Contentdata);
    }
    language_active.onclick = function() {
        var olan_high = $("#btn_pull_down").height();
        $('.txt_lan').css("line-height", (olan_high + "px"));
        SwitchController(switch_lan, list_language);
    }
    $scope.Contentdata = Contentdata;
    $http.get(path_lan[num_languageSwitch]).then($scope.Contentdata);

    function Contentdata(response) {
        $scope.student = "yes";
        $scope.student_login = response.data[1].student_login;
        $scope.teacher_login = response.data[1].teacher_login;
        $scope.input_email = response.data[1].input_email;
        $scope.input_password = response.data[1].input_password;
        $scope.btn_login = response.data[1].btn_login;
        $scope.btn_forgotpassword = response.data[1].btn_forgotpassword;
        $scope.btn_sign = response.data[1].btn_sign;
    };

    function SwitchController(switch_state, ele) {
        var list_language = document.querySelector("#list_language");
        const language_height = $("#list_language").height();
        var lang_target = language_height + 150;
        if (switch_state) {
            $(".lan_current").addClass("clear animated pulse");
            ele.style.display = "none";
            startMove(list_language, { height: lang_target }, 10);
            $("#btn_pull_down").attr('src', path.pull_up);
            //alert(language_height);
            switch_lan = false;
        } else {
            $(".lan_current").removeClass("clear animated pulse");
            ele.style.display = "block";
            startMove(list_language, { height: 0 }, 10);
            $("#btn_pull_down").attr('src', path.pull_down);
            switch_lan = true;
        }
    }
}

function ctrl_content($scope, $http) {
    // var language_active = document.querySelector("#language_active");
    var id_btn_ch = "#ch_option";
    var id_btn_en = "#en_option";
    var id_btn_fr = "#fr_option";
    var oBtn_lang_ch = document.querySelector(id_btn_ch);
    var oBtn_lang_en = document.querySelector(id_btn_en);
    var oBtn_lang_fr = document.querySelector(id_btn_fr);

    oBtn_lang_ch.onclick = function() {
        $http.get(path_lan[0]).then($scope.Contentdata);
        $(id_btn_ch).parent().addClass("lan_active");
        $(id_btn_en).parent().removeClass("lan_active");
        $(id_btn_fr).parent().removeClass("lan_active");
    }
    oBtn_lang_fr.onclick = function() {
        $http.get(path_lan[1]).then($scope.Contentdata);
        $(id_btn_fr).parent().addClass("lan_active");
        $(id_btn_en).parent().removeClass("lan_active");
        $(id_btn_ch).parent().removeClass("lan_active");
    }
    oBtn_lang_en.onclick = function() {
        $http.get(path_lan[2]).then($scope.Contentdata);
        $(id_btn_en).parent().addClass("lan_active");
        $(id_btn_ch).parent().removeClass("lan_active");
        $(id_btn_fr).parent().removeClass("lan_active");
    }
    $scope.Contentdata = Contentdata;
    $http.get(path_lan[num_languageSwitch]).then($scope.Contentdata);

    function Contentdata(response) {
        //teacher/student/assistant/coulart_aller
        $scope.student = response.data[0].student;
        $scope.teacher = response.data[0].teacher;
        $scope.assistant = response.data[0].assistant;
        $scope.coulart_aller_1 = response.data[0].coulart_aller_1;
        $scope.coulart_aller_2 = response.data[0].coulart_aller_2;
        $scope.tel_fr = response.data[0].tel_fr;
        $scope.tel_ch = response.data[0].tel_ch;
    };
};