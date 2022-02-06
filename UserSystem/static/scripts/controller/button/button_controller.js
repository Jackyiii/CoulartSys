function buttonController(page) {
    switch (page) {
        case "index":
            buttonIndex();
            console.log(page + " button controller success");
            break;
        case "student_login":
            changePassword("student");
            console.log(page + " button controller success");
            break;
        case "teacher_login":
            changePassword("teacher");
            console.log(page + " button controller success");
            break;
        case "admin_login":
            changePassword("admin");
            console.log(page + " button controller success");
            break;
        case "forgot_password":
            buttonForgotPassword("open");
            buttonForgotPassword("close");
            console.log(page + " button controller success");
            break;
        case "admin_index":
            buttonChangeMenuAdmin();
            console.log(page + " button controller success");
            break;
        case "student_my_next_class":
            StudentOnClass();

            console.log(page + " button controller success");
            break;
        case "teacher_my_next_class":
            TeacherOnClass();
            console.log(page + " button controller success");
            break;
        case "student_rtc_videos":
            //rtcVideo();
            console.log(page + " button controller success");
            break;
        default:
            console.log("can not found function / buttonController(" + page + ")");
    }
}