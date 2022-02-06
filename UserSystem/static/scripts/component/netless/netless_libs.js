let corners_a4 = [0, 0, 0, 500, 800, 0, 800, 500];
var select_corners = [];
var corners = [];
let marker_id = [0, 2, 4, 6];
var index = 0;
var page_index=0;
var globalState_init = {
    "look_same": false, // affect two ends
    "active_pencil": false, // only affect teacher end
    "active_eraser": false, // only affect teacher end
    "active_transform": false,
    "active_mirror": false, // affect two ends
    "active_award": false, // affect two ends
    "active_courseware": false, // affect two ends
    "active_mute": false, // affect two ends
    "active_student_control": false, // only affect student end
    // affect two ends
    "angle_x": 0,
    "angle_y": 0,
    "angle_z": 0,
    "scale": 1,
    "position": 0,
    // complicate
    "click_small_video": false,
    "double_to_child_pencil": false,
    "corners_a4": [0, 0, 0, 500, 800, 0, 800, 500],
    "select_corners": [],
    "marker_id": [0, 2, 4, 6],
    "index_transform": 0
}
function WhiteBoardController(roomUUID, roomToken, appId, courseware_url) {
    StudentMenuLayer();
    joinRoom(roomUUID, roomToken, appId, courseware_url);
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
        // listen to global state
        onRoomStateChanged: function(modifyState) {
            if (modifyState.globalState) {
                let change_value = modifyState.globalState;
                LookAtSame(change_value.look_same);
                ListenPencil(change_value.active_pencil);
                ListenEraser(change_value.active_eraser);
                ListenAward(change_value.active_award);
                ListenCourseware(change_value.active_courseware);

                //ChildPencil(change_value.double_to_child_pencil);
                //AuthorPencilController(change_value.double_to_child_pencil);
                //AwardAnimate(change_value.active_award);
                //AwardAnimate();
            }
        }

    }).then(function(room) {
        room.setGlobalState(globalState_init);
        // 加入房间成功，获取 room 对象
        // 并将之前的 <div id="whiteboard"/> 占位符变成白板
        room.setScenePath("/init");
        console.log("最初状态" + room.state.globalState.double_to_child_pencil);
        ToolSelect(room, courseware_url);
        EventMagicListen(room);
        ChangeViewCamera(room);
        room.bindHtmlElement(document.getElementById("whiteboard"));
        room.setMemberState({ currentApplianceName: "selector" });
        // TODO: if global state undefined, initialize global state
        NetlessPath(); //加载工具包icon
        console.log(room.state.roomMembers);
        let testBtn = document.getElementById("btn_finish");
        testBtn.onclick = function() {
            console.log("1");
        }
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
        room.setMemberState({ currentApplianceName: "selector" }); //光标变为选择的形态
        //AuthorPencil(room); // ??
        for (var i = 0; i < toollength; i++) {
            // add listener
            alltool[i].addEventListener("click", function() {
                ToolControl(alltool, $(this).index() - 1, room, courseware_url);
            });
        }
        ListenPencilToChild(room);
    }
}

