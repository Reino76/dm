document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const item = header.parentElement;

            // Toggle active class for content
            content.classList.toggle('active');

            // Close other accordions in the same card
            const parentAccordion = item.parentElement;
            parentAccordion.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.accordion-content').classList.remove('active');
                }
            });
        });
    });
});