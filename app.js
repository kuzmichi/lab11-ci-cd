document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const successAlert = document.getElementById('success-alert');

    // Email regex helper
    const isValidEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const validateField = (input, condition) => {
        const formGroup = input.parentElement;
        if (condition) {
            formGroup.classList.remove('invalid');
            return true;
        } else {
            formGroup.classList.add('invalid');
            return false;
        }
    };

    // Form submit listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform validations
        const isUsernameValid = validateField(usernameInput, usernameInput.value.trim().length >= 3);
        const isEmailValid = validateField(emailInput, isValidEmail(emailInput.value.trim()));
        const isPasswordValid = validateField(passwordInput, passwordInput.value.length >= 6);

        if (isUsernameValid && isEmailValid && isPasswordValid) {
            // Hide form and show success
            form.style.display = 'none';
            successAlert.classList.remove('hidden');
        }
    });

    // Real-time error removal on input
    [usernameInput, emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            input.parentElement.classList.remove('invalid');
        });
    });
});
