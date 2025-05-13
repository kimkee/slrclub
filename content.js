window.addEventListener("load", e=>{

});

// 웹페이지와의 데이터 교환을 위해 메시지 리스너 추가
window.addEventListener('message', (event) => {
    if (event.data.type === 'GET_STORAGE') {
        chrome.storage.sync.get(['key'], (result) => {
            window.postMessage({ type: 'STORAGE_DATA', data: result.key }, '*');
        });
    }
});