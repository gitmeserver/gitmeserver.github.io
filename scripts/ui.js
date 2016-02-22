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
	onCreateIndex();
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
	
	var contentsList = $.parseHTML("<div id='contentsList' class='row'></div>");
	$("#contentsArea").append(contentsList);
	
	for(var i=0; i<contents.length; i++){
		if(contents[i].check(channelId, searchWord)){
			$("#contentsList").append(contents[i].makeThumbnail());
		}
	}
	
	$("#contentsArea").append($.parseHTML("<hr /><footer><p>&copy; Created by DevY</p></footer>"));
}


function requestContents(){
	
	$("#contentsArea").empty();
	$("#contentsArea").append("<div style='text-align:center; margin-top:100px;'><img src='http://localhost:8080/gitmeserver/img/ajax-loader.gif' /><span style='margin-top:10px;display:block;'>미디어 정보를 로딩중입니다...</span></div>");
	
	requestEpisodeList(0);
	
}



function onCreateContents(){
	
	episodeList = [];
	
	var eFiles = selectedContents.getEpisodeFiles();
	
	for(var i=0; i<eFiles.length; i++){
		var eList = episodeMap[eFiles[i]];
		for(var j=0; j<eList.length; j++){
			episodeList.push(eList[j]);
		}
	}
	
	$("#contentsArea").empty();
	
	details();
	
	$("#contentsArea").append($.parseHTML("<div class='col-xs-12'><hr /></div>"));
	
	$("#contentsArea").append($.parseHTML("<div class='col-xs-12'><div id='list' class='list-group'></div><nav><ul class='pager'></ul></nav></div>"));
	
	list(1);
	pager(1);
	
	$("#contentsArea").append($.parseHTML("<div class='col-xs-12'><hr /><footer><p>&copy; Created by DevY</p></footer></div>"));
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
	
	$("#contentsArea").append(thumb);
	$("#contentsArea").append(text);
	
}

var itemSize = 5;
var pageSize = 5;

function list(page){
	
	var episodeTotalSize = episodeList.length;
	
	var end = page * itemSize;
	var start = end - itemSize;
	
	if(episodeTotalSize < end){
		end = episodeTotalSize;
	}
	
	$("#list").empty();
	
	for(var i=start; i<end; i++){
		var listItem = $.parseHTML("<a class='list-group-item' href='#'></a>");
		var title = episodeList[i].getEpisodeTitle();
		var episodeUrl = episodeList[i].getEpisodeUrl();
		
		var item = $(listItem).clone();
		$(item).attr("href", episodeUrl);
		$(item).text(title);
		$("#list").append(item);
	}
	
}

function pager(curPage){
	
	$(".pager").empty();
	
	var total = episodeList.length;
	
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


