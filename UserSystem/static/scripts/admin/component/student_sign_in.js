$(function() {
    $('#submit_student').on('click', function() {
        // 姓名
        var student_username = $('#student_username').val() || '未填写';
        var student_first_name = $('#student_first_name').val() || '未填写';
        var student_last_name = $('#student_last_name').val() || '未填写';
        var student_mail = $("#student_mail").val() || '未填写';
        var student_year = $("#student_year").val() || '未填写';
        var student_month = $("#student_month").val() || '未填写';
        var student_day = $("#student_day").val() || '未填写';
        var student_tel = $("#student_tel").val() || '未填写';
        var student_age = $("#student_age").val() || '未填写';
        var student_contact_other = $("#student_contact_other").val() || '未填写';
        var student_sex = function() {
            var v;
            $('[name="sex_radio"]').each(function() {
                if ($(this).prop('checked') === true) v = $(this).val();
            });
            return v;
        };
        var student_en = $('#student_en').val() || '未填写';
        var student_fr = $("#student_fr").val() || '未填写';
        var student_ch = $("#student_ch").val() || '未填写';
        var student_education_select = $("#student_education_select").val() || '未填写';
        var student_character = $("#student_character").val() || '未填写';
        var student_resident_country = $("#student_resident_country").val() || '未填写';
        var student_point_interest = $("#student_point_interest").val() || '未填写';
        var student_addr_resident = $("#student_addr_resident").val() || '未填写';
        var student_remark = $("#remark").val() || '未填写';
        var guarder_name = $("#guarder_name").val() || '未填写';
        var student_relation = $("#student_relation").val() || '未填写';
        var guarder_mail = $("#guarder_mail").val() || '未填写';
        var guarder_tel = $("#guarder_tel").val() || '未填写';
        var guarder_wechat = $("#guarder_wechat").val() || '未填写';
        var guarder_facebook = $("#guarder_facebook").val() || '未填写';
        var student_zone_time = $("#zone_time").val() || '未填写';
        // post
        var data = {
            "student_sex": student_sex(),
            "student_username": student_username,
            "student_first_name": student_first_name,
            "student_last_name": student_last_name,
            "student_mail": student_mail,
            "student_year": student_year,
            "student_month": student_month,
            "student_day": student_day,
            "student_tel": student_tel,
            "student_contact_other": student_contact_other,
            "student_en": student_en,
            "student_fr": student_fr,
            "student_ch": student_ch,
            "student_education_select": student_education_select,
            "student_character": student_character,
            "student_resident_country": student_resident_country,
            "student_point_interest": student_point_interest,
            "student_addr_resident": student_addr_resident,
            "student_remark": student_remark,
            "guarder_name": guarder_name,
            "student_relation": student_relation,
            "guarder_mail": guarder_mail,
            "guarder_tel": guarder_tel,
            "guarder_wechat": guarder_wechat,
            "student_age": student_age,
            "guarder_facebook": guarder_facebook,
            "zone_time": student_zone_time
        };
        $.ajax({
            type: "POST",
            url: "/admin/studentSign/user",
            data: data,
            success: function(data) {
                alert("成功");
                window.location = "/admin/studentSign/";
            }
        });
    });
});