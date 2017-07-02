function fetchJSON(callback){
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
	    var json = xhr.responseText;                         // Response
	    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
	    json = JSON.parse(json);                             // Parse JSON
	    console.log(json[getRandom()]);
	    callback(json);
	    addJSON(json);
	    console.log("Warning JSON fetched");
	    // ... enjoy your parsed json...
	};
	// Example:
	data = 'http://www.mocky.io/v2/594d18a61100008d23a3d25d';
	xhr.open('GET',data);
	clearAll();
	xhr.send();
}
function addJSON(data){
	chrome.storage.sync.set({myjson : JSON.stringify(data)}, function (){
		console.log("Data saved");
	});
	var picCount=0;
	for(var a = 0; a<data.length; a++){
		picCount = picCount + data[a].backdrop.split(",").length;
	}
	console.log("all pics are "+picCount);
	chrome.storage.sync.set({allCount : picCount}, function (){
		
	});
}
function getJSON(callback){
	chrome.storage.sync.get(['myjson'], function(items) {
		console.log(items);
	    if (items.myjson) {
	    	var data = JSON.parse(items.myjson);
			callback(data); // Serialization is auto, so nested objects are no problem
	    }else{
    		fetchJSON(callback);
	    }
	});
}
function setPic(pic){
	chrome.storage.sync.get(['showedCount'], function(items) {
		var temp = 1;
	    if (items.showedCount) {
			temp = temp + items.showedCount;
	    }
	    chrome.storage.sync.set({showedCount : temp}, function (){
			console.log("all showed pics count "+temp);
		});
	});
	chrome.storage.sync.set({pic : true}, function (){
		console.log("Data saved");
	});
}
function getPic(pic, callback){
	chrome.storage.sync.get([pic], function (items){
		if(!items.pic)
			callback(pic);
		else{

			chrome.storage.sync.get(['showedCount'], function(items) {
			    if (items.showedCount) {
					chrome.storage.sync.get(['allCount'], function (items2){
						if(items2.allCount){
							if(items2.allCount <= items.showedCount){
								console.log("every pic is shown already, refreshing json");
								clearAll();
							}
						}
					});
			    }
			});
			console.log("it has been shown already", pic);
			show();
		}
	});
}
function clearAll(){
	chrome.storage.sync.clear(function() {
    var error = chrome.runtime.lastError;
    console.log("Cache Cleared");
    if (error) {
        	console.error(error);
    	}
	});
}
function show(){
	getJSON(function(items){
		var data = items[getRandom()];
		var title = data.title +" ("+data.year+") ";
		document.getElementById("title").innerHTML = title;
		document.getElementById("movieurl").href = data.url;
		var string = 'https://image.tmdb.org/t/p/w780'+getRandom2(data.backdrop);
		document.body.style.backgroundImage = "url('" + string + "')";
	});
}
function getRandom(){
	console.log("Generating Random number");
	return Math.floor( Math.random() * (6-0)+0);
}
function getRandom2(pic){
	var pics = pic.split(",");
	console.log("Generating Random2 number, maz ", pics.length);
	return pics[Math.floor( Math.random() * (pics.length-0)+0)];
}


show();