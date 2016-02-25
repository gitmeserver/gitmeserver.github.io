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
 * 콘텐츠 영역 생성전에 기본 레이아웃을 구성한다. 
 */
function beforeOnCreateLayout(){
	
	var container = $.parseHTML("<div class='container'><div id='offCanvas' class='row row-offcanvas row-offcanvas-right'></div></div>");
	var contentsArea = $.parseHTML("<div id='contentsArea' class='col-xs-12 col-sm-9'></div>");
	var channelArea = $.parseHTML("<div class='col-xs-6 col-sm-3 sidebar-offcanvas' id='sidebar'><div id='searchArea' class='input-group btn'></div><div class='list-group'></div></div>");
	
	$("body").append(container);
	
	// 콘텐츠 영역 레이아웃 생성
	$("#offCanvas").append(contentsArea);
	// 채널 목록 레이아웃 생성 
	$("#offCanvas").append(channelArea);
	
//	$("#contentsArea").append("<div style='text-align:center; margin-top:100px;'><img src='http://localhost:8080/gitmeserver/img/ajax-loader.gif' /><span style='margin-top:10px;display:block;'>미디어 정보를 로딩중입니다...</span></div>");
//	$("#contentsArea").append("<div style='text-align:center; margin-top:100px;'><img src='http://gitmeserver.github.com/img/ajax-loader.gif' /><span style='margin-top:10px;display:block;'>미디어 정보를 로딩중입니다...</span></div>");
	
	$("#contentsArea").append("<div style='text-align:center; margin-top:100px;'><div class='windows8'><div class='wBall' id='wBall_1'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_2'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_3'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_4'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_5'><div class='wInnerBall'></div></div></div><span style='margin-top:20px;display:block;'>미디어 정보를 로딩중입니다...</span></div>");
	
	// 검색영역 생성 
	searchArea();
	
	// 채널 목록 생성 
	createChannel();
	
	// 콘텐츠 생성 
//	requestChannels(0);
	
}

/**
 * 검색 영영 생성 
 */
function searchArea(){
	var input = $("#searchArea");
	$(input).attr("style", "padding:0px !important; padding-bottom:6px !important");
	var searchInput = $.parseHTML("<input id='searchWord' type='text' class='form-control' placeholder='Search for...' />");
	$(searchInput).keyup(function(){
		searchWord = $(this).val();
		onCreateIndex();
	});
	var searchButton = $.parseHTML("<button class='btn btn-default' type='button'>검색</button>");
	$(searchButton).click(function(){
		searchWord = $("#searchWord").val();
		onCreateIndex();
	});
	
	$(input).append($.parseHTML("<span id='searchButton' class='input-group-btn'></span>"));
	$(input).find("#searchButton").append(searchButton);
	$(input).append(searchInput);
	
}

/**
 * 채널 목록을 생성한다. 
 */
function createChannel(){

	var listGroup = $("div.list-group");
	
	var all = new Channel("all", "전체").makeChannel();
	$(all).addClass("active");
	$(listGroup).append(all);
	
	for(var i=0; i<channels.length; i++){
		$(listGroup).append(channels[i].makeChannel());
	}
	
}

/**
 * 콘텐츠 정보를 다운받는다.
 */
function requestChannels(channelFileNo){
	
	var channelFileName = channelFiles[channelFileNo];
	
	if(channelFileName == undefined || channelFileName == "" || channelFileName == null){
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
