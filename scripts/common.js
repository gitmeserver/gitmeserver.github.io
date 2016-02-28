/**
 * 정보들을 저장할 객체 
 */
// 채널 목록 
var channels;

// 채널 파일 목록 
var contentsFiles;

// 현재 채널 아이디 
var channelId = "all";

// 검색 단어 
var searchWord;

// 추천 콘텐츠 목록 
var recommendedList;

//콘텐츠 목록 
var contentsList;

// 로딩된 에피소드 목록, key : contentsId, return episodeList  
var episodeMap;

// 콘텐츠의 에피소드 목록 
var episodeList;

//현재 선택되어진 콘텐츠 
var selectedContents;

// 현재 선택되어진 에피소드 
var selectedEpisode;

/**
 * UI를 구성하는 스크립트 
 */
$(document).ready(function(){
	
	// 채널 정보 초기화 
	channels = [];
	
	// 채널 파일 목록 
	contentsFiles = [];

	// 추천 콘텐츠 목록 
	recommendedList = [];
	
	// 콘텐츠 정보 초기화 
	contentsList = [];
	
	// 콘텐츠의 에피소드 정보 초기화 
	episodeMap = [];
	
	// 감상중인 에피소드 정보 초기화 
	deckList = [];
	
	onInit();
	
});

function initSelected(){
	selectedContents = undefined;
	selectedEpisode = undefined;
}

function onInit(){
	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: CHANNELS_URL
		, success: function(data) {
			
			data = $.parseXML(data);
			
			var channelList = $(data).find("channel");
			for(var i=0; i<channelList.length; i++){
				var channelId = $(channelList[i]).attr("channelId");
				var channelName = $(channelList[i]).attr("channelName");
				var channel = new Channel(channelId, channelName);
				channels.push(channel);
			}
			
			var contentsFileList = $(data).find("contentsFile");
			for(var i=0; i<contentsFileList.length; i++){
				var contentsFileName = $(contentsFileList[i]).text();
				contentsFiles.push(contentsFileName);
			}

			// 상단 영역 삽입 
			$("body").append(topArea());
			
			// 홈페이지명 설정 
			$("#siteName").text(SITENAME);
			
			// 콘텐츠 영역 생성전에 기본 레이아웃을 구성한다.
			beforeOnCreateLayout();
			
		}
		, error: function(xhr, status, error) {
			console.log("error");
		}
		, ajaxError: function(xhr, status, error) {
			console.log("ajaxError");
		}
	});
}


/**
 * 콘텐츠 정보를 다운받는다.
 */
function requestContents(contentsFileNo){
	
	$("#contentsRequestMessage").text(contentsRequestMessage + " (" + (contentsFileNo + 1) + "/" + contentsFiles.length + ")");
	
	var contentsFileName = contentsFiles[contentsFileNo];
	
	if(contentsFileName == undefined || contentsFileName == "" || contentsFileName == null){
		$("#spinner").remove();
		onCreateMain();
		return;
	}
	
	var url = CONTENTS_URL.replace("{contents_file_path}", contentsFileName);

	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: url
		, success: function(data) {

			data = data.replace(/&/gi, "&amp;");
			var cList = $($.parseXML(data)).find("contents");
			
			for(var i=0; i<cList.length; i++){
				var channelId = $(cList[i]).attr("channelId");
				var contentsId = $(cList[i]).attr("contentsId");
				var recommended = $(cList[i]).attr("recommended");
				var title = $(cList[i]).find("title").text();
				var thumbnail = $(cList[i]).find("thumbnail").text();
				var description = $(cList[i]).find("description").text();
				var episodeFiles = $(cList[i]).find("episodeFile");
				
				var eFiles = [];
				for(var j=0; j<episodeFiles.length; j++){
					eFiles.push($(episodeFiles[j]).text());
				}
				
				var year = $(cList[i]).find("year").text();
		        var directors = $(cList[i]).find("directors").text();
		        var actors = $(cList[i]).find("actors").text();
		        var runningTime = $(cList[i]).find("runningTime").text();
		        var subtitle = $(cList[i]).find("subtitle").text();
		        var audioLang = $(cList[i]).find("audioLang").text();
		        var genre = $(cList[i]).find("genre").text();
		        var nation = $(cList[i]).find("nation").text();
		        
				var c = new Contents(
						channelId, 
						contentsId, 
						recommended, 
						title, 
						thumbnail, 
						description, 
						eFiles, 
						year, 
						directors, 
						actors, 
						runningTime, 
						subtitle, 
						audioLang, 
						genre, 
						nation
					);
				contentsList.push(c);
				
				if(recommended){
					recommendedList.push(c);
				}
				
			}
			
			contentsFileNo = contentsFileNo + 1;
			requestContents(contentsFileNo);
			
		}
		, error: function(xhr, status, error) {
			
		}
	});
	
}

