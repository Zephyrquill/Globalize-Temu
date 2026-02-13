const translations = {
    tr: {
        extName: "Globalize Temu",
        extSub: "Yerel Ürün Filtresi",
        statusActive: "Uzantı Aktif",
        statusInactive: "Uzantı Devre Dışı",
        statusDescActive: "Yerel ürünler gizleniyor",
        statusDescInactive: "Tüm ürünler gösteriliyor"
    },
    en: {
        extName: "Globalize Temu",
        extSub: "Local Product Filter",
        statusActive: "Extension Active",
        statusInactive: "Extension Disabled",
        statusDescActive: "Local products are hidden",
        statusDescInactive: "All products are visible"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleBlocker');
    const btnTR = document.getElementById('btnTR');
    const btnEN = document.getElementById('btnEN');
    const btnLight = document.getElementById('btnLight');
    const btnDark = document.getElementById('btnDark');

    const elements = {
        extName: document.getElementById('extName'),
        extSub: document.getElementById('extSub'),
        statusLabel: document.getElementById('statusLabel'),
        statusDesc: document.getElementById('statusDesc')
    };

    chrome.storage.local.get({
        isEnabled: true,
        lang: 'tr',
        theme: 'light'
    }, (result) => {
        toggle.checked = result.isEnabled;
        setLanguage(result.lang);
        setTheme(result.theme);
        updateStatusUI(result.isEnabled, result.lang);
    });

    btnTR.addEventListener('click', () => setLanguage('tr', true));
    btnEN.addEventListener('click', () => setLanguage('en', true));

    function setLanguage(lang, save = false) {
        if (save) chrome.storage.local.set({ lang: lang });

        btnTR.classList.toggle('active', lang === 'tr');
        btnEN.classList.toggle('active', lang === 'en');

        updateStatusUI(toggle.checked, lang);
    }

    btnLight.addEventListener('click', () => setTheme('light', true));
    btnDark.addEventListener('click', () => setTheme('dark', true));

    function setTheme(theme, save = false) {
        if (save) chrome.storage.local.set({ theme: theme });

        document.body.classList.toggle('dark-mode', theme === 'dark');
        btnLight.classList.toggle('active', theme === 'light');
        btnDark.classList.toggle('active', theme === 'dark');
    }

    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.local.get(['lang'], (result) => {
            const currentLang = result.lang || 'tr';
            chrome.storage.local.set({ isEnabled: isEnabled }, () => {
                updateStatusUI(isEnabled, currentLang);

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]) {
                        chrome.tabs.reload(tabs[0].id);
                    }
                });
            });
        });
    });

    function updateStatusUI(isEnabled, lang) {
        const t = translations[lang];
        elements.extName.textContent = t.extName;
        elements.extSub.textContent = t.extSub;
        elements.statusLabel.textContent = isEnabled ? t.statusActive : t.statusInactive;
        elements.statusDesc.textContent = isEnabled ? t.statusDescActive : t.statusDescInactive;

        elements.statusLabel.style.color = isEnabled ? "#0a8800" : "#d32f2f";
    }
});
