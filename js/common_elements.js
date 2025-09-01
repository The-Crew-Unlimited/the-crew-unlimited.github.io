const STYLIZE_TOPNAV_TEXT_AS_UPPER = false;
const BTM_PAGE_LEGAL_INFO = [
	"TCU Project, 2025",
	"The TCU Project is not affiliated with Ubisoft or Ivory Tower. This is a community made project, the goal of which is to restore \"The Crew\" back to a playable state with the use of custom server emulator software.",
	"The TCU Project and it's staff do not host or redistribute any The Crew game files on official TCU Project sources, which includes our website, TCU Launcher and TCU Discord.",
	"We do not assist with, support or condone piracy.",
	"",
	"",
	"Currently hosted with GitHub Pages",
	"This website does not collect or store any of your data, it's just a collection of static pages.",
	"Some of the media/fonts are used from The Crew Fansite kit."
];

function preloadImage(imgSrc) {
	var link = document.createElement("link");
	link.rel = "preload";
	link.as = "image";
	link.href = imgSrc;
	document.head.appendChild(link);
}

/*
	TOP NAVIGATION BAR
*/

function createTopNavbar(tcuNetInfo, includeSocials) {
	// Get links
	let discordLink = tcuNetInfo != null ? tcuNetInfo.DiscordLink : null;
	let patreonLink = tcuNetInfo != null ? tcuNetInfo.PatreonLink : null;
	let youtubeLink = tcuNetInfo != null ? tcuNetInfo.YouTubeLink : null;
	
	let topnavBar = document.createElement("div", "topnav");
	topnavBar.id = "topnav_tcu";
	topnavBar.className = "topnav";

	topnavBar.appendChild(createImageButton("topnav_logo", "/home/", "/media/tcu_topnav.png", "/media/tcu_topnav_black.png", false));
	topnavBar.appendChild(createButton("topnav_news", "/news/", "News", false));
	topnavBar.appendChild(createButton("topnav_download", "/download/", "Download", false));
	if (patreonLink != null) {
		topnavBar.appendChild(createButton("topnav_support", "/support/", "Support Us", false));
	}
	topnavBar.appendChild(createButton("topnav_about", "/about/", "About"));
	
	if (tcuNetInfo != null && includeSocials == true) {
		if (youtubeLink != null) {
			topnavBar.appendChild(createImageButtonRight("topnav_socials_youtube", youtubeLink, "/media/socials/youtube.png", null, true));
		}
		if (patreonLink != null) {
			topnavBar.appendChild(createImageButtonRight("topnav_socials_patreon", patreonLink, "/media/socials/patreon.png", null, true));
		}
		if (discordLink != null) {
			topnavBar.appendChild(createImageButtonRight("topnav_socials_discord", discordLink, "/media/socials/discord.png", null, true));
		}
	}

	// Insert topnav at the top of the body
	document.body.insertBefore(topnavBar, document.body.childNodes[0]);

	console.log("TopNavbar created");
	
	return topnavBar;
}

function createButton(id, href, text, openNewTab) {
	let topnavBtn = document.createElement("a");
	topnavBtn.id = id;
	topnavBtn.href = href;
	topnavBtn.appendChild(document.createTextNode(STYLIZE_TOPNAV_TEXT_AS_UPPER ? text.toUpperCase() : text));
	if (openNewTab) {
		topnavBtn.target = "_blank";
		topnavBtn.rel="noopener noreferrer";
	}
	// Check if active //
	if (document.URL.indexOf(href) != -1) {
		topnavBtn.className += " active";
	}
	return topnavBtn;
}

function createImageButton(id, href, imgSrc, imgSrcActive, openNewTab) {
	let topnavBtn = document.createElement("button");
	topnavBtn.id = id;
	topnavBtn.className = "image_left";
	topnavBtn.onclick = function() {
		if (openNewTab) {
			window.open(href, "_blank", "noopener");
		} else {
			location.href = href;
		}
	};
	preloadImage(imgSrc);
	topnavBtn.style.backgroundImage = "url('" + imgSrc + "')";
	// Check if active //
	if (document.URL.indexOf(href) != -1) {
		topnavBtn.className += " active";
		if (imgSrcActive != null && imgSrcActive != imgSrc) {
			topnavBtn.style.backgroundImage = "url('" + imgSrcActive + "')";
		}
	}
	return topnavBtn;
}

function createImageButtonRight(id, href, imgSrc, imgSrcActive, openNewTab) {
	let btn = createImageButton(id, href, imgSrc, imgSrcActive, openNewTab);
	btn.className = "image_right";
	return btn;
}

/*
	BOTTOM PAGE LEGAL WARNING TEXT BOX
*/

function createLegalWarningBox() {
	let box = document.createElement("div");
	box.className = "credits_bar";
	
	for (let i = 0; i < BTM_PAGE_LEGAL_INFO.length; i++) {
		let text = document.createElement("p");
		text.className = "label_credits";
		text.appendChild(document.createTextNode(BTM_PAGE_LEGAL_INFO[i]));
		box.appendChild(text);
	}
	
	document.body.appendChild(box);
	
	return box;
}

function selectRandomBackground(backgroundElemId, imagesArray) {
	if (imagesArray == null || imagesArray.length <= 0) return;
	let bgElem = document.getElementById(backgroundElemId);
	if (bgElem != null) {
		let newBg = imagesArray[Math.floor(Math.random() * imagesArray.length)];
		preloadImage(newBg);
		bgElem.style.backgroundImage = "url(" + newBg + ")";
	} else {
		console.error("No element with ID '" + backgroundElemId + "'!");
	}
}

function createPostLink(newsData, parentElemId, style) {
	let newsLink = document.createElement("a");
	newsLink.innerText = newsData.Title;
	newsLink.href = newsData.File;
	newsLink.style = style;
	document.getElementById(parentElemId).appendChild(newsLink);
}

function createNewsPanel(newsData, parentId, height, marginBottom) {
	// Whole container //
	let container = document.createElement("div");
	if (marginBottom != null) {
		container.style = "margin-bottom: " + marginBottom;
	}
	
	// Title bar //
	let titlebar = document.createElement("div");
	titlebar.className = "page_contents header border_bottom";
	// Titlebar Title (Header) //
	let titlebarTitle = document.createElement("h1");
	titlebarTitle.innerText = newsData != null ? newsData.Title : "Post Title";
	titlebar.appendChild(titlebarTitle);
	// Titlebar Info (date and posted by) //
	let titlebarInfo = document.createElement("p");
	titlebarInfo.innerText = newsData != null ? newsData.Date + " | by " + newsData.Author : "Posted 00/00/00";
	titlebar.appendChild(titlebarInfo);
	
	container.appendChild(titlebar);
	//
	
	// News container //
	let newsContainer = document.createElement("div");
	newsContainer.className = "page_contents";
	newsContainer.style = "height: " + (height != null ? height : "700px") + ";";
	let newsIframe = document.createElement("iframe");
	newsIframe.style = "width: 100%; height: 100%; border: none;";
	if (newsData.File != null) {
		newsIframe.src = newsData.File;
	}
	newsContainer.appendChild(newsIframe);
	let unsupportedLbl = document.createElement("p");
	unsupportedLbl.innerText = "Your browser does not support iframes.";
	newsIframe.appendChild(unsupportedLbl);
	
	container.appendChild(newsContainer);
	//
	
	document.getElementById(parentId).appendChild(container);
	
	return container;
}