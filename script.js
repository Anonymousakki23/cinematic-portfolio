/**
 * Tab Navigation Controller
 * Handles switching between About, Resume, and Contact panels
 * with ARIA-compliant accessibility and smooth transitions.
 */
(function () {
    'use strict';

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    function switchTab(targetBtn) {
        const targetId = targetBtn.getAttribute('aria-controls');

        // Deactivate all tabs and panels
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
            btn.setAttribute('tabindex', '-1');
        });

        tabPanels.forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('hidden', '');
        });

        // Activate target tab and panel
        targetBtn.classList.add('active');
        targetBtn.setAttribute('aria-selected', 'true');
        targetBtn.removeAttribute('tabindex');

        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
            targetPanel.classList.add('active');
            targetPanel.removeAttribute('hidden');
        }

        // Animate language progress bars when About tab is shown
        if (targetId === 'tab-about') {
            animateProgressBars();
        }
    }

    function animateProgressBars() {
        const fills = document.querySelectorAll('.progress-fill');
        fills.forEach(fill => {
            const targetWidth = fill.style.getPropertyValue('--progress');
            // Force reflow then animate
            fill.style.width = '0';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    fill.style.width = targetWidth;
                });
            });
        });
    }

    // Bind click events
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn);
        });

        // Keyboard navigation (arrow keys)
        btn.addEventListener('keydown', (e) => {
            const btnArray = Array.from(tabBtns);
            const index = btnArray.indexOf(btn);
            let newIndex;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex = (index + 1) % btnArray.length;
                btnArray[newIndex].focus();
                switchTab(btnArray[newIndex]);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex = (index - 1 + btnArray.length) % btnArray.length;
                btnArray[newIndex].focus();
                switchTab(btnArray[newIndex]);
            } else if (e.key === 'Home') {
                e.preventDefault();
                btnArray[0].focus();
                switchTab(btnArray[0]);
            } else if (e.key === 'End') {
                e.preventDefault();
                btnArray[btnArray.length - 1].focus();
                switchTab(btnArray[btnArray.length - 1]);
            }
        });
    });

    // Initialize: animate progress bars on About tab by default
    animateProgressBars();
})();

/**
 * Form submission handler
 * Prevents the default submit and redirects to a constructed mailto: link
 * with subject and body populated from the form fields.
 */
function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const name = form.querySelector('#contact-name').value;
    const email = form.querySelector('#contact-email').value;
    const message = form.querySelector('#contact-message').value;

    // Build mailto query body
    const subject = encodeURIComponent('Message from Portfolio Contact Form');
    const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    // Redirect to mailto with subject and body
    window.location.href = `mailto:akshayiyer23@gmail.com?subject=${subject}&body=${body}`;
}
