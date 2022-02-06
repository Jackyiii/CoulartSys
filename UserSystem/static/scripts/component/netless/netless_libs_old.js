var switch_tool = false;
var page_index = 0;
var operable_obj = 1;
var globalState;
// var width = 500; // ppt 的宽
// var height = 500; // ppt 的高
function WhiteBoardController(roomUUID, roomToken, appId, courseware_url) {
    StudentMenuLayer();
    joinRoom(roomUUID, roomToken, appId, courseware_url);
    // alert(courseware_url.length);
}

function joinRoom(roomUUID, roomToken, appId, courseware_url) {
    var whiteWebSdk = new WhiteWebSdk({
        appIdentifier: appId,
    });
    var joinRoomParams = {
        uuid: roomUUID,
        roomToken: roomToken,
    };

    whiteWebSdk.joinRoom(joinRoomParams, {
        onRoomStateChanged: function(modifyState) {
            if (modifyState.globalState) {
                // Global State 发生了变化，读取到变化后的值
                globalState = modifyState.globalState;
                let bool_active = globalState.active_trans;
                console.log(bool_active + "开启/未开启");
                if (bool_active) {
                    let data_angle = globalState.new_angle;
                    let data_scale = globalState.new_scale;
                    let data_position = globalState.new_position;
                    let data_init_trans = globalState.init_transform;
                    let data_init_persc = globalState.init_perspective;

                    let uid_num = parseInt($("#uid").attr('class'));
                    let id = parseInt((uid_num % 100000) / 10000);
                    console.log("监听角度变化" + data_angle)
                    console.log("监听大小变化" + data_scale)
                    console.log("监听位置变化" + data_position);
                    console.log("初始化trans" + data_init_trans);
                    console.log("Perspetive value " + data_init_persc);
                    //console.log(id);
                    if (id == 1 && globalState.reguler_button) {
                        globalState.reguler_button = false;
                        if (globalState.target_controller == 1) {
                            globalState.reguler_button = false;
                            //学生本地透视
                            console.log("调整学生透视")
                            console.log(globalState.target_controller)
                            let uid_student = $("#me").children("div").attr('id');
                            let get_uid = $.trim(uid_student.replace(/[^\d]/g, ' '));
                            console.log(get_uid);
                            $("#player_" + get_uid).css({
                                'perspective': parseInt(data_angle, 10) * 0.2 + "px",
                                '-webkit-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                                '-moz-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                                '-ms-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                                '-o-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                                'transform': 'scale(' + data_scale + ',' + data_scale + ')'
                            });
                            $("#video" + get_uid).css({
                                'transform': data_init_trans,
                                'top': parseInt(data_position, 10) * 0.1 + "px"
                            });
                            globalState.active_trans = false;

                        } else {
                            globalState.reguler_button = false;
                            console.log("调整老师透视")
                            console.log(globalState.target_controller)
                            let teacher_id = $("#remote-container").children("div").attr('id');
                            console.log("学生的远端id:" + teacher_id);
                            $("#player_" + teacher_id).css({
                                'perspective': data_angle,
                                '-webkit-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                                '-moz-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                                '-ms-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                                '-o-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                                'transform': 'scale(' + data_scale + ',' + data_scale + ')'
                            });
                            $("#video" + teacher_id).css({
                                'transform': data_init_trans,
                                'top': data_position + 'px'
                            });
                            globalState.active_trans = false;
                        }
                    }
                }
            }
        }
    }).then(function(room) {
        // 加入房间成功，获取 room 对象
        // 并将之前的 <div id="whiteboard"/> 占位符变成白板
        room.setScenePath("/init");
        ToolSelect(room, courseware_url);
        EventMagicListen(room);
        ChangeViewCamera(room);
        let sceneState_blank = room.state.sceneState;
        console.log("scene path:", sceneState_blank.scenePath);
        console.log("scene name:", sceneState_blank.sceneName);
        console.log("scene index:", sceneState_blank.index);
        room.bindHtmlElement(document.getElementById("whiteboard"));
        room.setMemberState({ currentApplianceName: "selector" });
        room.setGlobalState({
            "target_controller": 1,
            "top": 0,
            "active_trans": false,
            "init_transform": "rotateX(45deg)",
            "init_perspective": "2000px",
            "reguler_button": false
        });

        //globalState = room.state.globalState;
        // console.log("kkkkkkkkkkkk" + JSON.stringify(globalState));
        // console.log("kkkkkkkkkkkk" + globalState.position);
    }).catch(function(err) {
        // 加入房间失败
        console.error(err);
    });
}



