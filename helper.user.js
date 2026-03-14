// ==UserScript==
// @name         FORUM HELPER Advance RP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Помощник с работой на форуме
// @author       You
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
    const iconLockReply = `<svg viewBox="0 0 448 512" width="14" height="14" fill="currentColor" style="margin-right:7px"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>`;
    const iconLockToggle = `<svg viewBox="0 0 448 512" width="14" height="14" fill="currentColor" style="margin-right:7px"><path d="M144 144L144 192l160 0L304 144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l32 0 0-48C112 73.5 162.5 16 224 16s112 57.5 112 128l0 48 32 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-192c0-35.3 28.7-64 64-64z"/></svg>`;
    const iconBack = `<svg viewBox="0 0 448 512" width="16" height="16" fill="#888"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>`;
    const iconEllipsis = `<svg viewBox="0 0 448 512" width="18" height="18" fill="#ff4d4d"><path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0A56 56 0 1 1 168 256zm160 0a56 56 0 1 1 112 0A56 56 0 1 1 328 256z"/></svg>`;
    const iconXmark = `<svg viewBox="0 0 384 512" width="18" height="18" fill="#888"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        #helper-modal { user-select: none; }
        #helper-modal input, #helper-modal textarea { user-select: text; }
        #helper-modal *::-webkit-scrollbar { width: 6px; }
        #helper-modal *::-webkit-scrollbar-track { background: #111; border-radius: 10px; }
        #helper-modal *::-webkit-scrollbar-thumb { background: #ff4d4d; border-radius: 10px; }
        .helper-toast {
            position: fixed; bottom: 20px; right: 20px; background: #ff4d4d; color: white;
            padding: 12px 24px; border-radius: 8px; z-index: 100000; font-family: sans-serif;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5); transform: translateY(100px); transition: 0.4s;
            user-select: none;
        }
        .helper-toast.show { transform: translateY(0); }
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
    `;
    document.head.appendChild(styleSheet);

    let templates = JSON.parse(localStorage.getItem('xf_templates')) || [
        { title: "✅ Приятной игры", text: "Здравствуйте!\nПриятной игры!|" }
    ];

    function showToast(text) {
        const t = document.createElement('div');
        t.className = 'helper-toast';
        t.innerText = text;
        document.body.appendChild(t);
        setTimeout(() => t.classList.add('show'), 100);
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
    }

    function inject() {
        if (document.querySelector('.js-helper-btn')) return;
        const replyBtn = document.querySelector('button.button--primary.button--icon--reply');
        if (replyBtn) {
            const wrapper = document.createElement('div');
            wrapper.className = 'js-helper-btn';
            wrapper.style.cssText = 'display: inline-flex; gap: 8px; margin-right: 8px; vertical-align: middle; user-select: none;';
            const lockLink = Array.from(document.querySelectorAll('a.menu-linkRow')).find(l => l.textContent.includes('Закрыть тему'));
            const unlockLink = Array.from(document.querySelectorAll('a.menu-linkRow')).find(l => l.textContent.includes('Открыть тему'));

            wrapper.appendChild(createSvgBtn('Шаблоны', iconList, replyBtn, () => renderMainModal()));

            if (lockLink) {
                wrapper.appendChild(createSvgBtn('Ответить и закрыть', iconLockReply, replyBtn, () => handleReplyAndClose(true)));
            }

            if (unlockLink) {
                wrapper.appendChild(createSvgBtn('Открыть тему', iconLockToggle, replyBtn, () => {
                    unlockLink.click();
                    showToast('Тема открывается...');
                    setTimeout(() => { location.reload(); }, 1000);
                }));
            } else if (lockLink) {
                wrapper.appendChild(createSvgBtn('Закрыть тему', iconLockToggle, replyBtn, () => {
                    lockLink.click();
                    showToast('Тема закрывается...');
                    setTimeout(() => { location.reload(); }, 1000);
                }));
            }
            replyBtn.before(wrapper);
        }
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

    function renderMainModal() {
        removeOldModal();
        let m = document.createElement('div');
        m.id = 'helper-modal';

        const isList = templates.length <= 5;
        const modalWidth = isList ? "450px" : "950px";
        const gridStyle = isList
            ? "display: flex; flex-direction: column; gap: 10px;"
            : "display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;";

        m.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background: linear-gradient(145deg, #1a1a1a, #111); border: 1px solid #ff4d4d; padding: 25px; z-index: 99999; box-shadow: 0 0 45px rgba(255, 77, 77, 0.3); border-radius: 12px; width: ${modalWidth}; color: white; font-family: 'Segoe UI', sans-serif; transition: 0.2s;`;

        m.innerHTML = `<div style="display:flex; align-items:center; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid #3d1a1a; position:relative;">
            <div style="width:100%; text-align:center; font-weight:bold; letter-spacing:1px; color:#ff4d4d; font-size:14px; text-transform: uppercase;">FORUM HELPER</div>
            <div style="display:flex; gap:12px; align-items:center; position:absolute; right:0;">
                <span id="open-settings" style="cursor:pointer; display:flex;">${iconEllipsis}</span>
                <span id="close-modal" style="cursor:pointer; display:flex;">${iconXmark}</span>
            </div>
        </div>
        <input type="text" id="helper-search" class="helper-search-input" placeholder="Поиск по названию...">
        <div id="templates-list" style="${gridStyle} max-height:60vh; overflow-y:auto; padding-right:5px;"></div>`;

        document.body.appendChild(m);
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
                b.onclick = () => { insertText(t.text); removeOldModal(); };
                listContainer.appendChild(b);
            });
        };

        drawTemplates();
        searchInput.oninput = (e) => drawTemplates(e.target.value);
        searchInput.focus();

        document.getElementById('close-modal').onclick = removeOldModal;
        document.getElementById('open-settings').onclick = renderSettingsModal;
    }

    function renderSettingsModal() {
        removeOldModal();
        let m = document.createElement('div');
        m.id = 'helper-modal';
        m.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:#161616; border:1px solid #ff4d4d; padding:20px; z-index:99999; box-shadow:0 0 40px rgba(255,77,77,0.3); border-radius:12px; width:650px; color:white; font-family:sans-serif;';

        m.innerHTML = `<div style="display:flex; align-items:center; margin-bottom:15px; border-bottom:1px solid #3d1a1a; padding-bottom:10px; position:relative;">
            <span id="back-to-main" style="cursor:pointer; position:absolute; left:0; display:flex;">${iconBack}</span>
            <div style="width:100%; text-align:center; font-weight:bold; color:#ff4d4d; text-transform: uppercase;">РЕДАКТОР ШАБЛОНОВ</div>
            <span style="position:absolute; right:0; font-size:12px; color:#666;">${templates.length}/30</span>
        </div>
        <div id="settings-container" style="max-height:450px; overflow-y:auto; margin-bottom:15px; padding-right:5px;"></div>
        <button id="add-template" style="width:100%; padding:10px; background:#1e1e1e; color:#ff4d4d; border:1px solid #ff4d4d; border-radius:6px; cursor:pointer; margin-bottom:10px; font-weight:bold;">+ ДОБАВИТЬ НОВЫЙ</button>
        <button id="save-settings" style="width:100%; padding:12px; background:#ff4d4d; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">СОХРАНИТЬ</button>`;

        document.body.appendChild(m);
        const container = document.getElementById('settings-container');

        templates.forEach((t, i) => {
            let div = document.createElement('div');
            div.style.cssText = 'background:#1f1f1f; padding:12px; margin-bottom:12px; border-radius:8px; border:1px solid #333; position:relative;';
            div.innerHTML = `
                <div style="display:flex; align-items:center; margin-bottom:8px;">
                    <input type="text" class="t-title-input" value="${t.title}" style="flex:1; background:#111; color:#ff4d4d; border:1px solid #333; padding:8px; border-radius:4px; font-weight:bold; border-left: 3px solid #ff4d4d;">
                    <span class="char-counter" id="cnt-${i}">${t.title.length}/30</span>
                </div>
                <textarea class="t-text-input" style="width:100%; background:#111; color:#bbb; border:1px solid #333; padding:8px; height:80px; border-radius:4px; resize:none; font-size:13px; font-family: sans-serif;">${t.text}</textarea>
                <div class="del-t" style="position:absolute; top:12px; right:55px; width:24px; height:24px; background:#3d1a1a; color:#ff4d4d; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; border: 1px solid #ff4d4d;">&times;</div>`;
            container.appendChild(div);

            const titleInput = div.querySelector('.t-title-input');
            const counter = div.querySelector(`#cnt-${i}`);

            titleInput.oninput = (e) => {
                let val = e.target.value;
                if (val.length > 30) { val = val.substring(0, 30); e.target.value = val; showToast('Лимит 30 символов'); }
                templates[i].title = val;
                counter.innerText = `${val.length}/30`;
                val.length === 30 ? counter.classList.add('limit') : counter.classList.remove('limit');
            };
            div.querySelector('.t-text-input').oninput = (e) => { templates[i].text = e.target.value; };
            div.querySelector('.del-t').onclick = () => { templates.splice(i, 1); renderSettingsModal(); };
        });

        document.getElementById('back-to-main').onclick = renderMainModal;
        document.getElementById('add-template').onclick = () => {
            if (templates.length >= 30) { showToast('Допустимое количество шаблонов - 30'); return; }
            templates.push({ title: "Новый шаблон", text: "" }); renderSettingsModal();
        };
        document.getElementById('save-settings').onclick = () => {
            localStorage.setItem('xf_templates', JSON.stringify(templates));
            renderMainModal(); showToast('Сохранено!');
        };
    }

    function removeOldModal() { const old = document.getElementById('helper-modal'); if (old) old.remove(); }

    function insertText(text) {
        const editor = document.querySelector('.fr-element');
        if (!editor) return;
        editor.focus();
        const formattedText = text.replace(/\n/g, '<br>');
        const marker = '|';
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

    function handleReplyAndClose(withReply) {
        const replyBtn = document.querySelector('button.button--primary.button--icon--reply');
        const closeLink = Array.from(document.querySelectorAll('a.menu-linkRow')).find(link => link.textContent.includes('Закрыть тему'));
        const editor = document.querySelector('.fr-element');

        if (!editor || editor.innerText.trim() === "") {
            showToast('Текстовое поле не может быть пустым');
            return;
        }

        if (withReply && replyBtn) {
            replyBtn.click();
            if (closeLink) {
                setTimeout(() => {
                    closeLink.click();
                    setTimeout(() => { location.reload(); }, 1000);
                }, 1500);
            }
            showToast('Отправка...');
        }
    }

    setInterval(inject, 1000);
})();
