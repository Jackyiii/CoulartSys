$(".source_exitClass").attr('src', path.exit);
let button_fallback = document.querySelector("#exitClass");
//let img_fallback = document.querySelector(".source_fallback");
//$(".source_fallback").attr('src', path.fall_back_v1);
//alert("1");

function exitClassController() {
    button_fallback.onclick = function() {
        window.location = "/";
        // switch (page) {
        //     case "student_class":
        //         window.location = "/student";
        //         break;
        //     case "teacher_class":
        //         window.location = "/teacher";
        //         break;
        //     default:
        //         console.log("can not found function / buttonController(" + page + ")");
        // }
    }
}