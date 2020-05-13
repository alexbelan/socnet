from .views import RegistrUserView, UserSettingView, HomeUserView, CheckUserView, UserView
from django.urls import path

app_name = 'users'

urlpatterns = [
    path('registr/', RegistrUserView.as_view(), name='registr'),
    path('setting/', UserSettingView.as_view(), name='setting'),
    path('check/', CheckUserView.as_view(), name='checkuser'),
    path('<int:pk>/', UserView.as_view(), name='user'),
    path('', HomeUserView.as_view(), name='home'),
]