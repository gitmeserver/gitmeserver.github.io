/**
 * 비디오 관련 스크립트 
 */

var totalDeck = 10;
var prefixDeck = "devy_deck";
var totalWatchAfter = 10;
var prefixWatchAfter = "devy_watchafter";

var MAX_FONT_SIZE = 80;
var MIN_FONT_SIZE = 10;

var FONT_SIZE = 2;
var MOVE_SEEK_SIZE = 10;
var SUB_TOP_SIZE = 1;
var SUB_SYNC_SIZE = 1;

var moveSeek = 0;
var subSync = 0;

var cms = 0;
var css = 0;

function initVideoConfig(){
	subSync = 0;
	moveSeek = 0;
	
	cms = 0;
	css = 0;
}

function plusFontSize(){
	
	var fontSize = $.getCfs();
	
	if(fontSize <= MAX_FONT_SIZE){
		fontSize = parseInt(fontSize) + parseInt(FONT_SIZE);
		$(".srt").css("font-size", fontSize + "px");
	}
	
	$.setCfs(fontSize);
	$("#cfs").text("자막크기 : " + $.getCfs());
}

function minusFontSize(){
	
	var fontSize = $.getCfs();
	
	if(MIN_FONT_SIZE <= fontSize){
		fontSize = parseInt(fontSize) - parseInt(FONT_SIZE);
		$(".srt").css("font-size", fontSize + "px");
	}
	
	$.setCfs(fontSize);
	$("#cfs").text("자막크기 : " + $.getCfs());
}

function plusSubTop(){
	var subTop = $.getCst();
	subTop = parseInt(subTop) + parseInt(SUB_TOP_SIZE);
	$(".srt").css("margin-top", subTop + "px");
	
	$.setCst(subTop);
	if(0 < $.getCst()){
		$("#cst").text("자막위치 : +" + $.getCst());
	}else{
		$("#cst").text("자막위치 : " + $.getCst());
	}
	
}

function minusSubTop(){
	var subTop = $.getCst();
	subTop = parseInt(subTop) - parseInt(SUB_TOP_SIZE);
	$(".srt").css("margin-top", subTop + "px");
	
	$.setCst(subTop);
	if(0 < $.getCst()){
		$("#cst").text("자막위치 : +" + $.getCst());
	}else{
		$("#cst").text("자막위치 : " + $.getCst());
	}
}

function plusSubSync(){
	subSync = subSync + SUB_SYNC_SIZE;
	
	css = css + SUB_SYNC_SIZE;
	if(0 < css){
		$("#css").text("자막싱크 : +" + css + "초");
	}else{
		$("#css").text("자막싱크 : " + css + "초");
	}
	
}

function minusSubSync(){
	subSync = subSync - SUB_SYNC_SIZE;
	
	css = css - SUB_SYNC_SIZE;
	if(0 < css){
		$("#css").text("자막싱크 : +" + css + "초");
	}else{
		$("#css").text("자막싱크 : " + css + "초");
	}
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
}

function forward(){
	var v = $("#video video")[0];
	var s = v.currentTime + SEEK_TIME;
	
	if(v.duration < s || v.duration == s){
		s = v.duration;
	}
	
	v.currentTime = s;
	
	cms = cms + SEEK_TIME;
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
	
	if($.getCst() == undefined){
		var playerHeight = $("#player").css("height");
		$.setCst(( parseInt(playerHeight) / 100 ) * 80);
	}
	
	if($.getCfs() == undefined){
		$.setCfs(16);
	}
	
	$(".srt").css("marginTop", $.getCst() + "px");
	$(".srt").css("fontSize", $.getCfs() + "px");
	
}

function videoControllOnOff(){
	$("#videoControll").toggle();
}
