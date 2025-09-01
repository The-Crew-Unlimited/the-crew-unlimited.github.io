const NEWS_POST_REF = "/news/?post=";
const LABEL_TRUNCATED_READ_FULL_POST = "> Read Full Post";
const LABEL_TRUNCATED_READ_FULL_POST_FONTSIZE = "32px";

function getNewsPostPath(tcuNetInfo, postFileName) {
	if (tcuNetInfo != null && tcuNetInfo.NewsDirectory != null) {
		if (!postFileName.endsWith(".json")) {
			postFileName += ".json";
		}
		let newsDir = tcuNetInfo.NewsDirectory;
		if (!newsDir.endsWith("/")) {
			newsDir += "/";
		}
		return newsDir + postFileName;
	}
	return null;
}

function generatePostContents(doc, directory, contentsArray, hrefToFullPost, truncateAfterLines) {
	let contentElems = [];
	if (contentsArray != null && contentsArray.length > 0) {
		let lineCount = 0;
		for (let i = 0; i < contentsArray.length; i++) {
			// Check if we've reached the line limit //
			if (truncateAfterLines != null && lineCount >= truncateAfterLines) {
				let readFullLink = doc.createElement("a");
				readFullLink.innerText = LABEL_TRUNCATED_READ_FULL_POST;
				readFullLink.href = hrefToFullPost;
				readFullLink.style = "font-size: " + LABEL_TRUNCATED_READ_FULL_POST_FONTSIZE + ";";
				contentElems.push(readFullLink);
				break;
			}
			//
			
			let contentObj = contentsArray[i];
			let contentElem = contentObj.Element;
			if (contentElem != null) {
				let elem = doc.createElement(contentElem);
				// Parse Inner Text //
				let contentText = contentObj.Text;
				if (contentText != null) {
					if (truncateAfterLines != null) {
						let newLineCount = (contentText.match(/\n/g) || []).length;		// This counts the amount of new lines in this text (num occurrences of "\n")
						let lineLimitLeft = -(lineCount - truncateAfterLines);
						let removeLines = Math.max(newLineCount - lineLimitLeft, 0);
						lineCount += newLineCount;
						if (lineLimitLeft <= 0) {
							continue;		// No lines available at all, skip this element
						} else if (removeLines > 0) {
							// There's less lines left than there are in this text alone. We have to truncate the text.
							for (let l = 0; l < removeLines; l++) {
								// Go through each last occurrence of \n for every line we have left (before limit)
								let lastOccurrence = contentText.lastIndexOf("\n");
								if (lastOccurrence != -1) {
									contentText = contentText.substring(0, lastOccurrence);
								}
							}
							// Add ellipsis
							while (contentText.endsWith(" ") || contentText.endsWith(".")) {
								contentText = contentText.substring(0, contentText.length - 1);
							}
							contentText += "...";
						}
					}
					elem.innerText = contentText;
				}
				// Read alt (image name) //
				let contentAlt = contentObj.Alt;
				if (contentAlt != null) {
					elem.alt = contentAlt;
				}
				// Read href (link redirects) //
				let contentHref = contentObj.HRef;
				if (contentHref != null) {
					elem.href = contentHref;
				}
				// Read Source (src) //
				let contentSrc = contentObj.Source;
				if (contentSrc != null) {
					elem.src = getAbsoluteFromRelativeDir(directory, contentSrc);
				}
				contentElems.push(elem);
				lineCount++;
			} else {
				console.log("Invalid content element at " + i);
			}
		}
	}
	return contentElems;
}

function getDirectory(src) {
	let path = src;
	let lastIndexOfSlash = path.lastIndexOf("/");
	return lastIndexOfSlash != -1 ? path.substr(0, lastIndexOfSlash) : path;
}

function getFile(src, removeExtension) {
	let path = src;
	let lastIndexOfSlash = path.lastIndexOf("/");
	path = lastIndexOfSlash != -1 ? path.substr(lastIndexOfSlash + 1, path.length) : path;
	if (removeExtension == true) {
		let lastIndexOfDot = path.lastIndexOf(".");
		if (lastIndexOfDot != -1) {
			path = path.substr(0, lastIndexOfDot);
		}
	}
	return path;
}

function getAbsoluteFromRelativeDir(currentDir, src) {
	if (!src.startsWith("/")) {
		// Is relative path //
		src = currentDir + "/" + src;
	}
	return src;
}

function createPostFrame(postJson, linkToPost, parentId, containerParams, titleParams, heightLimit, truncateAfterLines) {
	if (postJson == null) {
		console.log("Post Json is null!");
		return;
	}
	
	let directory = postJson.File != null ? getDirectory(postJson.File) : "";
	
	// Whole container //
	let container = document.createElement("div");
	container.style = "width: 100%;";
	if (containerParams != null) {
		for (let key of Object.keys(containerParams)) {
			container[key] = containerParams[key];
		}
	}
	
	// Title bar //
	let titlebar = document.createElement("div");
	titlebar.className = "page_contents header border_bottom";
	// Titlebar Title (Header) //
	let titlebarTitle = document.createElement("a");
	titlebarTitle.className = "header";
	if (titleParams != null) {
		for (let key of Object.keys(titleParams)) {
			titlebarTitle[key] = titleParams[key];
		}
	}
	titlebarTitle.innerText =  postJson.Title != null ? postJson.Title : "Post Title";
	if (linkToPost != null) titlebarTitle.href = linkToPost;
	titlebar.appendChild(titlebarTitle);
	// Titlebar Info (date and posted by) //
	let titlebarInfo = document.createElement("p");
	titlebarInfo.innerText = postJson.Date != null ? postJson.Date + " | by " + postJson.Author : "Posted 00/00/00";
	titlebar.appendChild(titlebarInfo);
	
	container.appendChild(titlebar);
	//
	
	// News container //
	let newsContainer = document.createElement("div");
	newsContainer.className = "news_container";
	newsContainer.style = "background-color: black;  overflow: auto;";
	if (heightLimit != null) newsContainer.style.maxHeight = heightLimit;
	if (postJson.Thumbnail != null) {
		let imgSrc = getAbsoluteFromRelativeDir(directory, postJson.Thumbnail);
		let newsThumbnail = document.createElement("img");
		newsThumbnail.src = imgSrc;
		newsThumbnail.alt = "Post Thumbnail";
		newsContainer.appendChild(newsThumbnail);
	}
	let postContents = document.createElement("div");
	postContents.style = "width: 100%; height: 100%; border: none; padding-bottom: 20px;";
	// Generate post contents //
	if (postJson.Content != null) {
		let contentElems = generatePostContents(document, directory, postJson.Content, linkToPost, truncateAfterLines);
		for (let i = 0; i < contentElems.length; i++) {
			postContents.appendChild(contentElems[i]);
		}
	}
	//
	newsContainer.appendChild(postContents);
	
	container.appendChild(newsContainer);
	//
	
	document.getElementById(parentId).appendChild(container);
	
	return container;
}