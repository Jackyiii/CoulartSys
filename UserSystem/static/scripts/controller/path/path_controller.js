function pathController(page) {
    switch (page) {
        case "index":
            IndexLanguagePath();
            $("#logo").attr('src', path.header_logo_img);
            $("#student_background").attr("src", path.student_img);
            $("#teacher_background").attr("src", path.teacher_img);
            $("#assistant_background").attr("src", path.assistant_img);
            $("#gotocoulart_background").attr("src", path.coulart_aller_img);
            console.log(page + " path contoller success");
            break;
        case "student_login":
            LanguagePath();
            console.log(page + " path contoller success");
            break;
        case "teacher_login":
            LanguagePath();
            console.log(page + " path contoller success");
            break;
        case "student_index":
            StudentIndexPath();
            LanguagePath();
            console.log(page + " path contoller success");
            $("#srcCommingSoon").attr("src", path.load_coomingsoon);
            break;
        case "teacher_index":
            TeacherIndexPath();
            LanguagePath();
            console.log(page + " path contoller success");
            break;
        case "admin_index":
            AdminIndexPath();
            //LanguagePath();
            console.log(page + " path contoller success");
            break;
        case "netless_tool":
            NetlessPath();
            console.log(page + " path contoller success");
            break;
        default:
            console.log("can not found " + page + " path controller reload");
            break;
    }
}