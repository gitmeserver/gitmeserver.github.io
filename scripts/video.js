/**
 * 비디오 관련 스크립트 
 */

var totalDeck = 10;
var prefixDeck = "deck";
var totalWatchAfter = 10;
var prefixWatchAfter = "watchafter";

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
	
	var key = $.deckKey(selectedContents.getChannelId(), selectedContents.getContentsId());
	
	var deck = new Deck(selectedContents, selectedEpisode, currentTime);
	var json = $.deckToJson(deck);
	
	if(document.cookie.split(";").length < totalDeck){
		if($.cookie(key) != undefined){
			$.removeCookie(key);
		}
		$.cookie(key, json, { expires: d });
		$.modal("저장되었습니다.");
	}else{
		$.modal(totalDeck + "개이하만 저장가능합니다.");
	}
	
}

function previous(){
	var v = $("#video video")[0];
	var src = v.src;
	v.currentTime = $.cookie(src);
}