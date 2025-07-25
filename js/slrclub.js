
const slrclubUI = {
    init: function() {
        // console.log("inslrclubUI.init()");
        this.theme.init();
        this.blocking.init();
        this.recent.init();
        this.autoHeight.init();
        this.roulette.init();
        this.font.init();
        this.css.init();
        this.adblock.init();
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
                console.log(userId ,  userName);
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
                // const btnInfo = btnUser.closest("ul").querySelector('[alt="info"]').closest("li");
                if (btnUser.id === "setBlockUser") {
                    console.log(btnUser.id + "버튼 클릭됨");
                    _this.addUser(userId , userName,);
                    // btnInfo.click();
                    // setTimeout(() => {
                        // const userNum = document.querySelector('#lookupbox').querySelector('[src*="info_joindate"]')?.closest('tr').querySelector('td:last-child').innerText.match(/\[\s*(\d+)번\s*회원\s*\]/)[1];
                        // console.log(userId , userNum);
                        // _this.addUser(userId , userName,);
                    // }, 200);
                }
            })
            document.addEventListener('click', (event) => {
                const btnUser = event.target.closest('[alt="새로고침"]');
                if (!btnUser) return;
                console.log('댓글 새로고침');
                setTimeout(()=>_this.set(), 500);
            })

            const target = document.getElementById('cmt_spinner');
            const observer = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    console.log('댓글 새로고침 : ');
                    setTimeout(()=>_this.set(), 100);
                });
            });
            if (target) observer?.observe(target);
        },
        addHTML: function(uid , name) {
            document.querySelector('#setBlockUser')?.remove(); // 기존의 memoLI 요소를 제거
            document.getElementById('su')?.querySelector('ul').insertAdjacentHTML('beforeend', `
                <li id="setBlockUser" href="javascript:;" class="${uid}" data-key=${uid} data-name="${name}">
                    <span>
                        <img src="https://media.slrclub.com/main/layer/icon_memo.gif" width="13" height="12" alt="info"><span>메모&차단 하기</span>
                    </span>
                </li>
            `);

            console.log('addHTML 호출됨');
        },
        addUser: function(uid , name) {
            if(uid === 'null'){
                uid = name;
            }
            console.log("addUser " +uid , name);
            chrome.storage.local.get('blockingData', (result) => {
                if (chrome.runtime.lastError) {
                    console.warn("storage 접근 실패:", chrome.runtime.lastError.message);
                    return;
                }
                blockingData = result.blockingData || blockingData;
                console.log('저장된 데이터:', result.blockingData);
                const oldKey = blockingData?.map(item => {
                    console.log(item.name, uid);
                    if (item.name === name || item.key === uid) {
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
                // 기존 데이터에서 같은 key 또는 name 값을 가진 요소를 제거
                blockingData = blockingData.filter(item => item.name !== newBlockingData.name && item.key !== newBlockingData.key);

                // 새로운 데이터를 배열의 맨 앞에 추가
                blockingData.unshift(newBlockingData);

                chrome.storage.local.set( {blockingData} , () => {
                    console.log('차단 데이터가 저장되었습니다:', blockingData);
                    location.reload(); // 페이지 새로고침
                });
            });

        },
        set: function() {
            chrome.storage.local.get(['blockingData','blockingEnabled'], (result) => {
                // console.log('저장된 데이터:', result.blockingData);
				const blockingData = result.blockingData ;
				const blockingEnabled = result.blockingEnabled ;
                if(blockingData === undefined) {
					chrome.storage.local.set({ blockingData: [] }, () => {
						console.log('차단 데이터가 초기화되었습니다.');
					});
				}
				if(blockingEnabled === undefined) {
					chrome.storage.local.set({ blockingEnabled: true }, () => {
						console.log('차단 기능이 활성화되었습니다.');
					});
				}
                
                document.querySelectorAll('.block_user').forEach(els => els.remove());
                
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
                            // if(els.classList.contains('re_prtnm')){
                            //     uname = els.innerText.replace(/^\[|\]$/g, "");
                            // }
                            // console.log( key , cutoff , name,  uname);
                            
                            if ( (name === uname)  ) {
                                // els.closest('li').style.opacity = '0.5';
                                els.insertAdjacentHTML('afterend', `<span class="block_user">[${memo}]</span>`);
                                // els.closest('li').style.display = 'none';
                                
                                if( cutoff){
                                    els.closest('li').querySelector('.cmtbt_ct').insertAdjacentHTML('afterend', `<span class="block_user box">차단 된 유저입니다.</span>`);
                                    els.closest('li').querySelector('.cmt-contents').style.display = 'none';
                                    els.closest('li').classList.add("isHide");
                                    // els.closest('li').querySelector('.cmtbt_ct').style.display = 'none';
                                }
                            }
                        });

                        document.querySelectorAll('#art-part .list li .name[data-uid]').forEach(els => {
                            const xuid = els.getAttribute('data-xuid');
                            const uname = els.innerText;
                            console.log( key , cutoff ,  xuid);
                            if ( name === uname || key === xuid ) {
                                els.insertAdjacentHTML('afterend', `<span class="block_user">[${memo}]</span>`);
                            }
                            if ( (name === uname || key === xuid ) && cutoff  && !els.closest('#bbs_view_head') ) {
                                els.closest('li').style.opacity = '0.5';
                                els.closest('li').style.display = 'none';
                            }
                        });
                        
                    });
                }
            });
            
        }
    },
    recent:{
        init: function() {
            this.set();
        },
        set: async function() {

            // 갤러리게시판일 경우 
            if( document.querySelector('[href*="/css/bbs_gal"]') ) {
                document.body.classList.add('isGal');
            }

            // console.log('setRecent');

            const name = document.querySelector('#bbs_view_head [data-xuid]')?.innerText;
            const uid = document.querySelector('#bbs_view_head [data-xuid]')?.getAttribute('data-xuid');

            document.querySelector('#recent_post')?.remove();
            document.querySelector('.rewview_title_wrap')?.insertAdjacentHTML('beforebegin', `<div class="recent_post" id="recent_post">RECENT_POST</div>`);

            
            const target = document.getElementById("recent_post");

            const jsonUrl = chrome.runtime.getURL("js/category.json");
            const category = await fetch(jsonUrl)
                .then(response => response.ok && response.json() )
                .then(data => data)
                .catch(err => console.error("JSON 파일 로드 실패:", err));
                
            await fetch(`/bbs/zboard.php?sid1=${uid}&setsearch=id&keyword=${uid}`)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");
                    const table = doc.querySelector("table"); // 첫 번째 <table>
                    if (table) {
                        target.innerHTML = "";
                        target.appendChild(table);
                        table.style.visibility = "visible";
                        table.querySelectorAll('tr .sbj a').forEach(els => {
                            // els.setAttribute('target', '_blank');
                            //  els.setAttribute('title', '새창 열림');
                            const url = els.href;
                            const id = new URL(url).searchParams.get("id");
                            // console.log(category[id]);
                            els.closest("tr").querySelector('.list_num').innerHTML = `<span class="cate">${category[id]}</span>`;
                            els.closest("tr").querySelector('.list_num').setAttribute('data-id', id);
                        });
                        document.getElementById('post_hd')?.remove();
                        target.insertAdjacentHTML('afterbegin', `
                            <div class="post_hd" id="post_hd">
                                <a href="/bbs/zboard.php?sid1=${uid}&setsearch=id&keyword=${uid}" target="_blank" class="link">
                                    <span class="name"><strong>${name}</strong> 님의 최근글</span>
                                    <span class="more">더보기 >></span>
                                </a>
                            </div>
                        `);
                    }else {
                        document.querySelector('#recent_post')?.remove();
                    }
                })
                .catch(err => {
                    console.error("요청 실패:", err)
                });
        }
    },
    autoHeight:{
        init: function() {
            this.evt();
        },
        evt: function() {
            const _this = this;
            document.addEventListener('input', (event) => {
                const el = event.target.closest(".cmt");
                if (el ) {
                    _this.set(el);
                }
            });
        },
        set: function(el) { // textarea 높이 자동 조절
            // console.log('el', el.tagName);
            // if(el.scrollHeight <= 73) return; 
            el.style.height = '73px'; // 초기화
            el.style.height = el.scrollHeight - 0  + 'px'; // 높이 조정
        }
    },
    roulette: {
        init: function() {
            
            const _this = this;
            
            chrome.storage.local.get(['isAutoRoulette'], (result) => {
                const isAutoRoulette = result.isAutoRoulette ;
                if(isAutoRoulette === undefined) {
                    chrome.storage.local.set({ isAutoRoulette: false }, () => {
                        // console.log('차단 데이터가 초기화되었습니다.');
                    });
                }
                if (isAutoRoulette === true) {
                    _this.time = setInterval( ()=> _this.start(), 3000);
                }
            });
        },
        run: function() {
            const _this = this;
            setTimeout( _this.end(), 5000);
        },
        start: function() {
            const _this = this;
            fetch('/service/game/roulette.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', }, body: 'gamestart=true' })
                .then(res => {
                    if (!res.ok) throw new Error('서버 응답 실패');
                    return res.json();  // JSON 응답 파싱
                })
                .then(data => {
                    if (data.msg === 'start') {
                        _this.run();
                    } else {
                        console.log(data);
                        clearInterval(_this.time); // 인터벌 중지
                    }
                })
                .catch(err => {
                    console.error('요청 실패:', err);
                });

        },
        end: function() {
            const _this = this;
            fetch('/service/game/roulette.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', }, body: 'gameend=true' })
                .then(res => {
                    if (!res.ok) throw new Error('서버 응답 실패');
                    return res.json();
                })
                .then(data => {
                    if (data.msg) {
                        console.log(data.msg);
                        alert(data.msg);
                        clearInterval(_this.time);
                    }
                })
                .catch(err => {
                    console.error('요청 실패:', err);
                });

        },
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
                chrome.storage.local.set({
                    theme: themeStat
                }, () => {
                    // console.log('테마가 설정되었습니다:', themeStat);
                });
            }
            setTheme();
        }
    },
    font: {
        init: function() {
            chrome.storage.local.get(['font'], (result) => {
                const font = result.font || '2';
                console.log('저장된 글꼴:', font);
                document.body.setAttribute('data-font',font);
                document.querySelector('#comment_box')?.setAttribute('data-font',font); // 즉시 적용
                chrome.storage.local.set({ font: font }, () => {
                    // console.log('차단 데이터가 초기화되었습니다.');
                });
            });
        }
    },     
    css: {
        init: function() {
            this.set();
        },
        set: function() {
            const cssurl = chrome.runtime.getURL("css/style1.css");
            const styleCss = `<link rel="stylesheet" type="text/css" href="${cssurl}">`;
            document.head.insertAdjacentHTML('beforeend', styleCss);

            // 자게 인기글 링크
            if(slrclubUI.param['id'] == 'free'){
                document.querySelector('a.bh.btn_hotart')?.setAttribute('href', '/bbs/zboard.php?id=hot_article&category=1&setsearch=category');
            }
        }
    },
    adblock: {
        init: function() {
            
            chrome.storage.local.get(['isAdblock'], (result) => {
				const isAdblock = result.isAdblock ;
                if (isAdblock === undefined) {
					chrome.storage.local.set({ isAdblock: false });
				}
                if (isAdblock === true) {
                    slrclubUI.adblock.set();      
                }
            });
            
        },
        set: function() {
            const cssurl = chrome.runtime.getURL("css/ad.css");
            const styleCss = `<link rel="stylesheet" type="text/css" href="${cssurl}">`;
            document.head.insertAdjacentHTML('beforeend', styleCss);
        }
    },
    param:(function(a) { // URL에서 파라미터 읽어오기  ui.param.***
		if (a == "") return {};
		var b = {};
		for (var i = 0; i < a.length; i++){
			var p=a[i].split('=');
			if (p.length != 2) continue;
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
		return b;
	})(window.location.search.substr(1).split('&')),
}

slrclubUI.init();




/* 

var run_valid = 0;

$(function () {
  $(".roulette_arrow").click(function () {
    if (run_valid == 0) {
      run_valid = 1;
      run_game();
      return false;
    } else {
      return false;
    }

  })
});

function run_roulette(deg) {
  deg = deg * -1;
  var div = document.getElementById('roulette');
  div.style.webkitTransform = 'rotate(' + deg + 'deg)';
  div.style.mozTransform = 'rotate(' + deg + 'deg)';
  div.style.msTransform = 'rotate(' + deg + 'deg)';
  div.style.oTransform = 'rotate(' + deg + 'deg)';
  div.style.transform = 'rotate(' + deg + 'deg)';
  setTimeout(end_game, 5000);

}
function end_game() {
  $.ajax({
    url: '/service/game/roulette.php', data: 'gameend=true', type: 'post',
    success: function (data) {
      if (data.msg) {
        alert(data.msg);
      }
    }
  });
}

function run_game() {
  $.ajax({
    url: '/service/game/roulette.php', data: 'gamestart=true', type: 'post',
    success: function (data) {
      if (data.msg == 'start') {
        run_roulette(data.angle);
      } else {
        alert(data.msg);
      }

    }
  });
}

 */