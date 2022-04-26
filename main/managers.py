from django.contrib.auth.base_user import BaseUserManager # use an email as unique identifier instead of username
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    """
        Custom user model manager where email is the unique identifiers
        for authentication instead of usernames.
    """
    
    def create_user(self, email, password, **extra_fields):
        """
            Create and save a User with the given email and password.
        """
        
        if not email:
            raise ValueError(_("The email must be set"))
        
        email = self.normalize_email(email)  # normalizing email = treating all characters after "@" as case insensitive, e.g. foo@bar.com = foo@BAR.com
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        """
            Create and save a SuperUser with the given email and password.
        """
        fields_dict = {
            "is_staff": True,
            "is_superuser": True,
            "is_active": True,
            # "has_delete_permission": True,
        }
        
        extra_fields.update(fields_dict)
        return self.create_user(email, password, **extra_fields)
