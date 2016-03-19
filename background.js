function send_code(code){
	var _result = "";
	$.ajax({
    	url: "http://hilite.me/api",
    	async: false,
    	// dataType: 'JSONP',
    	data: {
    		"code": code
    	},
    	success: function(res){
    		console.log(res);
    		_result = res;
    	},
    	fail: function(res){
    		console.log('fail');
    	}
    })
    return res;
}

function send_code_in_textarea(){
	var $e = document.getElementById('code_editor');
	var _text = $e.value;
	console.log(_text);
	send_code(_text)
}

$("#btn_send").click(send_code_in_textarea);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	console.log("background");
	console.log(request);
	var success = false,
		response = {};

	if("parseCode"===request.command){
		var _language = request.snippet.language?request.snippet.language:"Python"
		 
		$.ajax({
	    	url: "http://hilite.me/api",
	    	async: false,
	    	data: {
	    		"lexer": _language,
	    		"code": request.snippet.code,
	    		"linenos": "true"
	    	},
	    	success: function(res){
	    		console.log(res);
	    		success=true;
	    		response=res
	    	},
	    	fail: function(res){
	    		console.log('fail');
	    	}
	    });

	    if(success){
	    	sendResponse({
				command: "parsedCode",
				snippet: response
			});		
	    } else {
			sendResponse({
				command: "parseError",
			});
	    }
	}
});

