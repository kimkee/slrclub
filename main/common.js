/* chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		files: ['content.js']
	});
});
console.log("bacground.js");


function reddenPage() {
	document.body.style.backgroundColor = 'red';
}

chrome.action.onClicked.addListener((tab) => {
	if (!tab.url.includes("chrome://")) {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			function: reddenPage
		});
	}
}); */


/* document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
); */

chrome.storage.sync.get(['theme'], (result) => {
	console.log('저장된 테마:', result);
	if (result.theme === 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
	
});