import uuid
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from main.managers import CustomUserManager

# Create your models here.
class CustomUser(AbstractUser):
    GENDER = [
        ("male", _("Male")),
        ("female", _("Female")),
        ("other", _("Other")),
        ("unknown", _("Unknown")),
    ]
    
    username = None # remove username field
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    email = models.EmailField(_("email address"), unique=True) # made email field required and unique
    first_name = models.CharField(max_length=128, blank=False, null=False)
    last_name = models.CharField(max_length=128, blank=False, null=False)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True) # validators should be a list
    profile_picture = models.ImageField(default="", blank=True, null=True, upload_to="profiles")
    location = models.CharField(blank=True, max_length=200)
    gender = models.CharField(max_length=32, choices=GENDER, default="unknown")
    
    USERNAME_FIELD = "email" # set USERNAME_FIELD to email as unique identifier for the User model
    REQUIRED_FIELDS = ["first_name", "last_name"]
    
    objects = CustomUserManager() # specified  all objects for the class come from the CustomUserManager
    
    def __str__(self):
        return f"Custom user model: {self.email}"
