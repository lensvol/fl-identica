const INFO_BTN_CLASS_LIST = "fa fa-inverse fa-stack-1x fa-info";
const ITEM_IMAGE_SELECTOR = "img[class='equipped-group__available-item'], img[class='equipped-item__image'], div[data-quality-id] img";

function wrapButtonInContainer(button) {
    const containerDiv = document.createElement("div");
    containerDiv.className = "branch__plan-buttonlet";
    containerDiv.appendChild(button);
    return containerDiv;
}

function createInfoButton() {
    const buttonlet = document.createElement("button");
    buttonlet.setAttribute("id", "identica-info-button");
    buttonlet.setAttribute("type", "button");
    buttonlet.className = "buttonlet-container";

    const outerSpan = document.createElement("span");
    outerSpan.classList.add("buttonlet", "fa-stack", "fa-lg", "buttonlet-enabled");
    outerSpan.setAttribute("title", "Copy ID to the clipboard");

    [["fa", "fa-circle", "fa-stack-2x"], INFO_BTN_CLASS_LIST.split(" "), ["u-visually-hidden"]].map(classNames => {
        let span = document.createElement("span");
        span.classList.add(...classNames);
        outerSpan.appendChild(span);
    })

    buttonlet.appendChild(outerSpan);
    return buttonlet;
}

function createIdAdditionObserver(itemID) {
    return new MutationObserver(function (mutations, observer) {
        for (let m = 0; m < mutations.length; m++) {
            const mutation = mutations[m];

            for (let n = 0; n < mutation.addedNodes.length; n++) {
                const node = mutation.addedNodes[n];
                if (node.nodeName === "DIV" && node.id.startsWith("tippy-")) {
                    const idText = `ID: ${itemID}`;
                    const itemDescription = node.querySelector("div[class='tooltip__desc'] p span");
                    const existingIdSpan = node.querySelector("strong[class='item-id-display']");
                    if (itemDescription && !existingIdSpan) {
                        const idSpan = document.createElement("strong");
                        idSpan.innerText = idText;
                        idSpan.className = 'item-id-display';
                        idSpan.style.cssText = 'display: block';
                        itemDescription.parentElement.insertBefore(idSpan, itemDescription);
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

                const qualityItems = node.querySelectorAll("li[class='quality-item']");
                for (const quality of qualityItems) {
                    const iconNode = quality.querySelector("div[data-branch-id]");
                    const qualityId = iconNode.attributes["data-branch-id"].value;
                    const itemDescription = quality.querySelector("p[class='quality-item__description']");

                    itemDescription.appendChild(document.createElement("br"));
                    itemDescription.appendChild(document.createTextNode(`ID: ${qualityId}`));
                }

                let storylets = node.querySelectorAll("div[class*='storylet'][data-branch-id]");
                if (storylets.length === 0) {
                    if (node.nodeName === "DIV" && node.classList.contains("storylet") && node.hasAttribute("data-branch-id")) {
                        storylets = [node];
                    }
                }

                for (const storylet of storylets) {
                    let existingButtons = storylet.querySelectorAll("button[id='identica-info-button']");
                    if (existingButtons.length > 0) {
                        continue;
                    }

                    const infoButton = createInfoButton();
                    const buttonInContainer = wrapButtonInContainer(infoButton);
                    const storyletId = storylet.attributes["data-branch-id"].value;

                    infoButton.addEventListener("click", () => {
                        navigator.clipboard.writeText(storyletId).then(() => {
                            console.debug(`[FL Identica] ID ${storyletId} copied to clipboard!`);
                        })
                    });

                    const container = storylet.querySelector("div[class='storylet__title-and-description']");
                    const otherButtons = container.getElementsByClassName("storylet-root__frequency");
                    if (otherButtons.length > 0) {
                        container.insertBefore(buttonInContainer, otherButtons[otherButtons.length - 1].nextSibling);
                    } else {
                        container.insertBefore(buttonInContainer, container.firstChild);
                    }
                }

                let branches = node.querySelectorAll("div[class*='branch'][data-branch-id]");
                if (branches.length === 0) {
                    if (node.nodeName === "DIV" && node.classList.contains("branch")) {
                        branches = [node];
                    }
                }

                for (const branch of branches) {
                    let existingButtons = branch.querySelectorAll("button[id='identica-info-button']");
                    if (existingButtons.length > 0) {
                        continue;
                    }

                    const infoButton = createInfoButton();
                    const branchId = branch.attributes["data-branch-id"].value;

                    infoButton.addEventListener("click", () => {
                        navigator.clipboard.writeText(branchId).then(() => {
                            console.debug(`[FL Identica] ID ${branchId} copied to clipboard!`);
                        })
                    });

                    const branchHeader = branch.querySelector("h2[class*='branch__title'], h2[class*='storylet__heading']");

                    const otherButtons = branch.querySelectorAll("div[class*='storylet-root__frequency'] button");
                    if (otherButtons.length > 0) {
                        const container = otherButtons[0].parentElement;
                        container.insertBefore(infoButton, otherButtons[otherButtons.length - 1].nextSibling);
                    } else {
                        const container = branchHeader.parentElement;
                        container.insertBefore(wrapButtonInContainer(infoButton), container.firstChild);
                    }
                }
            }
        }
    }
});

testSlotObserver.observe(document, {childList: true, subtree: true});
