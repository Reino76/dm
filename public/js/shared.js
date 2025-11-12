/**
 * shared.js
 *
 * Contains shared utility functions for the DM Screen application.
 */

// Function to find an item by its name (case-insensitive)
function findItemByName(name) {
    if (typeof shopItems === 'undefined') return null;
    return shopItems.find(item => item.name.toLowerCase() === name.toLowerCase());
}

// Function to linkify item names in a text
function linkifyItemNames(text) {
    if (typeof shopItems === 'undefined') return text;
    let linkedText = text;

    const specialReplacements = [
        {
            regex: /1\s+Satunainen\s+Esine/gi,
            replacement: `1 <button class="btn randomize-btn" data-category="tavara">Arvo Satunnainen Esine</button>`
        },
        {
            regex: /1\s+Satunainen\s+Ase/gi,
            replacement: `1 <button class="btn randomize-btn" data-category="ase">Arvo Satunnainen Ase</button>`
        },
        {
            regex: /1\s+Satunainen\s+artifakti/gi,
            replacement: `1 <button class="btn randomize-btn" data-category="">Arvo Satunnainen Artifakti</button>`
        }
    ];

    specialReplacements.forEach(rule => {
        linkedText = linkedText.replace(rule.regex, rule.replacement);
    });

    shopItems.forEach(item => {
        const regex = new RegExp(`\\b${item.name}\\b`, "gi");
        const itemLink = `<a href="#" class="item-link" data-item-name="${item.name}">${item.name}</a>`;
        linkedText = linkedText.replace(regex, itemLink);
    });
    return linkedText;
}

function openItemDetails(itemName) {
    const item = findItemByName(itemName);
    const modal = document.getElementById("item-details-modal");
    const modalContent = document.getElementById("item-details-content");

    if (item && modal) {
        modalContent.innerHTML = `
            <h2>${item.name}</h2>
            <p><strong>Tyyppi:</strong> ${item.type}</p>
            <p>${linkifyItemNames(item.description)}</p>
            <div class="item-price">Hinta: ${item.price}</div>
        `;
        modal.classList.add("active");
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('item-link')) {
        e.preventDefault();
        const itemName = e.target.dataset.itemName;
        openItemDetails(itemName);
    }
    if (e.target.classList.contains('randomize-btn')) {
        e.preventDefault();
        const category = e.target.dataset.category;
        const randomItem = getRandomItem(category);
        if (randomItem) {
            openItemDetails(randomItem.name);
        }
    }
});

function getRandomItem(category = null) {
    let itemsToChooseFrom = shopItems;
    if (category) {
        const normalizedCategory = category.toLowerCase().replace(/ /g, '-');
        if (normalizedCategory === 'ase') {
            itemsToChooseFrom = shopItems.filter(item => item.type.includes('Lyömäase') || item.type.includes('Ammunta-ase'));
        } else if (normalizedCategory === 'tavara') {
            itemsToChooseFrom = shopItems.filter(item => item.type === 'Tavara');
        } else if (normalizedCategory === 'artifakti') {
            // Assuming 'artifakti' can be any item for now, as there is no specific type for it.
            // This can be adjusted if a more specific category is added later.
            itemsToChooseFrom = shopItems;
        }
    }
    if (itemsToChooseFrom.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * itemsToChooseFrom.length);
    return itemsToChooseFrom[randomIndex];
}