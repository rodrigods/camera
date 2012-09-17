var video = document.getElementById("live");

navigator.webkitGetUserMedia({video: true},
  function(stream) {
    showCamera();
  	document.stream = stream;
    video.src = window.webkitURL.createObjectURL(stream);
  },
  function(err) {
    console.log("Unable to get video stream!");
  }
);

function getImg() {

	var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
	var liveness = document.getElementById("live");

	canvas.width = liveness.clientWidth;
	canvas.height = liveness.clientHeight;

	ctx.drawImage(liveness, 0, 0, canvas.width, canvas.height);

  var image = canvas.toDataURL("image/png").substring(22);
  
  // show screenshot
  $('.preview').append(canvas);
  setTimeout(removeScreenshot, 1000);

  event.preventDefault();

  $.ajax({
    type: "POST",
    url: "https://api.buddycloud.org/cameraapp@buddycloud.org/media",
    dataType: "application/json",
    crossDomain: true,
    data: {"data": image, "content-type": "image/png"},
    xhrFields: {withCredentials: true},
    beforeSend: function(xhr) {
      var token = btoa("cameraapp@buddycloud.org" + ':' + "cameraapp");
      xhr.setRequestHeader("Authorization", "Basic " + token);
    },
    complete: function(res) {
      postComment($.parseJSON(res.responseText).id);
    }
  });
};

function postComment(mediaId) {
  var mediaUrl = "https://api.buddycloud.org/cameraapp@buddycloud.org/media/" + mediaId;
  $.ajax({
    type: "POST",
    url: "https://api.buddycloud.org/cameraapp@buddycloud.org/content/posts",
    contentType: "application/json",
    dataType: "text",
    crossDomain: true,
    data: JSON.stringify({"content":"New media " + mediaUrl}),
    xhrFields: {withCredentials: true},
    beforeSend: function(xhr) {
      var token = btoa("cameraapp@buddycloud.org" + ':' + "cameraapp");
      xhr.setRequestHeader("Authorization", "Basic " + token);
    },
    complete: function(res) {
      console.log("posted")
    }
  });  
};

function removeScreenshot(){
  $('.preview canvas').remove();
};