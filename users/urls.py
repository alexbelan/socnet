from django.conf.urls import url
from django.urls import path, include
from .views import RegistrUserView, UserSettingView, HomeUserView, CheckUserView
from django.urls import path
from rest_framework_simplejwt import views as jwt_views

app_name = 'users'

urlpatterns = [
    path('registr/', RegistrUserView.as_view(), name='registr'),
    path('setting/', UserSettingView.as_view(), name='setting'),
    path('check/', CheckUserView.as_view(), name='user'),
    path('', HomeUserView.as_view(), name='home'),

]