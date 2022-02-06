function buttonChangeMenuAdmin() {
    var coulartGeniusSign = document.querySelector("#coulart_genius_sign");
    var stuSign = document.querySelector("#stu_sign");
    var arrangeClass = document.querySelector("#arrange_class");
    var manageStu = document.querySelector("#manage_stu");
    var manageCoulartGenius = document.querySelector("#manage_coulart_genius");
    $(".circular-portrait").height($(".circular-portrait").width());
    //老师注册
    coulartGeniusSign.addEventListener("click", function() {
        $.ajax({
            type: "GET",
            url: "/admin/geniusSignIn",
            success: function(data) {
                console.log("success geniusSignIn");
                window.location = "/admin/geniusSignIn";
            }
        });
    });
    stuSign.addEventListener("click", function() {
        $.ajax({
            type: "GET",
            url: "/admin/studentSign",
            success: function(data) {
                console.log("success");
                window.location = "/admin/studentSign";
            }
        });
    });
    arrangeClass.addEventListener("click", function() {
        $.ajax({
            type: "GET",
            url: "/admin/studentSign",
            success: function(data) {
                console.log("success");
                window.location = "/admin/controlClass";
            }
        });
    });
    manageStu.onclick = function() {
        $.ajax({
            type: "GET",
            url: "/",
            success: function(data) {
                console.log("success");
                window.location = "/admin/manageStudent";
            }
        });
    }
    manageCoulartGenius.onclick = function() {
        $.ajax({
            type: "GET",
            url: "/",
            success: function(data) {
                console.log("success");
                window.location = "/admin/manageGenius";
            }
        });

    }
}

// function myFunction(e) {
//     var elems = document.querySelectorAll(".active_menu_personal");
//     [].forEach.call(elems, function(el) {
//         el.classList.remove("active_menu_personal");
//     });
//     e.target.className = "active_menu_personal";
// }

function buttonTarget(ele, target) {
    let button_element = document.querySelector(ele);
    button_element.onclick = function() {
        // var lang = document.getElementsByTagName('html')[0].getAttribute('lang');
        // var target_attr = target + "?lang=" + lang;
        window.location.href = target;
    }
}

function buttonIndex() {
    let btn_login_student = "#login_student";
    let btn_login_teacher = "#login_teacher";
    let btn_login_assistant = "#login_assistant";
    let btn_goto_coulart = "#goto_coulart";
    let target_href_student = path.page_login_student;
    let target_href_teacher = path.page_login_teacher;
    let target_href_assistant = path.page_login_assistant;
    let target_href_goto_coulart = path.page_login_coulart_go;
    if (btn_login_student != null && target_href_student != null) {
        buttonTarget(btn_login_student, target_href_student);
    }
    if (btn_login_teacher != null && target_href_teacher != null) {
        buttonTarget(btn_login_teacher, target_href_teacher);
    }
    if (btn_login_assistant != null && target_href_assistant != null) {
        buttonTarget(btn_login_assistant, target_href_assistant);
    }
    if (btn_goto_coulart != null && target_href_goto_coulart != null) {
        buttonTarget(btn_goto_coulart, target_href_goto_coulart);
    }
}

function changePassword(role) {

    let forgot_change_password = document.querySelector("#forgot_change_password");
    if (typeof(forgot_change_password) != "undefined" && forgot_change_password != null) {
        forgot_change_password.onclick = function() {
            let forgot_client_email = $("#forgot_client_email").val();
            let forgot_new_password = $("#forgot_new_password").val();
            let forgot_confirm_password = $("#forgot_confirm_password").val();
            let path = "/forgot/" + role + "/change_password";
            let data_password = {
                "forgot_email": forgot_client_email,
                "forgot_new_passoword": forgot_new_password
            };
            if (forgot_new_password == forgot_confirm_password && forgot_new_password != null && forgot_confirm_password != null) {
                alert("change password success");
                $.post(path, data_password, function(data) {
                    console.log("change password success");
                });
            }
        }
    }
}

