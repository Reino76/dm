document.addEventListener("DOMContentLoaded", () => {
    const shopContainer = document.getElementById("item-shop-container");
    const occupationsContainer = document.getElementById("occupation-shop-container");

    function render() {
        shopContainer.innerHTML = "";
        occupationsContainer.innerHTML = '<h2>Työnkuvat</h2>';

        shopItems.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "shop-item";
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.type}</p>
                <div class="item-price">${item.price}</div>
            `;
            itemElement.addEventListener("click", () => openItemDetails(item.name));
            shopContainer.appendChild(itemElement);
        });

        occupations.forEach(occ => {
            const occElement = document.createElement("div");
            occElement.className = "shop-item occupation-item";
            let benefitContent = `<p>${linkifyItemNames(occ.benefit)}</p>`;

            occElement.innerHTML = `<h3>${occ.occupation}</h3>${benefitContent}`;
            occupationsContainer.appendChild(occElement);
        });
    }

    render();
});