function ToolSelect(room, courseware_url) {
    if (typeof(room) != "undefined" && room != null) {
        let tool_look_at_same = document.querySelector("#look_same_realTime");
        let tool_pencil = document.querySelector("#pencil_realTime");
        let tool_eraser = document.querySelector("#eraser_realTime");
        let tool_trans = document.querySelector("#transform_realTime");
        let tool_mirror = document.querySelector("#mirror_realTime");
        let tool_award = document.querySelector("#award_realTime");
        let tool_courseware = document.querySelector("#courseware_realTime");
        let tool_mute = document.querySelector("#mute_realTime");
        let alltool = [tool_look_at_same, tool_pencil, tool_eraser, tool_trans, tool_mirror, tool_award, tool_courseware, tool_mute];
        let toollength = alltool.length;
        AuthorPencil(room);
        for (var i = 0; i < toollength; i++) {
            alltool[i].addEventListener("click", function() {
                let tool_index = $(this).index() - 1;
                switch (tool_index) {
                    case 0:
                        //look at same scene

                        ToolControl(alltool, tool_index, room, courseware_url);
                        break;
                    case 1:
                        //pencil tool
                        ToolControl(alltool, tool_index, room, courseware_url);
                        break;
                    case 2:
                        //eraser tool
                        ToolControl(alltool, tool_index, room, courseware_url);
                        break;
                    case 3:
                        //trans_scene tool
                        ToolControl(alltool, tool_index, room, courseware_url);
                        break;
                    case 4:
                        //mirror tool
                        ToolControl(alltool, tool_index, room, courseware_url);
                        break;
                    case 5:
                        //award tool
                        ToolControl(alltool, tool_index, room, courseware_url);
                        break;
                    case 6:
                        //courseware tool
                        ToolControl(alltool, tool_index, room, courseware_url);
                        break;
                    case 7:
                        //mute tool
                        ToolControl(alltool, tool_index, room, courseware_url);
                        break;
                }
            });
        }
    }
}

function AuthorPencil(room) {
    let tool_pencil = document.querySelector("#pencil_realTime");
    let get_prof = $("#uid").attr('class');
    let id_pro = parseInt((get_prof % 100000) / 10000);
    if (id_pro == 2) {
        tool_pencil.addEventListener("dblclick", function() {
            room.dispatchMagixEvent("AuthorPencilController");
        });
    }
}

