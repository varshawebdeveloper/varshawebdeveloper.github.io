document.addEventListener('DOMContentLoaded', () => {
    
    /* --- MOBILE NAV TOGGLE --- */
    const navToggle = document.getElementById('nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isOpened = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpened);
            primaryNav.classList.toggle('open');
        });

        // Close mobile nav when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('open');
            });
        });
    }

    /* --- ACTIVE NAV INDICATOR ON SCROLL --- */
    const sections = document.querySelectorAll('section[id]');
    
    const navObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies center of viewport
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    /* --- REVEAL ON SCROLL ANIMATIONS --- */
    const fadeElements = document.querySelectorAll('.fade-in-element');
    
    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters view
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve once shown
                fadeObserver.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));

    /* --- CONTACT FORM VALIDATION & DYNAMIC DELIVERY --- */
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnSpinner = submitBtn?.querySelector('.btn-spinner');
    
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    
    const successAlert = document.getElementById('form-success');
    const errorAlert = document.getElementById('form-error');

    // Validation helper
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const clearErrors = () => {
        nameInput.classList.remove('invalid-field');
        emailInput.classList.remove('invalid-field');
        messageInput.classList.remove('invalid-field');
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        successAlert.style.display = 'none';
        errorAlert.style.display = 'none';
    };

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            let isValid = true;

            // Validate Name
            if (!nameInput.value.trim()) {
                nameInput.classList.add('invalid-field');
                nameError.textContent = 'Please enter your name.';
                isValid = false;
            }

            // Validate Email
            if (!emailInput.value.trim()) {
                emailInput.classList.add('invalid-field');
                emailError.textContent = 'Please enter your email address.';
                isValid = false;
            } else if (!validateEmail(emailInput.value.trim())) {
                emailInput.classList.add('invalid-field');
                emailError.textContent = 'Please enter a valid email address.';
                isValid = false;
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                messageInput.classList.add('invalid-field');
                messageError.textContent = 'Please enter your message.';
                isValid = false;
            }

            if (!isValid) return;

            // Show Loading Spinner State
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'block';

            const formData = new FormData(contactForm);

            // Set the active Web3Forms access key directly in FormData
            const accessKey = 'd8a60155-6655-438c-8d9a-3b9ac597c6ea';
            formData.set('access_key', accessKey);

            try {
                if (accessKey === 'YOUR_ACCESS_KEY_HERE' || !accessKey) {
                    // Simulate submission locally for offline testing
                    console.log('Testing: Web3Forms access key is not set. Simulating delivery to varshasenthil411@gmail.com:', Object.fromEntries(formData.entries()));
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    successAlert.style.display = 'flex';
                    contactForm.reset();
                } else {
                    // Perform fetch to Web3Forms API using native FormData (Simple Request - avoids preflight OPTIONS)
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        successAlert.style.display = 'flex';
                        contactForm.reset();
                    } else {
                        throw new Error(result.message || 'API delivery failed');
                    }
                }
            } catch (err) {
                console.error('Submission error:', err);
                errorAlert.style.display = 'flex';
            } finally {
                // Restore Button State
                submitBtn.disabled = false;
                btnText.style.display = 'block';
                btnSpinner.style.display = 'none';
            }
        });
    }
});
