
const slrclubUI = {
    init: function() {
        // console.log("inslrclubUI.init()");
        this.theme.init();
        this.blocking.init();
    },
    blocking: {
        init: function() {
            this.set();
            this.evt();
        },
        evt: function() {
            const _this = this;
            document.addEventListener('click', (event) => {
                const btnUser = event.target.closest('[data-xuid]');
                if (!btnUser) return;
                const userId = btnUser.getAttribute('data-xuid');
                const userName = btnUser.innerText;
                console.log(userId);
                // const attrHref = event.target.closest('[href="#popup_menu_area"]')?.getAttribute('href');
                // const attrClass = event.target.closest('[href="#popup_menu_area"]')?.getAttribute('class');
                // const attrName = event.target.closest('[href="#popup_menu_area"]')?.innerText;
                // if (attrHref === "#popup_menu_area") { // 버튼 ID 확인
                    // console.log('버튼 클릭됨:', attrHref);
                    // setTimeout(() => _this.addHTML(userId, userName), 200);
                    // } 
                _this.addHTML(userId, userName);
                console.log(btnUser.id + "버튼 클릭됨");
                if (btnUser.id === "setBlockUser") {
                    _this.addUser(userId , userName);
                }
            })
            document.addEventListener('click', (event) => {
                const btnUser = event.target.closest('#setBlockUser');
                if (!btnUser) return;
                const userId = btnUser.getAttribute('data-key');
                const userName = btnUser.getAttribute('data-name');
                console.log(btnUser.id + "버튼 클릭됨");
                if (btnUser.id === "setBlockUser") {
                    _this.addUser(userId , userName);
                }
            })
        },
        addHTML: function(uid , name) {
            document.querySelector('#memoLI')?.remove(); // 기존의 memoLI 요소를 제거
            document.getElementById('su').querySelector('ul').insertAdjacentHTML('beforeend', `
                <li id="memoLI">
                    <span id="setBlockUser" href="javascript:;" class="${uid}" data-key=${uid} data-name="${name}">
                        <img src="https://media.slrclub.com/main/layer/icon_memo.gif" width="13" height="12" alt="info"><span>메모하기</span>
                    </span>
                </li>
            `);

            console.log('addHTML 호출됨');
        },
        addUser: function(uid, name) {
            console.log(uid , name);
            
            chrome.storage.sync.get(['blockingData'], (result) => {
                console.log('저장된 데이터:', result.blockingData);
                const oldKey = result.blockingData?.map(item => {
                    if (item.key === uid) {
                        return item.memo;
                    }
                }).join('');
                console.log(oldKey);
                const oldMemo = oldKey || '메모를 입력하세요';
                console.log('기존 메모:', oldMemo);
                console.log('기존 uid:' , uid);
                blockingData = result.blockingData || [];
                
                const memo = prompt(name+'님의 ', oldMemo);
                if (memo === null) {
                    return; // 사용자가 취소를 클릭한 경우
                }
                if (memo.trim() === '') {
                    alert('메모를 입력하세요');
                    return; // 사용자가 취소를 클릭한 경우
                }
                const newBlockingData = {
                    key: uid,
                    name: name,
                    memo: memo,
                    cutoff: false,
                    timestamp: new Date().toISOString(),
                };

                // 기존 데이터에서 같은 key 값을 가진 요소를 제거
                blockingData = blockingData.filter(item => item.key !== newBlockingData.key);

                // 새로운 데이터를 배열의 맨 앞에 추가
                blockingData.unshift(newBlockingData);

                chrome.storage.sync.set( {blockingData} , () => {
                    console.log('차단 데이터가 저장되었습니다:', blockingData);
                    location.reload(); // 페이지 새로고침
                });
            });

        },
        set: function() {
            chrome.storage.sync.get(['blockingData','blockingEnabled'], (result) => {
                // console.log('저장된 데이터:', result.blockingData);
                const blockingData = result.blockingData || [];
                // console.log(result.blockingEnabled);
                const blockingEnabled = result.blockingEnabled === undefined ? true : result.blockingEnabled;
                // console.log(blockingEnabled);
                if (blockingEnabled === true && blockingData.length > 0) {
                    blockingData.forEach(data => {
                        const { key, cutoff, name, memo } = data;
                        // console.log(key, name, memo);
                        document.querySelectorAll('#bbs_list .list_name span[data-xuid], #bbs_view_head .nick span[data-xuid]').forEach(els => {
                            const xuid = els.getAttribute('data-xuid');
                            // console.log( key , cutoff ,  xuid);
                            if ( key === xuid ) {
                                els.insertAdjacentHTML('afterend', `<div class="block_user" style="color: red; font-size: 11px;">${memo}</div>`);
                            }
                            if ( (key === xuid) && cutoff  && !els.closest('#bbs_view_head') ) {
                                els.closest('tr').style.opacity = '0.5';
                                els.closest('tr').style.display = 'none';
                            }
                        });
                        
                    });
                }
            });
            
        }
    },
    theme: {
        init: function(){
            this.set();
        },
        set: function() {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                setTheme();
            });

            const setTheme = () => {
                const themeStat = window.matchMedia('(prefers-color-scheme: dark)').matches  ? 'dark' : 'light';
                chrome.storage.sync.set({
                    theme: themeStat
                }, () => {
                    // console.log('테마가 설정되었습니다:', themeStat);
                });
            }
            setTheme();
        }
    },
}

slrclubUI.init();