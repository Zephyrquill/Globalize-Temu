let isEnabled = true;

chrome.storage.local.get({ isEnabled: true }, (result) => {
    isEnabled = result.isEnabled;
    if (isEnabled) {
        hideLocalProducts();
    }
});

const hideLocalProducts = () => {
    if (!isEnabled) return;

    const markers = document.querySelectorAll('.C9HMW0KN, ._1O9WmJi_');
    markers.forEach(marker => {
        const productCard = marker.closest('.EKDT7a3v') ||
            marker.closest('.Ois68FAW') ||
            marker.closest('div[role="group"]');

        if (productCard && productCard.style.display !== 'none') {
            productCard.style.display = 'none';
        }
    });

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.src || img.dataset.src || "";
        if (src.includes('local-image')) {
            const productCard = img.closest('.EKDT7a3v') ||
                img.closest('.Ois68FAW') ||
                img.closest('div[role="group"]');

            if (productCard && productCard.style.display !== 'none') {
                productCard.style.display = 'none';
            }
        }
    });
};

const observer = new MutationObserver((mutations) => {
    if (!isEnabled) return;

    let shouldRun = false;
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            shouldRun = true;
            break;
        }
    }
    if (shouldRun) {
        hideLocalProducts();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

setInterval(() => {
    if (isEnabled) hideLocalProducts();
}, 1500);
