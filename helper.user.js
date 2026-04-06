// ==UserScript==
// @name         FORUM HELPER Advance RP
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Помощник с работой на форуме
// @author       forzese
// @match        *://forum.adv-rp.com/*
// @match        *://*.adv-rp.com/*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/forzeska/ADVForumHelper/main/helper.user.js
// @downloadURL  https://raw.githubusercontent.com/forzeska/ADVForumHelper/main/helper.user.js
// ==/UserScript==

(function() {
    'use strict';

    const iconList = `<svg viewBox="0 0 512 512" width="14" height="14" fill="currentColor" style="margin-right:7px"><path d="M0 96C0 78.3 14.3 64 32 64H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>`;
    const iconLockToggle = `<svg viewBox="0 0 448 512" width="14" height="14" fill="currentColor" style="margin-right:7px"><path d="M144 144L144 192l160 0L304 144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l32 0 0-48C112 73.5 162.5 16 224 16s112 57.5 112 128l0 48 32 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-192c0-35.3 28.7-64 64-64z"/></svg>`;
    const iconBack = `<svg viewBox="0 0 448 512" width="16" height="16" fill="#888"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>`;
    const iconEllipsis = `<svg viewBox="0 0 448 512" width="18" height="18" fill="#ff4d4d"><path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0A56 56 0 1 1 168 256zm160 0a56 56 0 1 1 112 0A56 56 0 1 1 328 256z"/></svg>`;
    const iconXmark = `<svg viewBox="0 0 384 512" width="18" height="18" fill="#888"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        #helper-modal {
            user-select: none;
            opacity: 0;
            transform: scale(0.95);
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        #helper-modal.show {
            opacity: 1;
            transform: scale(1);
        }
        #helper-modal input, #helper-modal textarea { user-select: text; }
        #helper-modal *::-webkit-scrollbar { width: 6px; }
        #helper-modal *::-webkit-scrollbar-track { background: #111; border-radius: 10px; }
        #helper-modal *::-webkit-scrollbar-thumb { background: #ff4d4d; border-radius: 10px; }
        .helper-toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 100000;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
            pointer-events: none;
        }
        .helper-toast {
            background: #ff4d4d;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: sans-serif;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            transform: translateY(100px);
            transition: transform 0.3s ease, opacity 0.3s ease;
            opacity: 0;
            pointer-events: none;
        }
        .helper-toast.show {
            transform: translateY(0);
            opacity: 1;
        }
            .helper-toast.hide {
            transform: translateX(100%);
            opacity: 0;
        }
        .char-counter { font-size: 11px; color: #666; margin-left: 10px; font-family: monospace; }
        .char-counter.limit { color: #ff4d4d; font-weight: bold; }
        .helper-btn-tpl {
            padding: 12px 15px; background: #222; color: #fff; border: 1px solid #333;
            border-radius: 6px; cursor: pointer; font-size: 13px; transition: 0.2s;
            font-weight: 500; text-align: center; white-space: normal; word-wrap: break-word;
            display: flex; align-items: center; justify-content: center; min-height: 45px;
        }
        .helper-btn-tpl:hover { border-color: #ff4d4d; background: #2d1a1a; }
        .helper-search-input {
            width: 100%; background: #111; border: 1px solid #333; color: #fff;
            padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 13px; outline: none;
            transition: 0.2s; border-left: 3px solid #ff4d4d;
        }
        .helper-search-input:focus { border-color: #ff4d4d; }
        .prefix-option {
            padding: 12px 15px; background: #222; color: #fff; border: 1px solid #333;
            border-radius: 6px; cursor: pointer; font-size: 13px; margin-bottom: 8px;
            transition: 0.2s; text-align: center;
        }
        .prefix-option:hover { border-color: #ff4d4d; background: #2d1a1a; }
        .prefix-option.selected { border-color: #ff4d4d; background: #4d2a2a; box-shadow: 0 0 5px rgba(255,77,77,0.5); }
        .separator {
            height: 1px; background: #3d1a1a; margin: 15px 0; width: 100%;
        }
        .btn-group-wrapper {
            display: inline-flex;
            gap: 8px;
            margin-right: 8px;
            vertical-align: middle;
            user-select: none;
            align-items: center;
        }
        .helper-hidden-overlay {
            position: fixed !important;
            left: -9999px !important;
            top: -9999px !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
            z-index: -1 !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transition: none !important;
        }
        .helper-hidden-overlay .overlay,
        .helper-hidden-overlay .overlay *,
        .helper-hidden-overlay .overlay-container {
            opacity: 0 !important;
            visibility: hidden !important;
            background: transparent !important;
            box-shadow: none !important;
            transform: none !important;
            transition: none !important;
            animation: none !important;
        }
    `;
    document.head.appendChild(styleSheet);

    let templates = JSON.parse(localStorage.getItem('xf_templates')) || [
        { title: "Приятной игры", text: "Здравствуйте!\nПриятной игры!|" }
    ];

    window.__helperSelectedPrefix = null;
    let cachedEditData = null;
    let isFetchingPrefixes = false;

    function showToast(text) {
        let container = document.querySelector('.helper-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'helper-toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'helper-toast';
        toast.innerText = text;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
                if (container.children.length === 0) container.remove();
            }, 300);
        }, 3500);
    }

    function forceRestoreScroll() {
        const classesToRemove = [
            'hasOverlay', 'overlay-open', 'modal-open', 'overflow-hidden',
            'no-scroll', 'scroll-disabled', 'xenOverlay', 'hasModal'
        ];
        classesToRemove.forEach(cls => {
            document.body.classList.remove(cls);
            document.documentElement.classList.remove(cls);
        });
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflowY = '';
        document.documentElement.style.overflowY = '';
        document.body.style.position = '';
        document.documentElement.style.position = '';
        document.body.style.paddingRight = '';
        document.documentElement.style.paddingRight = '';
        document.body.style.top = '';
        document.documentElement.style.top = '';
        const wrappers = document.querySelectorAll('.p-body-wrapper, .p-body-main, .p-body, .p-pageWrapper');
        wrappers.forEach(wrapper => {
            if (window.getComputedStyle(wrapper).overflow === 'hidden') {
                wrapper.style.overflow = '';
            }
        });
    }

    function cleanupOverlayArtifacts() {
        document.querySelectorAll('.overlay, .overlay-container, .xfOverlay, .menu--potentialFixed, .xenOverlay').forEach(el => {
            if (!el.closest('.helper-hidden-overlay')) el.remove();
        });
        forceRestoreScroll();
        document.querySelectorAll('.overlay-blur, .modal-backdrop, .fade').forEach(el => el.remove());
    }

    async function fetchEditDataWithHiddenOverlay() {
        if (cachedEditData) return cachedEditData;
        if (isFetchingPrefixes) {
            await new Promise(r => setTimeout(r, 200));
            return cachedEditData;
        }
        isFetchingPrefixes = true;

        const editLink = Array.from(document.querySelectorAll('a.menu-linkRow')).find(
            link => link.textContent.trim() === 'Редактировать тему'
        );
        if (!editLink) {
            isFetchingPrefixes = false;
            return null;
        }

        const hiddenContainer = document.createElement('div');
        hiddenContainer.className = 'helper-hidden-overlay';
        document.body.appendChild(hiddenContainer);

        let overlayPromise = new Promise((resolve) => {
            const observer = new MutationObserver(() => {
                const overlay = document.querySelector('.overlay:not([aria-hidden="true"])');
                if (overlay && !hiddenContainer.contains(overlay)) {
                    observer.disconnect();
                    resolve(overlay);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => { observer.disconnect(); resolve(null); }, 3000);
        });

        editLink.click();
        let overlay = await overlayPromise;

        if (!overlay) {
            hiddenContainer.remove();
            isFetchingPrefixes = false;
            cleanupOverlayArtifacts();
            return null;
        }

        hiddenContainer.appendChild(overlay);
        overlay.style.cssText = 'opacity:0 !important; visibility:hidden !important; pointer-events:none !important; transition:none !important;';
        forceRestoreScroll();

        let form = null;
        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 100));
            form = overlay.querySelector('form');
            if (form) break;
        }

        if (!form) {
            hiddenContainer.remove();
            isFetchingPrefixes = false;
            cleanupOverlayArtifacts();
            return null;
        }

        const title = form.querySelector('input[name="title"]')?.value || '';
        const token = form.querySelector('input[name="_xfToken"]')?.value || '';
        const sticky = form.querySelector('input[name="sticky"]')?.checked ? '1' : '0';
        const indexState = form.querySelector('input[name="index_state"]:checked')?.value || 'default';
        const editUrl = form.getAttribute('action');

        let prefixSelect = form.querySelector('select[name="prefix_id"]');
        let prefixOptions = [];
        if (prefixSelect) {
            prefixOptions = Array.from(prefixSelect.querySelectorAll('option')).map(opt => ({
                id: opt.value,
                name: opt.textContent.trim() || '(Без префикса)'
            })).filter(opt => opt.id !== undefined);
        } else {
            await new Promise(r => setTimeout(r, 500));
            prefixSelect = form.querySelector('select[name="prefix_id"]');
            if (prefixSelect) {
                prefixOptions = Array.from(prefixSelect.querySelectorAll('option')).map(opt => ({
                    id: opt.value,
                    name: opt.textContent.trim() || '(Без префикса)'
                })).filter(opt => opt.id !== undefined);
            }
        }

        const closeBtn = overlay.querySelector('.overlay-titleCloser');
        if (closeBtn) closeBtn.click();
        hiddenContainer.remove();
        cleanupOverlayArtifacts();

        cachedEditData = { title, token, sticky, indexState, editUrl, prefixOptions };
        isFetchingPrefixes = false;
        return cachedEditData;
    }

    async function changePrefixAndClose(prefixId) {
        if (!cachedEditData) {
            cachedEditData = await fetchEditDataWithHiddenOverlay();
            if (!cachedEditData) return false;
        }
        const data = cachedEditData;
        const formData = new URLSearchParams();
        formData.append('_xfToken', data.token);
        formData.append('title', data.title);
        formData.append('prefix_id', prefixId);
        formData.append('discussion_open', '0');
        formData.append('sticky', data.sticky);
        formData.append('index_state', data.indexState);
        formData.append('_xfSet[discussion_open]', '1');
        formData.append('_xfSet[sticky]', '1');
        formData.append('_xfSet[index_state]', '1');
        formData.append('_xfResponseType', 'json');
        formData.append('_xfWithData', '1');
        formData.append('_xfRequestUri', window.location.pathname);
        formData.append('_xfToken', data.token);

        let editUrl = data.editUrl;
        if (!editUrl) {
            const threadMatch = window.location.pathname.match(/\/threads\/[^\/]+\.(\d+)/);
            if (threadMatch) {
                editUrl = `/threads/${threadMatch[0].split('/').pop()}/edit`;
                if (!editUrl.startsWith('http')) editUrl = window.location.origin + editUrl;
            }
        }
        if (!editUrl) return false;

        try {
            const response = await fetch(editUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData,
                credentials: 'same-origin'
            });
            const result = await response.json();
            return result._redirectStatus === 'ok' || response.ok;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async function handleReplyAndCloseWithPrefix() {
        const editor = document.querySelector('.fr-element');
        if (!editor || editor.innerText.trim() === "") {
            showToast('Текстовое поле не может быть пустым');
            return;
        }

        const replyBtn = document.querySelector('button.button--primary.button--icon--reply');
        if (!replyBtn) {
            showToast('Не найдена кнопка ответа');
            return;
        }
        replyBtn.click();
        showToast('Отправка ответа...');
        await new Promise(r => setTimeout(r, 1500));

        if (window.__helperSelectedPrefix && window.__helperSelectedPrefix !== '0') {
            showToast('Меняем префикс и закрываем тему...');
            const success = await changePrefixAndClose(window.__helperSelectedPrefix);
            if (success) {
                showToast('Префикс изменён, тема закрыта!');
                setTimeout(() => location.reload(), 1500);
            } else {
                showToast('Не удалось изменить префикс');
            }
        } else {
            const closeLink = Array.from(document.querySelectorAll('a.menu-linkRow')).find(link => link.textContent.includes('Закрыть тему'));
            if (closeLink) {
                closeLink.click();
                showToast('Тема закрыта');
                setTimeout(() => location.reload(), 1500);
            } else {
                showToast('Не найдена ссылка закрытия темы');
            }
        }
    }

    function hookRegularReplyButton() {
        const replyBtn = document.querySelector('button.button--primary.button--icon--reply');
        if (!replyBtn) return;
        if (replyBtn._helperHooked) return;
        replyBtn._helperHooked = true;
        replyBtn.addEventListener('click', async function() {
            setTimeout(async () => {
                if (window.__helperSelectedPrefix && window.__helperSelectedPrefix !== '0') {
                    showToast('Применяем выбранный префикс...');
                    const success = await changePrefixAndClose(window.__helperSelectedPrefix);
                    if (success) {
                        showToast('Префикс применён!');
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        showToast('Не удалось применить префикс');
                    }
                }
            }, 2000);
        });
    }

    function injectButtons() {
        const replyBtn = document.querySelector('button.button--primary.button--icon--reply');
        if (!replyBtn) return;
        if (document.querySelector('.js-helper-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'js-helper-wrapper btn-group-wrapper';

        const tplBtn = createSvgBtn('Шаблоны', iconList, replyBtn, () => renderMainModal());
        wrapper.appendChild(tplBtn);

        const lockLink = Array.from(document.querySelectorAll('a.menu-linkRow')).find(l => l.textContent.includes('Закрыть тему'));
        const unlockLink = Array.from(document.querySelectorAll('a.menu-linkRow')).find(l => l.textContent.includes('Открыть тему'));

        if (unlockLink) {
            const openBtn = createSvgBtn('Открыть тему', iconLockToggle, replyBtn, () => {
                unlockLink.click();
                showToast('Тема открывается...');
                setTimeout(() => location.reload(), 1000);
            });
            wrapper.appendChild(openBtn);
        } else if (lockLink) {
            const closeBtn = createSvgBtn('Закрыть тему', iconLockToggle, replyBtn, async () => {
                if (window.__helperSelectedPrefix && window.__helperSelectedPrefix !== '0') {
                    showToast('Меняем префикс и закрываем тему...');
                    const success = await changePrefixAndClose(window.__helperSelectedPrefix);
                    if (success) {
                        showToast('Префикс изменён, тема закрыта!');
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        showToast('Не удалось изменить префикс');
                    }
                } else {
                    lockLink.click();
                    showToast('Тема закрывается...');
                    setTimeout(() => location.reload(), 1000);
                }
            });
            wrapper.appendChild(closeBtn);
            const replyCloseBtn = createSvgBtn('Ответить и закрыть', iconList, replyBtn, async () => {
                await handleReplyAndCloseWithPrefix();
            });
            wrapper.appendChild(replyCloseBtn);
        }

        replyBtn.parentNode.insertBefore(wrapper, replyBtn);
        hookRegularReplyButton();
    }

    function createSvgBtn(text, svgHtml, sampleBtn, onClick) {
        let b = document.createElement('button');
        b.type = 'button';
        b.className = sampleBtn.className.replace('button--icon--reply', '');
        b.innerHTML = `${svgHtml}<span class="button-text">${text}</span>`;
        const style = window.getComputedStyle(sampleBtn);
        b.style.cssText = `cursor:pointer; white-space:nowrap; background-color:${style.backgroundColor}; color:${style.color}; padding:${style.padding}; border-radius:${style.borderRadius}; font-size:${style.fontSize}; font-weight:${style.fontWeight}; border:${style.border}; height:${style.height}; display:inline-flex; align-items:center; justify-content:center; transition:0.2s;`;
        b.onclick = (e) => { e.preventDefault(); onClick(); };
        return b;
    }

    async function renderMainModal() {
        removeOldModal();

        const isList = templates.length <= 5;
        const modalWidth = isList ? "500px" : "950px";
        const gridStyle = isList
            ? "display: flex; flex-direction: column; gap: 10px;"
            : "display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;";

        let m = document.createElement('div');
        m.id = 'helper-modal';
        m.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background: linear-gradient(145deg, #1a1a1a, #111); border: 1px solid #ff4d4d; padding: 25px; z-index: 99999; box-shadow: 0 0 45px rgba(255,77,77,0.3); border-radius: 12px; width: ${modalWidth}; max-height: 85vh; overflow-y: auto; color: white;`;
        m.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid #3d1a1a;">
                <div style="width:40px; display:flex; justify-content:flex-start;">
                    <img src="https://forum.adv-rp.com/data/avatars/l/0/54.jpg?1772846064" style="height:40px; width:40px; border-radius: 80%; object-fit: cover;" alt="logo">
                </div>
                <div style="flex:1; text-align:center; font-weight:bold; letter-spacing:1px; color:#ff4d4d; font-size:14px; text-transform: uppercase;">FORUM HELPER</div>
                <div style="width:40px; display:flex; gap:12px; justify-content:flex-end;">
                    <span id="open-settings" style="cursor:pointer; display:flex;">${iconEllipsis}</span>
                    <span id="close-modal" style="cursor:pointer; display:flex;">${iconXmark}</span>
                </div>
            </div>
            <input type="text" id="helper-search" class="helper-search-input" placeholder="Поиск шаблонов...">
            <div style="margin-top:5px;">
                <div style="text-align:center; font-weight:bold; letter-spacing:1px; color:#ff4d4d; font-size:13px; text-transform: uppercase; margin-bottom:10px;">ПРЕФИКСЫ</div>
                <div class="separator"></div>
                <div id="prefixes-list" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                    <div style="color:#888; padding:10px;">Загрузка префиксов...</div>
                </div>
            </div>
            <div class="separator"></div>
            <div style="margin-top:5px;">
                <div style="text-align:center; font-weight:bold; letter-spacing:1px; color:#ff4d4d; font-size:13px; text-transform: uppercase; margin-bottom:10px;">ШАБЛОНЫ</div>
                <div class="separator"></div>
            </div>
            <div id="templates-list" style="${gridStyle} max-height:40vh; overflow-y:auto; padding-right:5px;"></div>
        `;
        document.body.appendChild(m);
        m.offsetHeight;
        m.classList.add('show');

        const listContainer = m.querySelector('#templates-list');
        const searchInput = m.querySelector('#helper-search');
        const drawTemplates = (filter = "") => {
            listContainer.innerHTML = "";
            const filtered = templates.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()));
            filtered.forEach((t) => {
                let b = document.createElement('button');
                b.innerText = t.title;
                b.className = 'helper-btn-tpl';
                if (isList) b.style.width = "100%";
                b.onclick = () => {
                    insertText(t.text);
                    closeModal();
                };
                listContainer.appendChild(b);
            });
        };
        drawTemplates();
        searchInput.oninput = (e) => drawTemplates(e.target.value);

        let prefixes = [];
        try {
            const editData = await fetchEditDataWithHiddenOverlay();
            if (editData && editData.prefixOptions) prefixes = editData.prefixOptions;
        } catch(e) { console.warn(e); }

        const prefixesContainer = m.querySelector('#prefixes-list');
        if (prefixesContainer) {
            if (prefixes.length > 0) {
                prefixesContainer.innerHTML = '';
                prefixes.forEach(prefix => {
                    const btn = document.createElement('div');
                    btn.className = 'prefix-option';
                    btn.textContent = prefix.name;
                    btn.dataset.id = prefix.id;
                    if (window.__helperSelectedPrefix === prefix.id) btn.classList.add('selected');
                    btn.onclick = () => {
                        document.querySelectorAll('#prefixes-list .prefix-option').forEach(el => el.classList.remove('selected'));
                        btn.classList.add('selected');
                        window.__helperSelectedPrefix = prefix.id;
                        showToast(`Выбран префикс: ${prefix.name}`);
                    };
                    prefixesContainer.appendChild(btn);
                });
            } else {
                prefixesContainer.innerHTML = '<div style="color:#888; padding:10px; text-align:center;">Префиксы не найдены</div>';
            }
        }

        document.getElementById('close-modal').onclick = closeModal;
        document.getElementById('open-settings').onclick = () => {
            closeModal();
            renderSettingsModal();
        };
    }

    function closeModal() {
        const modal = document.getElementById('helper-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                if (modal.parentNode) modal.remove();
                cleanupOverlayArtifacts();
            }, 250);
        } else {
            cleanupOverlayArtifacts();
        }
    }

    function removeOldModal() {
        const old = document.getElementById('helper-modal');
        if (old) old.remove();
        cleanupOverlayArtifacts();
    }

    function renderSettingsModal() {
        let modal = document.getElementById('helper-modal');

        if (modal && modal.dataset.mode === 'settings') {
            const container = modal.querySelector('#settings-container');
            if (container) {
                container.innerHTML = '';
                templates.forEach((t, i) => {
                    let div = document.createElement('div');
                    div.style.cssText = 'background:#1f1f1f; padding:12px; margin-bottom:12px; border-radius:8px; border:1px solid #333; position:relative;';
                    div.innerHTML = `
                    <div style="display:flex; align-items:center; margin-bottom:8px;">
                        <input type="text" class="t-title-input" value="${t.title.replace(/"/g, '&quot;')}" style="flex:1; background:#111; color:#ff4d4d; border:1px solid #333; padding:8px; border-radius:4px; font-weight:bold; border-left: 3px solid #ff4d4d;">
                        <span class="char-counter" id="cnt-${i}">${t.title.length}/30</span>
                    </div>
                    <textarea class="t-text-input" style="width:100%; background:#111; color:#bbb; border:1px solid #333; padding:8px; height:80px; border-radius:4px; resize:none; font-size:13px;">${t.text.replace(/</g, '&lt;')}</textarea>
                    <div class="del-t" style="position:absolute; top:12px; right:55px; width:24px; height:24px; background:#3d1a1a; color:#ff4d4d; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; border: 1px solid #ff4d4d;">&times;</div>`;
                    container.appendChild(div);

                    const titleInput = div.querySelector('.t-title-input');
                    const counterSpan = div.querySelector(`#cnt-${i}`);
                    titleInput.oninput = (e) => {
                        let val = e.target.value;
                        if (val.length > 30) { val = val.substring(0, 30); e.target.value = val; showToast('Лимит 30 символов'); }
                        templates[i].title = val;
                        counterSpan.innerText = `${val.length}/30`;
                        val.length === 30 ? counterSpan.classList.add('limit') : counterSpan.classList.remove('limit');
                    };
                    div.querySelector('.t-text-input').oninput = (e) => { templates[i].text = e.target.value; };
                    div.querySelector('.del-t').onclick = () => { templates.splice(i, 1); renderSettingsModal(); };
                });
                const counterSpan = modal.querySelector('.settings-counter');
                if (counterSpan) counterSpan.innerText = `${templates.length}/30`;
            }
            return;
        }

        if (modal) modal.remove();
        let m = document.createElement('div');
        m.id = 'helper-modal';
        m.dataset.mode = 'settings';
        m.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:#161616; border:1px solid #ff4d4d; padding:20px; z-index:99999; box-shadow:0 0 40px rgba(255,77,77,0.3); border-radius:12px; width:650px; color:white;';

        m.innerHTML = `
            <div style="display:flex; align-items:center; margin-bottom:15px; border-bottom:1px solid #3d1a1a; padding-bottom:10px; position:relative;">
                <span id="back-to-main" style="cursor:pointer; position:absolute; left:0; display:flex;">${iconBack}</span>
                <div style="width:100%; text-align:center; font-weight:bold; color:#ff4d4d; text-transform: uppercase;">РЕДАКТОР ШАБЛОНОВ</div>
                <span style="position:absolute; right:0; font-size:12px; color:#666;" class="settings-counter">${templates.length}/30</span>
            </div>
            <div id="settings-container" style="max-height:450px; overflow-y:auto; margin-bottom:15px; padding-right:5px;"></div>
            <button id="add-template" style="width:100%; padding:10px; background:#1e1e1e; color:#ff4d4d; border:1px solid #ff4d4d; border-radius:6px; cursor:pointer; margin-bottom:10px; font-weight:bold;">+ ДОБАВИТЬ НОВЫЙ</button>
            <button id="save-settings" style="width:100%; padding:12px; background:#ff4d4d; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">СОХРАНИТЬ</button>
        `;
        document.body.appendChild(m);
        m.offsetHeight;
        m.classList.add('show');

        const container = m.querySelector('#settings-container');
        templates.forEach((t, i) => {
            let div = document.createElement('div');
            div.style.cssText = 'background:#1f1f1f; padding:12px; margin-bottom:12px; border-radius:8px; border:1px solid #333; position:relative;';
            div.innerHTML = `
                <div style="display:flex; align-items:center; margin-bottom:8px;">
                    <input type="text" class="t-title-input" value="${t.title.replace(/"/g, '&quot;')}" style="flex:1; background:#111; color:#ff4d4d; border:1px solid #333; padding:8px; border-radius:4px; font-weight:bold; border-left: 3px solid #ff4d4d;">
                    <span class="char-counter" id="cnt-${i}">${t.title.length}/30</span>
                </div>
                <textarea class="t-text-input" style="width:100%; background:#111; color:#bbb; border:1px solid #333; padding:8px; height:80px; border-radius:4px; resize:none; font-size:13px;">${t.text.replace(/</g, '&lt;')}</textarea>
                <div class="del-t" style="position:absolute; top:12px; right:55px; width:24px; height:24px; background:#3d1a1a; color:#ff4d4d; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; border: 1px solid #ff4d4d;">&times;</div>
            `;
            container.appendChild(div);

            const titleInput = div.querySelector('.t-title-input');
            const counterSpan = div.querySelector(`#cnt-${i}`);
            titleInput.oninput = (e) => {
                let val = e.target.value;
                if (val.length > 30) { val = val.substring(0, 30); e.target.value = val; showToast('Лимит 30 символов'); }
                templates[i].title = val;
                counterSpan.innerText = `${val.length}/30`;
                val.length === 30 ? counterSpan.classList.add('limit') : counterSpan.classList.remove('limit');
            };
            div.querySelector('.t-text-input').oninput = (e) => { templates[i].text = e.target.value; };
            div.querySelector('.del-t').onclick = () => { templates.splice(i, 1); renderSettingsModal(); };
        });

        document.getElementById('back-to-main').onclick = () => {
            closeModal();
            renderMainModal();
        };
        document.getElementById('add-template').onclick = () => {
            if (templates.length >= 30) { showToast('Допустимое количество шаблонов - 30'); return; }
            templates.push({ title: "Новый шаблон", text: "" });
            renderSettingsModal();
        };
        document.getElementById('save-settings').onclick = () => {
            localStorage.setItem('xf_templates', JSON.stringify(templates));
            showToast('Сохранено!');
            closeModal();
            renderMainModal();
        };
    }

    function insertText(text) {
        const editor = document.querySelector('.fr-element');
        if (!editor) return;
        editor.focus();
        const formattedText = text.replace(/\n/g, '<br>');
        const marker = '#';
        if (!formattedText.includes(marker)) {
            document.execCommand('insertHTML', false, formattedText + '<br>');
        } else {
            const htmlToInsert = formattedText.replace(marker, '<span id="temp-marker"></span>');
            document.execCommand('insertHTML', false, htmlToInsert);
            const m = document.getElementById('temp-marker');
            if (m) {
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStartBefore(m);
                range.collapse(true);
                sel.removeAllRanges(); sel.addRange(range);
                m.remove();
            }
        }
    }

    setInterval(() => {
        injectButtons();
    }, 1000);
})();
