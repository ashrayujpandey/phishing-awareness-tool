// Simulation-specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Form validation
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(error => {
                error.style.display = 'none';
            });
            
            // Email validation
            if (!emailInput.value.trim()) {
                showError('emailError', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError('emailError', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Password validation
            if (!passwordInput.value) {
                showError('passwordError', 'Password is required');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading overlay
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'flex';
                }
                
                // Track the attempt (for educational purposes)
                trackAttempt({
                    email: emailInput.value,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                });
                
                // Add realistic delay
                setTimeout(() => {
                    // Form will submit normally
                }, 1500);
            } else {
                e.preventDefault();
            }
        });
    }
    
    // Real-time email validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value.trim() && !isValidEmail(this.value.trim())) {
                showError('emailError', 'Please enter a valid email address');
            }
        });
    }
    
    // Simulate realistic behavior
    addRealisticBehavior();
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function trackAttempt(data) {
    // Store attempt data for educational analysis
    const attempts = JSON.parse(localStorage.getItem('phishingAttempts') || '[]');
    attempts.push(data);
    localStorage.setItem('phishingAttempts', JSON.stringify(attempts));
    
    console.log('Phishing attempt tracked for educational purposes:', data);
}

function addRealisticBehavior() {
    // Add subtle animations and behaviors that make the simulation feel real
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Simulate cursor pointer changes on interactive elements
    document.querySelectorAll('a, button, input[type="submit"]').forEach(element => {
        element.style.cursor = 'pointer';
    });
}

// Add some browser-specific behaviors
window.addEventListener('beforeunload', function(e) {
    // Only show warning if form has data (realistic behavior)
    const form = document.getElementById('loginForm');
    if (form) {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        
        if ((email && email.value.trim()) || (password && password.value)) {
            e.preventDefault();
            e.returnValue = '';
        }
    }
});
