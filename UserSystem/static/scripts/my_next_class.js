var coulartlab_addr = path.coulartlab;
var coulartlab_addr_token = coulartlab_addr + "token";
$("#timer_to_class").on("click", function() {
    var data = {
        uid: 331001,
        channel: "olivia"
    }
    $.ajax({
        type: "POST",
        url: coulartlab_addr_token,
        data: data,
        success: function(data) {
            // $orders.append("<li>name: " + data.name, "age:" + data.age + "</li>");
            window.location = coulartlab_addr_token + data.channel + data.uid + data.token;
            alert("uid:" + data.uid + "channel:" + data.channel + "token:" + data.token);
        }
    });
});