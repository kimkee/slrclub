const optionUI = {
    init: function() {

        document.querySelectorAll('.overflow-y-auto').forEach(target => {
            const observer = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    // console.log('크기 변경됨:', entry.contentRect);
                    const el = entry.target;
                    (el.scrollHeight > el.clientHeight) ? el.classList.add('pr-1') : el.classList.remove('pr-1');
                });
            });
            observer.observe(target);
        });

        this.adblock.init();
    },
    adblock: {
        init: function() {
            
            chrome.storage.local.get(['isAdblock'], (result) => {
				const isAdblock = result.isAdblock ;
                if (isAdblock === undefined) {
					chrome.storage.local.set({ isAdblock: false });
				}
                if (isAdblock === true) {
                    checkBoxAdBlock.checked = true;
                }
            });
            this.evt();
        },
        evt: function() {
            checkBoxAdBlock.addEventListener('change', () => {
                const isChecked = checkBoxAdBlock.checked;
                chrome.storage.local.set({ isAdblock: isChecked }, ()=> console.log(`AdBlock 설정이 ${isChecked ? '활성화' : '비활성화'}되었습니다.`) );
            });
        }
    }
    
}

optionUI.init();