function ToolControl(arr_tool, index, room, courseware_url) {
    let index_selector = parseInt(index);
    let tool_length = arr_tool.length;
    if (isNaN(index_selector)) {
        return 0;
    }
    if (typeof(arr_tool) != "undefined" && arr_tool != null && typeof(tool_length) != "undefined" && tool_length != null) {
        switch (index_selector) {
            case 0: // update look_same state
                room.setGlobalState({ "look_same": !room.state.globalState.look_same });
                break;
            case 1: // update pencil state
                room.setGlobalState({ "active_pencil": !room.state.globalState.active_pencil });
                PencilEvent(room);
                //AuthorPencil(room);
                break;
            case 2: // update eraser state
                room.setGlobalState({ "active_eraser": !room.state.globalState.active_eraser });
                EraserEvent(room);
                break;
            case 3: // update transform state
                console.log("1");
                startHandler();
                // document.addEventListener('mousemove', (event) => {
                //     //console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
                //     //info.innerHTML = 'Position X : ' + event.pageX + '<br />Position Y : ' + event.pageY;
                //     info.innerHTML = 'Position X : ' + event.clientX + '<br />Position Y : ' + event.clientY + '<br /> Conners: ' + corners + '<br /> Length:' + corners.length;
                //     console.log(corners);
                // });
                room.setGlobalState({ "active_transform": !room.state.globalState.active_transform });
                break;
            case 4: // update mirror state
                room.setGlobalState({ "active_mirror": !room.state.globalState.active_mirror });
                break;
            case 5: // update award state
                room.setGlobalState({ "active_award": true });
                let clearTimer = setTimeout(function() {
                    $("#award_controller").css({ display: "none" });
                    room.setGlobalState({ "active_award": false });
                }, 2000);
                break;
            case 6: // update course state
                room.setGlobalState({ "active_courseware": !room.state.globalState.active_courseware });
                CoursewareController(room, courseware_url,room.state.globalState.active_courseware);
                ChangeCoursewareButton(room, courseware_url);
                break;
            case 7: // update course state
                room.setGlobalState({ "active_mute": !room.state.globalState.active_course });
                break;
            default:
                console.log("can not found tool");
                break;
        }
    }
}

//************   Pencil Tool Function ************ 
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
        console.log("调色盘开启")
        $(".color-picker ").show();
        $(".color-option").each(function() {
            $(this).children().eq(1).css("background-color", $(this).children().eq(0).val());
            // $(this).children().eq(1).addClass("animated pulse");
        });

        console.log("value is: " + $('input[name=radio]:checked').val());
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

function ListenPencil(state) {
    if (state) {
        //room.setMemberState({ currentApplianceName: "selector" });
        $(".src_pencil_real").attr("src", path.pencil_realTime_active);
        $(".src_pencil_real").addClass("animated pulse");
        //console.log("开启画笔");
    } else {
        //room.setMemberState({ currentApplianceName: "selector" });
        //$(".src_lookSame_real").attr("src", path.look_same_realTime_noActive);
        $(".src_pencil_real").attr("src", path.pencil_realTime_noActive);
        $(".list_tool_realTime").children().removeClass("animated pulse");
        //LookAtDifferent();
        //console.log("关闭画笔");
    }
}

function PencilEvent(room) {
    if (room.state.globalState.active_pencil) {
        room.setMemberState({ currentApplianceName: "pencil" });
        ColorPicker(true, room);
        //console.log(state);
    } else {
        room.setMemberState({ currentApplianceName: "selector" });
        ColorPicker(false, room);
    }
}
//*********************  Pencil double event ************/
function ListenPencilToChild(room) {

    let tool_pencil = document.querySelector("#pencil_realTime");
    let get_prof = $("#uid").attr('class');
    let id_pro = parseInt((get_prof % 100000) / 10000);
    if (id_pro == 2) {
        tool_pencil.addEventListener("dblclick", function() {
            //console.log("触发双击");
            room.dispatchMagixEvent("ChildPencil");
        });
    }
}
function ChildPencil(room) {
    function get() {
        room.setGlobalState({ "double_to_child_pencil": !room.state.globalState.double_to_child_pencil });
        if (room.state.globalState.double_to_child_pencil) {
            room.setMemberState({ currentApplianceName: "pencil" });
        } else {
            room.setMemberState({ currentApplianceName: "selector" });
        }
        console.log("状态:" + room.state.globalState.double_to_child_pencil);
    }
    return get;
}
//*********************   Eraser Tool Function ************/
function ListenEraser(state) {
    if (state) {
        //room.setMemberState({ currentApplianceName: "selector" });
        $(".src_eraser_real").attr("src", path.eraser_realTime_active);
        $(".src_eraser_real").addClass("animated pulse");
        //console.log("开启橡皮");
    } else {
        //room.setMemberState({ currentApplianceName: "selector" });
        //$(".src_lookSame_real").attr("src", path.look_same_realTime_noActive);
        $(".src_eraser_real").attr("src", path.eraser_realTime_noActive);
        $(".list_tool_realTime").children().removeClass("animated pulse");
        //LookAtDifferent();
        //console.log("关闭橡皮");
    }
}

