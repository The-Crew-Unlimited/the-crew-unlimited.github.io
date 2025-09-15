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

function getLatestLauncherDownload(tcuNetInfo, callback) {
	if (tcuNetInfo != null) {
		let launcherDir = tcuNetInfo.LauncherDirectory;
		if (launcherDir != null) {
			let launcherManifest = tcuNetInfo.LauncherManifest;
			if (launcherManifest != null) {
				console.log("Retrieving the latest TCU Launcher download...");
				getJsonFromURL(launcherManifest, function(result) {
					if (result != null) {
						console.log("Launcher Manifest retrieved");
						let latestVer = result.LatestLauncherVer;
						let versionsArray = result.Versions;
						if (latestVer == null) {
							// No latest version explicitly defined, manually get the latest launcher version from the list
							if (versionsArray != null && versionsArray.length > 0) {
								// Get the latest array entry //
								let latest = versionsArray[versionsArray.length - 1];
								if (latest != null && latest.Version != null) {
									latestVer = latest.Version;
								} else {
									console.log("Latest launcher version entry is invalid!");
								}
							}
						}
						// Latest launcher version should be retrieved now, let's get the entry.
						if (latestVer != null) {
							for (let i = 0; i < versionsArray.length; i++) {
								let versionEntry = versionsArray[i];
								if (versionEntry.Version == latestVer) {
									console.log("Got latest launcher version: " + latestVer);
									if (callback != null) callback(versionEntry);		// Return the version entry
									return;
								}
							}
							console.log("Couldn't get Launcher version: " + latestVer);
						}
					} else {
						console.log("Couldn't get Launcher Manifest!");
					}
					if (callback != null) callback(null);		// Return null
				});
			} else {
				console.log("No LauncherManifest defined in TCU Net info!");
			}
		} else {
			console.log("No LauncherDirectory defined in TCU Net info!");
		}
	}
	return null;
}

function DateToString(date) {
	return date.toLocaleString("en-US", { timeZone: "UTC" });
}