from django.urls import path, include
from .views import ResumeView, TemplateListView, PermissionView, PublicResumeView, UserView, SharedResumeView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("resume", ResumeView, basename="resume")
router.register("view", PublicResumeView, basename="public_view")
router.register("permission", PermissionView, basename="permission")
router.register("shared_resume", SharedResumeView, basename="shared_resume")
router.register("templates", TemplateListView, basename="templates")
router.register("users", UserView, basename="users")

urlpatterns = [
    path("", include(router.urls)),
]
