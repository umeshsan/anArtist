$(document).ready(function() {
    /* INIT */
    initScrollToTop();
    initFilters();
    initPageTransitions();
    initPageDirection();


    /* FILTER TABS (REUSABLE) */
    function initFilters() {
        const filterPills = document.querySelectorAll('.pill');
        if (!filterPills.length) return;

        filterPills.forEach(pill => {
            pill.addEventListener('click', function() {

                const targetClass = this.dataset.target;
                const filterValue = this.dataset.filter;

                // Active pill
                document
                    .querySelectorAll(`.pill[data-target="${targetClass}"]`)
                    .forEach(p => p.classList.remove('active'));

                this.classList.add('active');

                // Target container
                const container = document.querySelector(`[data-container="${targetClass}"]`);
                if (!container) return;

                const cards = container.querySelectorAll(`.${targetClass}`);

                cards.forEach(card => {
                    card.classList.toggle(
                        'hidden',
                        filterValue !== 'all' && card.dataset.category !== filterValue
                    );
                });

                // No results message
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
            });
        });

        // Auto-init active pills
        filterPills.forEach(pill => {
            if (pill.classList.contains('active')) pill.click();
        });
    }


    /* PAGE TRANSITIONS */
    function initPageTransitions() {
        document.querySelectorAll('a[href]').forEach(link => {
            const url = link.getAttribute('href');
            if (!url || url.startsWith('http') || url.startsWith('#')) return;

            link.addEventListener('click', e => {
                e.preventDefault();

                const container = document.querySelector('.page-container');
                if (!container) {
                    window.location.href = url;
                    return;
                }

                container.classList.add('page-exit');
                setTimeout(() => window.location.href = url, 220);
            });
        });
    }


    /* PAGE DIRECTION (BACK/FORWARD) */
    function initPageDirection() {
        const container = document.querySelector('.page-container');
        if (!container) return;

        const isBack = performance.navigation.type === 2;
        container.classList.add(isBack ? 'page-back' : 'page-forward');
    }

});


/* SCROLL TO TOP */
function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

function initScrollToTop() {
    const $topButton = $('.topTop');
    if (!$topButton.length) return;

    $(window).on('scroll', debounce(function() {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height();
        const winHeight = $(window).height();
        const percent = Math.round((scrollTop / (docHeight - winHeight)) * 100);

        $topButton.css({
            opacity: percent > 15 ? 1 : 0,
            transform: percent > 15 ?
                'translateY(0)' : 'translateY(calc(100% + 5px))'
        });
    }, 100));

    $topButton.on('click', function() {
        $('html, body').stop().animate({ scrollTop: 0 }, 1000);
        return false;
    });
}