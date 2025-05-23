
chrome.storage.sync.get(['theme','blockingData','blockingEnabled'], (result) => {
    console.log('팝업에서 저장된 데이터:', result.theme);
    blockingData = result.blockingData || [];

    console.log('차단 데이터:', blockingData);
    setDataList(blockingData);
    // setDataList([]);
    console.log(result.blockingEnabled);
    const isBlockingEnabled = result.blockingEnabled === undefined ? true : result.blockingEnabled;
    document.getElementById('togBlocking').checked = isBlockingEnabled;
    setBlockingEnabled(isBlockingEnabled);
});

const setBlockingEnabled = (isBlockingEnabled) => {
    if(isBlockingEnabled){
        document.getElementById('blocklistScreen').classList.remove('!block');
        document.getElementById('blockingUserList').classList.remove('opacity-50');
    }else{
        document.getElementById('blocklistScreen').classList.add('!block');
        document.getElementById('blockingUserList').classList.add('opacity-50');
    }
}

const setDataList = (data) => {
    const DATALIST = `
        
        ${data.length > 0 ? `
            ${data.map(item => `
            <li class="flex items-start justify-start relative p-2 border border-gray-300 dark:border-gray-600 text-xs pr-10">
                <span class="w-18 flex-none font-medium break-all border-r border-gray-300 dark:border-gray-600 px-1 mr-2">
                    <input type="checkbox" data-key="${item.key}" data-name="${item.name}" ${item.cutoff ? 'checked' : ''} class="tog-checkbox cutoff" title="해당 회원의 글이 목록에서 보이지 않게 합니다." />
                </span>
                <span class="w-28 flex-none font-medium break-all border-r border-gray-300 dark:border-gray-600 p-1 mr-2">${item.name}</span>
                <span class="memo w-full text-xs">
                    <input type="text" value="${item.memo}" data-key="${item.key}" class="memo-val w-full p-1" />
                </span>
                <button type="button" class="bt-del w-6 h-6 absolute right-1 top-2" data-key="${item.key}" data-name="${item.name}" title="메모,차단 목록에서 삭제">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </li>
        `).join('')}` : `
            <li class="text-center h-full flex justify-center flex-col gap-5 items-center py-20">
                <i class="fa-solid fa-magnifying-glass text-2xl"></i> <p class="text-sm">메모,차단 하신 유저가 없습니다.</p>
            </li>
        `}
        
    `;
    document.getElementById('blockingUserList').innerHTML = DATALIST; // 새 데이터 추가
};


document.addEventListener('focusout', (event) => memoUpdate(event));
document.addEventListener('change', (event) => cutOffUpdate(event));
document.addEventListener('keypress', (event) => event.key === 'Enter' ?  memoUpdate(event) : null);

const cutOffUpdate = (event) => {
    const checkbox = event.target.closest(".tog-checkbox.cutoff");
    if(!checkbox) return;
    
    const key = checkbox.getAttribute('data-key');
    const name = checkbox.getAttribute('data-name');
    const newChecked = checkbox.checked;
    console.log(key, newChecked);

    // Update the cutoff in blockingData
    const itemToUpdate = blockingData.find(item => item.name === name);
    if (itemToUpdate) {
        itemToUpdate.cutoff = newChecked;
    }
    chrome.storage.sync.set({ blockingData }, () => {
        console.log('차단 업데이트되었습니다:', blockingData);
    });
};
const memoUpdate = (event) => {
    const inputVal = event.target.closest(".memo-val");
    if(!inputVal) return;
    const key = inputVal.getAttribute('data-key');
    const newMemo = inputVal.value;
    console.log(key, newMemo);

    // Update the memo in blockingData
    const itemToUpdate = blockingData.find(item => item.name === name);
    if (itemToUpdate) {
        itemToUpdate.memo = newMemo;
    }

    // Save updated data to chrome.storage.sync
    chrome.storage.sync.set({ blockingData }, () => {
        console.log('차단 데이터가 업데이트되었습니다:', blockingData);
    });
};

document.addEventListener('click', (event) => {
    const btDel = event.target.closest(".bt-del");
    if(btDel){
        const key = btDel.getAttribute("data-key");
        const name = btDel.getAttribute("data-name");
        console.log(key);
        if (!confirm(`"${name}"님을 메모,차단 목록에서 삭제하시겠습니까?`)) {
            return; // 사용자가 취소를 클릭한 경우
        }
        // 삭제할 데이터의 key 값을 사용하여 해당 데이터를 삭제
        blockingData = blockingData.filter(item => item.key !== key);
        setDataList(blockingData); // 새 데이터 추가
        chrome.storage.sync.set({ blockingData }, () => {
            console.log('차단 데이터가 저장되었습니다:', blockingData);
        });
    }
})

document.getElementById('togBlocking').addEventListener('change', () => {
    const isChecked = document.getElementById('togBlocking').checked;

    const dataToSave = {
        blockingEnabled: isChecked
    };

    // chrome.storage.sync에 데이터 저장
    chrome.storage.sync.set(dataToSave, () => {
        console.log('토글 블록리스트', dataToSave);
        setBlockingEnabled(isChecked);
    });

});


document.getElementById('btnBackup').addEventListener('click', () => {
    chrome.storage.sync.get(null, (items)=> {
        const dataToBackup = JSON.stringify(items, null, 2); // JSON 형식으로 변환
        const blob = new Blob([dataToBackup], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // 현재 날짜/시간 YYYYMMDD_HHMMSS 형식으로 가져오기
        const now = new Date();
        const timestamp = now.getFullYear().toString()
            + String(now.getMonth() + 1).padStart(2, '0')
            + String(now.getDate()).padStart(2, '0') + '_'
            + String(now.getHours()).padStart(2, '0')
            + String(now.getMinutes()).padStart(2, '0')
            + String(now.getSeconds()).padStart(2, '0');
        const filename = `backup_slrclub_${timestamp}.json`; // 파일 이름 생성


        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // 다운로드할 파일 이름
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // URL 해제
        console.log('백업 완료:', dataToBackup);
    })
});

// 복원
document.getElementById('btnRestore').addEventListener('click', () => {
    document.getElementById('fileInput').click(); // 파일 선택 대화상자 열기
});

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                chrome.storage.sync.set(data, () => {
                    console.log('복원 완료:', data);
                    alert('복원이 완료되었습니다.');
                });
            } catch (error) {
                console.error('JSON 파싱 오류:', error);
                alert('유효하지 않은 JSON 파일입니다.');
            }
        };
        reader.readAsText(file);
    }
    event.target.value = ''; // 파일 선택 후 input 초기화
    location.reload(); // 페이지 새로고침
});


/* // 웹페이지에 DOM 이벤트 리스너 추가
document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'saveButton') { // 버튼 ID 확인

        const dataToSave = {
            popkey: '잇싸쓰2'
        };
    
        // chrome.storage.sync에 데이터 저장
        chrome.storage.sync.set(dataToSave, () => {
            console.log('팝업 에서 데이터가 저장되었습니다:', dataToSave);
            alert('팝업 에서 데이터가 저장되었습니다');
        });
    }

});



chrome.storage.sync.get(['popkey'], (result) => {
    console.log('팝업에서 저장된 데이터:', result.popkey);
    document.getElementById('popdata').textContent = result.popkey;
}); */