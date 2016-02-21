
/**
 * body 영역 구성
 */
function onCreateIndexContents(channelId){
	
	$("#contentsArea").empty();
	
	var contentsList = $.parseHTML("<div id='contentsList' class='row'></div>");
	$("#contentsArea").append(contentsList);
	
	if(channelId == "all"){
		for(var i=0; i<contents.length; i++){
			$("#contentsList").append(contents[i].makeThumbnail());
		}
	}else{
		for(var i=0; i<contents.length; i++){
			if(contents[i].checkChannel(channelId)){
				$("#contentsList").append(contents[i].makeThumbnail());
			}
		}
	}
	
}