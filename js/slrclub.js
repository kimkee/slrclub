
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
                const btnUser = event.target.closest('[data-xuid]') || event.target.closest('.cname');
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
                if (btnUser.id === "setBlockUser") {
                    console.log(btnUser.id + "버튼 클릭됨");
                    _this.addUser(userId , userName);
                }
            })
            document.addEventListener('click', (event) => {
                const btnUser = event.target.closest('[alt="새로고침"]');
                if (!btnUser) return;
                console.log('새로고침');
                setTimeout(()=>_this.set(), 1000);
            })
        },
        addHTML: function(uid , name) {
            document.querySelector('#setBlockUser')?.remove(); // 기존의 memoLI 요소를 제거
            document.getElementById('su').querySelector('ul').insertAdjacentHTML('beforeend', `
                <li  id="setBlockUser" href="javascript:;" class="${uid}" data-key=${uid} data-name="${name}">
                    <span>
                        <img src="https://media.slrclub.com/main/layer/icon_memo.gif" width="13" height="12" alt="info"><span>메모&차단 하기</span>
                    </span>
                </li>
            `);

            console.log('addHTML 호출됨');
        },
        addUser: function(uid, name) {
            console.log(uid , name);
            
            chrome.storage.sync.get('blockingData', (result) => {
                if (chrome.runtime.lastError) {
                    console.warn("storage 접근 실패:", chrome.runtime.lastError.message);
                    return;
                }
                blockingData = result.blockingData || blockingData;
                console.log('저장된 데이터:', result.blockingData);
                const oldKey = blockingData?.map(item => {
                    if (item.name === name) {
                        return item.memo;
                    }
                }).join('');
                console.log(oldKey);
                const oldMemo = oldKey || '메모를 입력하세요';
                console.log('기존 메모:', oldMemo);
                console.log('기존 uid:' , uid);
                blockingData = blockingData || [];
                
                const memo = prompt(name+' 님의 메모 ', oldMemo);
                if (memo === null) {
                    return; // 사용자가 취소를 클릭한 경우
                }else if (memo.trim() === '') {
                    alert('메모를 입력하세요');
                    return; // 사용자가 취소를 클릭한 경우
                }
                
                const isCutOff = confirm(name + ' 님을 차단해서 글을 가리시겠습니까?');

                const newBlockingData = {
                    key: uid,
                    name: name,
                    memo: memo.trim(),
                    cutoff: isCutOff,
                    timestamp: new Date().toISOString(),
                };

                // 기존 데이터에서 같은 key 값을 가진 요소를 제거
                blockingData = blockingData.filter(item => item.name !== newBlockingData.name);

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
                document.querySelectorAll('.block_user').forEach(els => {
                    els.remove();
                });
                if (blockingEnabled === true && blockingData.length > 0) {
                    blockingData.forEach(data => {
                        const { key, cutoff, name, memo } = data;
                        // console.log(key, name, memo);
                        document.querySelectorAll('#bbs_list .list_name span[data-xuid], #bbs_view_head .nick span[data-xuid]').forEach(els => {
                            const xuid = els.getAttribute('data-xuid');
                            const uname = els.innerText;
                            // console.log( key , cutoff ,  xuid);
                            if ( name === uname || key === xuid ) {
                                els.insertAdjacentHTML('afterend', `<div class="block_user">[${memo}]</div>`);
                                els.closest('.list_name')?.classList.add('isMemo');
                            }
                            if ( (name === uname || key === xuid ) && cutoff  && !els.closest('#bbs_view_head') ) {
                                els.closest('tr').style.opacity = '0.5';
                                els.closest('tr').style.display = 'none';
                                
                            }
                        });
                        document.querySelectorAll('#rewview_list .cname').forEach(els => {
                            const uname = els.innerText;
                            // console.log( key , cutoff , name,  uname);
                            
                            if ( (name === uname)  ) {
                                // els.closest('li').style.opacity = '0.1';
                                els.insertAdjacentHTML('afterend', `<span class="block_user">[${memo}]</span>`);
                                // els.closest('li').style.display = 'none';
                                
                                if( cutoff){
                                    els.closest('li').querySelector('.cmtbt_ct').insertAdjacentHTML('afterend', `<span class="block_user box">차단 된 유저입니다.</span>`);
                                    els.closest('li').querySelector('.cmt-contents').style.display = 'none';
                                    // els.closest('li').querySelector('.cmtbt_ct').style.display = 'none';
                                }
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