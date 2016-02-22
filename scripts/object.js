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
			onCreateIndex();
		});
		
		return item;
    }
    
});

var Contents = $Class({
    
	$init : function(channelId, title, thumbnail, description, episodeFiles){
		this.channelId = channelId;
        this.title = title;
        this.thumbnail = thumbnail;
        this.description = description;
        this.episodeFiles = episodeFiles;
    }, 

    getChannelId : function(){
    	return this.channelId;
    },
    
    setChannelId : function(channelId){
    	this.channelId = channelId;
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
    
    getDescription : function(){
    	return this.description;
    },
    
    setDescription : function(description){
    	this.description = description;
    },
    
    getEpisodeFiles : function(){
    	return this.episodeFiles;
    },
    
    setEpisodeFiles : function(episodeFiles){
    	this.episodeFiles = episodeFiles;
    },
    
    makeThumbnail : function(){
    	
    	var chId = this.channelId;
        var ti = this.title;
        var thumb = this.thumbnail;
        var desc = this.description;
        var epiFiles = this.episodeFiles;
    	
        if(!(-1 < thumb.indexOf("http://")) && !(-1 < thumb.indexOf("https://"))){
        	thumb = THUMBNAIL_URL.replace("{thumbnail_file_name}", thumb); 
        }
        
    	var th = $.parseHTML("<div class='cont col-xs-4 col-sm-3 col-lg-2'></div>");
    	$(th).attr("style", "text-align:center; padding-bottom:10px;");
    	
    	var imgA = $.parseHTML("<a href='#'></a>");
    	var img = $.parseHTML("<img class='img-responsive' />");
    	$(img).attr("src", thumb);
    	$(img).attr("style", "margin-left:auto; margin-right:auto; margin-bottom:5px;");
    	$(imgA).append(img);
    	
    	var t = $.parseHTML("<a href='#'></a>");
    	$(t).append($.cutStr(this.title, 12));
    	$(t).attr("style", "display:block;");
    	
    	var clickFunc = function(){
    		selectedContents = new Contents(chId, ti, thumb, desc, epiFiles);
    		requestContents();
    		return false;
    	};
    	
    	$(imgA).click(clickFunc);
    	$(t).click(clickFunc);
    	
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


var Episode = $Class({
    
	$init : function(episodeTitle, episodeUrl){ 
        this.episodeTitle = episodeTitle;
		this.episodeUrl = episodeUrl;
    }, 
    
    getEpisodeTitle : function(){
    	return this.episodeTitle;
    },
    
    setEpisodeTitle : function(episodeTitle){
    	this.episodeTitle = episodeTitle;
    },
    
    getEpisodeUrl : function(){
    	return this.episodeUrl;
    },
    
    setEpisodeUrl : function(episodeUrl){
    	this.episodeUrl = episodeUrl;
    }
    
    
});