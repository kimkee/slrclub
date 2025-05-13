/* document.addEventListener('DOMContentLoaded', () => {
    const option1 = document.getElementById('option1');
    const option2 = document.getElementById('option2');
    const saveButton = document.getElementById('save');
    const resetButton = document.getElementById('reset');

    // 저장된 값을 로드하여 체크박스를 초기화
    chrome.storage.sync.get(['option1', 'option2'], (result) => {
        option1.checked = result.option1 || false;
        option2.checked = result.option2 || false;
    });

    // 저장 버튼 클릭 이벤트
    saveButton.addEventListener('click', () => {
        chrome.storage.sync.set({
            option1: option1.checked,
            option2: option2.checked
        }, () => {
            alert('Options saved!');
        });
    });

    // 초기화 버튼 클릭 이벤트
    resetButton.addEventListener('click', () => {
        chrome.storage.sync.clear(() => {
            option1.checked = false;
            option2.checked = false;
            alert('Options reset!');
        });
    });
});


 */