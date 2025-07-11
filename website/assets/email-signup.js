// Email signup functionality with SendGrid integration
class EmailSignup {
    constructor() {
        this.apiEndpoint = '/api/signup'; // You'll need to create this endpoint
        this.init();
    }

    init() {
        // Find all email signup forms
        const forms = document.querySelectorAll('.email-signup-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });

        // Add input validation
        const emailInputs = document.querySelectorAll('.email-input');
        emailInputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateEmail(e.target));
            input.addEventListener('input', (e) => this.clearErrors(e.target));
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const source = formData.get('source') || 'website';
        
        // Validate email
        if (!this.isValidEmail(email)) {
            this.showError(form, 'Please enter a valid email address');
            return;
        }

        // Show loading state
        this.setLoadingState(form, true);

        try {
            const response = await this.submitToSendGrid(email, source);
            
            if (response.success) {
                this.showSuccess(form, 'Thanks! You\'re on the waitlist. Check your email for confirmation.');
                form.reset();
            } else {
                this.showError(form, response.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showError(form, 'Network error. Please check your connection and try again.');
        } finally {
            this.setLoadingState(form, false);
        }
    }

    async submitToSendGrid(email, source) {
        // This is a client-side example - you'll need a backend endpoint
        // for security reasons (to hide your SendGrid API key)
        
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                source: source,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateEmail(input) {
        const email = input.value.trim();
        if (email && !this.isValidEmail(email)) {
            this.showInputError(input, 'Please enter a valid email address');
            return false;
        }
        this.clearInputError(input);
        return true;
    }

    showError(form, message) {
        const errorDiv = form.querySelector('.error-message') || this.createErrorDiv(form);
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Hide success message if visible
        const successDiv = form.querySelector('.success-message');
        if (successDiv) {
            successDiv.style.display = 'none';
        }
    }

    showSuccess(form, message) {
        const successDiv = form.querySelector('.success-message') || this.createSuccessDiv(form);
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        // Hide error message if visible
        const errorDiv = form.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    showInputError(input, message) {
        input.classList.add('error');
        let errorSpan = input.parentNode.querySelector('.input-error');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'input-error';
            input.parentNode.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
    }

    clearInputError(input) {
        input.classList.remove('error');
        const errorSpan = input.parentNode.querySelector('.input-error');
        if (errorSpan) {
            errorSpan.remove();
        }
    }

    clearErrors(input) {
        this.clearInputError(input);
        const form = input.closest('form');
        const errorDiv = form.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    setLoadingState(form, isLoading) {
        const button = form.querySelector('button[type="submit"]');
        const spinner = form.querySelector('.loading-spinner');
        
        if (isLoading) {
            button.disabled = true;
            button.textContent = 'Joining...';
            if (spinner) spinner.style.display = 'inline-block';
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || 'Join Waitlist';
            if (spinner) spinner.style.display = 'none';
        }
    }

    createErrorDiv(form) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #dc2626;
            background: #fef2f2;
            border: 1px solid #fecaca;
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            display: none;
        `;
        form.appendChild(errorDiv);
        return errorDiv;
    }

    createSuccessDiv(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            color: #059669;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            display: none;
        `;
        form.appendChild(successDiv);
        return successDiv;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmailSignup();
});

// CSS styles for email forms
const emailFormStyles = `
<style>
.email-signup-form {
    max-width: 400px;
    margin: 0 auto;
}

.email-input-group {
    position: relative;
    margin-bottom: 1rem;
}

.email-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
}

.email-input:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.email-input.error {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.email-submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.email-submit-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.email-submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.input-error {
    color: #dc2626;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: block;
}

.loading-spinner {
    display: none;
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-left: 0.5rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.privacy-notice {
    font-size: 0.8rem;
    color: #6b7280;
    text-align: center;
    margin-top: 0.5rem;
}

.privacy-notice a {
    color: #10b981;
    text-decoration: none;
}

.privacy-notice a:hover {
    text-decoration: underline;
}
</style>
`;

// Inject styles into head
document.head.insertAdjacentHTML('beforeend', emailFormStyles);
