"""backend URL Configuration

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
from django.http import JsonResponse
from django.urls import path

from backend.views import api, auth


def response_not_found_handler(request, exception=None):
    return JsonResponse({"error": "The route is not defined"}, status=404)


handler404 = response_not_found_handler

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/login", auth.Login.as_view()),
    path("auth/register", auth.Register.as_view()),
    path("auth/logout", auth.LogOut.as_view()),
    path("auth/user", auth.AuthenticatedUser.as_view()),
    path("api/onboarding", api.Onboarding.as_view()),
]
