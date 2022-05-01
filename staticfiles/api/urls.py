from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import Routes, MyTokenObtainPairView, RegisterView, RetrieveUpdateDestroyProfileView, ChangePasswordView, ResetPasswordView, ResetPasswordConfirmView, CSRFTokenView

urlpatterns = [    
    path("api/", Routes.as_view(), name="api_routes"),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/user_profile/", RetrieveUpdateDestroyProfileView.as_view(), name="update_profile"),
    path("api/change_password/", ChangePasswordView.as_view(), name="change_password"),
    path("api/reset_password/", ResetPasswordView.as_view(), name="reset_password"),
    path("api/reset_password_confirm/", ResetPasswordConfirmView.as_view(), name="reset_password_confirm"),
    path("api/get_csrf_token/", CSRFTokenView.as_view(), name="csrf_token_view"),
]