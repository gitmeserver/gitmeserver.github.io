var xml;

/**
 * UI를 구성하는 스크립트 
 */
$(document).ready(function(){
	
	$.ajax({
		type: 'get'
		, dataType: "xml"
		, url: "http://" + domain +"/channels.xml"
		, success: function(data) {
			xml = data;
			
			// 우측 네비게이션 삽입 
			$("body").append(nav());
			
			// 실제 콘텐츠 영역 삽입 
			$("body").append(container());
			
			// 홈페이지명 설정 
			$("#siteName").text(siteName);
		}
		, error: function(xhr, status, error) {alert(error); }
	});
	
});


/**
 * 네비게이션 버튼 생성 
 */
function nav(){
	
	var nav = $.parseHTML("<nav class='navbar navbar-fixed-top navbar-inverse'></nav>");
		var container = $.parseHTML("<div class='container'></div>");
			var navbarHeader = $.parseHTML("<div class='navbar-header'></div>");
	
				var button = $.parseHTML("<button type='button' class='navbar-toggle collapsed btn btn-primary btn-xs' data-toggle='offcanvas' aria-expanded='false' aria-controls='navbar'></button>");
					var srOnly = $.parseHTML("<span class='sr-only'>Toggle navigation</span>");
					var iconBar = $.parseHTML("<span class='icon-bar'></span>");
	
				var navbarBrand = $.parseHTML("<a id='siteName' class='navbar-brand' href='#'>홈페이지 이름을 정해주세요!</a>");
	
	$(button).click(function(){
	    $('.row-offcanvas').toggleClass('active')
	});
	$(button).append(srOnly);
	$(button).append($(iconBar).clone()).append($(iconBar).clone()).append($(iconBar).clone());
	
	$(navbarHeader).append(button);
	$(navbarHeader).append(navbarBrand);
				
	$(container).append(navbarHeader);
	
	$(nav).append(container);
	
	return nav;
				
}

/**
 * body 영역 구성
 */
function container(){
	
	var container = $.parseHTML("<div class='container'></div>");
	var offCanvasRow = $.parseHTML("<div class='row row-offcanvas row-offcanvas-right'></div>");
	
	$(container).append(offCanvasRow);
	$(container).append($.parseHTML("<hr />"));
	$(container).append($.parseHTML("<footer><p>&copy; Company 2014</p></footer>"));
	$(offCanvasRow).append(contents());
	$(offCanvasRow).append(menu());

	return container;
}

/**
 * contents 영역 구성
 */
function contents(){
	
	var col = $.parseHTML("<div class='col-xs-12 col-sm-9'></div>");
	var row = $.parseHTML("<div class='row'></div>");
	
//	$(col).append(jumbotron());
	$(col).append(row);
	
	var contentsList = $(xml).find("contents"); 
	var contentsSize = $(contentsList).size();
	
	for(var i=0; i<contentsSize; i++){
		var thumb = $(thumbnail(contentsList[i])).clone();
		$(row).append(thumb);
	}
	
	return col;
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
function thumbnail(contents){
	var th = $.parseHTML("<div class='col-xs-4 col-lg-2'></div>");
	$(th).attr("style", "text-align:center; padding-bottom:10px;");
	var img = $.parseHTML("<a href='#'><img /></a>");
	var title = $.parseHTML("<div><a href='#'></a></div>");
	
	var imgSrc = $(contents).find("thumbnail").text();
	var thumbTitle = $(contents).find("title").text();
	
	thumbTitle = cutStr(thumbTitle, 16);
	
	$(img).find("img").attr("src", imgSrc);
	$(img).find("img").attr("style", "width:120px; margin-left:auto; margin-right:auto; margin-bottom:5px;");
	$(title).find("a").append(thumbTitle);
	
	$(th).append(img);
	$(th).append(title);
	
	return th;
}

/**
 * 메뉴 
 */
function menu(){
	var sidebar = $.parseHTML("<div class='col-xs-6 col-sm-3 sidebar-offcanvas' id='sidebar'><div class='list-group'></div></div>");
	var listGroup = $(sidebar).find("div.list-group");
	
	var itemActive = $.parseHTML("<a href='#' class='list-group-item active'>전체</a>");
	$(itemActive).click(function(){
		$(".list-group-item").removeClass("active");
		$(this).addClass("active");
	});
	$(listGroup).append(itemActive);
	
	var item = $.parseHTML("<a href='#' class='list-group-item'>Link</a>");
	var channel = $(xml).find("channel");
	for(var i=0; i<channel.length; i++){
		var it = $(item).clone().text($(channel[i]).attr("channelName"));
		$(it).click(function(){
			$(".list-group-item").removeClass("active");
			$(this).addClass("active");
		});
		$(listGroup).append(it);
	}
	
	return sidebar;
	
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



