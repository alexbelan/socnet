from django.conf.urls import url
from django.urls import path, include
from .views import RegistrUserView, HelloUserView
from django.urls import path
from rest_framework_simplejwt import views as jwt_views

app_name = 'users'

urlpatterns = [
    path('registr/', RegistrUserView.as_view(), name='registr'),
    path('<int:pk>/', HelloUserView.as_view(), name='user'),

]