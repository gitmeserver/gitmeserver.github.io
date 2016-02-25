/**
 * 정보들을 저장할 객체 
 */
// 채널 목록 
var channels;

// 채널 파일 목록 
var channelFiles;

// 콘텐츠 목록 
var contents;

// 현재 채널 아이디 
var channelId = "all";

// 검색 단어 
var searchWord;

// 현재 선택되어진 콘텐츠 
var selectedContents;

// 로드된 에피소드 목록 
var episodeMap;

// 콘텐츠의 에피소드 목록 
var episodeList;

// 현재 선택되어진 에피소드 
var selectedEpisode;

/**
 * UI를 구성하는 스크립트 
 */
$(document).ready(function(){
	
	// 채널 정보 초기화 
	channels = [];
	
	// 채널 파일 목록 
	channelFiles = [];
	
	// 콘텐츠 정보 초기화 
	contents = [];
	
	// 콘텐츠의 에피소드 정보 초기화 
	episodeMap = [];
	
	onInit();
	
});

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
			
			var channelFileList = $(data).find("channelFile");
			for(var i=0; i<channelFileList.length; i++){
				var channelFileName = $(channelFileList[i]).text();
				channelFiles.push(channelFileName);
			}

			// 상단 영역 삽입 
			$("body").append(topArea());
			
			// 홈페이지명 설정 
			$("#siteName").text(SITENAME);
			
			// 콘텐츠 영역 생성전에 기본 레이아웃을 구성한다.
			beforeOnCreateLayout();
			
		}
		, error: function(xhr, status, error) {
			alert(error); 
		}
	});
}


/**
 * 콘텐츠 정보를 다운받는다.
 */
function requestChannels(channelFileNo){
	
	var channelFileName = channelFiles[channelFileNo];
	
	if(channelFileName == undefined || channelFileName == "" || channelFileName == null){
		$("#spinner").remove();
		onCreateIndex();
		
		return;
	}
	
	var url = CHANNELS_PATH_URL.replace("{channel_file_name}", channelFileName);

	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: url
		, success: function(data) {

			data = data.replace(/&/gi, "&amp;");
			var contentsList = $($.parseXML(data)).find("contents");
			
			for(var i=0; i<contentsList.length; i++){
				var channelId = $(contentsList[i]).find("channelId").text();
				var title = $(contentsList[i]).find("title").text();
				var thumbnail = $(contentsList[i]).find("thumbnail").text();
				var description = $(contentsList[i]).find("description").text();
				var episodeFiles = $(contentsList[i]).find("episodeFile");
				
				var eFiles = [];
				for(var j=0; j<episodeFiles.length; j++){
					eFiles.push($(episodeFiles[j]).text());
				}
				
				var c = new Contents(channelId, title, thumbnail, description, eFiles);
				contents.push(c);
			}
			
			channelFileNo = channelFileNo + 1;
			requestChannels(channelFileNo);
			
		}
		, error: function(xhr, status, error) {
			
		}
	});
	
}

function requestEpisodeList(episodeFileNo){
	
	var eFiles = selectedContents.getEpisodeFiles();
	var eFile = eFiles[episodeFileNo];

	// 모든 파일을 로드했으면 에피소드 목록 화면을 출력한다. 
	if(eFiles.length == episodeFileNo){
		onCreateContents();
		return;
	}
	
	// 이미 데이터가 존재하면 다음 에피소드 파일을 로드한다. 
	if(episodeMap[eFile] != undefined){
		episodeFileNo = episodeFileNo + 1;
		requestEpisodeList(episodeFileNo);
		return;
	}

	var url = EPISODE_FILE_URL.replace("{episode_file_path}", eFile);
	
	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: url
		, success: function(data){
			// '&' <-- 오류... '&' -> '&amp;'로 모두 치환
			data = data.replace(/&/gi, "&amp;");
			data = $(data).find("episode");
			var size = data.length;

			var episode = [];
			
			for(var i=0; i<size; i++){
				var episodeTitle = $(data[i]).find("episodeTitle").text();
				var episodeUrl = $(data[i]).find("episodeUrl").text();
				
				var epi = new Episode(episodeTitle, episodeUrl);
				episode.push(epi);
			}
			
			episodeMap[eFile] = episode;
			
			episodeFileNo = episodeFileNo + 1;
			
			if(episodeFileNo == eFiles.length){
				onCreateContents();
				return;
			}else{
				requestEpisodeList(episodeFileNo);
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
	}
	
});  