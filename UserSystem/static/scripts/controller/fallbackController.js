$(".source_fallback").attr('src', path.fall_back_v1);
let button_fallback = document.querySelector("#fallback");
//let img_fallback = document.querySelector(".source_fallback");
//$(".source_fallback").attr('src', path.fall_back_v1);
//alert("1");

function fallbackController(page) {
    button_fallback.onclick = function() {
        switch (page) {
            case "student_login":
                window.location = "/";
                break;
            case "teacher_login":
                window.location = "/";
                break;
            case "student_index":
                window.location = "/";
                break;
            case "teacher_index":
                window.location = "/";
                break;
            default:
                console.log("can not found function / buttonController(" + page + ")");
        }
    }
}