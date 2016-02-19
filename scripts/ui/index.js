
/**
 * body 영역 구성
 */


/**
 * 메인 페이지 
 */
function view(){
	
	var container = $.parseHTML("<div class='container'></div>");
	var offCanvasRow = $.parseHTML("<div class='row row-offcanvas row-offcanvas-right'></div>");
	
	$(container).append(offCanvasRow);
	$(container).append($.parseHTML("<hr />"));
	$(container).append($.parseHTML("<footer><p>&copy; Created by DevY</p></footer>"));
	
	// 실제 콘텐츠 영역
	$(offCanvasRow).append(contents("all"));
	$(offCanvasRow).append(sidebar());

	return container;
}

/**
 * contents 영역 구성
 */
function contents(channelId){
	
	var col = $.parseHTML("<div id='contentsList' class='col-xs-12 col-sm-9'></div>");
	var row = $.parseHTML("<div class='row'></div>");
	
	if(jumbotron_enabled){
		$(col).append(jumbotron());
	}
	$(col).append(row);
	$(row).empty();
	
	requestContents(channelId, 1);
	
	return col;
}

function requestContents(channelId, channelFileNo){
	
	var url = CHANNELS_PATH_URL.replace("{channel_file_no}", channelFileNo);
	
	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: url
		, success: function(data) {
			
			if(channelId == "all"){
				var c = $(data).find("contents");
				var size = $(c).size();
				for(var i=0; i<size; i++){
					$("#contentsList div.row").append(thumbnail(c[i], channelFileNo));
				}
				
			}else{
				var c = $(data).find("contents");
				var size = $(c).size();
				for(var i=0; i<size; i++){
					if($(c[i]).find("channelId").text() == channelId){
						$("#contentsList div.row").append(thumbnail(c[i], channelFileNo));
					}
				}
			}
			
			channelFileNo = channelFileNo + 1;
			requestContents(channelId, channelFileNo);
			
		}
		, error: function(xhr, status, error) {
		}
	});
	
}

/**
 * 점보트론 
 */
function jumbotron(){
	
	var jumbotron = $.parseHTML("<div class='jumbotron'></div>");
	var h1 = $.parseHTML("<h1>Hello, world!</h1>");
	var p = $.parseHTML("<p>This is an example to show the potential of an offcanvas layout pattern in Bootstrap. Try some responsive-range viewportsizes to see it in action.</p>");
	
	$(jumbotron).append(h1);
	$(jumbotron).append(p);
	
	return jumbotron;
}

/**
 * 아이템 
 */
function thumbnail(contents, channelFileNo){
	
	var imgSrc = $(contents).find("thumbnail").text();
	var contentsId = $(contents).find("contentsId").text();
	var thumbTitle = $(contents).find("title").text();
	
	var th = $.parseHTML("<div class='cont col-xs-4 col-lg-2'></div>");
	$(th).attr("style", "text-align:center; padding-bottom:10px;");
	
	var imgA = $.parseHTML("<a href='contents.html?contentsId=" + contentsId + "&amp;channelFileNo=" + channelFileNo + "'></a>");
	var img = $.parseHTML("<img />");
	$(img).attr("src", imgSrc);
	$(img).attr("style", "width:120px; margin-left:auto; margin-right:auto; margin-bottom:5px;");
	$(imgA).append(img);
	
	var title = $.parseHTML("<a href='contents.html?contentsId=" + contentsId + "&amp;channelFileNo=" + channelFileNo + "'></a>");
	thumbTitle = cutStr(thumbTitle, 16);
	$(title).append(thumbTitle);
	$(title).attr("style", "display:block;");
	
	$(th).append(imgA);
	$(th).append(title);
	
	return th;
}

/**
 * 메뉴 
 */
function sidebar(){
	var sidebar = $.parseHTML("<div class='col-xs-6 col-sm-3 sidebar-offcanvas' id='sidebar'><div class='list-group'></div></div>");
	var listGroup = $(sidebar).find("div.list-group");
	
	var all = $.parseHTML("<a href='#' id='all' class='list-group-item active'>전체</a>");
	$(all).click(function(){
		$(".list-group-item").removeClass("active");
		$(this).addClass("active");
		$("#contentsList").replaceWith(contents($(this).attr("id")));
	});
	$(listGroup).append(all);

	var item = $.parseHTML("<a href='#' class='list-group-item'>Link</a>");
	
	var channelList = $(channels).find("channel");
	
	for(var i=0; i<channelList.length; i++){
		var it = $(item).clone().text($(channelList[i]).attr("channelName"));
		$(it).attr("id", $(channelList[i]).attr("channelId"));
		$(it).click(function(){
			$(".list-group-item").removeClass("active");
			$(this).addClass("active");
			$("#contentsList").replaceWith(contents($(this).attr("id")));
		});
		$(listGroup).append(it);
	}
	
	return sidebar;
	
}