function ToolControl(arr_tool, index, room, courseware_url) {
    let index_selector = parseInt(index);
    let tool_ele_all = arr_tool;
    let tool_length = arr_tool.length;
    if (isNaN(index_selector)) {
        return 0;
    }
    if (typeof(arr_tool) != "undefined" && arr_tool != null && typeof(tool_length) != "undefined" && tool_length != null) {
        NetlessPath();
        room.setMemberState({ currentApplianceName: "selector" });
        switch (index_selector) {
            case 0:
                //look at same scene
                NetlessPath();
                if (switch_tool == false) {
                    room.dispatchMagixEvent("LookSameEvent");
                    $(".src_lookSame_real").attr("src", path.look_same_realTime_active);
                    $(".src_lookSame_real").addClass("animated pulse");
                    ToolSelector(room, "lool_at_same", courseware_url);
                    switch_tool = true;
                    break;
                } else {
                    room.dispatchMagixEvent("LookSameEvent");
                    $(".list_tool_realTime").children().removeClass("animated pulse")
                    room.setMemberState({ currentApplianceName: "selector" });
                    switch_tool = false;
                    break;
                }
            case 1:
                //pencil tool
                NetlessPath();
                if (switch_tool == false) {
                    ColorPicker(true, room)
                    $(".src_pencil_real").attr("src", path.pencil_realTime_active);
                    $(".src_pencil_real").addClass("animated pulse");
                    ToolSelector(room, "pencil", courseware_url);
                    switch_tool = true;
                    break;
                } else {
                    ColorPicker(false, room);
                    $(".list_tool_realTime").children().removeClass("animated pulse")
                    room.setMemberState({ currentApplianceName: "selector" });
                    switch_tool = false;
                    break;
                }
            case 2:
                //eraser tool
                NetlessPath();
                if (switch_tool == false) {
                    $(".src_eraser_real").attr("src", path.eraser_realTime_active);
                    $(".src_eraser_real").addClass("animated pulse");
                    ToolSelector(room, "eraser", courseware_url);
                    switch_tool = true;
                    break;
                } else {
                    $(".list_tool_realTime").children().removeClass("animated pulse")
                    room.setMemberState({ currentApplianceName: "selector" });
                    switch_tool = false;
                    break;
                }
            case 3:
                //trans_scene tool
                NetlessPath();
                if (switch_tool == false) {
                    RegualateCameraController(operable_obj, room);
                    room.dispatchMagixEvent("RegulateCamera");
                    $(".src_transform_real").attr("src", path.transform_realTime_active);
                    $(".src_transform_real").addClass("animated pulse");
                    ToolSelector(room, "trans_scene", courseware_url);
                    $("#panel_tranform").css({ display: "block" });
                    $("#panel_tranform").addClass("animated pulse");
                    switch_tool = true;
                    break;
                } else {
                    RemoveCameraController(operable_obj);
                    RemoveRangeTransform();
                    room.dispatchMagixEvent("RegulateCamera");
                    $(".list_tool_realTime").children().removeClass("animated pulse")
                    room.setMemberState({ currentApplianceName: "selector" });
                    $("#panel_tranform").css({ display: "none" });
                    switch_tool = false;
                    break;
                }
            case 4:
                //mirror tool
                NetlessPath();
                if (switch_tool == false) {
                    room.dispatchMagixEvent("Mirror");
                    $(".src_mirror_real").attr("src", path.mirror_realTime_active);
                    $(".src_mirror_real").addClass("animated pulse");
                    ToolSelector(room, "mirror", courseware_url);
                    switch_tool = true;
                    break;
                } else {
                    room.dispatchMagixEvent("DisMirror");
                    $(".list_tool_realTime").children().removeClass("animated pulse")
                    room.setMemberState({ currentApplianceName: "selector" });
                    switch_tool = false;
                    break;
                }
            case 5:
                //award tool  
                NetlessPath();
                room.dispatchMagixEvent("Award");
                $(".src_award_real").attr("src", path.award_realTime_active);
                $(".src_award_real").addClass("animated pulse");
                ToolSelector(room, "award", courseware_url);
                break;
            case 6:
                NetlessPath();
                if (switch_tool == false) {
                    $(".src_courseware_real").attr("src", path.courseware_realTime_active);
                    $(".src_courseware_real").addClass("animated pulse");
                    ToolSelector(room, "courseware", courseware_url);
                    //room.setMemberState({ currentApplianceName: "selector" });
                    //switch_tool = true;
                    switch_tool = true;
                    break;
                } else {
                    $("#courseware_button").css({ display: "none" });
                    room.setScenePath("/init");
                    $(".list_tool_realTime").children().removeClass("animated pulse")
                    room.setMemberState({ currentApplianceName: "selector" });
                    switch_tool = false;
                    break;
                }
            case 7:
                //mute tool 
                NetlessPath();
                EnableMute();
                if (switch_tool == false) {
                    $(".src_mute_real").attr("src", path.mute_realTime_active);
                    $(".src_mute_real").addClass("animated pulse");
                    ToolSelector(room, "mute", courseware_url);
                    switch_tool = true;
                    break;
                } else {
                    $(".list_tool_realTime").children().removeClass("animated pulse")
                    room.setMemberState({ currentApplianceName: "selector" });
                    switch_tool = false;
                    break;
                }
            default:
                NetlessPath();
                console.log("can not found tool");
                break;
        }
    }
}

