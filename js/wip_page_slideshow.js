let imageIndex = -1;
let fade = 1.0;
let bgImg = null;
const images = [];
const delayMs = 10000;
const fadeNone = "rgba(1, 1, 1, 0.0)";
const fadeFull = "rgba(1, 1, 1, 1.0)";

images[0] = "/media/background_0.jpg";
images[1] = "/media/background_1.jpg";
images[2] = "/media/background_2.jpg";
images[3] = "/media/background_3.jpg";
images[4] = "/media/background_4.jpg";

const preloadImages = () => {
	console.log("Preloading images...");
    for (let i = 0; i < images.length; i++) {
        let img = new Image();
        img.src = images[i];
        console.log("Preloaded image: " + images[i]);
    }
}

const updateImage = () => {
	imageIndex = (imageIndex + 1) % images.length;
	console.log("Image " + imageIndex);
	bgImg = document.getElementById("background");
	bgImg.style.backgroundColor = fadeFull;
	bgImg.style.backgroundImage = "url('" + images[imageIndex] + "')";
	bgImg.style.backgroundBlendMode = "darken";
	
	const animFadeIn = bgImg.animate(
	[
  		{ backgroundColor: fadeFull },
		{ backgroundColor: fadeNone },
		{ backgroundColor: fadeNone },
		{ backgroundColor: fadeNone },
		{ backgroundColor: fadeNone },
		{ backgroundColor: fadeNone },
		{ backgroundColor: fadeNone },
		{ backgroundColor: fadeFull },
	], {
  		easing: 'linear',
  		duration: delayMs + 100
	});
	animFadeIn.play();
	
	setTimeout(updateImage, delayMs); // Change image every X seconds
} 

preloadImages();
updateImage();