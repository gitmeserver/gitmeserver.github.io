/**
 * 
 */

function play(){
	var v = $("#video video")[0];
	v.play();
}

function pause(){
	var v = $("#video video")[0];
	v.pause();
}

function backward(){
	var v = $("#video video")[0];
	var s = v.currentTime - SEEK_TIME;
	
	if(s < 0 || s == 0){
		s = 0;
	}
	
	v.currentTime = s;
}

function forward(){
	var v = $("#video video")[0];
	var s = v.currentTime + SEEK_TIME;
	
	if(v.duration < s || v.duration == s){
		s = v.duration;
	}
	
	v.currentTime = s;
}

function save(){
	var d = 365 * 99;
	var v = $("#video video")[0];
	var src = v.src;
	var currentTime = v.currentTime;
	
	$.cookie(src, currentTime, { expires: d });
	
	modal("저장되었습니다.");
	
}

function modal(message){
	$("body").append("<div class='modal fade bs-example-modal-sm' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel' aria-hidden='true'><div class='modal-dialog modal-sm'><div class='modal-content'>" + message + "</div></div></div>");
	$(".modal").on('hidden.bs.modal', function (e) {
		  console.log("1234");
	});
	$(".modal").modal();
}

function previous(){
	var v = $("#video video")[0];
	var src = v.src;
	v.currentTime = $.cookie(src);
}