function buttonForgotPassword(state) {
    let cancel_change_pass = document.querySelector("#forgot_cancel_password");
    let button_forgot = document.querySelector("#forgot_password");
    let window_popup = document.querySelector("#window_popup");
    let forgot_client_email = document.querySelector("#forgot_client_email");
    let forgot_new_password = document.querySelector("#forgot_new_password");
    let forgot_confirm_password = document.querySelector("#forgot_confirm_password");
    switch (state) {
        case "open":
            if (typeof(cancel_change_pass) != "undefined" && cancel_change_pass != null) {
                cancel_change_pass.onclick = function() {
                    forgot_client_email.required = false;
                    forgot_new_password.required = false;
                    forgot_confirm_password.required = false;
                    window_popup.style.display = "none";
                    console.log("got cancel button");
                }
            }
            console.log("success function / buttonForgotPassword(" + state + ")");
            break;
        case "close":
            if (typeof(button_forgot) != "undefined" && button_forgot != null && typeof(window_popup) != "undefined" && window_popup != null) {
                button_forgot.onclick = function() {
                    $("#content_popup").addClass("animated pulse");
                    forgot_client_email.required = true;
                    forgot_new_password.required = true;
                    forgot_confirm_password.required = true;
                    window_popup.style.display = "block";
                    console.log("reset your password");
                }
            }
            console.log("success function / buttonForgotPassword(" + state + ")");
            break;
        default:
            console.log("can not found / buttonForgotPassword(" + state + ")");
    }
}

function StudentOnClass() {
    const btn_enter_class = document.querySelector("#timer_to_class");
    const $variable_uid = $('#id_num').html().trim();
    const student_name = $('.name_user').html().trim();
    const data_student_uid = {};
    let path = "/student/token";
    if (typeof($variable_uid) != "undefined" && $variable_uid != null) {
        data_student_uid.uid = $variable_uid;
        if (typeof(data_student_uid.uid) != "undefined" && data_student_uid.uid != null) {
            btn_enter_class.onclick = function() {
                $.post(path, data_student_uid, function(data) {
                    window.location.href = "/class/" + data.target_room + "?uid=" + data.uid.toString();
                });
            }
        } else {
            console.log(student_name + "/" + $variable_uid + ": data_student_uid.uid error undfind")
        }
    } else {
        console.log(student_name + "/" + $variable_uid + ": $variable_uid error undfind")
    }
}

function TeacherOnClass() {
    const btn_enter_class = document.querySelector("#timer_to_class");
    const $variable_uid = $('#id_num').html().trim();
    const teacher_name = $('.name_user').html().trim();
    var target_child = $('.my_target_child').html().trim();
    var data_teacher = {};
    let path = "/teacher/token";
    if (typeof($variable_uid) != "undefined" && $variable_uid != null && typeof(target_child) != "undefined" && target_child != null) {
        data_teacher.uid = $variable_uid;
        data_teacher.target_child = target_child;
        if (typeof(data_teacher.uid) != "undefined" && data_teacher.uid != null) {
            btn_enter_class.onclick = function() {
                $.post(path, data_teacher, function(data) {
                    console.log("get: token/" + data.token + " /uuid(channel):" + data.channel + " /targetRoom:" + data.target_room);
                    window.location.href = "/class/" + data.target_room + "?uid=" + data.uid.toString();
                });
            }
        } else {
            console.log(student_name + "/" + $variable_uid + ": data_teacher.uid error undfind")
        }
    } else {
        console.log(student_name + "/" + $variable_uid + ": $variable_uid error undfind")
    }
}

function rtcVideo() {
    var me_container = document.querySelector("#me");
    var remote_container = document.querySelector("#remote-container");
    let $draggable = $('.draggable').draggabilly();
    me_container.ondblclick = function() {
        if ($("#me").hasClass("smallVideo")) {
            $("#me").attr("class", "grandVideo");
            $("#me").css('left', '0');
            $("#me").css('top', '0');
            $("#remote-container").attr("class", "smallVideo draggable");
            $("#remote-container").css('left', '0');
            $("#remote-container").css('top', '0');
        } else {
            let $draggable = $('.draggable').draggabilly();
        }
    }
    remote_container.ondblclick = function() {
        if ($("#remote-container").hasClass("smallVideo")) {
            $("#remote-container").attr("class", "grandVideo");
            $("#me").attr("class", "smallVideo draggable");
            $("#remote-container").css('left', '0');
            $("#remote-container").css('top', '0');
            $("#me").css('left', '0');
            $("#me").css('top', '0');
        } else {
            let $draggable = $('.draggable').draggabilly();
        }
    }
}
// const uid = <%= user.uid %>;
// const channel = "<%= user.user %>";
// var type_uid = typeof(uid);
// var type_channel = typeof(channel);
// alert("type uid: " + type_uid + " /value uid: " + uid + " /type channel: " + type_channel + " /value channel:" + channel);
// const data = {
//     uid: uid,
//     channel: channel,
//     token: "studentToken"
// }

// btn_enter_class.onclick = function() {
//     $.ajax({
//         type: "POST",
//         url: "/student/token",
//         data: data,
//         success: function(data) {
//             window.location.href = "/class/" + data.channel + "?uid=" + data.uid.toString();
//         }
//     });
// }