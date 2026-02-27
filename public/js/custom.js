$(document).ready(function() {

    /* ===================== INIT ===================== */
    initFancybox();
    initFilters();
    initPageTransitions();
    initPageDirection();


    /* ===================== FANCYBOX ===================== */
    function initFancybox() {
        if (typeof Fancybox === "undefined") return;

        Fancybox.bind('[data-fancybox]', {
            Thumbs: false,
            Toolbar: {
                display: ["close"]
            }
        });
    }


    /* ===================== FILTER TABS (REUSABLE) ===================== */
    function initFilters() {
        const filterPills = document.querySelectorAll('.pill');
        if (!filterPills.length) return;

        filterPills.forEach(pill => {
            pill.addEventListener('click', function() {

                const targetClass = this.dataset.target;
                const filterValue = this.dataset.filter;

                /* Active pill */
                document
                    .querySelectorAll(`.pill[data-target="${targetClass}"]`)
                    .forEach(p => p.classList.remove('active'));

                this.classList.add('active');

                /* Target container */
                const container = document.querySelector(`[data-container="${targetClass}"]`);
                if (!container) return;

                const cards = container.querySelectorAll(`.${targetClass}`);

                cards.forEach(card => {
                    card.classList.toggle(
                        'hidden',
                        filterValue !== 'all' && card.dataset.category !== filterValue
                    );
                });

                /* No results message */
                const visibleCards = container.querySelectorAll(`.${targetClass}:not(.hidden)`);
                const existingMsg = container.querySelector('#noResultsMsg');
                if (existingMsg) existingMsg.remove();

                if (!visibleCards.length) {
                    container.insertAdjacentHTML(
                        'beforeend',
                        `<div id="noResultsMsg" style="text-align:center;padding:40px 20px;color:#9b8a7c;">
                            <i class="fa-regular fa-face-frown" style="font-size:48px;margin-bottom:16px;"></i>
                            <p>No items found</p>
                         </div>`
                    );
                }

                /* Rebind Fancybox after filtering */
                initFancybox();
            });
        });

        /* Auto-init active pills */
        filterPills.forEach(pill => {
            if (pill.classList.contains('active')) {
                pill.click();
            }
        });
    }


    /* ===================== PAGE TRANSITIONS ===================== */
    function initPageTransitions() {
        document.querySelectorAll('a[href]').forEach(link => {
            const url = link.getAttribute('href');

            // Ignore external, hash, and fancybox links
            if (
                !url ||
                url.startsWith('http') ||
                url.startsWith('#') ||
                link.hasAttribute('data-fancybox')
            ) {
                return;
            }

            link.addEventListener('click', e => {
                e.preventDefault();

                const container = document.querySelector('.page-container');
                if (!container) {
                    window.location.href = url;
                    return;
                }

                container.classList.add('page-exit');
                setTimeout(() => {
                    window.location.href = url;
                }, 220);
            });
        });
    }


    /* ===================== PAGE DIRECTION ===================== */
    function initPageDirection() {
        const container = document.querySelector('.page-container');
        if (!container) return;

        const nav = performance.getEntriesByType("navigation");
        const isBack = nav.length && nav[0].type === "back_forward";

        container.classList.add(isBack ? 'page-back' : 'page-forward');
    }

});