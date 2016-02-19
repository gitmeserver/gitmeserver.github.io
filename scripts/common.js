var channels;

/**
 * UI를 구성하는 스크립트 
 */
$(document).ready(function(){

	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: CHANNELS_URL
		, success: function(data) {
			
			channels = $.parseXML(data);

			// 상단 영역 삽입 
			$("body").append(topArea());
			
			// 홈페이지명 설정 
			$("#siteName").text(SITENAME);
			
			// 실제 콘텐츠 영역 삽입 
			$("body").append(view());
			
		}
		, error: function(xhr, status, error) {
			alert(error); 
		}
	});
	
});

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
	
	$(navbarHeader).append(button);
	$(navbarHeader).append(navbarBrand);
				
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