from flask import Flask, request, render_template, jsonify, redirect, url_for, session, flash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import json
import os
import re
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# In-memory storage for demonstration (use database in production)
simulation_logs = []
attempt_tracker = {}

# Utility functions
def is_valid_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def log_attempt(ip_address, email, password, user_agent, success=False):
    """Log phishing attempt for analysis"""
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'ip_address': ip_address,
        'email': email,
        'password_length': len(password) if password else 0,
        'user_agent': user_agent,
        'success': success,
        'session_id': session.get('session_id', 'unknown')
    }
    simulation_logs.append(log_entry)
    
    # Save to file for persistence
    try:
        with open('simulation_logs.json', 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
    except Exception as e:
        print(f"Error logging attempt: {e}")

def check_rate_limit(ip_address):
    """Basic rate limiting"""
    if ip_address not in attempt_tracker:
        attempt_tracker[ip_address] = []
    
    now = datetime.now()
    # Remove old attempts
    attempt_tracker[ip_address] = [
        attempt for attempt in attempt_tracker[ip_address] 
        if now - attempt < app.config.get('RATE_LIMIT_DURATION', timedelta(hours=1))
    ]
    
    if len(attempt_tracker[ip_address]) >= app.config.get('MAX_ATTEMPTS_PER_IP', 10):
        return False
    
    attempt_tracker[ip_address].append(now)
    return True

# Awareness routes
@app.route('/')
def index():
    return render_template('awareness/index.html')

@app.route('/awareness')
def awareness_home():
    return render_template('awareness/index.html')

@app.route('/videos')
def videos():
    return render_template('awareness/videos.html')

@app.route('/tips')
def tips():
    return render_template('awareness/tips.html')

@app.route('/quiz')
def quiz():
    return render_template('awareness/quiz.html')

@app.route('/simulations')
def simulations_page():
    return render_template('awareness/simulations.html')

# Simulation routes
@app.route('/simulation')
def simulation_login():
    session['session_id'] = os.urandom(16).hex()
    return render_template('simulation/login.html')

@app.route('/capture', methods=['POST'])
def capture_credentials():
    ip_address = request.remote_addr
    
    # Rate limiting
    if not check_rate_limit(ip_address):
        return jsonify({'error': 'Too many attempts. Please try again later.'}), 429
    
    email = request.form.get('email', '').strip()
    password = request.form.get('password', '')
    user_agent = request.headers.get('User-Agent', 'Unknown')
    
    # Log the attempt
    if app.config.get('LOG_ATTEMPTS', True):
        log_attempt(ip_address, email, password, user_agent)
    
    # Validation
    if not email or not password:
        flash('Please fill in all fields.', 'error')
        return redirect(url_for('simulation_login'))
    
    if not is_valid_email(email):
        flash('Please enter a valid email address.', 'error')
        return redirect(url_for('simulation_login'))
    
    # Always educate after capture
    return render_template('simulation/education.html', email=email)

# Social Media Simulations
@app.route('/simulation/social-media/<platform>')
def social_media_simulation(platform):
    """Simulate social media phishing attacks"""
    session['session_id'] = os.urandom(16).hex()
    
    templates = {
        'facebook': 'simulation/facebook_login.html',
        'instagram': 'simulation/instagram_login.html',
        'linkedin': 'simulation/linkedin_login.html'
    }
    
    template = templates.get(platform, 'simulation/login.html')
    return render_template(template, platform=platform)

@app.route('/capture-social', methods=['POST'])
def capture_social_credentials():
    """Handle social media credential capture"""
    ip_address = request.remote_addr
    
    if not check_rate_limit(ip_address):
        return jsonify({'error': 'Too many attempts. Please try again later.'}), 429
    
    email = request.form.get('email', '').strip()
    password = request.form.get('password', '')
    platform = request.form.get('platform', 'unknown')
    user_agent = request.headers.get('User-Agent', 'Unknown')
    
    # Log the attempt
    if app.config.get('LOG_ATTEMPTS', True):
        log_attempt(ip_address, email, password, user_agent)
    
    # Validation
    if not email or not password:
        flash('Please fill in all fields.', 'error')
        return redirect(url_for('social_media_simulation', platform=platform))
    
    if not is_valid_email(email):
        flash('Please enter a valid email address.', 'error')
        return redirect(url_for('social_media_simulation', platform=platform))
    
    # Redirect to social media education page
    return render_template('simulation/social_education.html', 
                         email=email, platform=platform)

# Urgency Attack Simulation
@app.route('/simulation/urgency-attack')
def urgency_attack():
    """High-pressure urgency attack simulation"""
    session['session_id'] = os.urandom(16).hex()
    return render_template('simulation/urgent_security.html')

@app.route('/capture-urgent', methods=['POST'])
def capture_urgent_credentials():
    """Handle urgent attack credential capture"""
    ip_address = request.remote_addr
    
    if not check_rate_limit(ip_address):
        return jsonify({'error': 'Too many attempts. Please try again later.'}), 429
    
    email = request.form.get('email', '').strip()
    password = request.form.get('password', '')
    user_agent = request.headers.get('User-Agent', 'Unknown')
    
    # Log the attempt
    if app.config.get('LOG_ATTEMPTS', True):
        log_attempt(ip_address, email, password, user_agent)
    
    # Validation
    if not email or not password:
        flash('Please fill in all fields.', 'error')
        return redirect(url_for('urgency_attack'))
    
    if not is_valid_email(email):
        flash('Please enter a valid email address.', 'error')
        return redirect(url_for('urgency_attack'))
    
    # Redirect to urgent attack education page
    return render_template('simulation/urgent_education.html', email=email)

# Spear Phishing Simulation
@app.route('/simulation/spear-phishing/<target>')
def spear_phishing(target):
    """Personalized spear phishing simulation"""
    session['session_id'] = os.urandom(16).hex()
    return render_template('simulation/spear_phishing.html', target=target)

@app.route('/capture-spear', methods=['POST'])
def capture_spear_credentials():
    """Handle spear phishing credential capture"""
    ip_address = request.remote_addr
    
    if not check_rate_limit(ip_address):
        return jsonify({'error': 'Too many attempts. Please try again later.'}), 429
    
    email = request.form.get('email', '').strip()
    password = request.form.get('password', '')
    target = request.form.get('target', 'employee')
    employee_id = request.form.get('employee_id', '')
    user_agent = request.headers.get('User-Agent', 'Unknown')
    
    # Log the attempt
    if app.config.get('LOG_ATTEMPTS', True):
        log_attempt(ip_address, email, password, user_agent)
    
    # Validation
    if not email or not password:
        flash('Please fill in all fields.', 'error')
        return redirect(url_for('spear_phishing', target=target))
    
    if not is_valid_email(email):
        flash('Please enter a valid email address.', 'error')
        return redirect(url_for('spear_phishing', target=target))
    
    # Redirect to spear phishing education page
    return render_template('simulation/spear_education.html', 
                         email=email, target=target, employee_id=employee_id)

# Admin routes
@app.route('/admin/logs')
def view_logs():
    """Admin endpoint to view simulation logs (protect in production)"""
    # Only show in debug mode for security
    if not app.config.get('DEBUG', False):
        return jsonify({'error': 'Access denied'}), 403
    
    return jsonify(simulation_logs[-50:])  # Last 50 entries

@app.route('/admin/simulation-logs')
def view_simulation_logs():
    """View detailed simulation logs"""
    if not app.config.get('DEBUG', False):
        return jsonify({'error': 'Access denied'}), 403
    
    try:
        with open('simulation_logs.json', 'r') as f:
            logs = [json.loads(line) for line in f.readlines()]
        return jsonify(logs[-100:])  # Return last 100 entries
    except FileNotFoundError:
        return jsonify([])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('errors/404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('errors/500.html'), 500

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

# App runner
if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('static/uploads', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    # Ensure simulation_logs.json exists
    if not os.path.exists('simulation_logs.json'):
        with open('simulation_logs.json', 'w') as f:
            pass
    
    print(f"Starting Phishing Awareness Tool...")
    print(f"Debug mode: {app.config.get('DEBUG', False)}")
    print(f"Host: {app.config.get('HOST', '127.0.0.1')}")
    print(f"Port: {app.config.get('PORT', 5000)}")
    
    app.run(
        host=app.config.get('HOST', '0.0.0.0'),
        port=app.config.get('PORT', 5000),
        debug=app.config.get('DEBUG', True)
    )
