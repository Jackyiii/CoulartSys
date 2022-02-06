function styleController(page) {
    switch (page) {
        case "index":
            SetScale("#logo", "#header_role", "height", "10");
            SetScale("#ch_option", "#header_role", "height", "40");
            SetScale("#en_option", "#header_role", "height", "40");
            SetScale("#fr_option", "#header_role", "height", "40");
            SetScale("#assistant_background", "#login_assistant", "height", "0");
            SetScale("#teacher_background", "#login_teacher", "height", "0");
            SetScale("#student_background", "#login_student", "height", "0");
            SetScale("#gotocoulart_background", "#goto_coulart", "height", "0");
            console.log(page + " style controller success");
            break;
        case "student_login":
            let roles_img_student = document.querySelector("#roles_img_student");
            if (typeof(roles_img_student) != "undefined" && roles_img_student != null) {
                $(roles_img_student).height($(roles_img_student).width());
                console.log(page + " style controller success");
                break;
            }
        case "teacher_login":
            let roles_img_teacher = document.querySelector("#roles_img_teacher");
            if (typeof(roles_img_teacher) != "undefined" && roles_img_teacher != null) {
                $(roles_img_teacher).height($(roles_img_teacher).width());
                console.log(page + " style controller success");
                break;
            }
        case "admin_login":
            let roles_img_admin = document.querySelector("#roles_img_admin");
            if (typeof(roles_img_admin) != "undefined" && roles_img_admin != null) {
                $(roles_img_admin).height($(roles_img_admin).width());
                console.log(page + " style controller success");
                break;
            }
        case "forgot_password":
            let forgot_ui = document.querySelector("#roles_img");
            if (typeof(forgot_ui) != "undefined" && forgot_ui != null) {
                console.log(page + " style controller success");
                break;
            }
        case "student_index":
            $(".circular-portrait").height($(".circular-portrait").width());
            $(".courseware").height($(".courseware").width());
            //var $variable_uid = $('#id_num').html();
            console.log(page + " style controller success");
            break;
        case "teacher_index":
            $(".circular-portrait").height($(".circular-portrait").width());
            $(".courseware").height($(".courseware").width());
            //var $variable_uid = $('#id_num').html();
            console.log(page + " style controller success");
            break;
        case "admin_index":
            $(".circular-portrait").height($(".circular-portrait").width());
            $(".courseware").height($(".courseware").width());
            //var $variable_uid = $('#id_num').html();
            console.log(page + " style controller success");
            break;
        case "student_my_next_class":
            $(".courseware").height($(".courseware").width());
            console.log(page + " style controller success");
            break;
        case "teacher_my_next_class":
            $(".courseware").height($(".courseware").width());
            console.log(page + " style controller success");
            break;
        default:
            console.log("can not found " + page + " style controller reload");
    }
}