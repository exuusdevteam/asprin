$(function(){
	
	
	
	
	$(document).on("click", "#fire-file-btn, #load-filename", function(e){
		e.preventDefault();
		$("#filename-asprin").trigger("click");
	});
	
	
	$("#fire-file-btn").click(function(e){
		
	});
	
	$("#load-filename").click(function(e){
		e.preventDefault();
		$("#filename-asprin").trigger("click");
	});
	
	
	
	/*$("#uplaod-asprin-file").click(function(e){
		e.preventDefault();

		var loadedFile = $("#load-filename").val();
		
		if(loadedFile != ""){
			hideUploadButton();
			showLoadButton();
		}
		
		
		
		
	});*/ 
	
	
	function hideUploadButton(){
		$(".hide-upload-btn").hide();
	}
	
	function showUploadButton(){
		$(".hide-upload-btn").show();
	}
	
	function showLoadButton(){
		$(".show-upload-btn").show();
	}
	
	function hideLoadButton(){
		$(".show-upload-btn").hide();
	}
	
	function hideFilenameButton(){
		$(".file-asprin").hide();
	}
	
	function loadFilename(){
		setInterval(function(){
			var filename = $("#filename-asprin").val();
			$("#load-filename").val(filename);
			
			if(filename != ""){
				hideUploadButton();
				showUploadButton();
			}
		},1000);
	}
	
	// Call all function
	
	hideLoadButton();
	hideFilenameButton();
	loadFilename();
	
});