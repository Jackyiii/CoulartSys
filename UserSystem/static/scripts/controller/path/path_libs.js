function IndexLanguagePath() {
    $("#ch_option").attr('src', path.ch_language_img);
    $("#fr_option").attr('src', path.fr_language_img);
    $("#en_option").attr('src', path.en_language_img);
}

function LanguagePath() {
    $("#ch_img").attr('src', path.ch_language_img);
    $("#fr_img").attr('src', path.fr_language_img);
    $("#en_img").attr('src', path.en_language_img);
    $("#lan_active").attr('src', path.en_language_img);
    $("#btn_pull_down").attr('src', path.pull_down);
}

function StudentIndexPath() {
    $("#profil_personal").attr("src", path.student_img);
    $('#nav').css('background-image', path.nav_student);
    $("#background_personal").attr('src', path.nav_student);
}

function TeacherIndexPath() {
    $("#profil_personal").attr("src", path.teacher_img);
    $('#nav').css('background-image', path.nav_teacher);
    $("#background_personal").attr('src', path.nav_teacher);
}

function AdminIndexPath() {
    $("#profil_personal").attr("src", path.admin_img);
    $('#nav').css('background-image', path.nav_admin);
    $("#background_personal").attr('src', path.nav_admin);
}

function NetlessPath() {
    $(".src_lookSame_real").attr("src", path.look_same_realTime_noActive);
    $(".src_pencil_real").attr("src", path.pencil_realTime_noActive);
    $(".src_eraser_real").attr("src", path.eraser_realTime_noActive);
    $(".src_transform_real").attr("src", path.transform_realTime_noActive);
    $(".src_mirror_real").attr("src", path.mirror_realTime_noActive);
    $(".src_award_real").attr("src", path.award_realTime_noActive);
    $(".src_courseware_real").attr("src", path.courseware_realTime_noActive);
    $(".src_mute_real").attr("src", path.mute_realTime_noActive);
    $(".left_courseware").attr("src", path.left_button);
    $(".right_courseware").attr("src", path.right_button);
    $(".award_controller").attr("src", path.award_animate);
}