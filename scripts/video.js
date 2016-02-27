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
	
	var key = $.deckKey(selectedContents.getChannelId(), selectedContents.getContentsId());
	
	var deck = new Deck(selectedContents, selectedEpisode, currentTime);
	var json = $.deckToJson(deck);
	
	var dSize = 0;
	var c = document.cookie.split(";");
	
	for(var i=0; i<c.length; i++){
		if(-1 < c[i].indexOf(prefixDeck)){
			dSize = dSize + 1; 
		}
	}
	
	if(dSize < totalDeck){
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
	
	var key = $.deckKey(selectedContents.getChannelId(), selectedContents.getContentsId());
	
	var deck = $.jsonToDeck($.cookie(key));
	
	v.currentTime = deck.currentTime;
}




