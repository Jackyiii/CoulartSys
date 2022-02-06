function getContentLanguage(lan, page) {
    $('html').attr('lang', lan);
    switch (page) {
        case "index":
            $.post("/language/language", { language: lan }, function(data) {
                $(".tel_fr").html(data.tel_fr);
                $(".tel_ch").html(data.tel_ch);
                $(".student").html(data.student);
                $(".teacher").html(data.teacher);
                $(".assistant").html(data.assistant);
                $(".coulart_aller_1").html(data.coulart_aller_1);
                var $coulart_aller_2 = $("<div class=\"coulart_aller_2 sous_title_coulart\"></div>");
                $(".coulart_aller_1").append($coulart_aller_2);
                $(".coulart_aller_2").html(data.coulart_aller_2);
            });
            console.log(page + " getContentLanguage contoller success");
            break;
        case "student_login":
            $.post("/language/student_login", { language: lan }, function(data) {
                $(".trans_forgot").html(data.forgot);
                $(".trans_title").html(data.title);
                $(".trans_email").html(data.email);
                $(".trans_password").html(data.password);
                $(".trans_login").html(data.login);
            });
            console.log(page + " getContentLanguage contoller success");
            break;
        case "teacher_login":
            $.post("/language/teacher_login", { language: lan }, function(data) {
                $(".trans_forgot").html(data.forgot);
                $(".trans_title").html(data.title);
                $(".trans_email").html(data.email);
                $(".trans_password").html(data.password);
                $(".trans_login").html(data.login);
            });
            console.log(page + " getContentLanguage contoller success");
            break;
        case "student_index":
            $.post("/language/student_index", { language: lan }, function(data) {
                $(".trans_profil_student").html(data.my_profil_student);
                $(".trans_my_class_manager").html(data.my_class_manager);
                $(".trans_my_class").html(data.my_class);
                $(".trans_my_art_pass").html(data.my_art_pass);
                $(".trans_my_vocate").html(data.my_vacate);
                $(".trans_my_inform").html(data.my_inform);
                $(".trans_my_next_class").html(data.my_next_class);
                $(".trans_class_type").html(data.my_class_type_official);
                $(".trans_courseware").html(data.my_class_preview);
                $(".trans_not_on_time").html(data.not_on_time);
            });
            console.log(page + " getContentLanguage contoller success");
            break;
        case "teacher_index":
            $.post("/language/teacher_index", { language: lan }, function(data) {
                $(".trans_my_class").html(data.my_class);
                $(".trans_my_class_manager").html(data.my_class_manager);
                $(".trans_waiting_for_evaluation").html(data.wait_for_comment);
                $(".trans_my_art_pass").html(data.my_art_path);
                $(".trans_my_vocate").html(data.my_vacate);
                $(".trans_course_development").html(data.my_course_developement);
                $(".trans_my_salary").html(data.my_salary);
                $(".trans_not_on_time").html(data.not_on_time);
                $(".trans_class_type").html(data.my_class_type);
                $(".trans_course_completed").html(data.class_finish);
                $(".trans_my_next_class").html(data.my_next_class);
            });
            console.log(page + " getContentLanguage contoller success");
            break;
        default:
            console.log("can not found " + page + " getContentLanguage controller reload");
    }

}

function SwitchController(switch_state, ele) {
    var list_language = document.querySelector("#list_language");
    const language_height = $("#list_language").height();
    var lang_target = language_height + 150;
    if (switch_state) {
        $(".lan_current").addClass("clear animated pulse");
        ele.style.display = "none";
        startMove(list_language, { height: lang_target });
        $("#btn_pull_down").attr('src', path.pull_up);
        //alert(language_height);
        switch_lan = false;
    } else {
        $(".lan_current").removeClass("clear animated pulse");
        ele.style.display = "block";
        startMove(list_language, { height: 0 });
        $("#btn_pull_down").attr('src', path.pull_down);
        switch_lan = true;
    }
}