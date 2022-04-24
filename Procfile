release: python digital_resume/manage.py migrate
web: gunicorn -b 0.0.0.0:8000 digital_resume.digital_resume.wsgi --log-file -
