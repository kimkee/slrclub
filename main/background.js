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






chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install' || details.reason === 'update') {
    migrateStorage();
  }
});

function migrateStorage() {
  chrome.storage.local.get('migrated', result => {
	const migratedVersion = result.migrated || 0;
    if (migratedVersion == 2) {
      // 이미 마이그레이션 완료
      return;
    }

    // 1️⃣ sync에서 기존 데이터 가져오기
    chrome.storage.sync.get(null, oldData => {
      // 2️⃣ local로 저장
      chrome.storage.local.set(oldData, () => {
        // 3️⃣ 마이그레이션 플래그 저장
        chrome.storage.local.set({ migrated: 2 }, () => {
          console.log("데이터 마이그레이션 완료");
        });
      });
    });
  });
} 

