function eventController(page) {
    switch (page) {
        case "netless_tool":
            DragController()
            break;
        default:
            console.log("can not found " + page + " path controller reload");
    }
}