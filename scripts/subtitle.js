/**
 * 
 */

(function(window) {
	var regexSyncSearch = /<sync/i;
	var regexSyncClose = /<sync|<\/body|<\/sami/i;
	var regexSyncTime = /<sync[^>]+?start=(\d+)[^>]+?>/i;
	var regexLineEnding = /[\r\n]/g;
	var regexExtractColor = /<[^>]+?color=(#?[^>]+?)(?:\s[^>]+?)?>(.+?)<\/[^>]+?>/gi;
	var regexBrTag = /<br\s?\/?>/gi;
	var regexTags = /(<([^>]+)>)/ig;

	window.Smi = Smi;
	function Smi() {}

	/**
	 * 파싱
	 */
	Smi.prototype.parse = function parse(data) {
		var self = this;
		
		if (typeof data !== 'string') {
			data = data.toString();
			// Buffer 등등...
		}
		
		var elements = self.splitBySync(data);
		
		for (var i = 0; i < elements.length; i++) {
			elements[i].content = self.replace(elements[i].content);
		}
		
		return elements;
	}

	/**
	 * <SYNC> 태그로 자름
	 */
	Smi.prototype.splitBySync = function splitBySync(data) {
		var elements = [];
		
		while (true) {
			var syncTagIdx = data.search(regexSyncSearch);
			if (syncTagIdx < 0) {
				break;
			}
			 
			var syncCloseTagIdx = data.slice(syncTagIdx + 1).search(regexSyncClose) + 1;
			var element = '';
			if (syncCloseTagIdx > 0) {
				element = data.slice(syncTagIdx, syncTagIdx + syncCloseTagIdx)
				data = data.slice(syncTagIdx + syncCloseTagIdx);
			} else {
				// 망가진 파일이지만 대충 보정
				element = data.slice(syncTagIdx);
				data = '';
			}
				
			var matches = regexSyncTime.exec(element);
			if (matches === null) {
				continue;
			}
			
			var startTime = Number.parseInt(matches[1]);
			element = element.replace(regexSyncTime, '').replace(regexLineEnding, '');		
			elements.push({
				'content': element,
				'startTime': startTime
			});
		}
		
		return elements;
	}

	/**
	 * 태그들을 잘 처리해줌.
	 */
	Smi.prototype.replace = function replace(content) {
		var self = this;
		
		if (typeof content !== 'string') {
			return content;
		}
		
		content = content.replace(regexBrTag, '\n');
		
		content = content.replace(regexExtractColor, function(match, color, content) {
			return '::lt;span style="color:' + color.trim() + '"::gt;' + content + '::lt;/span::gt;';
		});
		
		content = content.replace(regexTags, '');
		
		content = self.fixTag(content);
		
		return content.trim();
	}
	Smi.prototype.fixTag = function fixTag(content) {
		if (typeof content !== 'string') {
			return content;
		}
		
		return content.replace(/::lt;/gi, '<').replace(/::gt;/gi, '>');
	}
})(window);


/*
 * jQuery srt
 *
 * version 0.1 (November 28, 2008)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
/*
  usage:
    <video src="example.ogg" id="examplevideo" />
    <div class="srt" data-video="examplevideo" data-srt="example.srt"></div>

  jquery.srt.js will try to load subtitles in all elements with 'srt' class.
  'data-video' atribute is used to link to the related video,
  if no data-srt is provided, the contents of the div is parsed as srt.
 */

function subtitleSrt(){
	
	function toSeconds(t) {
		var s = 0.0
		if(t) {
			var p = t.split(':');
			for(i=0;i<p.length;i++)
				s = s * 60 + parseFloat(p[i].replace(',', '.'))
		}
		return s;
	}
	
	function strip(s) {
		return s.replace(/^\s+|\s+$/g,"");
	}
	
	function playSrtSubtitles(subtitleElement) {
		
		clearInterval(ival);
		
		var videoId = subtitleElement.attr('data-video');
		var srt = subtitleElement.text();
		subtitleElement.text('');
		srt = srt.replace(/\r\n|\r|\n/g, '\n')

		var subtitles = {};
		srt = strip(srt);
		var srt_ = srt.split('\n\n');
		for(s in srt_) {
			st = srt_[s].split('\n');
			if(st.length >=2) {
				n = st[0];
				
				var st0 = st[1].split(' --> ')[0];
				if(st0 != "" && st0 != undefined){
					i = strip(st0);
				}
				
				var st1 = st[1].split(' --> ')[1];
				if(st1 != "" && st1 != undefined){
					o = strip(st1);
				}
				
				t = st[2];
				
				if(st.length > 2) {
					for(j=3; j<st.length;j++)
						t += '\n'+st[j];
				}
				is = toSeconds(i);
				os = toSeconds(o);
				
				subtitles[selectedContents.getContentsId() + "_" + selectedEpisode.getEpisodeTitle() + "_" + is.toString().split(".")[0]] = t;
			}
		}
		var currentSubtitle = -1;
		var ival = setInterval(function() {
			var vid = document.getElementById(videoId);
			
			if(vid == undefined){
				return;
			}
			
			var currentTime = vid.currentTime;
			currentTime = parseInt(currentTime) + parseInt(subSync);
			$(".srt").text(subtitles[selectedContents.getContentsId() + "_" + selectedEpisode.getEpisodeTitle() + "_" + currentTime]);
			
		}, 100);
	}
	
	function playSmiSubtitles(data){
		
		clearInterval(ival);
		
		var smiParser = new Smi();
		var srt = smiParser.parse(data);
		
		var subtitles = {};
		
		for(var i=0; i<srt.length; i++){
			var t = Math.floor(srt[i].startTime / 100);
			var c = srt[i].content;
			c = c.replace("&nbsp;", "");
			c = c.replace("&nbsp", "");
			c = c.replace(/(<([^>]+)>)/gi, "");
			c = c.replace(/(<\/([^>]+)>)/gi, "");
			
			subtitles[selectedContents.getContentsId() + "_" + selectedEpisode.getEpisodeTitle() + "_" + t] = c;
		}
		
		var ival = setInterval(function() {
			var vid = $("#video video")[0];
			
			if(vid == undefined){
				return;
			}
			
			var currentTime = vid.currentTime;
			currentTime = parseInt(currentTime) + parseInt(subSync);
			$(".srt").text(subtitles[selectedContents.getContentsId() + "_" + selectedEpisode.getEpisodeTitle() + "_" + currentTime]);

		}, 100);
		
	}
	
	$('.srt').each(function() {
		var subtitleElement = $(this);
		var videoId = subtitleElement.attr('data-video');
		if(!videoId) return;
		var srtUrl = subtitleElement.attr('data-srt');
		if(srtUrl) {

			/**
			 * TODO 자막 호출전 인코딩 조정 
			 */
			$.ajaxSetup({
			    'beforeSend' : function(xhr) {
			        xhr.overrideMimeType('text/html; charset=EUC-KR');
			    },
			});
			
			// srt 자막 처리 
			if(-1 < srtUrl.indexOf(".srt")){
				$(this).load(srtUrl, function (responseText, textStatus, req) {
					playSrtSubtitles(subtitleElement);
					
					// 자막 호출 완료 후 인코딩 초기화 
					$.ajaxSetup({
					    'beforeSend' : function(xhr) {
					        xhr.overrideMimeType('text/html; charset=UTF-8');
					    },
					});
				});
		
			// smi 자막 처리  
			}else if(-1 < srtUrl.indexOf(".smi")){
				$.ajax({
					type: 'get'
					, dataType: "text"
					, url: srtUrl
					, success: function(data) {
						playSmiSubtitles(data);
						
						// 자막 호출 완료 후 인코딩 초기화 
						$.ajaxSetup({
						    'beforeSend' : function(xhr) {
						        xhr.overrideMimeType('text/html; charset=UTF-8');
						    },
						});
						
					}
					, error: function(xhr, status, error) {
						console.log("error");
					}
				});
			}
			
		} else {
			playSrtSubtitles(subtitleElement);
		}
	});
}


