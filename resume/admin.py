from django.contrib import admin
from resume.models import Template, Resume, ResumePermission, PublicResume

# Register your models here.
admin.site.register((Template, PublicResume))

class PermissionInline(admin.TabularInline):
    model = ResumePermission
    
@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    inlines = [PermissionInline]
    
