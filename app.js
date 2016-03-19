/**
 * Created by ian.zhang on 3/18/16.
 */

function showAlert(){
    console.log('something')
    alert("show alert");
    var _value = document.getElementById
    
}

var refresh_lock = false;

function getAllPortentialCodeString(){
	if(refresh_lock){
		return;
	}
	refresh_lock = true;
	var potential_tags = [];
	var $dom_potential = document.querySelectorAll(".item.integration_item .block p.value.body"),
		$normal_message_potential = document.querySelectorAll(".post>p.post_text");
	for(var i=0, N=$dom_potential.length;i<N;i++){
		var _tag = $dom_potential[i];
		var _html = _tag.innerHTML;
		var _matched = _html.match(_regex);
		if(_matched && 'none'!==$dom_potential[i].style.display){
			potential_tags.push($dom_potential[i]);
		}
	}
	for(var i=0, N=$normal_message_potential.length;i<N;i++){
		var _tag = $normal_message_potential[i];
		var _html = _tag.innerHTML;
		var _matched = _html.match(_regex);
		if(_matched && 'none'!==$normal_message_potential[i].style.display){
			potential_tags.push($normal_message_potential[i]);
		}
	}

	if(potential_tags.length===0){
		refresh_lock=false;
		return ;
	}
	

	var _regex = /^(``` (java|ruby|js|python))([\s\S]*?)```/
	var _release_lock = false;
	for(var i=0, N=potential_tags.length;i<N;i++){
		var index = N-i-1;
		var _tag = potential_tags[index];
		if (potential_tags[index-1] === "end"){
			reach_end=true;
		}
		var _html = _tag.innerHTML;
		var _matched = _html.match(_regex);
		if(_matched){
			_language = _matched[2]
			_code = _matched[3];
			
			_release_lock = (N-i==1);
			_replacement = sendCodeSnippetForParse(_tag, _release_lock, {
				code: _code,
				language: _language
			}, replaceCodeSnippet);
		}
	}

}

function replaceCodeSnippet($dom, replacement, _release_lock){
	var $parent = $dom.parentNode;
	if($dom.style.display==='none'){
		return ;
	}
	$dom.style.display='none';
	if(!$parent){
		console.log("error");
		console.log($dom);
		return ;
	}
	var $child = document.createElement('div');
	$child.innerHTML =replacement;
	$parent.appendChild($child);
	refresh_lock = !_release_lock;
}

function sendCodeSnippetForParse($dom, _release_lock, _snippet, callback){
	chrome.runtime.sendMessage({
		command: "parseCode",
		snippet: _snippet
	}, function(response){
		console.log(response);
		_html = response.snippet
		if(_html){
			callback($dom, _html, _release_lock);
		}
	});
	
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	console.log("content");
	console.log(request);
	console.log(sender);
	console.log(sendResponse);
});

setInterval(function(){
	if(!document.querySelector('#compose_forms>.compose_type'))	{
		return ;
	}
	if(document.querySelector('#compose_forms>.compose_type').dataset['eventAdded']){

	} else {
		document.querySelector('#compose_forms>.compose_type')
			.addEventListener('click', function(e){
				console.log("clicked");
				setTimeout(function(){
					var $menu = document.getElementById('menu');
					console.log($menu);
					var _html = '<li id="appended_post_code" class="rollover" index="9"><span class="ico ico-files"></span>Send Code Snippet&nbsp;&nbsp;</li>';
					var $d = document.createElement('div');
					$d.innerHTML = _html;
					$menu.querySelector('ul').appendChild($d);
					$('#appended_post_code').click(function(e){
						console.log('YEAH!!!')
					});
				}, 100)
			});	
		document.querySelector('#compose_forms>.compose_type').dataset['eventAdded']=true;
	}
	
	getAllPortentialCodeString();
},1000);

