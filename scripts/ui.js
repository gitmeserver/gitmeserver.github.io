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
	
				var input = $.parseHTML("<div class='input-group col-xs-4 btn'></div>");
				var searchInput = $.parseHTML("<input id='searchWord' type='text' class='form-control' placeholder='Search for...' />");
				$(searchInput).keyup(function(){
					searchWord = $(this).val();
					onCreateIndexContents();
				});
				var searchButton = $.parseHTML("<button class='btn btn-default' type='button'>Go!</button>");
				$(searchButton).click(function(){
					searchWord = $("#searchWord").val();
					onCreateIndexContents();
				});
				
				$(input).append(searchInput);
				$(input).append($.parseHTML("<span id='searchButton' class='input-group-btn'></span>"));
				$(input).find("#searchButton").append(searchButton);
				
	$(button).click(function(){
	    $('.row-offcanvas').toggleClass('active')
	});
	$(button).append(srOnly);
	$(button).append($(iconBar).clone()).append($(iconBar).clone()).append($(iconBar).clone());
	
	$(navbarHeader).append(navbarBrand);
	$(navbarHeader).append(button);
	$(navbarHeader).append(input);
				
	$(container).append(navbarHeader);
	
	$(nav).append(container);
	
	return nav;
				
}


/**
 * body 영역 구성
 */
function onCreateIndexContents(){
	
	$("#contentsArea").empty();
	
	var contentsList = $.parseHTML("<div id='contentsList' class='row'></div>");
	$("#contentsArea").append(contentsList);
	
	for(var i=0; i<contents.length; i++){
		if(contents[i].check(channelId, searchWord)){
			$("#contentsList").append(contents[i].makeThumbnail());
		}
	}
	
}