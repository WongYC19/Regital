"""digital_resume URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.staticfiles.storage import staticfiles_storage
from django.urls import path, include
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from django.conf import settings
from django.conf.urls.static import static

react_urls = ["resume", "shared_resume", "shared_resume/view/<str:uid>", "resume/<str:uid>", "profile", "view/<str:uid>", "login", "signup", "password_reset", "password_reset_confirm", "password_reset_confirm/<str:uid>/<str:token>", "password_reset_done"]
react_url_patterns = [path(url + "/", TemplateView.as_view(template_name="build/index.html")) for url in react_urls]

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", TemplateView.as_view(template_name="build/index.html")),
    path("", include("api.urls")),
    path("", include("resume.urls")),    
    path(
        "favicon.ico",
        RedirectView.as_view(url=staticfiles_storage.url("favicon.ico")),
    ),
]

urlpatterns += react_url_patterns
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
