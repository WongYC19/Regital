#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import dotenv
from pathlib import Path

def main():
    """Run administrative tasks."""
    DOT_ENV_PATH = Path().resolve() / "digital_resume"  / ".env"
    DOT_ENV_PATH2 = Path().resolve() / "digital_resume"  / "digital_resume" / ".env"
    env_paths = [DOT_ENV_PATH, DOT_ENV_PATH2]
    
    for env_path in env_paths:        
        if env_path.exists():
            print("Reading .env file...")
            dotenv.load_dotenv(str(env_path))
            break
        else:
            print(f"No .env found in {env_path}, be sure to make it.")
        
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digital_resume.settings')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
