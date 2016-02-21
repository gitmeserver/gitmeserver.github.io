/**
 * 클래스 정의 
 */
var $Class = function(oClassMember) {
    function ClassOrigin() {
        this.$init.apply(this, arguments);
    }
    ClassOrigin.prototype = oClassMember;
    ClassOrigin.prototype.constructor = ClassOrigin;
    return ClassOrigin
}

var Channel = $Class({
    
	$init : function(channelId, channelName){ 
        this.channelId = channelId;
		this.channelName = channelName;
    }, 
    
    getChannelId : function(){
    	return this.channelId;
    },
    
    setChannelId : function(channelId){
    	this.channelId = channelId;
    },
    
    getChannelName : function(){
    	return this.channelName;
    },
    
    setChannelName : function(channelName){
    	this.channelName = channelName;
    },
    
    makeChannel : function(){
    	var item = $.parseHTML("<a href='#' class='list-group-item'>" + this.channelName + "</a>");
		$(item).attr("id", this.channelId);
		$(item).click(function(){
			$(".list-group-item").removeClass("active");
			$(this).addClass("active");
			channelId = $(this).attr("id");
			onCreateIndexContents();
		});
		
		return item;
    }
    
});

var Contents = $Class({
    
	$init : function(channelId, contentsId, directoryPath, title, thumbnail){
		this.channelId = channelId;
		this.contentsId = contentsId;
		this.directoryPath = directoryPath;
        this.title = title;
        this.thumbnail = thumbnail;
    }, 

    getChannelId : function(){
    	return this.cannelId;
    },
    
    setChannelId : function(channelId){
    	this.channelId = channelId;
    },
    
    getContentsId : function(){
    	return this.contentsId;
    },
    
    setContentsId : function(contentsId){
    	this.contentsId = contentsId;
    },
    
    getDirectoryPath : function(){
    	return this.directoryPath;
    },
    
    setDirectoryPath : function(){
    	this.directoryPath = directoryPath;
    },
    
    getTitle : function(){
    	return this.title;
    },
    
    setTitle : function(title){
    	this.title = title;
    },
    
    getThumbnail : function(){
    	return this.thumbnail;
    },
    
    setThumbnail : function(thumbnail){
    	this.thumbnail = thumbnail;
    },
    
    makeThumbnail : function(){
    	var th = $.parseHTML("<div class='cont col-xs-4 col-sm-3 col-lg-2'></div>");
    	$(th).attr("style", "text-align:center; padding-bottom:10px;");
    	
    	var imgA = $.parseHTML("<a href='contents.html?contentsId=" + this.contentsId + "'></a>");
    	var img = $.parseHTML("<img class='img-responsive' />");
    	$(img).attr("src", this.thumbnail);
    	$(img).attr("style", "margin-left:auto; margin-right:auto; margin-bottom:5px;");
    	$(imgA).append(img);
    	
    	var t = $.parseHTML("<a href='contents.html?contentsId=" + this.contentsId + "'></a>");
    	$(t).append(cutStr(this.title, 12));
    	$(t).attr("style", "display:block;");
    	
    	$(th).append(imgA);
    	$(th).append(t);
    	
    	return th;
    },
    
    check : function(ch, searchWord){
    	if(searchWord == undefined || -1 < this.title.indexOf(searchWord)){
    		if(ch.match("all") || this.channelId.match(ch)){
    			return true;
    		}else{
    			return false;
    		}
    	}else{
    		return false;
    	}
    }
    
});