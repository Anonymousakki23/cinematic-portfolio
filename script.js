/**
 * Sci-Fi Portfolio Controller
 * Handles sidebar toggle, tab navigation, photography filters,
 * photography lightbox, testimonials modal, skill bars, and contact form.
 */
(function () {
    'use strict';

    /* ==============================================
       SIDEBAR: Show/Hide Contacts
       ============================================== */
    var sidebar = document.querySelector('[data-sidebar]');
    var sidebarBtn = document.querySelector('[data-sidebar-btn]');

    if (sidebar && sidebarBtn) {
        var contactsList = sidebar.querySelector('.contacts-list');
        var showBtn = sidebarBtn.querySelector('[data-sidebar-btn-label]');
        var chevron = sidebarBtn.querySelector('i');
        var isExpanded = false; /* Start collapsed on mobile-friendly note */

        function toggleSidebar() {
            isExpanded = !isExpanded;
            contactsList.classList.toggle('collapsed', !isExpanded);
            showBtn.textContent = isExpanded ? 'Hide Contacts' : 'Show Contacts';
            if (chevron) chevron.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }

        sidebarBtn.addEventListener('click', toggleSidebar);
    }

    /* ==============================================
       TAB NAVIGATION
       ============================================== */
    var navLinks = document.querySelectorAll('[data-nav-link]');
    var pages = document.querySelectorAll('[data-page]');

    function switchPage(targetLink) {
        var targetPageName = targetLink.getAttribute('data-nav-link');

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            link.setAttribute('aria-selected', 'false');
            link.setAttribute('tabindex', '-1');
        });

        pages.forEach(function (page) {
            page.classList.remove('active');
        });

        targetLink.classList.add('active');
        targetLink.setAttribute('aria-selected', 'true');
        targetLink.removeAttribute('tabindex');

        var targetPage = document.querySelector('[data-page="' + targetPageName + '"]');
        if (targetPage) {
            targetPage.classList.add('active');
            /* Re-trigger animations when switching tabs */
            if (targetPageName === 'About') {
                animateSkillBars();
            }
        }
    }

    navLinks.forEach(function (link, index) {
        link.setAttribute('aria-selected', link.classList.contains('active') ? 'true' : 'false');
        if (!link.classList.contains('active')) {
            link.setAttribute('tabindex', '-1');
        }

        link.addEventListener('click', function () {
            switchPage(link);
        });

        link.addEventListener('keydown', function (e) {
            var navArray = Array.from(navLinks);
            var linkIndex = navArray.indexOf(link);
            var newIndex;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex = (linkIndex + 1) % navArray.length;
                navArray[newIndex].focus();
                switchPage(navArray[newIndex]);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex = (linkIndex - 1 + navArray.length) % navArray.length;
                navArray[newIndex].focus();
                switchPage(navArray[newIndex]);
            } else if (e.key === 'Home') {
                e.preventDefault();
                navArray[0].focus();
                switchPage(navArray[0]);
            } else if (e.key === 'End') {
                e.preventDefault();
                navArray[navArray.length - 1].focus();
                switchPage(navArray[navArray.length - 1]);
            }
        });
    });

    /* ==============================================
       PHOTOGRAPHY FILTER
       ============================================== */
    var photoFilterButtons = document.querySelectorAll('[data-photo-filter]');
    var photoItems = document.querySelectorAll('[data-photo-item]');

    function applyPhotoFilter(category) {
        photoItems.forEach(function (item) {
            var matches = category === 'all' || item.getAttribute('data-category') === category;
            item.classList.toggle('active', matches);
        });
    }

    photoFilterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            photoFilterButtons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            applyPhotoFilter(btn.getAttribute('data-photo-filter'));
        });
    });

    /* ==============================================
       PHOTOGRAPHY LIGHTBOX
       ============================================== */
    var lightbox = document.querySelector('[data-lightbox]');
    var lightboxClose = document.querySelector('[data-lightbox-close]');
    var lightboxImg = document.querySelector('[data-lightbox-img]');
    var lightboxTitle = document.querySelector('[data-lightbox-title]');
    var lightboxCategory = document.querySelector('[data-lightbox-category]');
    var lightboxDate = document.querySelector('[data-lightbox-date]');

    photoItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var svg = item.querySelector('.photo-img svg');
            if (!svg) return;

            var clone = svg.cloneNode(true);
            lightboxImg.innerHTML = '';
            lightboxImg.appendChild(clone);

            var caption = item.querySelector('.photo-caption');
            lightboxTitle.textContent = caption ? caption.querySelector('.photo-title').textContent : '';
            lightboxCategory.textContent = caption ? caption.querySelector('.category').textContent : '';
            lightboxDate.textContent = caption ? caption.querySelector('.photo-meta span:last-child').textContent : '';

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    /* ==============================================
       TESTIMONIALS MODAL
       ============================================== */
    var modalContainer = document.querySelector('[data-modal-container]');
    var modalCloseBtn = document.querySelector('[data-modal-close-btn]');
    var modalTitle = document.querySelector('[data-modal-title]');
    var modalText = document.querySelector('[data-modal-text]');
    var modalAvatar = document.querySelector('[data-modal-avatar]');
    var modalDate = document.querySelector('[data-modal-date]');
    var testimonialsItems = document.querySelectorAll('[data-testimonials-item]');
    var lastFocused = null;

    /* Set date text for testimonial items if not present */
    testimonialsItems.forEach(function (item) {
        var titleEl = item.querySelector('[data-testimonials-title]');
        var textEl = item.querySelector('[data-testimonials-text]');
        if (titleEl && textEl) {
            var card = item.querySelector('.content-card');
            if (card) card.setAttribute('role', 'button');
        }
    });

    testimonialsItems.forEach(function (item) {
        item.addEventListener('click', function () {
            lastFocused = item;
            var title = item.querySelector('[data-testimonials-title]');
            var text = item.querySelector('[data-testimonials-text]');
            if (modalTitle && title) modalTitle.textContent = title.textContent;
            if (modalText && text) modalText.innerHTML = text.innerHTML;

            var avatar = item.querySelector('[data-testimonials-avatar]');
            if (modalAvatar && avatar) {
                modalAvatar.setAttribute('src', avatar.getAttribute('src'));
                modalAvatar.setAttribute('alt', avatar.getAttribute('alt'));
            }

            if (modalContainer) {
                modalContainer.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (modalCloseBtn) modalCloseBtn.focus();
            }
        });
    });

    function closeModal() {
        if (modalContainer) modalContainer.classList.remove('active');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    var overlay = document.querySelector('[data-overlay]');
    if (overlay) overlay.addEventListener('click', closeModal);

    /* ==============================================
       SKILL BARS (Languages) - Animated on view
       ============================================== */
    function animateSkillBars() {
        var fills = document.querySelectorAll('.skill-progress-fill');
        fills.forEach(function (fill) {
            var targetWidth = fill.style.width;
            fill.style.width = '0';
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    fill.style.width = targetWidth;
                });
            });
        });
    }

    /* ==============================================
       CONTACT FORM HANDLER (mailto: integration)
       ============================================== */
    function handleFormSubmit(e) {
        e.preventDefault();
        var form = e.target;
        var formData = new FormData(form);
        var subject = encodeURIComponent('Message from Portfolio Contact Form');
        var body = encodeURIComponent(
            'Name: ' + (formData.get('name') || '') +
            '\nEmail: ' + (formData.get('email') || '') +
            '\n\nMessage:\n' + (formData.get('message') || '')
        );
        window.location.href = 'mailto:akshayiyer23@gmail.com?subject=' + subject + '&body=' + body;
    }

    var contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(function (form) {
        /* The form has action="mailto:..." — intercept for enhanced handling */
        form.addEventListener('submit', handleFormSubmit);
    });

    /* ==============================================
       INITIALIZE
       ============================================== */
    animateSkillBars();
})();
