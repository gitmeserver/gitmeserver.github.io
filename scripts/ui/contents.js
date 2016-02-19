/**
 * body 영역 구성
 */

var contentsXml;
var episodeXml;
var channelFileNo;
var contentsId;

/**
 * 메인 페이지 
 */
function view(){

	$(".navbar-toggle").remove();
	
	channelFileNo = $.getUrlVar("channelFileNo");
	contentsId = $.getUrlVar("contentsId");
	var channelUrl = CHANNELS_PATH_URL.replace("{channel_file_no}", channelFileNo);
	
	contentsData(channelUrl);
	
}

function contentsData(channelUrl){
	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: channelUrl
		, success: function(data) {
			// '&' <-- 오류... '&' -> '&amp;'로 모두 치환
			data = data.replace(/&/gi, "&amp;");
			var contentsList = $($.parseXML(data)).find("contents");
			var contentsListSize = contentsList.length;
			
			for(var i=0; i<contentsListSize; i++){
				if($(contentsList[i]).find("contentsId").text() == contentsId){
					contentsXml = contentsList[i];
				}
			}
			
			episodeList();
			
		}
		, error: function(xhr, status, error) {
			alert(error); 
		}
	});
}

function episodeList(){

	var domain = DOMAIN_URL;
	if(domain[domain.length - 1] != "/"){
		domain = domain + "/";
	}
	
	var dirPath = $(contentsXml).find("directoryPath").text();
	if(dirPath[0] == "/"){
		dirPath = dirPath.substr(1, dirPath.length);
	}
	if(dirPath[dirPath.length - 1] != "/"){
		dirPath = dirPath + "/";
	}
	var contentsFile = $(contentsXml).find("contentsId").text() + ".xml";
	var contentsFilePath = dirPath + contentsFile;
	var contentsFileUrl = DOMAIN_URL + contentsFilePath;

	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: contentsFileUrl
		, success: function(data) {
			// '&' <-- 오류... '&' -> '&amp;'로 모두 치환
			data = data.replace(/&/gi, "&amp;");
			episodeXml = $.parseXML(data);
			
			var size = $(episodeXml).find("episode").size();
			
			var container = $.parseHTML("<div class='container'></div>");
			
			$(container).append(details());
			$(container).append($.parseHTML("<hr />"));
			
			// 리스트 레이아웃 구성 
			$(container).append($.parseHTML("<div class='row row-offcanvas row-offcanvas-right'><div class='col-xs-12'><div id='list' class='list-group'></div></div></div>"));
			$(container).append($.parseHTML("<nav><ul class='pager'></ul></nav>"));
			
			$(container).append($.parseHTML("<hr />"));
			$(container).append($.parseHTML("<footer><p>&copy; Created by DevY</p></footer>"));
			
			$("body").append(container);
			
			list(1);
			pager(1);
			
		}
		, error: function(xhr, status, error) {
			alert(error); 
		}
	});
}

function details(){
	
	var thumbUrl = $(contentsXml).find("thumbnail").text();
	var title = $(contentsXml).find("title").text();
	
	var wrap = $.parseHTML("<div class='row row-offcanvas row-offcanvas-right'></div>");
	
	var thumb = $.parseHTML("<div class='col-xs-5 col-md-3'></div>");
	var thumbImg = $.parseHTML("<img id='thumbnail' class='img-responsive img-rounded' />");
	$(thumbImg).attr("src", thumbUrl);
	$(thumb).append(thumbImg);
	
	var text = $.parseHTML("<div class='col-xs-7 col-md-9'></div>");
	var h1 = $.parseHTML("<h1></h1>");
	$(h1).text(title);
	var p = $.parseHTML("<p></p>");
//	$(p).text("전쟁으로 소중한 가족도, 지켜야 할 동료도 모두 잃은 군인 ‘한상렬’(임시완). 우연히 전출 명령을 받아 머물게 된 부대 내에서 부모를 잃고 홀로 남은 아이들을 만나게 된다.아이들의 해맑은 모습에 점차 마음을 열게 된 그는 자원봉사자 선생님 ‘박주미’(고아성)와 함께 어린이 합창단을 만들어 노래를 가르치기 시작하고, 이들의 노래는 언제 목숨을 잃을지 모르는 전쟁 한가운데 놓인 모든 이들의 마음을 울리기 시작하는데...전쟁 한가운데,작은 노래가 만든 위대한 기적이 시작된다!");
	$(text).append(h1);
	$(text).append(p);
	
	$(wrap).append(thumb);
	$(wrap).append(text);
	
	return wrap;
}

var itemSize = 5;
var pageSize = 5;

function list(page){
	var episodeList = $(episodeXml).find("episode");
	var episodeTotalSize = $(episodeList).size();
	
	var end = page * itemSize;
	var start = end - itemSize;
	
	if(episodeTotalSize < end){
		end = episodeTotalSize;
	}
	
	$(".list-group").empty();
	
	for(var i=start; i<end; i++){
		var listItem = $.parseHTML("<a class='list-group-item' href='#'></a>");
		var title = $(episodeList[i]).find("title").text();
		var episodeUrl = $(episodeList[i]).find("episodeUrl").text();
		
		var item = $(listItem).clone();
		$(item).attr("href", episodeUrl);
		$(item).text(title);
		$(".list-group").append(item);
	}
	
}

function pager(curPage){
	
	$(".pager").empty();
	
	var episodeList = $(episodeXml).find("episode");
	var total = $(episodeList).size();
	
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
		$(a).attr("href", "#");
		$(a).text(i);
		$(a).click(function(){
			list($(this).text());
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



