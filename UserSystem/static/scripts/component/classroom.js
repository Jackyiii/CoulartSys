let path_token = "/class/";
var get_user_id = $("#uid").attr('class');
var get_user_channel = $("#channel").attr('class');
var get_user_room = $("#room").attr('class');
var data = {}
data.uid = get_user_id;
data.channel = get_user_channel;
data.room = get_user_room;
$.post(path_token, data, function(data) {
    var token_data = {};
    var courseware_url = [];
    token_data.rtc_uid = data.rtc_uid;
    token_data.rtc_channel = data.rtc_channel;
    token_data.rtc_token = data.rtc_token;
    token_data.netless_roomUUID = data.netless_roomUUID;
    token_data.netless_sdkToken = data.netless_sdkToken;
    token_data.netless_roomToken = data.netless_roomToken;
    token_data.id_netless = data.id_netless;
    courseware_url = data.url_courseware;
    var a = getRtcVideo(token_data.rtc_uid, token_data.rtc_channel, token_data.rtc_token);
    getNetlessTool(token_data.netless_roomUUID, token_data.netless_roomToken, token_data.id_netless, courseware_url, a);
});