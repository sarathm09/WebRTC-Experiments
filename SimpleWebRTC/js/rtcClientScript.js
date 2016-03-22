

var webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'myVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remVideo',
    // immediately ask for camera access
    autoRequestMedia: true
});

function connectRTC(){
    if($("#yourId").val() != "")
        webrtc.joinRoom($("#yourId").val(), function(e, c){
            if(!e){
                $("#collapseConfig").click();
            }
        })
}

webrtc.on('readyToCall', function () {
    $("#connectButton").prop("disabled", false);
});

webrtc.on('createdPeer', function (peer) {
    peer.on('fileTransfer', function (metadata, receiver) {
        console.log('incoming filetransfer', metadata.name, metadata);
        receiver.on('progress', function (bytesReceived) {
            console.log('receive progress', bytesReceived, 'out of', metadata.size);
        });
        // get notified when file is done
        receiver.on('receivedFile', function (file, metadata) {
            console.log('received file', metadata.name, metadata.size);

            // close the channel
            receiver.channel.close();
        });
        filelist.appendChild(item);
    });
    $("#fileIp").on('change', function() {
        var file = $("#fileIp")[0].files[0];
        var sender = peer.sendFile(file);
    });
});

$(document).on("ready", function () {
    $("#connectButton").prop("disabled", true);
});