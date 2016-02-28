/**
 * 클래스 정의 
 */
var $Class = function(oClassMember) {
    function ClassOrigin() {
        this.$init.apply(this, arguments);
    }
    ClassOrigin.prototype = oClassMember;
    ClassOrigin.prototype.constructor = ClassOrigin;
    return ClassOrigin;
};

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
			initSelected();
			$(".list-group-item").removeClass("active");
			$(this).addClass("active");
			channelId = $(this).attr("id");
			onCreateIndex();
		});
		
		return item;
    }
    
});

var Contents = $Class({
    
	$init : function(channelId, contentsId, recommended, title, thumbnail, description, episodeFiles, year, directors, actors, runningTime, subtitle, audioLang, genre, nation){
		this.channelId = channelId;
		this.contentsId = contentsId;
		this.recommended = recommended;
        this.title = title;
        this.thumbnail = thumbnail;
        this.description = description;
        this.episodeFiles = episodeFiles;
        this.year = year;
        this.directors = directors;
        this.actors = actors;
        this.runningTime = runningTime;
        this.subtitle = subtitle;
        this.audioLang = audioLang;
        this.genre = genre;
        this.nation = nation;
    }, 

    getChannelId : function(){
    	return this.channelId;
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
    
    isRecommended : function(){
    	return this.recommended;
    },
    
    setRecommended : function(recommended){
    	this.recommended = recommended;
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
    
    getYear : function(){
    	return this.year;
    },
    
    setYear : function(year){
    	this.year = year;
    },
    
    getDirectors : function(){
    	return this.directors;
    },
    
    setDirectors : function(directors){
    	this.directors = directors;
    },
    
    getActors : function(){
    	return this.actors;
    },
    
    setActors : function(actors){
    	this.actors = actors;
    },
    
    getRunningTime : function(){
    	return this.runningTime;
    },
    
    setRunningTime : function(runningTime){
    	this.runningTime = runningTime;
    },
    
    getSubtitle : function(){
    	return this.subtitle;
    },
    
    setSubTitle : function(subtitle){
    	this.subtitle = subtitle;
    },
    
    getAudioLang : function(){
    	return this.audioLang;
    },
    
    setAudioLang : function(audioLang){
    	this.audioLang = audioLang;
    },
    
    getGenre : function(){
    	return this.genre;
    },
    
    setGenre : function(genre){
    	this.genre = genre;
    },
    
    getNation : function(){
    	return this.nation;
    },
    
    setNation : function(nation){
    	this.nation = nation;
    },
    
    makeThumbnail : function(){
    	
    	var chId = this.channelId;
    	var contId = this.contentsId;
    	var reco = this.recommended;
        var ti = this.title;
        var thumb = this.thumbnail;
        var desc = this.description;
        var epiFiles = this.episodeFiles;
        var cYear = this.year;
        var cDirectors = this.directors;
        var cActors = this.actors;
        var cRunningTime = this.runningTime;
        var cSubtitle = this.subtitle;
        var cAudioLang = this.audioLang;
        var cGenre = this.genre;
        var cNation = this.nation;
    	
        if(!(-1 < thumb.indexOf("http://")) && !(-1 < thumb.indexOf("https://"))){
        	thumb = THUMBNAIL_URL.replace("{thumbnail_file_path}", thumb); 
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
    		initSelected();
    		selectedContents = new Contents(
    				chId, 
    				contId, 
    				reco, 
    				ti, 
    				thumb, 
    				desc, 
    				epiFiles, 
    				cYear, 
    				cDirectors, 
    				cActors, 
    				cRunningTime, 
    				cSubtitle, 
    				cAudioLang, 
    				cGenre, 
    				cNation
    			);
    		requestContentsEpisode("detail");
    		return false;
    	};
    	
    	$(imgA).click(clickFunc);
    	$(t).click(clickFunc);
    	
    	$(th).append(imgA);
    	$(th).append(t);
    	
    	return th;
    },
    
    makeWatchAfter : function(){
    	var chId = this.channelId;
    	var contId = this.contentsId;
    	var reco = this.recommended;
        var ti = this.title;
        var thumb = this.thumbnail;
        var desc = this.description;
        var epiFiles = this.episodeFiles;
        var cYear = this.year;
        var cDirectors = this.directors;
        var cActors = this.actors;
        var cRunningTime = this.runningTime;
        var cSubtitle = this.subtitle;
        var cAudioLang = this.audioLang;
        var cGenre = this.genre;
        var cNation = this.nation;
    	
        if(!(-1 < thumb.indexOf("http://")) && !(-1 < thumb.indexOf("https://"))){
        	thumb = THUMBNAIL_URL.replace("{thumbnail_file_path}", thumb); 
        }
        
    	var th = $.parseHTML("<div class='cont col-xs-4 col-sm-3 col-lg-2'></div>");
    	$(th).attr("style", "text-align:center; padding-bottom:10px;");
    	
    	var imgA = $.parseHTML("<a href='#'></a>");
    	var img = $.parseHTML("<img class='img-responsive' />");
    	$(img).attr("src", thumb);
    	$(img).attr("style", "margin-left:auto; margin-right:auto; margin-bottom:5px;");
    	$(imgA).append(img);
    	
    	var ended = $.parseHTML("<a class='ended glyphicon glyphicon-remove' href='#'></a>");
    	$(ended).click(function(){
    		$.removeWatchAfter(contId);
    		onWatchAfter();
    	});
    	
    	var t = $.parseHTML("<a href='#'></a>");
    	$(t).append($.cutStr(this.title, 12));
    	$(t).attr("style", "display:block;");
    	
    	var clickFunc = function(){
    		initSelected();
    		selectedContents = new Contents(
    				chId, 
    				contId, 
    				reco, 
    				ti, 
    				thumb, 
    				desc, 
    				epiFiles, 
    				cYear, 
    				cDirectors, 
    				cActors, 
    				cRunningTime, 
    				cSubtitle, 
    				cAudioLang, 
    				cGenre, 
    				cNation
    			);
    		requestContentsEpisode("detail");
    		return false;
    	};
    	
    	$(imgA).click(clickFunc);
    	$(t).click(clickFunc);
    	
    	$(th).append(ended);
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

var Deck = $Class({
    
	$init : function(contents, episode, currentTime){
		this.contents = contents;
		this.episode = episode;
		this.currentTime = currentTime;
    }, 
    
    getContents : function(){
    	return this.contents;
    },
    
    setContents : function(contents){
    	this.contents = contents;
    },
    
    getEpisode : function(){
    	return this.episode;
    },
    
    setEpisode : function(episode){
    	this.episode = episode;
    },
    
    getCurrentTime : function(){
    	return this.currentTime;
    },
    
    setCurrentTime : function(currentTime){
    	this.currentTime = currentTime;
    },
    
    makeDeck : function(){
    	
    	var chId = this.contents.getChannelId();
    	var contId = this.contents.getContentsId();
    	var reco = this.contents.isRecommended();
        var ti = this.contents.getTitle();
        var thumb = this.contents.getThumbnail();
        var desc = this.contents.getDescription();
        var epiFiles = this.contents.getEpisodeFiles();
        var cYear = this.year;
        var cDirectors = this.directors;
        var cActors = this.actors;
        var cRunningTime = this.runningTime;
        var cSubtitle = this.subtitle;
        var cAudioLang = this.audioLang;
        var cGenre = this.genre;
        var cNation = this.nation;
        
        var eTitle = this.episode.getEpisodeTitle();
		var eUrl = this.episode.getEpisodeUrl();
    	
        if(!(-1 < thumb.indexOf("http://")) && !(-1 < thumb.indexOf("https://"))){
        	thumb = THUMBNAIL_URL.replace("{thumbnail_file_path}", thumb); 
        }
        
    	var th = $.parseHTML("<div class='cont col-xs-4 col-sm-3 col-lg-2'></div>");
    	$(th).attr("style", "text-align:center; padding-bottom:10px;");
    	
    	var imgA = $.parseHTML("<a href='#'></a>");
    	var img = $.parseHTML("<img class='img-responsive' />");
    	$(img).attr("src", thumb);
    	$(img).attr("style", "margin-left:auto; margin-right:auto; margin-bottom:5px;");
    	$(imgA).append(img);
    	
    	var ended = $.parseHTML("<a class='ended glyphicon glyphicon-remove' href='#'></a>");
    	$(ended).click(function(){
    		var key = $.deckKey(chId, contId);
    		$(this).parent().detach();
    		$.removeCookie(key);
    		onDeck();
    	});
    	
    	var t = $.parseHTML("<a href='#'></a>");
    	$(t).append($.cutStr(ti, 12));
    	$(t).attr("style", "display:block;");
    	
    	var clickFunc = function(){
    		selectedContents = new Contents(
    				chId, 
    				contId, 
    				reco, 
    				ti, 
    				thumb, 
    				desc, 
    				epiFiles, 
    				cYear, 
    				cDirectors, 
    				cActors, 
    				cRunningTime, 
    				cSubtitle, 
    				cAudioLang, 
    				cGenre, 
    				cNation
    			);
    		selectedEpisode = new Episode(eTitle, eUrl);
    		requestContentsEpisode("video");
    		return false;
    	};
    	
    	$(imgA).click(clickFunc);
    	$(t).click(clickFunc);

    	$(th).append(ended);
    	$(th).append(imgA);
    	$(th).append(t);
    	
    	return th;
    },
    
}); 