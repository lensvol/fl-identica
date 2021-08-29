
const ITEM_IMAGE_SELECTOR = "img[class='equipped-group__available-item'], img[class='equipped-item__image']";

function createIdAdditionObserver(itemID) {
    return new MutationObserver(function (mutations, observer) {
        for (let m = 0; m < mutations.length; m++) {
            const mutation = mutations[m];

            for (let n = 0; n < mutation.addedNodes.length; n++) {
                const node = mutation.addedNodes[n];
                if (node.nodeName === "DIV" && node.id.startsWith("tippy-")) {
                    const idText = `ID: ${itemID}`;
                    const itemName = node.querySelector("div[class='tooltip__desc'] p span");
                    const existingIdSpan = node.querySelector("strong[class='item-id-display']");
                    if (itemName && !existingIdSpan) {
                        const idSpan = document.createElement("strong");
                        idSpan.innerText = idText;
                        idSpan.className = 'item-id-display';
                        idSpan.style.cssText = 'display: block';
                        itemName.parentElement.insertBefore(idSpan, itemName);
                    }
                    observer.disconnect();
                }
            }
        }
    });
}

let testSlotObserver = new MutationObserver(function (mutations) {
    for (let m = 0; m < mutations.length; m++) {
        const mutation = mutations[m];

        for (let n = 0; n < mutation.addedNodes.length; n++) {
            const node = mutation.addedNodes[n];
            if (node.nodeName === "DIV" || node.nodeName === "LI") {
                const itemImages = node.querySelectorAll(ITEM_IMAGE_SELECTOR);
                for (const img of itemImages) {
                    img.addEventListener("mouseover", (event) => {
                        const itemId = event.target.parentElement.parentElement.attributes["data-quality-id"].value;
                        createIdAdditionObserver(itemId).observe(document, {childList: true, subtree: true});
                    });
                }
            }
        }
    }
});

testSlotObserver.observe(document, {childList: true, subtree: true});