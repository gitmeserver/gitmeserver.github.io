/**
 * 비디오 관련 스크립트 
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
	
	var json = $.parseJSON(selectedContents);
	console.log(json);
	
	
	if(document.cookie.split(";").length < 20){
		$.cookie(src, currentTime, { expires: d });
		$.modal("저장되었습니다.");
	}else{
		$.modal("20개이하만 저장가능합니다.");
	}
	
}

function previous(){
	var v = $("#video video")[0];
	var src = v.src;
	v.currentTime = $.cookie(src);
}