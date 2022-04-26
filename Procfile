release: python manage.py migrate
web: gunicorn -b 0.0.0.0:8000 digital_resume.wsgi --log-file -
