/**
 * 비디오 관련 스크립트 
 */

var totalDeck = 10;
var prefixDeck = "devy_deck";
var totalWatchAfter = 10;
var prefixWatchAfter = "devy_watchafter";

var MAX_FONT_SIZE = 50;
var MIN_FONT_SIZE = 10;

var MOVE_SEEK_SIZE = 10;

var SUB_TOP_SIZE = 1;

var SUB_SYNC_SIZE = 0.1;

var fontSize = 12;
var moveSeek = 0;
var subTop = 0;
var subSync = 0;

function initVideoConfig(){
	fontSize = 12;
	subSync = 0;
	subTop = 0;
	moveSeek = 0;
}

function plusFontSize(){
	if(fontSize <= MAX_FONT_SIZE){
		fontSize = fontSize + 1;
	}
}

function minusFontSize(){
	if(MIN_FONT_SIZE <= fontSize){
		fontSize = fontSize - 1;
	}
}

function plusMoveSeek(){
	moveSeek = moveSeek + MOVE_SEEK_SIZE;
}

function minusMoveSeek(){
	moveSeek = moveSeek - MOVE_SEEK_SIZE;
}

function plusSubTop(){
	subTop = subTop + SUB_TOP_SIZE;
}

function minusSubTop(){
	subTop = subTop - SUB_TOP_SIZE;
}

function plusMoveSeek(){
	moveSeek = moveSeek + SUB_SYNC_SIZE;
}

function minusMoveSeek(){
	moveSeek = moveSeek - SUB_SYNC_SIZE;
}

function clickPlus(){
	if($("#fontSize").hasClass("active")){
		console.log("#fontSize");
	}else if($("#subTop").hasClass("active")){
		console.log("#subTop");
	}else if($("#subSync").hasClass("active")){
		console.log("#subSync");
	}else if($("#moveSeek").hasClass("active")){
		console.log("#moveSeek");
	}
}

function clickMinus(){
	if($("#fontSize").hasClass("active")){
		console.log("#fontSize");
	}else if($("#subTop").hasClass("active")){
		console.log("#subTop");
	}else if($("#subSync").hasClass("active")){
		console.log("#subSync");
	}else if($("#moveSeek").hasClass("active")){
		console.log("#moveSeek");
	}
}

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
	});
	
	$("#embed").removeClass("embed-responsive");
	$("#embed").removeClass("embed-responsive-16by9");
	$("#embed").addClass("fullscreen");
	
	$("#player").addClass("fullscreen");
	
	$("#fullscreen").hide();
	$("#fullscreenOff").show();
	
}

function fullscreenOff(){
	
	var f = $("#embed")[0];
	
	screenfull.exit(f);
	
	$("#embed").removeClass("fullscreen");
	$("#embed").addClass("embed-responsive");
	$("#embed").addClass("embed-responsive-16by9");
	
	$("#player").removeClass("fullscreen");
	
	$("#fullscreen").show();
	$("#fullscreenOff").hide();
	
}

function subtitleLocationChange(){
	
	var playerHeight = $("#player").css("height");
	var srtMarginTop = ( parseInt(playerHeight) / 100 ) * 80;
	
	var fontSize = ( parseInt(playerHeight) / 50 ) + 10;
	
	$(".srt").css("marginTop", srtMarginTop);
	$(".srt").css("fontSize", fontSize);
	
}

function videoControllOnOff(){
	$("#videoControll").toggle();
}
