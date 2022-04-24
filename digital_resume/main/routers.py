from rest_framework import routers
from .viewsets import ResumeViewSet
# from .user.viewsets import UserViewSet
# from .user.auth.viewsets import LoginViewSet, RegistrationViewSet, RefreshViewSet

routes = routers.SimpleRouter()
routes.register(r"resume", ResumeViewSet, basename="resume")

# routes.register(r'auth/login', LoginViewSet, basename='auth-login')
# routes.register(r'auth/register', RegistrationViewSet, basename='auth-register')
# routes.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')

# User
# routes.register(r'user', UserViewSet, basename='user')

urlpatterns = [*routes.urls]