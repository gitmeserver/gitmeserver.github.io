var contentsRequestMessage = "콘텐츠 목록을 로딩중입니다...";
var episodeRequestMessage = "에피소드 목록을 로딩중입니다...";

/**
 * TODO 자막 싱크, 구간이동, 자막 폰트 크기 조절 
 */


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
	
	// 데이터 로딩중 스피너
	$("#contentsArea").append("<div id='spinner' style='text-align:center; margin-top:100px;'><div class='windows8'><div class='wBall' id='wBall_1'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_2'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_3'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_4'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_5'><div class='wInnerBall'></div></div></div><span id='contentsRequestMessage' style='margin-top:20px;display:block;'>" + contentsRequestMessage + "</span></div>");
	
	// 검색영역 생성 
	searchArea();
	
	// 채널 목록 생성 
	createChannel();
	
	// 콘텐츠 생성 
	requestContents(0);
	
}

/**
 * 검색 영영 생성 
 */
function searchArea(){
	var input = $("#searchArea");
	$(input).attr("style", "padding:0px !important; padding-bottom:6px !important");
	var searchInput = $.parseHTML("<input id='searchWord' type='text' class='form-control' placeholder='Search for...' />");
	$(searchInput).keyup(function(){
		initSelected();
		searchWord = $(this).val();
		onCreateIndex();
	});
	var searchButton = $.parseHTML("<button class='btn btn-default' type='button'>검색</button>");
	$(searchButton).click(function(){
		initSelected()
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
 * 상단영역 생성 
 */
function topArea(){
	
	var nav = $.parseHTML("<nav class='navbar navbar-fixed-top navbar-inverse'></nav>");
		var container = $.parseHTML("<div class='container'></div>");
			var navbarHeader = $.parseHTML("<div class='navbar-header'></div>");
	
				var button = $.parseHTML("<button type='button' class='navbar-toggle collapsed btn btn-primary btn-xs' data-toggle='offcanvas' aria-expanded='false' aria-controls='navbar'></button>");
					var srOnly = $.parseHTML("<span class='sr-only'>Toggle navigation</span>");
					var iconBar = $.parseHTML("<span class='icon-bar'></span>");
	
				var navbarBrand = $.parseHTML("<a id='siteName' class='navbar-brand' href='#'>홈페이지 이름을 정해주세요!</a>");
					
	$(navbarBrand).click(main);
	$(button).click(function(){
	    $('.row-offcanvas').toggleClass('active');
	});
	$(button).append(srOnly);
	$(button).append($(iconBar).clone()).append($(iconBar).clone()).append($(iconBar).clone());
	
	$(navbarHeader).append(navbarBrand);
	$(navbarHeader).append(button);
				
	$(container).append(navbarHeader);
	
	$(nav).append(container);
	
	return nav;
				
}

function main(){
	initSelected();
	channelId = "all";
	searchWord = "";
	$("#searchWord").val("");
	$(".list-group-item").removeClass("active");
	$("#all").addClass("active");
	onCreateMain();
}

/**
 * index 화면 Contents 구성
 */
function onCreateMain(){
	
	$("#contentsArea").empty();
	
	$("#contentsArea").append("<h3 style='border-bottom:2px solid #fff; margin-top:0px !important;'>추천 콘텐츠<span class='glyphicon glyphicon-thumbs-up btn-lg' aria-hidden='true'></span></h3>");
	
	var recommendedArea = $.parseHTML("<div id='recommended' class='row'></div>");
	$("#contentsArea").append(recommendedArea);
	onRecommended();
	
	$("#contentsArea").append("<h3 style='border-bottom:2px solid #fff;'>감상중<span class='glyphicon glyphicon-facetime-video btn-lg' aria-hidden='true'></span></h3>");
	var deckArea = $.parseHTML("<div id='deck' class='row'></div>");
	$("#contentsArea").append(deckArea);
	onDeck();

	$("#contentsArea").append("<h3 style='border-bottom:2px solid #fff;'>나중에 보기<span class='glyphicon glyphicon-check btn-lg' aria-hidden='true'></span></h3>");
	var watchAfterArea = $.parseHTML("<div id='watchAfter' class='row'></div>");
	$("#contentsArea").append(watchAfterArea);
	onWatchAfter();
	
	$("#contentsArea").append($.parseHTML("<hr /><footer><p>&copy; Created by DevY</p></footer>"));
	
}

function onRecommended(){
	
	$("#recommended").empty();
	
	for(var i=0; i<recommendedList.length; i++){
		$("#recommended").append(recommendedList[i].makeThumbnail());
	}
	
	if(recommendedList.length == 0){
		$("#recommended").append("<p style='text-align:center; padding:30px 0px;'>추천 콘텐츠가 없습니다.</p>");
	}
}

function onDeck(){
	
	$("#deck").empty();
	
	var deckList = $.cookie("deckList");
	
	if(deckList == undefined){
		$("#deck").append("<p style='text-align:center; padding:30px 0px;'>감상중인 콘텐츠가 없습니다.</p>");
		return;
	}
	
	for(var i=0; i<contentsList.length; i++){
		var key = contentsList[i].getChannelId() + "_" + contentsList[i].getContentsId() + "_";
		if(-1 < deckList.indexOf(key)){
			$("#deck").append(contentsList[i].makeDeck());
		}
	}

}

function onWatchAfter(){
	
	$("#watchAfter").empty();
	
	var watchAfterCookie = $.cookie("watchAfterList");
	
	if($.cookie("watchAfterList") != undefined){
		
		var watchAfterList = $.cookie("watchAfterList").split(",");
		if(0 < watchAfterList.length){
			for(var i=0; i<contentsList.length; i++){
				for(var j=0; j<watchAfterList.length; j++){
					if(contentsList[i].getContentsId() == watchAfterList[j]){
						$("#watchAfter").append(contentsList[i].makeWatchAfter());
					}
				}
			}
		}else{
			$("#watchAfter").append("<p style='text-align:center; padding:30px 0px;'>나중에보기에 콘텐츠가 없습니다.</p>");
		}
		
	}else{
		$("#watchAfter").append("<p style='text-align:center; padding:30px 0px;'>나중에보기에 콘텐츠가 없습니다.</p>");
	}
	
	
}

/**
 * index 화면 Contents 구성
 */
function onCreateIndex(){
	
	$("#contentsArea").empty();
	
	$("#contentsArea").append("<div id='searching' style='text-align:right; margin-bottom:10px;'></div>");
	if(searchWord != undefined && searchWord != "" && searchWord != null){
		$("#searching").show();
		$("#searching").text("'" + searchWord + "' 검색중...");
	}else{
		$("#searching").hide();
	}
	
	var contentsListRow = $.parseHTML("<div id='contentsList' class='row'></div>");
	$("#contentsArea").append(contentsListRow);
	
	for(var i=0; i<contentsList.length; i++){
		if(contentsList[i].check(channelId, searchWord)){
			$("#contentsList").append(contentsList[i].makeThumbnail());
		}
	}
	
	if($("#contentsList .cont").size() == 0){
		$("#contentsList").append("<p style='text-align:center; padding:30px 0px;'>검색된 콘텐츠가 없습니다.</p>");
	}
	
	$("#contentsArea").append($.parseHTML("<hr /><footer><p>&copy; Created by DevY</p></footer>"));
}


function requestContentsEpisode(page){
	
	$("#contentsArea").empty();
	
	// 데이터 로딩중 스피너
	$("#contentsArea").append("<div id='spinner' style='text-align:center; margin-top:100px;'><div class='windows8'><div class='wBall' id='wBall_1'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_2'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_3'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_4'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_5'><div class='wInnerBall'></div></div></div><span id='episodeRequestMessage' style='margin-top:20px;display:block;'>" + episodeRequestMessage + "</span></div>");
	
	requestEpisode(0, page);
	
}

function getSavedEpisode(){
	var deck = $.getDeck(selectedContents.getChannelId(), selectedContents.getContentsId());
	
	if(deck != undefined){
		var selectedContentsEpisodeList = episodeMap[selectedContents.getContentsId()];
		for(var i=0; i<selectedContentsEpisodeList.length; i++){
			var episodeTitle = selectedContentsEpisodeList[i].getEpisodeTitle();
			if(-1 < deck.indexOf(selectedContents.getChannelId() + "_" + selectedContents.getContentsId() + "_" + episodeTitle + "_")){
				return selectedContentsEpisodeList[i];
			}
		}
	}
	
	return undefined;
}

function onCreateContents(page){
	
	selectedEpisode = getSavedEpisode();
	
	$("#spinner").remove();
	
	$("#contentsArea").append("<div id='detail'></div>");
	
	if(-1 < page.indexOf("video")){
		video();
	}else{
		details();
	}
	
	$("#contentsArea").append($.parseHTML("<div class='col-xs-12 clear-both-padding'><hr /></div>"));
	
	$("#contentsArea").append($.parseHTML("<div class='col-xs-12 clear-both-padding'><div id='list' title='0' class='list-group'></div><nav><ul class='pager'></ul></nav></div>"));
	
	list(1);
	pager(1);
	
	$("#contentsArea").append($.parseHTML("<div class='col-xs-12 clear-both-padding'><hr /><footer><p>&copy; Created by DevY</p></footer></div>"));
}

function details(){
	
	selectedEpisode = undefined;
	
	var moreCount = 0;
	
	var thumbUrl = selectedContents.getThumbnail();
	var title = selectedContents.getTitle();
	var recommended = selectedContents.isRecommended();
	var year = selectedContents.getYear();
	var directors = selectedContents.getDirectors();
	var actors = selectedContents.getActors();
	var runningTime = selectedContents.getRunningTime();
	var subtitle = selectedContents.getSubtitle();
	var genre = selectedContents.getGenre();
	var audioLang = selectedContents.getAudioLang();
	var description = selectedContents.getDescription();
	var nation = selectedContents.getNation();
	
	var thumb = $.parseHTML("<div class='col-xs-5 col-md-3'></div>");
	var thumbImg = $.parseHTML("<img id='thumbnail' class='img-responsive img-rounded' />");
	$(thumbImg).attr("src", thumbUrl);
	$(thumb).append(thumbImg);
	
	var text = $.parseHTML("<div class='col-xs-7 col-md-9' style='text-align:right;'></div>");
	var h1 = $.parseHTML("<h3 style='margin-top:10px !important;'></h3>");
	$(h1).text(title);

	$(text).append(h1);

	var watchAfterBtn = $.parseHTML("<button id='watchAfterBtn' type='button' class='glyphicon glyphicon-check btn btn-default'><span style='padding-left:5px; float:right; margin-top:-2px;'>나중에보기</span></button>");
	$(watchAfterBtn).click(function(){
		$.addWatchAfter(selectedContents.getContentsId());
	});
	$(text).append(watchAfterBtn);
	
	if(runningTime != undefined && 0 < runningTime.length){
		$(text).append("<div style='margin-top:15px;'>" + runningTime + "</div>");
	}

	if(genre != undefined && 0 < genre.length){
		$(text).append("<div>" + genre + "</div>");
	}
	
	if(year != undefined && 0 < year.length){
		$(text).append("<div>" + year + "</div>");
	}
	
	$("#detail").append(thumb);
	$("#detail").append(text);
	
	$("#contentsArea").append($.parseHTML("<div id='info_line' class='col-xs-12 clear-both-padding'><hr /></div>"));
	
	$("#contentsArea").append("<div id='info' class='col-xs-12'><button title='more' class='btn btn-default' style='display:block; text-align:center; margin:0px auto; margin-bottom:10px;'>더보기</button></div>");
	
	$("#info button").click(function(){
		$("#info .more_info").toggle();
		
		if($(this).attr("title").match("more")){
			$(this).text("숨기기");
			$(this).attr("title", "hide");
		}else{
			$(this).text("더보기");
			$(this).attr("title", "more");
		}
		
	});
	
	if(directors != undefined && 0 < directors.length){
		$("#info").append("<div>연출 - " + directors + "</div>");
		moreCount = moreCount + 1;
	}
	
	if(actors != undefined && 0 < actors.length){
		$("#info").append("<div style='padding-bottom:30px;'>출연 - " + actors + "</div>");
		moreCount = moreCount + 1;
	}
	
	if(nation != undefined && 0 < nation.length){
		$("#info").append("<div class='more_info' style='padding-bottom:10px; display:none;'>국가 - " + nation + "</div>");
		moreCount = moreCount + 1;
	}
	
	if(subtitle != undefined && 0 < subtitle.length){
		$("#info").append("<div class='more_info' style='padding-bottom:10px; display:none;'>자막 - " + subtitle + "</div>");
		moreCount = moreCount + 1;
	}
	
	if(audioLang != undefined && 0 < audioLang.length){
		$("#info").append("<div class='more_info' style='padding-bottom:10px; display:none;'>오디오언어 - " + audioLang + "</div>");
		moreCount = moreCount + 1;
	}
	
	if(description != undefined && 0 < description.length){
		$("#info").append("<div class='more_info' style='display:none;'>" + description + "</div>");
		moreCount = moreCount + 1;
	}
	
	if(moreCount == 0){
		$("#info").append("<div class='more_info' style='display:none; text-align:center; padding:30px 0px;'>추가된 정보가 없습니다.</div>");
	}
	
}

function video(){
	
	cfs = ( parseInt(playerHeight) / 50 ) + 10;
	
	$("#detail").empty();
	$("#info").detach();
	$("#info_line").detach();

	$("#detail").append("<div id='video'></div>");
	$("#video").append("<div id='subject'></div>");
	$("#subject").append("<h3></h3><span></span>");
	$("#video").append("<div id='embed' class='embed-responsive embed-responsive-16by9'></div>");
	$("#embed").append("<div id='videoControll' style='display:none;'><div>");
	$("#embed").append("<video id='player' controls='true' autoplay='true' class='embed-responsive-item'></video>");
	$("#embed").append("<div class='srt' data-video='player'></div>");
	$("#detail").append("<div id='controll'><div id='controllInfo'></div><div class='float-right'></div><span id='cButton'></span></div></div>");
	
	$("#videoControll").append("<button type='button' id='fullscreen' class='glyphicon glyphicon-resize-full btn btn-default'></button>");
	$("#videoControll").append("<button type='button' id='fullscreenOff' style='display:none;' class='glyphicon glyphicon-resize-small btn btn-default'></button>");
	$("#videoControll").append("<button id='save' type='button' class='glyphicon glyphicon-floppy-disk btn btn-default'></button>");
	$("#videoControll").append("<button id='previous' type='button' style='display:none;' class='glyphicon glyphicon-facetime-video btn btn-default'></button>");
	
	// 영상위치 이동  
	$("#controll #cButton").append("<button id='moveSeek' type='button' class='glyphicon glyphicon-forward btn btn-default active'></button>");
	
	var sub = selectedEpisode.getEpisodeSubtitle();
	if(sub != undefined){
		$(".srt").attr("data-srt", sub);
		subtitleSrt();
		
		subtitleLocationChange();
		
		// 자막 글씨 크기
		$("#controll #cButton").append("<button id='fontSize' type='button' class='glyphicon glyphicon-text-size btn btn-default'></button>");
		$("#controllInfo").append("<span id='cfs'>자막크기 : " + cfs + "</span>");
		// 자막위치 
		$("#controll #cButton").append("<button id='subTop' type='button' class='glyphicon glyphicon-sort-by-alphabet btn btn-default'></button>");
		$("#controllInfo").append("<span id='cst'>자막위치 : " + cst + "</span>");
		// 자막싱크 
		$("#controll #cButton").append("<button id='subSync' type='button' class='glyphicon glyphicon-text-width btn btn-default'></button>");
		$("#controllInfo").append("<span id='css'>자막싱크 : " + css + "초</span>");
	}
	
	$("#controll .float-right").append("<button id='vcMinus' type='button' class='glyphicon glyphicon-minus btn btn-default'></button>");
	$("#controll .float-right").append("<button id='vcPlus' type='button' class='glyphicon glyphicon-plus btn btn-default'></button>");
	
	var title = $("#video #subject h3");
	var epTitle = $("#video #subject span");
	var videoSrc = $("#video video");
	
	$(title).text(selectedContents.getTitle());
	$(epTitle).text(selectedEpisode.getEpisodeTitle());
	$(videoSrc).attr("src", selectedEpisode.getEpisodeUrl());
	
	$("#backward").click(function(){
		backward();
	});
	
	$("#forward").click(function(){
		forward();
	});
	
	$("#save").click(function(){
		save();
		list($("#list").attr("title"));
	});
	
	$("#previous").click(function(){
		previous();
	});
	
	$("#fullscreen").click(function(){
		fullscreenOn();
	});
	
	$("#fullscreenOff").click(function(){
		fullscreenOff();
	});
	
	$("#controll span > button").click(function(){
		$("#controll span > button").removeClass("active");
		$(this).addClass("active");
	});
	
	$("#video video").click(function(){
		videoControllOnOff();
	});
	
	$("#vcPlus").click(function(){
		clickPlus();
	});
	
	$("#vcMinus").click(function(){
		clickMinus();
	});
	
	// Listen for resize changes
	window.addEventListener("resize", function() {
		subtitleLocationChange();
	}, false);
	
	// Listen for orientation changes      
	window.addEventListener("orientationchange", function() {
	    // Announce the new orientation number
		subtitleLocationChange();
	}, false);
	
	isDeck();
	
	return false;
}

function isDeck(){
	
	var channelId = selectedContents.getChannelId();
	var contentsId = selectedContents.getContentsId();
	var episodeTitle = selectedEpisode.getEpisodeTitle();
	
	var deck = $.getDeck(selectedContents.getChannelId(), selectedContents.getContentsId());
	if(deck != undefined){
		if(-1 < deck.indexOf(channelId + "_" + contentsId + "_" + episodeTitle + "_")){
			$("#previous").show();
		}else{
			$("#previous").hide();	
		}
	}
	
	return false;
}

var itemSize = 5;
var pageSize = 5;

function list(page){
	
	$("#list").attr("title", page);
	
	var savedEpisode = getSavedEpisode();
	var episodeTotalSize = episodeMap[selectedContents.getContentsId()].length;
	
	var end = page * itemSize;
	var start = end - itemSize;
	
	if(episodeTotalSize < end){
		end = episodeTotalSize;
	}
	
	$("#list").empty();
	
	for(var i=start; i<end; i++){
		var listItem = $.parseHTML("<a class='list-group-item' href='#'></a>");
		var episode = episodeMap[selectedContents.getContentsId()][i];
		
		var item = $(listItem).clone();
		$(item).attr("title", episode.getEpisodeTitle());
		$(item).attr("href", episode.getEpisodeUrl());
		$(item).text(episode.getEpisodeTitle());
		
		if(episode.getEpisodeSubtitle() != undefined && 0 < episode.getEpisodeSubtitle().length){
			$(item).attr("episode-subtitle", episode.getEpisodeSubtitle());
		}
		
		// 현재 시청중인 에피소드를 표시 
		if(selectedEpisode != undefined){
			if(selectedEpisode.getEpisodeTitle().match(episode.getEpisodeTitle())){
				$(item).append("<span style='margin-left:5px;' class='glyphicon glyphicon-eye-open'></span>");
			}
		}
		
		// 저장되어 있는 에피소드를 표시 
		if(savedEpisode != undefined){
			if(savedEpisode.getEpisodeTitle().match(episode.getEpisodeTitle())){
				$(item).append("<span style='margin-left:5px;' class='glyphicon glyphicon-floppy-disk'></span>");
			}
		}
		
		// 에피소드를 클릭하면 현재 시청중인 에피소드를 표시하고 해당 동영상을 재생한다.
		$(item).click(function(){
			$("#list .list-group-item .glyphicon-eye-open").detach();
			$(this).append("<span style='margin-left:5px;' class='glyphicon glyphicon-eye-open'></span>");
			selectedEpisode = new Episode($(this).attr("title"), $(this).attr("href"), $(this).attr("episode-subtitle"));
			video();
			return false;
		});
		
		$("#list").append(item);
	}
	
	if($("#list .list-group-item").size() == 0){
		$("#list").append("<p style='text-align:center; padding:30px 0px;'>준비중입니다...</p>");
	}
	
}

function pager(curPage){
	
	$(".pager").empty();
	
	var total = episodeMap[selectedContents.getContentsId()].length;
	
	/**
     * 총 페이지 수 계산
     */

	var totalPage;
	var first;
	var last;
	var prev;
	var next;
	
    if((total % itemSize) == 0){
        totalPage = total / itemSize;
    }else{
        totalPage = (total / itemSize) + 1;
    }

    /**
     * 페이징 넘버에서 시작 넘버 계산
     */
    first = ((    Math.floor((curPage - 1) / itemSize))  * itemSize) + 1;
    /**
     * 페이징 넘버에서 마지막 넘버 계산
     */
    last = first + (pageSize - 1);
    if(totalPage < last){
        last = totalPage;
    }

    /**
     * 이전 페이지 계산
     */
    if(first == 1) {
        prev = 1;
    }else{
        prev = first - 1;
    }

    /**
     * 다음 페이지 계산
     */
    if(last == totalPage){
        next = last;
    }else{
        next = last + 1;
    }
    
	if(first != 1){
		var prevButton = $.parseHTML("<li><a href='#'>&lt;</a></li>");
	    $(prevButton).click(function(){
	    	list(first - 1);
	    	pager(first - 1);
	    	return false;
	    });
	    $(".pager").append(prevButton);
	}
	
	for(var i=first; i<=last; i++){
		var li = $.parseHTML("<li></li>");
		var a = $.parseHTML("<a></a>");
		
		if(i == curPage){
			$(li).addClass("active");
		}
		
		$(a).attr("href", "#");
		$(a).text(i);
		$(a).click(function(){
			list($(this).text());
			$(".pager li").removeClass("active");
			$(this).parent().addClass("active");
			return false;
		});
		$(li).append(a);
		$(".pager").append(li);
	}
	
	if(last < totalPage - 1){
		var nextButton = $.parseHTML("<li><a href='#'>&gt;</a></li>");
		$(nextButton).click(function(){
			list(last + 1);
			pager(last + 1);
			return false;
		});
		$(".pager").append(nextButton);
	}
	
}