function EraserEvent(room) {
    if (room.state.globalState.active_eraser) {
        room.setMemberState({ currentApplianceName: "eraser" });
    } else {
        room.setMemberState({ currentApplianceName: "selector" });
    }
}
//*********************   Award Tool Function ************/
function ListenAward(state) {
    if (state) {
        //room.setMemberState({ currentApplianceName: "selector" });
        $(".src_award_real").attr("src", path.award_realTime_active);
        $(".src_award_real").addClass("animated pulse");
        $("#award_controller").css({ display: "block" });
        //AwardAnimate(room)
        //console.log("开启award");
    } else {
        //room.setMemberState({ currentApplianceName: "selector" });
        //$(".src_lookSame_real").attr("src", path.look_same_realTime_noActive);
        $(".src_award_real").attr("src", path.award_realTime_noActive);
        $(".list_tool_realTime").children().removeClass("animated pulse");
        $("#award_controller").css({ display: "none" });
        //LookAtDifferent();
        //console.log("关闭award");
    }
}
//*********************   Courseware Tool Function ************/

function ListenCourseware(state) {
    if (state) {
        //room.setMemberState({ currentApplianceName: "selector" });
        $(".src_courseware_real").attr("src", path.courseware_realTime_active);
        $(".src_courseware_real").addClass("animated pulse");
        $(".button_courseware_ctroller_left").css({ display: "block" });
        $(".button_courseware_ctroller_right").css({ display: "block" });
        //console.log("开启画笔");
    } else {
        console.log("closed with courseware function")
        //room.setMemberState({ currentApplianceName: "selector" });
        //$(".src_lookSame_real").attr("src", path.look_same_realTime_noActive);
        $(".src_courseware_real").attr("src", path.courseware_realTime_noActive);
        $(".list_tool_realTime").children().removeClass("animated pulse");
        $("#courseware_button").css({ display: "none" });
        $(".button_courseware_ctroller_left").css({ display: "none" });
        $(".button_courseware_ctroller_right").css({ display: "none" });
        //LookAtDifferent();
        //console.log("关闭画笔");
    }
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

function CoursewareController(room, courseware_url,state) {
    console.log(state);
    if(state){
        OpenedCourseware(room,courseware_url);
    }else{
        ClosedCourseware(room);
    }

}
function OpenedCourseware(room,courseware_url){
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
    console.log("SceneState:"+sceneState.sceneName);
    console.log("SceneState:"+sceneState.index);
}
function ClosedCourseware(room){
    room.setScenePath("/init");
    let sceneState = room.state.sceneState;
    console.log(sceneState);
}
//************     同屏功能管理  ************
function LookAtSame(state) {
    if (state) {
        //room.setMemberState({ currentApplianceName: "selector" });
        $(".src_lookSame_real").attr("src", path.look_same_realTime_active);
        $(".src_lookSame_real").addClass("animated pulse");
        //console.log("开启同屏");
    } else {
        //room.setMemberState({ currentApplianceName: "selector" });
        $(".src_lookSame_real").attr("src", path.look_same_realTime_noActive);
        $(".list_tool_realTime").children().removeClass("animated pulse");
        //LookAtDifferent();
        //console.log("关闭同屏");
    }
}

// function ToolSelector(room, tool, courseware_url) {
//     if (typeof(room) != "undefined" && room != null && typeof(tool) != "undefined" && tool != null) {
//         switch (tool) {
//             case "lool_at_same":
//                 //look at same scene
//                 room.setMemberState({ currentApplianceName: "selector" });
//                 console.log("active " + tool + " tool with success!");
//                 break;
//             case "pencil":
//                 //ChangeSceneController(room, "controller/courseware");
//                 room.setMemberState({ currentApplianceName: "pencil" });
//                 console.log("active " + tool + " tool with success!");
//                 break;
//             case "eraser":
//                 //eraser tool
//                 //ChangeSceneController(room, "eraser");
//                 room.setMemberState({ currentApplianceName: "eraser" });
//                 console.log("active " + tool + " tool with success!");
//                 break;
//             case "trans_scene":
//                 //trans_scene tool
//                 room.setMemberState({ currentApplianceName: "selector" });
//                 console.log("active " + tool + " tool with success!");
//                 break;
//             case "mirror":
//                 //mirror tool
//                 room.setMemberState({ currentApplianceName: "pencil" });
//                 console.log("active " + tool + " tool with success!");
//                 break;
//             case "award":
//                 //award tool
//                 room.setMemberState({ currentApplianceName: "pencil" });
//                 console.log("active " + tool + " tool with success!");
//                 break;
//             case "courseware":
//                 //ChangeCoursewareButton(room, courseware_url);
//                 //courseware tool
//                 room.setMemberState({ currentApplianceName: "selector" });
//                 //ChangeSceneController(room, "courseware");
//                 //CoursewareController(room, courseware_url);
//                 console.log("active " + tool + " tool with success!");
//                 break;
//             case "mute":
//                 //mute tool
//                 room.setMemberState({ currentApplianceName: "pencil" });
//                 console.log("active " + tool + " tool with success!");
//                 break;
//             default:
//                 console.log("can not found tool");
//                 break;
//         }
//     }
// }

function EventMagicListen(room) {
    //room.addMagixEventListener("PencilEvent", AddPencilEvent(room));
    room.addMagixEventListener("LookSameEvent", ChangeViewVideos);
    //room.addMagixEventListener("Award", AwardAnimate);
    room.addMagixEventListener("RegulateCamera", TransCameraData(room));
    room.addMagixEventListener("Mirror", SetMirror);
    room.addMagixEventListener("DisMirror", DisMirror);
    room.addMagixEventListener("ChildPencil", ChildPencil(room));
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

function SetMirror() {
    if (operable_obj == 1) {
        //调学生透视
        let student_id = $("#remote-container").children("div").attr('id');
        console.log("Student" + student_id);
        $("#video" + student_id).css({ // TODO: Y mirror
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
            'transform': 'rotateY(180deg)' //TODO:Y mirror
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

// function CoursewareController(room, courseware_url) {
//     //let ele_localvideo = document.querySelector("#me");
//     //ele_localvideo.style.display = "none";
//     let width = 500; // ppt 的宽
//     let height = 500; // ppt 的高
//     let imageURLs = courseware_url;
//     // 切换到新插入 ppt 的第一页
//     let scenePath = "/controller/courseware/1";
//     let sceneState = room.state.sceneState;
//     let scenes = imageURLs.map(function(url, index) {
//         return {
//             name: "" + (index + 1),
//             ppt: {
//                 src: url,
//                 width: width,
//                 height: height,
//             },
//         };
//     });
//     // 将 ppt 页插入场景
//     room.putScenes("/controller/courseware", scenes);
//     room.setScenePath(scenePath);
//     room.setSceneIndex(page_index);
//     const width_courseware = room.state.sceneState.scenes[room.state.sceneState.index].ppt.width;
//     const height_courseware = room.state.sceneState.scenes[room.state.sceneState.index].ppt.height;
//     room.moveCameraToContain({
//         originX: -width_courseware / 2,
//         originY: -height_courseware / 2,
//         width: width_courseware,
//         height: height_courseware,
//         // 动画为可选参数
//         animationMode: "continuous" // 2.2.2 新增 API，continuous:连续动画（默认），immediately: 瞬间完成
//     });
// }

// function ChangeSceneController(room, name) {
//     room.putScenes("/", [{ name: name }]);
//     room.setScenePath("/" + name);
//     let sceneState = room.state.sceneState;
//     console.log("scene path:", sceneState.scenePath);
//     console.log("scene name:", sceneState.sceneName);
//     console.log("scene index:", sceneState.index);
// }

// function ChangeCoursewareButton(room, arr_courserware) {
//     let uid_num = parseInt($("#uid").attr('class'));
//     let id_teacher = parseInt((uid_num % 100000) / 10000);
//     let num_courseware = arr_courserware.length;
//     //说明是老师端登录
//     // alert(uid_nim);
//     if (id_teacher == 2) {
//         $("#courseware_button").css({ display: "block" });
//         let btn_right = document.querySelector(".button_courseware_ctroller_right");
//         let btn_left = document.querySelector(".button_courseware_ctroller_left");
//         btn_right.onclick = function() {
//             page_index = page_index + 1;
//             if (typeof(page_index) != "undefined" && page_index != null && page_index >= 0 && page_index < num_courseware) {
//                 room.setSceneIndex(page_index);
//             } else {
//                 page_index = num_courseware - 1;
//                 room.setSceneIndex(page_index);
//             }
//         }
//         btn_left.onclick = function() {
//             page_index = page_index - 1;
//             if (typeof(page_index) != "undefined" && page_index != null && page_index >= 0 && page_index < num_courseware) {
//                 room.setSceneIndex(page_index);
//             } else {
//                 page_index = 0;
//                 room.setSceneIndex(page_index);
//             }
//         }
//     }
// }

function RangeTransform(room) {
    //函数的作用是用于监听输入的情况和值的变化
    //TODO: angle x
    //TODO: !!!
    document.getElementById("range_angle_x").addEventListener("input", EventAngle_x(room), false);
    document.getElementById("range_angle_x").addEventListener("change", EventAngle_x(room), false)
        //TDOD:!
    document.getElementById("range_angle_y").addEventListener("input", EventAngle_y(room), false);
    document.getElementById("range_angle_y").addEventListener("change", EventAngle_y(room), false)

    //TDOD:!
    document.getElementById("range_angle_z").addEventListener("input", EventAngle_z(room), false);
    document.getElementById("range_angle_z").addEventListener("change", EventAngle_z(room), false)

    document.getElementById("range_scale").addEventListener("input", EventScale(room), false);
    document.getElementById("range_scale").addEventListener("change", EventScale(room), false);
    document.getElementById("range_position").addEventListener("input", EventPosition(room), false);
    document.getElementById("range_position").addEventListener("change", EventPosition(room), false);
}

function RemoveRangeTransform() {
    //TODO:!!
    document.getElementById("range_angle_x").removeEventListener("input", EventAngle_x(room));
    document.getElementById("range_angle_x").removeEventListener("change", EventAngle_x(room));
    // TODO: set event y
    document.getElementById("range_angle_y").removeEventListener("input", EventAngle_y(room));
    document.getElementById("range_angle_y").removeEventListener("change", EventAngle_y(room));
    // TODO:
    document.getElementById("range_angle_z").removeEventListener("input", EventAngle_z(room));
    document.getElementById("range_angle_z").removeEventListener("change", EventAngle_z(room));


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

function EventAngle_x(room) {
    function RangeAngle(event) {
        if (operable_obj == 1) {
            //调学生透视
            console.log("Child视频端的透视角度变化");
            // TODO: !!!! ???? set attr ?
            let uid = $("#remote-container").children("div").attr('id');
            console.log("***********************************" + uid);
            setViewAngle_x(event.target.value, uid, room);
        } else {
            console.log("老师端视频端的透视角度变化");
            let teacher_id = $("#me").children("div").attr('id');
            let uid = $.trim(teacher_id.replace(/[^\d]/g, ' '));
            // TODO: ??
            console.log("========================================" + uid);
            setViewAngle_x(event.target.value, uid, room);
        }
    }
    return RangeAngle
}
//TODO:!! y

function EventAngle_y(room) {
    function RangeAngle(event) {
        if (operable_obj == 1) {
            //调学生透视
            console.log("Child视频端的透视角度变化");
            let uid = $("#remote-container").children("div").attr('id');
            setViewAngle_y(event.target.value, uid, room);
        } else {
            console.log("老师端视频端的透视角度变化");
            let teacher_id = $("#me").children("div").attr('id');
            let uid = $.trim(teacher_id.replace(/[^\d]/g, ' '));
            setViewAngle_y(event.target.value, uid, room);
        }
    }
    return RangeAngle
}

//TODO:!! z

function EventAngle_z(room) {
    function RangeAngle(event) {
        if (operable_obj == 1) {
            //调学生透视
            console.log("Child视频端的透视角度变化");
            let uid = $("#remote-container").children("div").attr('id');
            setViewAngle_z(event.target.value, uid, room);
        } else {
            console.log("老师端视频端的透视角度变化");
            let teacher_id = $("#me").children("div").attr('id');
            let uid = $.trim(teacher_id.replace(/[^\d]/g, ' '));
            setViewAngle_z(event.target.value, uid, room);
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
            //let angle_data = document.getElementById("showVal").innerHTML;//TODO: !!!

            let angle_data_x = document.getElementById('range_angle_x').value;
            let angle_data_y = document.getElementById('range_angle_y').value;
            let angle_data_z = document.getElementById('range_angle_z').value;

            let pos_data = document.getElementById("showVal_Position").innerHTML;
            room.setGlobalState({
                "new_angle_x": angle_data_x, //TODO: !!!
                "new_angle_y": angle_data_y,
                "new_angle_z": angle_data_z,

                "new_scale": scale_data,
                "new_position": pos_data
            })
            console.log("确认调整完毕/角度是:" + angle_data_x + "/大小是:" + scale_data + "/位置是" + pos_data);
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
                'transform': 'rotateX(0deg)', //TODO: rotate X !!!
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
                'transform': 'rotateX(45deg)', // TODO: rotate X
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
                'transform': "rotateY(180deg)" //TODO: rotate Y
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

function startHandler() {
    /** select */
    $("#container_tranform").css({ display: "block" });
    document.getElementById('container_tranform').addEventListener('click', select, false);

}

function finishHandler() {
    /** remove select */

    document.getElementById('container_tranform').removeEventListener('click', select, false);

    /** auto perspective */
    if (select_corners.length == 8) {
        corners = corners_a4;
        transform2d('video3310001', select_corners, corners);

        /** auto update markers */
        for (var i = 0; i < 8; i += 2) {
            var marker = document.getElementById("marker" + i);
            marker.style.left = corners[i] + "px";
            marker.style.top = corners[i + 1] + "px";
            marker.style.visibility = "visible";
            console.log("============marker: " + i + "==" + marker.style.left + "==== " + marker.style.top);
        }
    }
}

/** select function */
function select(event) {
    //get position
    var box = event.target.getBoundingClientRect();
    var x = event.clientX - box.left; // == event.offsetX
    var y = event.clientY - box.top; // event.offsetY
    //info.innerHTML = 'Position X : ' + event.clientX + '<br />Position Y : ' + event.clientY;

    info.innerHTML = 'X : ' + x + '<br />Y : ' + y;
    if (select_corners.length < 8) {

        var marker = document.getElementById("marker" + marker_id[index]);
        marker.style.left = x + "px";
        marker.style.top = y + "px";
        marker.style.visibility = "visible";

        select_corners.push(x);
        select_corners.push(y);
        index += 1;
        if (index == 4) {
            $("#btn_finish").css({ "background-color": "#00B1FF" });
        }
    }
}

/* button handler*/
function correctHandler() {

    /** disable browser automate drag&drop function */
    /** disable image drag&drop */
    /** important ! */
    var img = document.getElementById('img');
    img.ondragstart = function() {
        return false;
    };

    var marker6 = document.getElementById('marker6');
    marker6.ondragstart = function() {
        return false;
    }

    var markerId = 'undefined';

    window.addEventListener('mouseup', function() {
        console.log("============mouse up");
        if (markerId != 'undefined') {
            markerId = 'undefined';
        }
    });


    /******** mousedown, select marker *********/
    window.addEventListener('mousedown', function(event) {
        if ((markerId == 'undefined') && (event.target.id != null)) {
            var id = event.target.id;
            markerId = id;
        }
    });

    /**mousemove, update */
    window.addEventListener('mousemove', function(event) {

        if ((markerId != 'undefined') && (markerId != null) && (event.pageX != 'undefined')) {
            var i = parseInt(markerId.charAt(markerId.length - 1));

            /** update corner */
            //let shiftX = event.clientX - ball.getBoundingClientRect().left;
            //let shiftY = event.clientY - ball.getBoundingClientRect().top;

            // TODO: get center
            corners[i] = event.pageX - 10;
            corners[i + 1] = event.pageY - 10;

            /** update corner marker */
            var marker = document.getElementById(markerId);
            marker.style.left = corners[i] + "px";
            marker.style.top = corners[i + 1] + "px";
            alert("1");
            /** update perspective transform */
            transform2d('video3310001', select_corners, corners);
        }
    });


}

/* button handler*/
function resetHandler() {
    /** reset transform */
    var box = document.getElementById('box_transform');
    box.style["-webkit-transform"] = 'initial';
    box.style["-moz-transform"] = 'initial';
    box.style["-o-transform"] = 'initial';
    box.style.transform = 'initial';

    /** reset select_corners */
    select_corners = [];

    /** reset markers */
    index = 0;

    /** reset container */
    var marker = document.getElementById('marker0');
    marker.style["visibility"] = 'hidden';
    var marker = document.getElementById('marker2');
    marker.style["visibility"] = 'hidden';
    var marker = document.getElementById('marker4');
    marker.style["visibility"] = 'hidden';
    var marker = document.getElementById('marker6');
    marker.style["visibility"] = 'hidden';


}

/** function perspective transform */
// src: source corners
// des: destination corners
function transform2d(elt, src, des) {
    var elt = document.getElementById(elt);
    var transform = PerspT(src, des);
    var t = transform.coeffs;
    t = [t[0], t[3], 0, t[6],
        t[1], t[4], 0, t[7],
        0, 0, 1, 0,
        t[2], t[5], 0, t[8]
    ];
    t = "matrix3d(" + t.join(", ") + ")";

    elt.style["-webkit-transform"] = t;
    elt.style["-moz-transform"] = t;
    elt.style["-o-transform"] = t;
    elt.style.transform = t;
}
// function AwardAnimate(room) {
//     room.setGlobalState({ "active_award": true });
//     $("#award_controller").css({ display: "block" });
//     let clearTimer = setTimeout(function() {
//         $("#award_controller").css({ display: "none" });
//         room.setGlobalState({ "active_award": false });
//     }, 2000);
// }

//TODO:!! change, use session or cookie
// get uid
//let uid_num = parseInt($("#uid").attr('class'));
// TODO: if not NAN, exist
//sessionStorage.setItem('uid', uid_num);
//let id = parseInt((uid_num % 100000) / 10000);
//学生本地透视
// console.log("调整学生透视")
// let uid_student = $("#me").children("div").attr('id');
// let get_uid = $.trim(uid_student.replace(/[^\d]/g, ' '));
// console.log(get_uid);
//console.log(change_value.look_same)

// room.setGlobalState({ "active_pencil": !room.state.globalState.look_same });
// if (room.state.globalState.look_same) {
//     room.setMemberState({ currentApplianceName: "pencil" });
//     $(".src_pencil_real").attr("src", path.pencil_realTime_active);
//     $(".src_pencil_real").addClass("animated pulse");
// } else {
//     room.setMemberState({ currentApplianceName: "selector" });
// }
// break;

//NetlessPath(); //??
/*
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
}*/
// case 1:
//     //pencil tool
//     NetlessPath();
//     if (switch_tool == false) {
//         ColorPicker(true, room)
//         $(".src_pencil_real").attr("src", path.pencil_realTime_active);
//         $(".src_pencil_real").addClass("animated pulse");
//         ToolSelector(room, "pencil", courseware_url);
//         switch_tool = true;
//         break;
//     } else {
//         ColorPicker(false, room);
//         $(".list_tool_realTime").children().removeClass("animated pulse")
//         room.setMemberState({ currentApplianceName: "selector" });
//         switch_tool = false;
//         break;
//     }
// case 2:
//     //eraser tool
//     NetlessPath();
//     if (switch_tool == false) {
//         $(".src_eraser_real").attr("src", path.eraser_realTime_active);
//         $(".src_eraser_real").addClass("animated pulse");
//         ToolSelector(room, "eraser", courseware_url);
//         switch_tool = true;
//         break;
//     } else {
//         $(".list_tool_realTime").children().removeClass("animated pulse")
//         room.setMemberState({ currentApplianceName: "selector" });
//         switch_tool = false;
//         break;
//     }
// case 3:
//     //trans_scene tool
//     NetlessPath();
//     if (switch_tool == false) {
//         RegualateCameraController(operable_obj, room);
//         room.dispatchMagixEvent("RegulateCamera");
//         $(".src_transform_real").attr("src", path.transform_realTime_active);
//         $(".src_transform_real").addClass("animated pulse");
//         ToolSelector(room, "trans_scene", courseware_url);
//         $("#panel_tranform").css({ display: "block" });
//         $("#panel_tranform").addClass("animated pulse");
//         switch_tool = true;
//         break;
//     } else {
//         RemoveCameraController(operable_obj);
//         RemoveRangeTransform();
//         room.dispatchMagixEvent("RegulateCamera");
//         $(".list_tool_realTime").children().removeClass("animated pulse")
//         room.setMemberState({ currentApplianceName: "selector" });
//         $("#panel_tranform").css({ display: "none" });
//         switch_tool = false;
//         break;
//     }
// case 4:
//     //mirror tool
//     NetlessPath();
//     if (switch_tool == false) {
//         room.dispatchMagixEvent("Mirror");
//         $(".src_mirror_real").attr("src", path.mirror_realTime_active);
//         $(".src_mirror_real").addClass("animated pulse");
//         ToolSelector(room, "mirror", courseware_url);
//         switch_tool = true;
//         break;
//     } else {
//         room.dispatchMagixEvent("DisMirror");
//         $(".list_tool_realTime").children().removeClass("animated pulse")
//         room.setMemberState({ currentApplianceName: "selector" });
//         switch_tool = false;
//         break;
//     }
// case 5:
//     //award tool  
//     NetlessPath();
//     room.dispatchMagixEvent("Award");
//     $(".src_award_real").attr("src", path.award_realTime_active);
//     $(".src_award_real").addClass("animated pulse");
//     ToolSelector(room, "award", courseware_url);
//     break;
// case 6:
//     NetlessPath();
//     if (switch_tool == false) {
//         $(".src_courseware_real").attr("src", path.courseware_realTime_active);
//         $(".src_courseware_real").addClass("animated pulse");
//         ToolSelector(room, "courseware", courseware_url);
//         //room.setMemberState({ currentApplianceName: "selector" });
//         //switch_tool = true;
//         switch_tool = true;
//         break;
//     } else {
//         $("#courseware_button").css({ display: "none" });
//         room.setScenePath("/init");
//         $(".list_tool_realTime").children().removeClass("animated pulse")
//         room.setMemberState({ currentApplianceName: "selector" });
//         switch_tool = false;
//         break;
//     }
// case 7:
//     //mute tool 
//     NetlessPath();
//     EnableMute();
//     if (switch_tool == false) {
//         $(".src_mute_real").attr("src", path.mute_realTime_active);
//         $(".src_mute_real").addClass("animated pulse");
//         ToolSelector(room, "mute", courseware_url);
//         switch_tool = true;
//         break;
//     } else {
//         $(".list_tool_realTime").children().removeClass("animated pulse")
//         room.setMemberState({ currentApplianceName: "selector" });
//         switch_tool = false;
//         break;
//     }
// default:
//     NetlessPath();
//     console.log("can not found tool");
//     break;