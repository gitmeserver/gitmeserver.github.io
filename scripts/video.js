/**
 * 비디오 관련 스크립트 
 */

var totalDeck = 10;
var prefixDeck = "devy_deck";
var totalWatchAfter = 10;
var prefixWatchAfter = "devy_watchafter";

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
	var d = 30;
	var v = $("#video video")[0];
	var src = v.src;
	var currentTime = v.currentTime;
	
	if(currentTime == undefined){
		$.modal("콘텐츠가 아직 재생준비중입니다.");
		return;
	}
	
	$.removeDeck(selectedContents.getChannelId(), selectedContents.getContentsId());
	$.addDeck(selectedContents.getChannelId(), selectedContents.getContentsId(), selectedEpisode.getEpisodeTitle(), currentTime);
	isDeck();
}

function previous(){
	var v = $("#video video")[0];
	var src = v.src;
	var deck = $.getDeck(selectedContents.getChannelId(), selectedContents.getContentsId()).split("_");
	v.currentTime = deck[deck.length - 1];
}

function fullscreenOn(){
	
	var f = $("#embed")[0];
	
	screenfull.request(f);
	
	$(document).on(screenfull.raw.fullscreenchange, function () {
		
		subtitleLocationChange();
		
//		if(!screenfull.isFullscreen){
//			fullscreenOff();
//			$("#videoControll #fullscreenOff").hide();
//		}
	});
	
	$("#embed").removeClass("embed-responsive");
	$("#embed").removeClass("embed-responsive-16by9");
	$("#embed").addClass("fullscreen");
	
	$("#player").addClass("fullscreen");
	
}

function fullscreenOff(){
	
	var f = $("#embed")[0];
	
	screenfull.exit(f);
	
	$("#embed").removeClass("fullscreen");
	$("#embed").addClass("embed-responsive");
	$("#embed").addClass("embed-responsive-16by9");
	
	$("#player").removeClass("fullscreen");
	
}

function subtitleLocationChange(){
	
	var playerHeight = $("#player").css("height");
	var srtMarginTop = ( parseInt(playerHeight) / 100 ) * 80;
	
	var fontSize = ( parseInt(playerHeight) / 50 ) + 10;
	
	$(".srt").css("marginTop", srtMarginTop);
	$(".srt").css("fontSize", fontSize);
	
}

function videoControllLeftOnOff(){
	$(".vLeft").toggle();
}

function videoControllRightOnOff(){
	$(".vRight").toggle();
}
