/**
 * 
 */
var document;

function getSubtitle(){
	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: "http://devys.github.io/subtitle/kungfu.ko.smi"
		, success: function(data) {
			document = $.parseHTML(data);
			var syncs = $(document).find("sync");
			console.log(syncs.length);
		}
		, error: function(xhr, status, error) {
			console.log("error");
		}
	});
}