function ToolSelector(room, tool, courseware_url) {
    if (typeof(room) != "undefined" && room != null && typeof(tool) != "undefined" && tool != null) {
        switch (tool) {
            case "lool_at_same":
                //look at same scene
                room.setMemberState({ currentApplianceName: "selector" });
                console.log("active " + tool + " tool with success!");
                break;
            case "pencil":

                //ChangeSceneController(room, "controller/courseware");
                room.setMemberState({ currentApplianceName: "pencil" });
                console.log("active " + tool + " tool with success!");
                break;
            case "eraser":
                //eraser tool
                //ChangeSceneController(room, "eraser");
                room.setMemberState({ currentApplianceName: "eraser" });
                console.log("active " + tool + " tool with success!");
                break;
            case "trans_scene":
                //trans_scene tool
                room.setMemberState({ currentApplianceName: "selector" });
                console.log("active " + tool + " tool with success!");
                break;
            case "mirror":
                //mirror tool
                room.setMemberState({ currentApplianceName: "pencil" });
                console.log("active " + tool + " tool with success!");
                break;
            case "award":
                //award tool
                room.setMemberState({ currentApplianceName: "pencil" });
                console.log("active " + tool + " tool with success!");
                break;
            case "courseware":
                ChangeCoursewareButton(room, courseware_url);
                //courseware tool
                room.setMemberState({ currentApplianceName: "selector" });
                //ChangeSceneController(room, "courseware");
                CoursewareController(room, courseware_url);
                console.log("active " + tool + " tool with success!");
                break;
            case "mute":
                //mute tool
                room.setMemberState({ currentApplianceName: "pencil" });
                console.log("active " + tool + " tool with success!");
                break;
            default:
                console.log("can not found tool");
                break;
        }
    }
}
//CoursewareController(room, 200, 200, courseware_url, "我的天堂", 0);

function EventMagicListen(room) {
    room.addMagixEventListener("LookSameEvent", ChangeViewVideos);
    room.addMagixEventListener("Award", AwardAnimate);
    room.addMagixEventListener("RegulateCamera", TransCameraData(room));
    room.addMagixEventListener("Mirror", SetMirror);
    room.addMagixEventListener("DisMirror", DisMirror);
    room.addMagixEventListener("AuthorPencilController", AuthorPencilController);
}

function AuthorPencilController() {
    let get_student_id = $("#uid").attr('class');
    let id_stu = parseInt((get_student_id % 100000) / 10000);
    if (id_stu == 1) {
        if ($("#pencil_realTime").is(":hidden")) {
            $("#pencil_realTime").show();
            console.log("1");
        } else {
            $("#pencil_realTime").hide();
            console.log("2")
        }
    }
}

