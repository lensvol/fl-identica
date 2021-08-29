
const ITEM_IMAGE_SELECTOR = "img[class='equipped-group__available-item'], img[class='equipped-item__image']";

function createIdAdditionObserver(itemID) {
    return new MutationObserver(function (mutations, observer) {
        for (let m = 0; m < mutations.length; m++) {
            let mutation = mutations[m];

            for (let n = 0; n < mutation.addedNodes.length; n++) {
                let node = mutation.addedNodes[n];
                if (node.nodeName.toLowerCase() === "div" && node.id.startsWith("tippy-")) {
                    const idText = `\nID: ${itemID}`;
                    const itemName = node.querySelector("div[class='tooltip__desc'] p span");
                    if (itemName && !itemName.innerText.endsWith(idText)) {
                        itemName.innerText += idText;
                    }
                    observer.disconnect();
                }
            }
        }
    });
}

let testSlotObserver = new MutationObserver(function (mutations) {
    for (let m = 0; m < mutations.length; m++) {
        let mutation = mutations[m];

        for (let n = 0; n < mutation.addedNodes.length; n++) {
            let node = mutation.addedNodes[n];
            if (node.nodeName === "DIV") {
                const itemImages = node.querySelectorAll(ITEM_IMAGE_SELECTOR);
                for (const img of itemImages) {
                    img.addEventListener("mouseover", (event) => {
                        const itemId = event.target.parentElement.parentElement.attributes["data-quality-id"].value;
                        createIdAdditionObserver(itemId).observe(document, {childList: true, subtree: true});
                    })
                }
            }
        }
    }
});

testSlotObserver.observe(document, {childList: true, subtree: true});