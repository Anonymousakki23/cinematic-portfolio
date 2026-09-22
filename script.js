/**
 * vCard Portfolio Controller
 * Handles sidebar toggle, tab navigation, testimonials modal, and portfolio filtering.
 * Mirrors the interaction patterns of the codewithsadee vCard template.
 */
(function () {
    'use strict';

    /* ---------- Sidebar: Show/Hide Contacts ---------- */
    const sidebar = document.querySelector('[data-sidebar]');
    const sidebarBtn = document.querySelector('[data-sidebar-btn]');

    if (sidebar && sidebarBtn) {
        const contactsList = sidebar.querySelector('.contacts-list');
        const showBtn = sidebarBtn.querySelector('span');
        const chevron = sidebarBtn.querySelector('i');
        let isExpanded = true;

        function toggleSidebar() {
            isExpanded = !isExpanded;
            contactsList.style.maxHeight = isExpanded ? contactsList.scrollHeight + 'px' : '0px';
            contactsList.style.overflow = isExpanded ? 'visible' : 'hidden';
            contactsList.style.marginTop = isExpanded ? '16px' : '0px';
            contactsList.style.opacity = isExpanded ? '1' : '0.5';
            contactsList.style.transition = 'all 0.3s ease';

            sidebarBtn.querySelector('span').textContent = isExpanded ? 'Hide Contacts' : 'Show Contacts';
            chevron.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }

        sidebarBtn.addEventListener('click', toggleSidebar);
        contactsList.style.maxHeight = contactsList.scrollHeight + 'px';
    }

    /* ---------- Tab Navigation ---------- */
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const pages = document.querySelectorAll('[data-page]');

    function switchPage(targetLink) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-selected', 'false');
            link.setAttribute('tabindex', '-1');
        });

        pages.forEach(page => {
            page.classList.remove('active');
            page.setAttribute('hidden', '');
        });

        targetLink.classList.add('active');
        targetLink.setAttribute('aria-selected', 'true');
        targetLink.removeAttribute('tabindex');

        const targetPage = document.querySelector('[data-page="' + targetLink.getAttribute('data-nav-link') + '"]');
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.removeAttribute('hidden');

            if (targetLink.getAttribute('data-nav-link') === 'About') {
                animateSkillBars();
            }
        }
    }

    navLinks.forEach((link, index) => {
        link.setAttribute('aria-selected', link.classList.contains('active') ? 'true' : 'false');
        if (!link.classList.contains('active')) {
            link.setAttribute('tabindex', '-1');
        }

        link.addEventListener('click', () => switchPage(link));

        link.addEventListener('keydown', (e) => {
            const navArray = Array.from(navLinks);
            const linkIndex = navArray.indexOf(link);
            let newIndex;

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

    /* ---------- Skill Bars (Languages) ---------- */
    function animateSkillBars() {
        const fills = document.querySelectorAll('.skill-progress-fill');
        fills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    fill.style.width = targetWidth;
                });
            });
        });
    }

    /* ---------- Testimonials Modal ---------- */
    const modalContainer = document.querySelector('[data-modal-container]');
    const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
    const modalTitle = document.querySelector('[data-modal-title]');
    const modalText = document.querySelector('[data-modal-text]');
    const modalAvatar = document.querySelector('[data-modal-container] img[alt*="Daniel"]');
    const testimonialsList = document.querySelector('[data-testimonials-list]');
    const testimonialsItems = document.querySelectorAll('[data-testimonials-item]');
    let lastFocused = null;

    testimonialsItems.forEach(item => {
        item.addEventListener('click', () => {
            lastFocused = item;
            modalTitle.textContent = item.querySelector('[data-testimonials-title]').textContent;
            modalText.innerHTML = item.querySelector('[data-testimonials-text]').innerHTML;

            const avatar = item.querySelector('[data-testimonials-avatar]');
            if (modalAvatar && avatar) {
                modalAvatar.setAttribute('src', avatar.getAttribute('src'));
                modalAvatar.setAttribute('alt', avatar.getAttribute('alt'));
            }

            modalContainer.classList.add('active');
            document.body.style.overflow = 'hidden';
            modalCloseBtn.focus();
        });
    });

    function closeModal() {
        modalContainer.classList.remove('active');
        document.body.style.overflow = '';
        if (lastFocused) {
            lastFocused.focus();
        }
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalContainer.querySelector('[data-overlay]').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
            closeModal();
        }
    });

    /* ---------- Portfolio Filtering ---------- */
    const filterButtons = document.querySelectorAll('[data-filter-btn]');
    const selectBox = document.querySelector('[data-select]');
    const selectList = document.querySelector('[data-select-list]');
    const selectItems = document.querySelectorAll('[data-select-item]');
    const selectValue = document.querySelector('[data-select-value]');
    const selectIcon = document.querySelector('[data-select-icon]');
    const projectItems = document.querySelectorAll('[data-filter-item]');

    function applyFilter(category) {
        projectItems.forEach(item => {
            const matches = item.getAttribute('data-category').includes(category.toLowerCase());
            item.classList.toggle('active', matches);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.textContent.trim());
        });
    });

    if (selectBox && selectList && selectItems.length > 0) {
        selectBox.addEventListener('click', (e) => {
            e.stopPropagation();
            selectList.classList.toggle('active');
            selectIcon.style.transform = selectList.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        });

        selectItems.forEach(item => {
            item.addEventListener('click', () => {
                const value = item.textContent.trim();
                selectValue.textContent = value === 'All' ? 'Select category' : value;
                selectList.classList.remove('active');
                selectIcon.style.transform = 'rotate(0deg)';
                applyFilter(value);
                selectBox.querySelector('[data-filter-btn]').classList.add('active');
            });
        });

        document.addEventListener('click', () => {
            selectList.classList.remove('active');
            selectIcon.style.transform = 'rotate(0deg)';
        });
    }

    /* ---------- Contact Form ---------- */
    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const subject = encodeURIComponent('Message from Portfolio Contact Form');
        const body = encodeURIComponent(
            `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\nMessage:\n${formData.get('message')}`
        );

        window.location.href = `mailto:akshayiyer23@gmail.com?subject=${subject}&body=${body}`;
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    /* ---------- Initialize ---------- */
    animateSkillBars();
})();
