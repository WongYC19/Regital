from rest_framework.permissions import BasePermission
from resume.models import ResumePermission, Resume

class ResumePermissionControl(BasePermission):
    safe_methods = ("GET", "POST", "PUT", "DELETE")
    
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        
        if request.method in self.safe_methods:
            return True
       
        return False

    
    def has_object_permission(self, request, view, obj):
        print("Has object permission is called.")
        if obj.created_by == request.user:
            return True
        
        right = 0
        if request.method == "DELETE":
            right = 2
        elif request.method == "PUT":
            right = 1
        
        print("Is allowed users:", right)
        is_allowed = ResumePermission.objects.filter(
            right__gte=right, 
            resume=obj
        ).first()
        
        is_allowed = bool(is_allowed)
        return is_allowed