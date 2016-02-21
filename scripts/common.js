var channels;
var contents;

/**
 * UI를 구성하는 스크립트 
 */
$(document).ready(function(){
	onInit();
});

function onInit(){
	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: CHANNELS_URL
		, success: function(data) {
			
			// 채널 정보 초기화 
			channels = [];
			
			// 콘텐츠 정보 초기화 
			contents = [];
			
			var channelList = $($.parseXML(data)).find("channel");
			for(var i=0; i<channelList.length; i++){
				var channelId = $(channelList[i]).attr("channelId");
				var channelName = $(channelList[i]).attr("channelName");
				var channel = new Channel(channelId, channelName);
				channels.push(channel);
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
	var channelArea = $.parseHTML("<div class='col-xs-6 col-sm-3 sidebar-offcanvas' id='sidebar'><div class='list-group'></div></div>");
	
	$("body").append(container);
	
	// 콘텐츠 영역 레이아웃 생성
	$("#offCanvas").append(contentsArea);
	// 채널 목록 레이아웃 생성 
	$("#offCanvas").append(channelArea);
	
	// 채널 목록 생성 
	createChannel();

	// 콘텐츠 생성 
	requestContents(1);
	
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
function requestContents(channelFileNo){
	
	var url = CHANNELS_PATH_URL.replace("{channel_file_no}", channelFileNo);

	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: url
		, success: function(data) {

			data = data.replace(/&/gi, "&amp;");
			var contentsList = $($.parseXML(data)).find("contents");
			
			for(var i=0; i<contentsList.length; i++){
				var channelId = $(contentsList[i]).find("channelId").text();
				var contentsId = $(contentsList[i]).find("contentsId").text();
				var directoryPath = $(contentsList[i]).find("directoryPath").text();
				var title = $(contentsList[i]).find("title").text();
				var thumbnail = $(contentsList[i]).find("thumbnail").text();
				
				var c = new Contents(channelId, contentsId, directoryPath, title, thumbnail);
				contents.push(c);
			}
			
			channelFileNo = channelFileNo + 1;
			requestContents(channelFileNo);
			
		}
		, error: function(xhr, status, error) {
			onCreateIndexContents("all");
		}
	});
	
}

$.extend({
	getUrlVars: function(){
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
	getUrlVar: function(name){
		return $.getUrlVars()[name];
	}
});

/**
 * 상단영역 생성 
 */
function topArea(){
	
	var nav = $.parseHTML("<nav class='navbar navbar-fixed-top navbar-inverse'></nav>");
		var container = $.parseHTML("<div class='container'></div>");
			var navbarHeader = $.parseHTML("<div class='navbar-header'></div>");
	
				var button = $.parseHTML("<button type='button' class='navbar-toggle collapsed btn btn-primary btn-xs' data-toggle='offcanvas' aria-expanded='false' aria-controls='navbar'></button>");
					var srOnly = $.parseHTML("<span class='sr-only'>Toggle navigation</span>");
					var iconBar = $.parseHTML("<span class='icon-bar'></span>");
	
				var navbarBrand = $.parseHTML("<a id='siteName' class='navbar-brand' href='index.html'>홈페이지 이름을 정해주세요!</a>");
	
	$(button).click(function(){
	    $('.row-offcanvas').toggleClass('active')
	});
	$(button).append(srOnly);
	$(button).append($(iconBar).clone()).append($(iconBar).clone()).append($(iconBar).clone());
	
	$(navbarHeader).append(navbarBrand);
	$(navbarHeader).append(button);
				
	$(container).append(navbarHeader);
	
	$(nav).append(container);
	
	return nav;
				
}

function cutStr(str, limit){  
   var tmpStr = str;  
   var byte_count = 0;  
   var len = str.length;  
   var dot = "";  
   
   for(i=0; i<len; i++){  
      byte_count += chr_byte(str.charAt(i));   
      if(byte_count == limit-1){  
         if(chr_byte(str.charAt(i+1)) == 2){  
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
}  
  
function chr_byte(chr){  
   if(escape(chr).length > 4)  
      return 2;  
   else  
      return 1;  
}
