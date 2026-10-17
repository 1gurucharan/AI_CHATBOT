
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render


def home(request):
    return render(request, "chatbotapp/index.html")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home, name="home"),
    path("", include("chatbotapp.urls")),
]
    