// Main JavaScript for awareness site
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .tip-card, .stat').forEach(el => {
        observer.observe(el);
    });

    // Quiz functionality
    initializeQuiz();
    
    // Tips page functionality
    initializeTips();
});


function initializeQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    const questions = [
        {
            question: "What should you do if you receive an unexpected email asking you to verify your account?",
            options: [
                "Click the link immediately to secure your account",
                "Contact the company directly through official channels",
                "Reply to the email asking for verification",
                "Forward it to your friends for advice"
            ],
            correct: 1,
            explanation: "Always verify suspicious requests through official channels, never through the suspicious email itself."
        },
        {
            question: "Which of these is a red flag in a phishing email?",
            options: [
                "Professional company logo",
                "Urgent language like 'Act now or lose access!'",
                "Proper spelling and grammar",
                "Clear contact information"
            ],
            correct: 1,
            explanation: "Urgency tactics are a common phishing technique designed to pressure you into acting without thinking."
        },
        {
            question: "What's the best way to check if a website is legitimate?",
            options: [
                "Look for professional design only",
                "Check the URL carefully and look for HTTPS",
                "Trust it if it loads quickly",
                "Assume it's safe if it has a login form"
            ],
            correct: 1,
            explanation: "Always verify the URL matches the legitimate site and ensure it uses HTTPS (look for the lock icon)."
        },
        {
            question: "What should you do if a link in an email looks suspicious?",
            options: [
                "Click it and see where it goes",
                "Forward it to your IT department or security team",
                "Bookmark it for later",
                "Ignore and delete the email"
            ],
            correct: 1,
            explanation: "Suspicious links should always be reported to IT/security teams to prevent harm."
        },
        {
            question: "Which of the following is a safe practice when receiving unexpected attachments?",
            options: [
                "Open it if it looks like it came from your manager",
                "Download it and scan it later",
                "Verify the sender before opening any attachments",
                "Trust attachments from company email addresses"
            ],
            correct: 2,
            explanation: "Always verify the sender’s identity before opening unexpected attachments—even from known addresses."
        },
        {
            question: "Phishing attacks can occur through which of the following channels?",
            options: [
                "Only email",
                "Email and SMS only",
                "Email, SMS, phone calls, and social media",
                "Only websites"
            ],
            correct: 2,
            explanation: "Phishing can occur across many platforms including email, SMS (smishing), phone (vishing), and social media."
        },
        {
            question: "Why should you hover over a hyperlink before clicking it?",
            options: [
                "To see if it's underlined",
                "To check the font style",
                "To preview the actual URL destination",
                "To load the page faster"
            ],
            correct: 2,
            explanation: "Hovering over a link reveals the actual URL, helping you spot malicious redirections."
        },
        {
            question: "You receive an email from 'support@paypa1.com'. What should you do?",
            options: [
                "Ignore the small difference, it's likely safe",
                "Click the link and log in to check your account",
                "Report it as a phishing attempt",
                "Reply to confirm if it's legitimate"
            ],
            correct: 2,
            explanation: "This is a classic phishing technique using a spoofed domain (e.g., 'paypa1.com'). Always report such emails."
        },
        {
            question: "What is a common goal of phishing attacks?",
            options: [
                "To entertain users",
                "To promote a brand",
                "To steal personal or financial information",
                "To improve email communication"
            ],
            correct: 2,
            explanation: "Phishing is primarily used to steal credentials, personal, or financial data for malicious use."
        },
        {
            question: "What is the most secure way to access a bank account online?",
            options: [
                "Via a link received in an email",
                "From a browser bookmark or by typing the URL manually",
                "Through social media links",
                "Using a public Wi-Fi without VPN"
            ],
            correct: 1,
            explanation: "Always access sensitive sites by typing the URL directly or using bookmarks—not email links."
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let answers = [];

    function displayQuestion() {
        const question = questions[currentQuestion];
        quizContainer.innerHTML = `
            <div class="quiz-question">
                <h3>Question ${currentQuestion + 1} of ${questions.length}</h3>
                <p class="question-text">${question.question}</p>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <label class="option">
                            <input type="radio" name="answer" value="${index}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
                <button id="next-question" class="btn btn-primary" disabled>
                    ${currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
            </div>
        `;

        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.addEventListener('change', () => {
                document.getElementById('next-question').disabled = false;
            });
        });

        document.getElementById('next-question').addEventListener('click', nextQuestion);
    }

    function nextQuestion() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) return;

        const answerIndex = parseInt(selectedAnswer.value);
        const question = questions[currentQuestion];
        const isCorrect = answerIndex === question.correct;

        answers.push({
            question: currentQuestion,
            answer: answerIndex,
            correct: isCorrect,
            explanation: question.explanation
        });

        if (isCorrect) score++;

        currentQuestion++;

        if (currentQuestion < questions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        const percentage = Math.round((score / questions.length) * 100);
        let feedback = "";

        if (percentage >= 80) {
            feedback = "Excellent! You have a strong understanding of phishing protection.";
        } else if (percentage >= 60) {
            feedback = "Good job! You have basic knowledge but could benefit from more practice.";
        } else {
            feedback = "You might be vulnerable to phishing attacks. Please review the educational materials.";
        }

        quizContainer.innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete!</h3>
                <div class="score">
                    <span class="score-number">${score}</span> / ${questions.length}
                    <span class="score-percentage">(${percentage}%)</span>
                </div>
                <p class="feedback">${feedback}</p>
                <div class="answers-review">
                    <h4>Review Your Answers:</h4>
                    ${answers.map((answer, index) => `
                        <div class="answer-review ${answer.correct ? 'correct' : 'incorrect'}">
                            <p><strong>Question ${index + 1}:</strong> ${questions[index].question}</p>
                            <p><strong>Your answer:</strong> ${questions[index].options[answer.answer]}</p>
                            ${!answer.correct ? `<p><strong>Correct answer:</strong> ${questions[index].options[questions[index].correct]}</p>` : ''}
                            <p class="explanation">${answer.explanation}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-actions">
                    <button onclick="location.reload()" class="btn btn-secondary">Retake Quiz</button>
                    <a href="/tips" class="btn btn-primary">Learn More</a>
                </div>
            </div>
        `;
    }

    displayQuestion();
}



function initializeTips() {
    // Add interactive elements to tips page
    const tipCards = document.querySelectorAll('.tip-card');
    
    tipCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });

    // Add search functionality if search box exists
    const searchBox = document.getElementById('tips-search');
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tips = document.querySelectorAll('.tip-item');
            
            tips.forEach(tip => {
                const text = tip.textContent.toLowerCase();
                tip.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .quiz-question {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .options {
        margin: 2rem 0;
    }
    
    .option {
        display: block;
        margin: 1rem 0;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .option:hover {
        background: #e9ecef;
    }
    
    .option input {
        margin-right: 1rem;
    }
    
    .quiz-results {
        text-align: center;
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .score {
        font-size: 2rem;
        margin: 2rem 0;
        color: var(--primary-color);
    }
    
    .answer-review {
        text-align: left;
        margin: 1rem 0;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid;
    }
    
    .answer-review.correct {
        background: #f0f9ff;
        border-color: var(--success-color);
    }
    
    .answer-review.incorrect {
        background: #fef2f2;
        border-color: var(--danger-color);
    }
    
    .explanation {
        font-style: italic;
        color: var(--text-secondary);
        margin-top: 0.5rem;
    }
`;
document.head.appendChild(style);
