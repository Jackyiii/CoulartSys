$(function() {
    $('#submit_emploi').on('click', function() {
        // 姓名
        var emploi_username = $('#emploi_username').val() || '未填写';
        var emploi_first_name = $('#emploi_first_name').val() || '未填写';
        var emploi_last_name = $('#emploi_last_name').val() || '未填写';
        var emploi_mail = $("#emploi_mail").val() || '未填写';
        var emploi_birth_year = $("#emploi_year").val() || '未填写';
        var emploi_birth_month = $("#emploi_month").val() || '未填写';
        var emploi_birth_day = $("#emploi_day").val() || '未填写';
        var emploi_contact_tel = $("#emploi_tel").val() || '未填写';
        var emploi_contact_other = $("#emploi_contact_other").val() || '未填写';
        var emploi_sex = function() {
            var v;
            $('[name="sex_radio"]').each(function() {
                if ($(this).prop('checked') === true) v = $(this).val();
            });
            return v;
        };
        var education_select = $('#education_select').val() || '未填写';
        var emploi_diplome = $("#emploi_diplome").val() || '未填写';
        var emploi_diplomeOther = $("#emploi_diplomeOther").val() || '未填写';
        var post_select = $("#post_select").val() || '未填写';
        var post_select_2 = $("#post_select_2").val() || '未填写';
        var resident_country = $("#resident_country").val() || '未填写';
        var addr_resident = $("#addr_resident").val() || '未填写';
        var bank_infos = $("#bank_infos").val() || '未填写';
        var emploi_compte = $("#emploi_compte").val() || '未填写';
        var emploi_compte_name = $("#emploi_compte_name").val() || '未填写';
        var remark = $("#remark").val() || '未填写';
        var exigence_name = $("#exigence_name").val() || '未填写';
        var exigence_tel = $("#exigence_tel").val() || '未填写';

        var emploi_en = $("#emploi_en").val() || '未填写';
        var emploi_fr = $("#emploi_fr").val() || '未填写';
        var emploi_ch = $("#emploi_ch").val() || '未填写';
        // post
        var data = {
            "emploi_username": emploi_username,
            "emploi_first_name": emploi_first_name,
            "emploi_last_name": emploi_last_name,
            "emploi_mail": emploi_mail,
            "emploi_birth_year": emploi_birth_year,
            "emploi_birth_month": emploi_birth_month,
            "emploi_birth_day": emploi_birth_day,
            "emploi_contact_tel": emploi_contact_tel,
            "emploi_contact_other": emploi_contact_other,
            "emploi_sex": emploi_sex(),
            "emploi_education_select": education_select,
            "emploi_diplome": emploi_diplome,
            "emploi_diplomeOther": emploi_diplomeOther,
            "emploi_post_select": post_select,
            "emploi_post_select_2": post_select_2,
            "emploi_resident_country": resident_country,
            "emploi_addr_resident": addr_resident,
            "emploi_bank_infos": bank_infos,
            "emploi_emploi_compte": emploi_compte,
            "emploi_emploi_compte_name": emploi_compte_name,
            "emploi_remark": remark,
            "emploi_exigence_name": exigence_name,
            "emploi_exigence_tel": exigence_tel,
            "emploi_en": emploi_en,
            "emploi_fr": emploi_fr,
            "emploi_ch": emploi_ch
        };
        $.ajax({
            type: "POST",
            url: "/admin/emploiSign/user",
            data: data,
            success: function(data) {
                alert("成功");
                window.location = "/admin/geniusSignIn";
            }
        });
    });
});