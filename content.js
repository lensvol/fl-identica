
function createIdAdditionObserver(itemID) {
    return new MutationObserver(function (mutations, observer) {
        for (let m = 0; m < mutations.length; m++) {
            let mutation = mutations[m];

            for (let n = 0; n < mutation.addedNodes.length; n++) {
                let node = mutation.addedNodes[n];
                if (node.nodeName.toLowerCase() === "div" && node.id.startsWith("tippy-")) {
                    const idText = ` (ID: ${itemID})`;
                    const itemName = node.querySelector("span[class='item__name']");
                    if (itemName && !itemName.innerText.endsWith(idText)) {
                        itemName.innerText += idText;
                    }
                    observer.disconnect();
                }
            }
        }
    });
}

document.addEventListener("mouseover", (event) => {
    if (event.target && event.target.nodeName === "IMG" && event.target.classList.contains("equipped-group__available-item")) {
        const itemId = event.target.parentElement.parentElement.attributes["data-quality-id"].value;
        createIdAdditionObserver(itemId).observe(document, {childList: true, subtree: true});
    }
});