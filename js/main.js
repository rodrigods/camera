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
  
  $.ajax("https://api.buddycloud.org/techcrunch@topics.buddycloud.org/media", {
    type: "POST",
    beforeSend : function(xhr) {
      var token = btoa("techcrunchtest@buddycloud.org" + ':' + "techcrunchtest");
      xhr.setRequestHeader("Authorization", "Basic " + token);
    },
    xhrFields: {
      withCredentials: true;
    },
    data: {"data": image,
           "content-type": "image/png"},
    success: function() {
      console.log("success");
    },
    complete: function (response) {
      console.log(response);
    }
  });
}

function removeScreenshot(){
  $('.preview canvas').remove();
}