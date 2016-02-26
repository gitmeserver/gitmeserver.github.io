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
	
	var key = selectedContents.getChannelId() + "_" + selectedContents.getContentsId();
	
	var deck = new Deck(selectedContents, selectedEpisode, currentTime);
	var json = $.deckToJson(deck);
	
	if(document.cookie.split(";").length < 20){
		if($.cookie(key) != undefined){
			$.removeCookie(key);
		}
		$.cookie(key, json, { expires: d });
		
		for(var i=0; i<deckList.length; i++){
			var dContents = deckList[i].getContents();
			var dKey = dContents.getChannelId() + "_" + dContents.getContentsId();
			var deck = new Deck(selectedContents, selectedEpisode, currentTime);
			if(key.match(dKey)){
				console.log("match");
				deckList.splice(i+1, 0, deck);
			}else{
				console.log("no match");
				deckList.push(deck);
			}
		}
		
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