function StudentMenuLayer() {
    let get_student_id = $("#uid").attr('class');
    let id_stu = parseInt((get_student_id % 100000) / 10000);
    if (id_stu == 1) {
        $("#look_same_realTime").hide();
        $("#eraser_realTime").hide();
        $("#transform_realTime").hide();
        $("#mirror_realTime").hide();
        $("#award_realTime").hide();
        $("#courseware_realTime").hide();
        $("#pencil_realTime").hide();
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function ColorPicker(state, room) {
    $('input[type=radio][name=radio]').change(function() {
        let rgb = hexToRgb(this.value);
        let strokeColor = [rgb.r, rgb.g, rgb.b];
        let strokeWidth = 6;
        room.setMemberState({
            currentApplianceName: "pencil",
            strokeColor: strokeColor,
            strokeWidth: strokeWidth
        });
    });
    if (state) {
        $(".color-picker ").show();
        $(".color-option").each(function() {
            $(this).children().eq(1).css("background-color", $(this).children().eq(0).val());
            // $(this).children().eq(1).addClass("animated pulse");
        });

        //console.log("value is: " + $('input[name=radio]:checked').val());
        let get_pencil_top = $('#pencil_realTime').offset().top - $(window).scrollTop();
        let pencil_left = $("#toolController").css("left");
        let pencil_width = $("#toolController").css("width");
        let ele_width = $(".color-picker").css("width");
        // console.log("dadadad" + pencil_right);
        // let get_color_picker_right = parseInt(pencil_left, 10) * 3 + parseInt(pencil_width, 10) + "px";
        let get_color_picker_left = parseInt(pencil_left, 10) - parseInt(ele_width, 10) - 20 + "px";
        $(".color-picker ").css({
            'top': get_pencil_top,
            'left': get_color_picker_left
        });
    } else {
        $(".color-picker ").hide();
    }
}

function SetMirror() {
    if (operable_obj == 1) {
        //调学生透视
        let student_id = $("#remote-container").children("div").attr('id');
        console.log("Student" + student_id);
        $("#video" + student_id).css({
            'transform': 'rotateY(180deg)'
        });
        console.log($("#video" + student_id).css('transform'));
        console.log("学生镜像成功");
    } else {
        //调整老师透视
        let teacher_id = $("#me").children("div").attr('id');
        let get_teacher_id = $.trim(teacher_id.replace(/[^\d]/g, ' '));
        console.log("Teacher" + get_teacher_id);
        $("#video" + get_teacher_id).css({
            'transform': 'rotateY(180deg)'
        });
        console.log("老师镜像成功");
    }
}

function EnableMute() {
    let id = $("#uid").attr('class');
    document.getElementById("player_" + id).muted = true;
    document.getElementById("audio" + id).muted = true;
    // document.getElementById("me").muteAudio();
    console.log("mute " + id);
}

function DisMirror() {
    if (operable_obj == 1) {
        //调学生透视
        let student_id = $("#remote-container").children("div").attr('id');
        console.log("Student" + student_id);
        $("#video" + student_id).css({
            'transform': ''
        });
        console.log($("#video" + student_id).css('transform'));
        console.log("学生镜像成功2");
    } else {
        //调整老师透视
        let teacher_id = $("#me").children("div").attr('id');
        let get_teacher_id = $.trim(teacher_id.replace(/[^\d]/g, ' '));
        console.log("Teacher" + get_teacher_id);
        $("#video" + get_teacher_id).css({
            'transform': ''
        });
        console.log("老师镜像成功2");
    }
}

function CoursewareController(room, courseware_url) {
    //let ele_localvideo = document.querySelector("#me");
    //ele_localvideo.style.display = "none";
    let width = 500; // ppt 的宽
    let height = 500; // ppt 的高
    let imageURLs = courseware_url;
    // 切换到新插入 ppt 的第一页
    let scenePath = "/controller/courseware/1";
    let sceneState = room.state.sceneState;
    let scenes = imageURLs.map(function(url, index) {
        return {
            name: "" + (index + 1),
            ppt: {
                src: url,
                width: width,
                height: height,
            },
        };
    });
    // 将 ppt 页插入场景
    room.putScenes("/controller/courseware", scenes);
    room.setScenePath(scenePath);
    room.setSceneIndex(page_index);
    const width_courseware = room.state.sceneState.scenes[room.state.sceneState.index].ppt.width;
    const height_courseware = room.state.sceneState.scenes[room.state.sceneState.index].ppt.height;
    room.moveCameraToContain({
        originX: -width_courseware / 2,
        originY: -height_courseware / 2,
        width: width_courseware,
        height: height_courseware,
        // 动画为可选参数
        animationMode: "continuous" // 2.2.2 新增 API，continuous:连续动画（默认），immediately: 瞬间完成
    });
}

function ChangeSceneController(room, name) {
    room.putScenes("/", [{ name: name }]);
    room.setScenePath("/" + name);
    let sceneState = room.state.sceneState;
    console.log("scene path:", sceneState.scenePath);
    console.log("scene name:", sceneState.sceneName);
    console.log("scene index:", sceneState.index);
}

function ChangeCoursewareButton(room, arr_courserware) {
    let uid_num = parseInt($("#uid").attr('class'));
    let id_teacher = parseInt((uid_num % 100000) / 10000);
    let num_courseware = arr_courserware.length;
    //说明是老师端登录
    if (id_teacher == 2) {
        $("#courseware_button").css({ display: "block" });
        let btn_right = document.querySelector(".button_courseware_ctroller_right");
        let btn_left = document.querySelector(".button_courseware_ctroller_left");
        btn_right.onclick = function() {
            page_index = page_index + 1;
            if (typeof(page_index) != "undefined" && page_index != null && page_index >= 0 && page_index < num_courseware) {
                room.setSceneIndex(page_index);
            } else {
                page_index = num_courseware - 1;
                room.setSceneIndex(page_index);
            }
        }
        btn_left.onclick = function() {
            page_index = page_index - 1;
            if (typeof(page_index) != "undefined" && page_index != null && page_index >= 0 && page_index < num_courseware) {
                room.setSceneIndex(page_index);
            } else {
                page_index = 0;
                room.setSceneIndex(page_index);
            }
        }
    }
}

function RangeTransform(room) {
    //函数的作用是用于监听输入的情况和值的变化
    document.getElementById("range_angle").addEventListener("input", EventAngle(room), false);
    document.getElementById("range_angle").addEventListener("change", EventAngle(room), false)
    document.getElementById("range_scale").addEventListener("input", EventScale(room), false);
    document.getElementById("range_scale").addEventListener("change", EventScale(room), false);
    document.getElementById("range_position").addEventListener("input", EventPosition(room), false);
    document.getElementById("range_position").addEventListener("change", EventPosition(room), false);
}

function RemoveRangeTransform() {
    document.getElementById("range_angle").removeEventListener("input", EventAngle(room));
    document.getElementById("range_angle").removeEventListener("change", EventAngle(room));
    document.getElementById("range_scale").removeEventListener("input", EventScale(room));
    document.getElementById("range_scale").removeEventListener("change", EventScale(room));
    document.getElementById("range_position").removeEventListener("input", EventPosition(room));
    document.getElementById("range_position").removeEventListener("change", EventPosition(room));
}

function ChangeViewVideos() {
    var uid_num = parseInt($("#uid").attr('class'));
    var id_student = parseInt((uid_num % 100000) / 10000);
    if (id_student == 1) {
        let small_video = document.querySelector(".smallVideo");
        let grand_video = document.querySelector(".grandVideo");
        small_video.className = "grandVideo";
        grand_video.className = "smallVideo active_click";
    }
}

function AwardAnimate() {
    $("#award_controller").css({ display: "block" });
    let clearTimer = setTimeout(function() {
        $("#award_controller").css({ display: "none" });
        NetlessPath();
    }, 2000);
}

function RemoveCameraController(operable_obj) {
    $.ajax({
        type: "get",
        url: '/',
        success: function(res) {
            let uid_num = parseInt($("#uid").attr('class'));
            let id_teacher = parseInt((uid_num % 100000) / 10000);
            if (id_teacher == 2) {
                if (operable_obj == 1) {
                    let student_id = $("#remote-container").children("div").attr('id');
                    $("#player_" + student_id).css({
                        'perspective': '2000px',
                        'transform-origin': '50% 50% 50%',
                        'transform-origin': 'center',
                        'overflow': 'hidden',
                        'transform': '',
                        'perspective-origin': 'center center',
                        '-moz-perspective-origin': 'center center',
                        '-webkit-perspective-origin': 'center center'
                    });
                    $("#video" + student_id).css({
                        'transform': ''
                    });
                } else {
                    let teacher_id = $("#me").children("div").attr('id');
                    var get_teacher_id = $.trim(teacher_id.replace(/[^\d]/g, ' '));
                    $("#player_" + get_teacher_id).css({
                        'perspective': '2000px',
                        'transform-origin': '50% 50% 50%',
                        'transform-origin': 'center',
                        'overflow': 'hidden',
                        'transform': '',
                        'perspective-origin': 'center center',
                        '-moz-perspective-origin': 'center center',
                        '-webkit-perspective-origin': 'center center'
                    });
                    $("#video" + get_teacher_id).css({
                        'transform': ''
                    });
                }
            }
        }
    });
}

function EventAngle(room) {
    function RangeAngle(event) {
        if (operable_obj == 1) {
            //调学生透视
            console.log("Child视频端的透视角度变化");
            let uid = $("#remote-container").children("div").attr('id');
            setViewAngle(event.target.value, uid, room);
        } else {
            console.log("老师端视频端的透视角度变化");
            let teacher_id = $("#me").children("div").attr('id');
            let uid = $.trim(teacher_id.replace(/[^\d]/g, ' '));
            setViewAngle(event.target.value, uid, room);
        }
    }
    return RangeAngle
}

function EventScale(room) {
    function RangeScale(event) {
        //alert(room.state.globalState.test);
        if (operable_obj == 1) {
            //调学生透视
            console.log("Child视频端的大小变化");
            let uid = $("#remote-container").children("div").attr('id');
            setViewScale(event.target.value, uid, room);
        } else {
            console.log("老师视频端的大小变化");
            let teacher_id = $("#me").children("div").attr('id');
            let uid = $.trim(teacher_id.replace(/[^\d]/g, ' '));
            setViewScale(event.target.value, uid, room);
        }
    }
    return RangeScale
}

function EventPosition(room) {
    function RangePosition(event) {
        if (operable_obj == 1) {
            //调老师透视
            console.log("Child视频端的位置变化");
            let uid = $("#remote-container").children("div").attr('id');
            setViewPosition(event.target.value, uid, room);
            //g_pos = event.target.value;
            globalState.test = event.target.value;
        } else {
            console.log("老师视频端的位置变化");
            let teacher_id = $("#me").children("div").attr('id');
            var uid = $.trim(teacher_id.replace(/[^\d]/g, ' '));
            setViewPosition(event.target.value, uid, room);
        }
    }
    return RangePosition
}

function TransCameraData(room) {
    //当老师调整完却定时的函数
    function GetTransformData() {
        let uid_num = parseInt($("#uid").attr('class'));
        let id_teacher = parseInt((uid_num % 100000) / 10000);
        if (id_teacher == 2) {
            let scale_data = document.getElementById("showVal_Scale").innerHTML;
            let angle_data = document.getElementById("showVal").innerHTML;
            let pos_data = document.getElementById("showVal_Position").innerHTML;
            room.setGlobalState({
                "new_angle": angle_data,
                "new_scale": scale_data,
                "new_position": pos_data
            })
            console.log("确认调整完毕/角度是:" + angle_data + "/大小是:" + scale_data + "/位置是" + pos_data);
        } else {
            //学生端
            $("#me").css({
                'transform': "rotateY(180deg)"
            });
        }
        console.log(uid_num);
    }
    return GetTransformData;
}

function RegualateCameraController(operable_obj, room) {
    let uid_num = parseInt($("#uid").attr('class'));
    let id_teacher = parseInt((uid_num % 100000) / 10000);
    if (id_teacher == 2) {
        //开启调整透视设置的初始化设置
        let uid_num = parseInt($("#uid").attr('class'));
        let id_teacher = parseInt((uid_num % 100000) / 10000);

        if (operable_obj == 1) {
            //调学生透视
            let student_id = $("#remote-container").children("div").attr('id');
            // let read_angle = $("#player_" + student_id).css('perspective');
            // let read_scale = $("#player_" + student_id).css('transform');
            // let read_posi = $("#video" + student_id).css("top");
            console.log("Student" + student_id)
                //console.log("angle read value " + read_angle + "scale read value " + read_scale + "position read value " + read_posi);
            $("#player_" + student_id).css({
                'transform-origin': '50% 50% 50%',
                'transform-origin': 'center',
                'perspective-origin': 'center center',
                '-moz-perspective-origin': 'center center',
                '-webkit-perspective-origin': 'center center',
                'overflow': 'hidden',
                // 'perspective': '2000px',
                // '-webkit-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                // '-moz-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                // '-ms-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                // '-o-transform': 'scale(' + data_scale + ',' + data_scale + ')',
                // 'transform': 'scale(1.5, 1.5)',
            });
            //let video_remote = $(".grandVideo").children("div").children("div").children("video");
            $("#video" + student_id).css({
                'transform': 'rotateX(45deg)',
                //'transform': 'rotateY(180deg)',
                // 'top': parseInt(data_position, 10) * 0.1 + "px"
            });
            RangeTransform(room);
        } else {
            let teacher_id = $("#me").children("div").attr('id');
            var get_teacher_id = $.trim(teacher_id.replace(/[^\d]/g, ' '));
            console.log("Teacher" + get_teacher_id)
            $("#player_" + get_teacher_id).css({
                'perspective': '2000px',
                'transform-origin': '50% 50% 50%',
                'transform-origin': 'center',
                'overflow': 'hidden',
                'transform': 'scale(1.5, 1.5)',
                'perspective-origin': 'center center',
                '-moz-perspective-origin': 'center center',
                '-webkit-perspective-origin': 'center center',
                //'transform': 'rotateY(180deg)'
            });
            $("#video" + get_teacher_id).css({
                'transform': 'rotateX(45deg)',
                //'transform': 'rotateY(180deg)',
            });
            RangeTransform(room);
        }
    }
    let button_vaild = document.querySelector(".bubbly-button");
    button_vaild.onclick = function() {
        room.dispatchMagixEvent("RegulateCamera");
        room.setGlobalState({
            "active_trans": true
        });
        $("#panel_tranform").css({ display: "none" });
        $(".src_transform_real").attr("src", path.transform_realTime_noActive);
        switch_tool = false;
        room.setGlobalState({
            "reguler_button": true
        });
    }

}

function ChangeViewCamera(room) {
    //函数用于大小镜头的切换
    let uid_num = parseInt($("#uid").attr('class'));
    let id_teacher = parseInt((uid_num % 100000) / 10000);

    if (id_teacher == 2) {
        document.querySelector(".smallVideo").addEventListener("dblclick", function() {
            $("#me").css({
                'transform': "rotateY(180deg)"
            });
            let small_video = document.querySelector(".smallVideo");
            let grand_video = document.querySelector(".grandVideo");
            small_video.className = "grandVideo";
            grand_video.className = "smallVideo active_click";
            if (operable_obj == 1) {
                room.setGlobalState({
                    "target_controller": 2
                })
                operable_obj = 2;
            } else {
                room.setGlobalState({
                    "target_controller": 1
                })
                operable_obj = 1;
            }
            ChangeViewCamera(room);
            RegualateCameraController(operable_obj, room);
        });
    }
}