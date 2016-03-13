/**
 * 비디오 관련 스크립트 
 */

var totalDeck = 10;
var prefixDeck = "devy_deck";
var totalWatchAfter = 10;
var prefixWatchAfter = "devy_watchafter";

var MAX_FONT_SIZE = 50;
var MIN_FONT_SIZE = 10;

var FONT_SIZE = 2;
var MOVE_SEEK_SIZE = 10;
var SUB_TOP_SIZE = 1;
var SUB_SYNC_SIZE = 1;

var moveSeek = 0;
var subSync = 0;

var cms = 0;
var css = 0;
var cfs = 16;
var cts = 0;

function initVideoConfig(){
	subSync = 0;
	moveSeek = 0;
	
	cms = 0;
	css = 0;
	cfs = 16;
	cts = 0;
}

function plusFontSize(){
	
	var fontSize = parseInt($(".srt").css("font-size").replace("px", ""));
	
	if(fontSize <= MAX_FONT_SIZE){
		fontSize = fontSize + FONT_SIZE;
		$(".srt").css("font-size", fontSize + "px");
	}
	
	cfs = fontSize;
	$("#cfs").text("자막크기:" + cfs);
}

function minusFontSize(){
	
	var fontSize = parseInt($(".srt").css("font-size").replace("px", ""));
	
	if(MIN_FONT_SIZE <= fontSize){
		fontSize = fontSize - FONT_SIZE;
		$(".srt").css("font-size", fontSize + "px");
	}
	
	cfs = fontSize;
	$("#cfs").text("자막크기:" + cfs);
}

function plusSubTop(){
	var subTop = parseInt($(".srt").css("margin-top").replace("px", ""));
	subTop = subTop + SUB_TOP_SIZE;
	$(".srt").css("margin-top", subTop + "px");
	
	cst = cst + SUB_TOP_SIZE;
	$("#cst").text("자막위치:" + cst);
}

function minusSubTop(){
	var subTop = parseInt($(".srt").css("margin-top").replace("px", ""));
	subTop = subTop - SUB_TOP_SIZE;
	$(".srt").css("margin-top", subTop + "px");
	
	cst = cst - SUB_TOP_SIZE;
	$("#cst").text("자막위치:" + cst);
}

function plusSubSync(){
	subSync = subSync + SUB_SYNC_SIZE;
	
	css = css + SUB_SYNC_SIZE;
	$("#css").text("자막싱크:" + css);
}

function minusSubSync(){
	subSync = subSync - SUB_SYNC_SIZE;
	
	css = css - SUB_SYNC_SIZE;
	$("#css").text("자막싱크:" + css);
}

function clickPlus(){
	if($("#fontSize").hasClass("active")){
		plusFontSize();
	}else if($("#subTop").hasClass("active")){
		plusSubTop();
	}else if($("#subSync").hasClass("active")){
		plusSubSync();
	}else if($("#moveSeek").hasClass("active")){
		forward();
	}
}

function clickMinus(){
	if($("#fontSize").hasClass("active")){
		minusFontSize();
	}else if($("#subTop").hasClass("active")){
		minusSubTop();
	}else if($("#subSync").hasClass("active")){
		minusSubSync();
	}else if($("#moveSeek").hasClass("active")){
		backward();
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
	
	cms = cms - SEEK_TIME;
	$("#cms").text("영상위치:" + v.currentTime);
}

function forward(){
	var v = $("#video video")[0];
	var s = v.currentTime + SEEK_TIME;
	
	if(v.duration < s || v.duration == s){
		s = v.duration;
	}
	
	v.currentTime = s;
	
	cms = cms + SEEK_TIME;
	$("#cms").text("영상위치:" + v.currentTime);
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
		console.log(screenfull.isFullscreen);
		
		if(screenfull.isFullscreen){
			$("#embed").removeClass("embed-responsive");
			$("#embed").removeClass("embed-responsive-16by9");
			$("#embed").addClass("fullscreen");
			
			$("#player").addClass("fullscreen");
			
			$("#fullscreen").hide();
			$("#fullscreenOff").show();
		}else{
			$("#embed").removeClass("fullscreen");
			$("#embed").addClass("embed-responsive");
			$("#embed").addClass("embed-responsive-16by9");
			
			$("#player").removeClass("fullscreen");
			
			$("#fullscreen").show();
			$("#fullscreenOff").hide();
		}
	});
	
}

function fullscreenOff(){
	
	var f = $("#embed")[0];
	
	screenfull.exit(f);
	
}

function subtitleLocationChange(){
	
	var playerHeight = $("#player").css("height");
	var srtMarginTop = ( parseInt(playerHeight) / 100 ) * 80;
	
//	var fontSize = ( parseInt(playerHeight) / 50 ) + 10;
	
	$(".srt").css("marginTop", srtMarginTop);
	$(".srt").css("fontSize", cfs);
	
}

function videoControllOnOff(){
	$("#videoControll").toggle();
}
