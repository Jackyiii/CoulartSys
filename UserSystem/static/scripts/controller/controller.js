function Controller(page) {
    config();
    switch (page) {
        case "index":
            pathController(page);
            buttonController(page);
            styleController(page);
            languageButtonIndex(page);
            console.log(page + " contoller success");
            break;
        case "student_login":
            styleController(page);
            pathController(page);
            languageButtonNormal(page);
            buttonController(page);
            console.log(page + " contoller success");
            break;
        case "teacher_login":
            styleController(page);
            pathController(page);
            languageButtonNormal(page);
            buttonController(page);
            console.log(page + " contoller success");
            break;
        case "admin_login":
            styleController(page);
            buttonController(page);
            console.log(page + " contoller success");
            break;
        case "student_index":
            styleController(page);
            pathController(page);
            languageButtonNormal(page);
            // buttonController(page);
            console.log(page + " contoller success");
            break;
        case "teacher_index":
            styleController(page);
            pathController(page);
            languageButtonNormal(page);
            // buttonController(page);
            console.log(page + " contoller success");
            break;
        case "admin_index":
            styleController(page);
            pathController(page);
            buttonController(page);
            console.log(page + " contoller success");
            break;
        default:
            languageButtonNormal();
            console.log("can not found " + page + " controller reload");
    }
}