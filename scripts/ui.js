var contentsRequestMessage = "콘텐츠 목록을 로딩중입니다...";
var episodeRequestMessage = "에피소드 목록을 로딩중입니다...";

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

function main(){
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
	
	onRecommended();
	
	onDeck();

	watchAfter();
	
	$("#contentsArea").append($.parseHTML("<footer><p>&copy; Created by DevY</p></footer>"));
	
}

function onRecommended(){

	$("#contentsArea").append("<h3 style='border-bottom:2px solid #fff;'>추천하는 콘텐츠<span class='glyphicon glyphicon-thumbs-up btn-lg' aria-hidden='true'></span></h3>");
	
	var recommendedArea = $.parseHTML("<div id='recommended' class='row'></div>");
	$("#contentsArea").append(recommendedArea);
	
	for(var i=0; i<recommendedList.length; i++){
		$("#recommended").append(recommendedList[i].makeThumbnail());
	}
	
	if(recommendedList.length == 0){
		$("#recommended").append("<p style='text-align:center; padding:30px 0px;'>추천하는 콘텐츠가 없습니다.</p>");
	}
}

function onDeck(){
	
	$("#contentsArea").append("<h3 style='border-bottom:2px solid #fff;'>감상중<span class='glyphicon glyphicon-facetime-video btn-lg' aria-hidden='true'></span></h3>");
	
	var deckArea = $.parseHTML("<div id='deck' class='row'></div>");
	$("#contentsArea").append(deckArea);
	
	var deckList = document.cookie.split(";");
	var deckSize = 0;
	
	for(var i=0; i<contentsList.length; i++){
		var key = $.deckKey(contentsList[i].getChannelId(), contentsList[i].getContentsId());
		if($.cookie(key) != undefined){
			deckSize = deckSize + 1;
			var json = $.cookie(key);
			var deck = $.jsonToDeck(json);
			$("#deck").append(deck.getContents().makeThumbnail());
		}
	}

	if(deckSize == 0){
		$("#deck").append("<p style='text-align:center; padding:30px 0px;'>감상중인 콘텐츠가 없습니다.</p>");
	}
	
//	$("#contentsArea").append("<hr />");
}

function watchAfter(){
	
	$("#contentsArea").append("<h3 style='border-bottom:2px solid #fff;'>나중에 보기<span class='glyphicon glyphicon-check btn-lg' aria-hidden='true'></span></h3>");
	
	var watchAfterArea = $.parseHTML("<div id='watchAfter' class='row'></div>");
	$("#contentsArea").append(watchAfterArea);
	
	$("#watchAfter").append("<p style='text-align:center; padding:30px 0px;'>위시리스트에 콘텐츠가 없습니다.</p>");
	
//	$("#contentsArea").append("<hr />");
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
	
	$("#contentsArea").append($.parseHTML("<hr /><footer><p>&copy; Created by DevY</p></footer>"));
}


function requestContentsEpisode(){
	
	$("#contentsArea").empty();
	
	// 데이터 로딩중 스피너
	$("#contentsArea").append("<div id='spinner' style='text-align:center; margin-top:100px;'><div class='windows8'><div class='wBall' id='wBall_1'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_2'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_3'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_4'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_5'><div class='wInnerBall'></div></div></div><span id='episodeRequestMessage' style='margin-top:20px;display:block;'>" + episodeRequestMessage + "</span></div>");
	
	requestEpisode(0);
	
}

function onCreateContents(){
	
	$("#spinner").remove();
	
	$("#contentsArea").append("<div id='detail'></div>");
	
	details();
	
	$("#contentsArea").append($.parseHTML("<div class='col-xs-12 clear-both-padding'><hr /></div>"));
	
	$("#contentsArea").append($.parseHTML("<div class='col-xs-12 clear-both-padding'><div id='list' class='list-group'></div><nav><ul class='pager'></ul></nav></div>"));
	
	list(1);
	pager(1);
	
	$("#contentsArea").append($.parseHTML("<div class='col-xs-12 clear-both-padding'><hr /><footer><p>&copy; Created by DevY</p></footer></div>"));
}

function details(){
	
	var thumbUrl = selectedContents.getThumbnail();
	var title = selectedContents.getTitle();
	
	var thumb = $.parseHTML("<div class='col-xs-5 col-md-3'></div>");
	var thumbImg = $.parseHTML("<img id='thumbnail' class='img-responsive img-rounded' />");
	$(thumbImg).attr("src", thumbUrl);
	$(thumb).append(thumbImg);
	
	var text = $.parseHTML("<div class='col-xs-7 col-md-9'></div>");
	var h1 = $.parseHTML("<h3></h3>");
	$(h1).text(title);
	var p = $.parseHTML("<p></p>");

	$(text).append(h1);
	$(text).append(p);
	
	$("#detail").append(thumb);
	$("#detail").append(text);
	
}

function video(){
	
	$("#detail").empty();
	$("#detail").append("<div id='video'><div id='subject'><h3></h3><span></span></div><div class='embed-responsive embed-responsive-16by9'><video controls='true' autoplay='true' class='embed-responsive-item'></video></div><div id='controll'><div class='float-right'><button id='save' type='button' class='glyphicon glyphicon-floppy-disk btn btn-default btn-lg'></button><button id='previous' type='button' class='glyphicon glyphicon-eye-open btn btn-default btn-lg'></button></div><span><button id='backward' class='glyphicon glyphicon-step-backward btn btn-default btn-lg' type='button'></button><button id='forward' class='glyphicon glyphicon-step-forward btn btn-default btn-lg' type='button'></button></span></div></div>");
	
	var title = $("#video #subject h3");
	var subTitle = $("#video #subject span");
	var videoSrc = $("#video video");
	
	$(title).text(selectedContents.getTitle());
	$(subTitle).text(selectedEpisode.getEpisodeTitle());
	$(videoSrc).attr("src", selectedEpisode.getEpisodeUrl());
	
	$("#backward").click(function(){
		backward();
	});
	
	$("#forward").click(function(){
		forward();
	});
	
	$("#save").click(function(){
		save();
	});
	
	$("#previous").click(function(){
		previous();
	});
	
	return false;
}

var itemSize = 5;
var pageSize = 5;

function list(page){
	
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
		
		$(item).click(function(){
			selectedEpisode = episode;
			video();
			return false;
		});
		
		$("#list").append(item);
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