function requestEpisode(episodeFileNo, page){
	
	var eFiles = selectedContents.getEpisodeFiles();
	var eFile = eFiles[episodeFileNo];

	$("#episodeRequestMessage").text(episodeRequestMessage + " (" + (episodeFileNo + 1) + "/" + eFiles.length + ")");
	
	// 모든 파일을 로드했으면 에피소드 목록 화면을 출력한다. 
	if(eFiles.length == episodeFileNo){
		onCreateContents(page);
		return;
	}
	
	// 이미 데이터가 존재하면 다음 에피소드 파일을 로드한다. 
	if(episodeMap[selectedContents.getContentsId] != undefined){
		episodeFileNo = episodeFileNo + 1;
		requestEpisode(episodeFileNo, page);
		return;
	}

	var url = EPISODE_URL.replace("{episode_file_path}", eFile);
	
	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: url
		, success: function(data){
			// '&' <-- 오류... '&' -> '&amp;'로 모두 치환
			data = data.replace(/&/gi, "&amp;");
			data = $(data).find("episode");
			var size = data.length;

			episodeMap[selectedContents.getContentsId()] = [];
			
			for(var i=0; i<size; i++){
				var episodeTitle = $(data[i]).find("episodeTitle").text();
				var episodeUrl = $(data[i]).find("episodeUrl").text();
				
				var epi = new Episode(episodeTitle, episodeUrl);
				episodeMap[selectedContents.getContentsId()].push(epi);
			}
			
			episodeFileNo = episodeFileNo + 1;
			
			if(episodeFileNo == eFiles.length){
				onCreateContents(page);
				return;
			}else{
				requestEpisode(episodeFileNo, page);
			}
		}
		, error: function(xhr, status, error) {
			alert(error);
		}
	});
}

/**
 * jQuery 확장 메서드 
 */
$.extend({
	
	// URL에서 매개변수 추출  
	getUrlVars : function(){
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	
	// URL에서 매개변수 추출  
	getUrlVar: function(name){
		return $.getUrlVars()[name];
	},
	
	// 문자열의 길이가 limit을 넘는다면 자른후 '...'으로 치환한다.
	cutStr : function(str, limit){  
	   var tmpStr = str;  
	   var byte_count = 0;  
	   var len = str.length;  
	   var dot = "";  
	   
	   for(i=0; i<len; i++){  
	      byte_count += $.chrByte(str.charAt(i));   
	      if(byte_count == limit-1){  
	         if($.chrByte(str.charAt(i+1)) == 2){  
	            tmpStr = str.substring(0,i+1);  
	            dot = "...";  
	         } else {  
	            if(i+2 != len) dot = "...";  
	            tmpStr = str.substring(0,i+2);  
	         }  
	         break;  
	      } else if(byte_count == limit){  
	         if(i+1 != len) dot = "...";  
	         tmpStr = str.substring(0,i+1);  
	         break;  
	      }  
	   }  
	   return tmpStr+dot;  
	},
	
	// 문자열의 길이를 byte로 반
	chrByte : function(chr){
		if(escape(chr).length > 4)  
			return 2;  
		else  
			return 1;
	},
	
	modal : function(message){
		$("body").append("<div class='modal fade bs-example-modal-sm' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel' aria-hidden='true'><div class='modal-dialog modal-sm'><div class='modal-content'>" + message + "</div></div></div>");
		$(".modal").on('hidden.bs.modal', function (e) {
			$(".modal").detach();
		});
		$(".modal").click(function(){
			$(".modal").detach();
		});
		$(".modal").modal();
	},
	
	deckToJson : function(deck){
		return $.toJSON(deck);
	},
	
	jsonToDeck : function(json){
		
		var d = $.evalJSON(json);
		
		// Contents
		this.channelId = d.contents.channelId;
		this.contentsId = d.contents.contentsId;
		this.recommended = d.contents.recommended;
        this.title = d.contents.title;
        this.thumbnail = d.contents.thumbnail;
        this.description = d.contents.description;
        this.episodeFiles = d.contents.episodeFiles;
        this.year = d.contents.year;
        this.directors = d.contents.directors;
        this.actors = d.contents.actors;
        this.runningTime = d.contents.runningTime;
        this.subtitle = d.contents.subtitle;
        this.audioLang = d.contents.audioLang;
        this.genre = d.contents.genre;
        this.nation = d.contents.nation;
        
        var contents = new Contents(
        		this.channelId, 
        		this.contentsId, 
        		this.recommended, 
        		this.title, 
        		this.thumbnail, 
        		this.description, 
        		this.episodeFiles,
        		this.year,
        		this.directors,
        		this.actors,
        		this.runningTime,
        		this.subtitle,
        		this.audioLang,
        		this.genre,
        		this.nation
        );
        
        // Episode
        this.episodeTitle = d.episode.episodeTitle;
		this.episodeUrl = d.episode.episodeUrl;
		
		var episode = new Episode(this.episodeTitle, this.episodeUrl);
		
		// currentTime
		this.currentTime = d.currentTime;
		
		var deck = new Deck(contents, episode, this.currentTime);
		
		return deck;
		
	},
	
	deckKey : function(channelId, contentsId){
		return prefixDeck + "_" + channelId + "_" + contentsId;
	},
	
	addWatchAfter : function(contentsId){
		var watchAfterList = $.cookie("watchAfterList");
		if(watchAfterList == undefined){
			watchAfterList = contentsId;
		}else{
			
			var list = watchAfterList.split(",");
			for(var i=0; i<list.length; i++){
				if(list[i].match(contentsId)){
					$.modal("이미 나중에보기에 등록되었습니다.");
					return;
				}
			}
			watchAfterList = watchAfterList + "," + contentsId;
		}
		$.cookie("watchAfterList", watchAfterList);
	},
	
	removeWatchAfter : function(contentsId){
		var watchAfterList = $.cookie("watchAfterList");
		
		console.log(watchAfterList.indexOf(","));
		
//		if(watchAfterList.indexOf(",")){
//			$.removeCookie("watchAfterList");
//		}
		
		// 맨 앞의 contentsId 제거  
		watchAfterList = watchAfterList.replace(contentsId + ",", "");
		
		// 중간 부분 contentsId 제거 
		watchAfterList = watchAfterList.replace("," + contentsId + ",", "");
		
		// 맨 뒤의 contentsId 제거 
		watchAfterList = watchAfterList.replace("," + contentsId, "");
		
		console.log(watchAfterList);
		$.cookie("watchAfterList", watchAfterList);
	}
	
});  