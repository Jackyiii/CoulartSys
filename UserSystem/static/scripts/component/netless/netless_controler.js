function getNetlessTool(roomUUID, roomToken, appId, courseware_url) {
    pathController("netless_tool");
    eventController("netless_tool");
    WhiteBoardController(roomUUID, roomToken, appId, courseware_url);
}