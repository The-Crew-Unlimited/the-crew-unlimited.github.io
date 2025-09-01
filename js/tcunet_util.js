const TCU_NET_INFO = "/tcu.info.json";

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
			if (anHttpRequest.readyState == 4) {
				if (anHttpRequest.status == 200) {
					if (aCallback != null) aCallback(anHttpRequest.responseText);
				} else {
					if (aCallback != null) aCallback(null);
				}
			}
        }
        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

function getTextFromURL(url, callback) {
	var client = new HttpClient();
	client.get(url, callback);
}

function getJsonFromURL(url, callback) {
	var client = new HttpClient();
	client.get(url, function(data) {
		if (data != null) {
			if (callback != null) callback(JSON.parse(data));
		} else {
			if (callback != null) callback(null);
		}
	});
}

function getTCUNetInfo(callback) {
	getJsonFromURL(TCU_NET_INFO, callback);
}

function getTCUNewsList(tcuInfo, callback) {
	let newslist = [];
	
	if (tcuInfo == null || tcuInfo.NewsDirectory == null || tcuInfo.NewsList == null) {
		console.log("TCU net info doesn't define news directory and/or news list");
		if (callback != null) callback(newslist);
	}
	
	console.log("Retrieving newslist...");
	getJsonFromURL(tcuInfo.NewsList, function(result) {
		if (result != null) {
			if (result.NewsList != null && result.NewsList.length > 0) {
				for (let i = 0; i < result.NewsList.length; i++) {
					console.log("- News retrieved: " + result.NewsList[i]);
					// Make into absolute path
					newslist[i] = tcuInfo.NewsDirectory + result.NewsList[i];
				}
			}
		}
		if (callback != null) callback(newslist);
	});
}

/*function getNewsData(newsFilePath, callback) {
	// Read the news html //
	getTextFromURL(newsFilePath, function(newsFile) {
		let ReturnData = {};
		ReturnData["File"] = newsFilePath;
		
		let dom = new DOMParser().parseFromString(newsFile, "text/html");
		
		// Get title (of the page) //
		let titleTags = dom.getElementsByTagName("title");
		if (titleTags.length > 0) {
			let titleTag = titleTags[0];
			ReturnData["Title"] = titleTag.innerText;
		}
		
		// Get meta tags //
		let metaTags = dom.getElementsByTagName("meta");
		
		for (let i = 0; i < metaTags.length; i++) {
			let name = metaTags[i].getAttribute("name");
			let content = metaTags[i].getAttribute("content");
			if (name == "date") {
				// Assume that the date format is "8/25/2025, 5:27:55 PM" (like how Date().toLocaleString() does it, or the DateToString() function below) //
				ReturnData["Date"] = content;
			} else if (name == "author") {
				ReturnData["Author"] = content;
			}
		}
		
		if (callback != null) callback(ReturnData);
	});
}

// Data
function getLatestTCUNews(tcuInfo, callback) {
	getTCUNewsList(tcuInfo, function(newslist) {
		if (newslist != null && newslist.length > 0) {
			let latestNewsFile = newslist[newslist.length - 1];
			if (latestNewsFile != null) {
				getNewsData(latestNewsFile, function(latestNewsData) {
					if (callback != null) callback(latestNewsData);
				});
				return;
			}
		}
		if (callback != null) callback(null);
	});
}*/

function DateToString(date) {
	return date.toLocaleString("en-US", { timeZone: "UTC" });
}