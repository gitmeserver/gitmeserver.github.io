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
    
	$init : function(channelName, contentsList){ 
        this.channelName = channelName;
        this.contentsList = contentsList;
    }, 
    
    getChannelName : function(){
    	return this.channelName;
    },
    
    setChannelName : function(channelName){
    	this.channelName = channelName;
    },
    
    getContentsList : function(){
    	return this.contentsList;
    },
    
    setContentsList : function(contentsList){
    	this.contentsList = contentsList;
    }
    
});

var Contents = $Class({
    
	$init : function(title, contentsId, thumbnail){ 
        this.title = title;
        this.contentsId = contentsId;
        this.thumbnail = thumbnail;
    }, 
    
    getTitle : function(){
    	return this.title;
    },
    
    setTitle : function(title){
    	this.title = title;
    },
    
    getContentsId : function(){
    	return this.contentsId;
    },
    
    setContentsId : function(contentsId){
    	this.contentsId = contentsId;
    },
    
    getThumbnail : function(){
    	return this.thumbnail;
    },
    
    setThumbnail : function(thumbnail){
    	this.thumbnail = thumbnail;
    }
    
});
