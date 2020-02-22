from django.urls import path
from .views import RegistrUserView

app_name = 'users'

urlpatterns = [
    path('registr/', RegistrUserView.as_view(), name='registr')
]