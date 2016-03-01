/**
 * 
 */
function getSubtitle(){
	$.ajax({
		type: 'get'
		, dataType: "text"
		, url: "http://devys.github.io/subtitle/kungfu.ko.smi"
		, success: function(data) {
//			console.log(data);
			alert(data);
		}
		, error: function(xhr, status, error) {
			console.log("error");
		}
	});
}