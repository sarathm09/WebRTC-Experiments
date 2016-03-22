
var conn;
var peer = new Peer({key: 'zglk1hrvlq71ra4i'});

var connect = function(c) {
    conn = c;
    $("#connectButton").attr("disabled", "disabled");
    $('#remoteId').val(conn.peer);

    conn.on('data', function(data){
        if($('#remChatBox').val().length == 0)
            $('#remChatBox').val(data);
        else
            $('#remChatBox').val($('#remChatBox').val() + "\n" + conn.peer + ": " + data);
    });
};
function setupCall (call) {
            // Hang up on an existing call if present
            if (window.existingCall) {
                window.existingCall.close();
            }
            // Wait for stream on the call, then set peer video display
            call.on('stream', function(stream){
                $('#their-video').prop('src', URL.createObjectURL(stream));
            });
            // UI stuff
            window.existingCall = call;
            
        }
        
var connectRTC = function(){
    c = peer.connect($('#remoteId').val());
    var call = peer.call($('#remoteId').val(), window.localStream);

    c.on("open", function(){
        connect(c);
    });

    setupCall(call);
};



peer.on("open", function(id){
    $('#yourId').val(id);
});
// Receiving a call
peer.on('call', function(call){
    // Answer the call automatically (instead of prompting user) for demo purposes
    call.answer(window.localStream);
    setupCall(call);
});
peer.on('error', function(err){
    alert(err.message);
});
peer.on('connection', connect);

$(document).ready(function(){

    // Video Functionality
    var myVid = $("#myVideo");
    vendorUrl = window.URL || window.webkitURL;

    navigator.getMedia = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;
    
    // Capture video
    navigator.getMedia({
        video: true,
        audio: true
    }, function (stream) {
        myVid[0].src = vendorUrl.createObjectURL(stream);
        myVid[0].play();
        window.localStream = stream;
    }, function (error){
        console.log(error);
    });

    // Chatbox functionality
    $("#urChatBox").keydown(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == 13){
            text = $("#urChatBox").val();
            $("#urChatBox").val("");
            conn.send(text);
        }
    });
});

