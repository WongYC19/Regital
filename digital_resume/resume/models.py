import uuid
from django.db import models
from main.models import CustomUser as User
from django.utils.timezone import now

# Create your models here.
    
class Template(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, verbose_name="Template ID")
    thumbnail = models.ImageField(upload_to="thumbnails", default="/placeholder.png", null=False, blank=True, verbose_name="template thumbnail")
    title = models.CharField(max_length=150, null=False, blank=False, unique=True)
    description = models.TextField(null=False, blank=True, default="")
    created_date = models.DateTimeField(auto_now_add=True, editable=False, blank=True)
    last_modified_date = models.DateTimeField(auto_now=True, editable=False, blank=True)
    
    def __str__(self):
        return f"Title: {self.title}" 
    
class Resume(models.Model):
    template = models.ForeignKey(Template, on_delete=models.CASCADE, editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="author", editable=False)
    created_date = models.DateTimeField(auto_now_add=True, editable=False)    
    last_modified_date = models.DateTimeField(auto_now=True, editable=False)
    resume_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, null=False, verbose_name="resume_id")
    content = models.JSONField(verbose_name="resume content", null=False, blank=True, default=dict)
   
    def __str__(self):
        return f"{self.resume_id} - {self.created_by.first_name} {self.created_by.last_name} ({self.created_by.pk}) last modified resume on {self.last_modified_date.date()}"

class ResumePermission(models.Model):
    
    class Right(models.IntegerChoices):
        VIEW = 0 # view only
        WRITE = 1 # view + edit
        FULL = 2 # view + edit + delete
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user", db_index=True)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="resume", db_index=True)
    right = models.SmallIntegerField(choices=Right.choices, default=Right.VIEW, db_index=True)
    
    class Meta:
        unique_together = ("user", "resume")
        
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} ({self.user.pk}) has {self.get_right_display()} right on resume {self.resume.resume_id}"
    
class PublicResume(models.Model):
    
    resume_id = models.OneToOneField(to=Resume, on_delete=models.CASCADE, primary_key=True)
    public_id = models.UUIDField(verbose_name="Public Url", null=False, editable=False, default=uuid.uuid4, unique=True)
    
    def __str__(self) -> str:
        return f"Resume ID: {self.resume_id} with public id: {self.public_id}"