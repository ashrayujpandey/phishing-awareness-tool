import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    HOST = os.environ.get('FLASK_HOST', '0.0.0.0')
    PORT = int(os.environ.get('FLASK_PORT', 5000))
    
    # Simulation settings
    LOG_ATTEMPTS = True
    MAX_ATTEMPTS_PER_IP = 10
    RATE_LIMIT_DURATION = timedelta(hours=1)
