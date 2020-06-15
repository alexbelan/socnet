from users.serializers import UserPhotoSettingSerializer
from .views import RegistrUserView, UserSettingView, HomeUserView, CheckUserView, UserView, ShowFriendsView, \
    ShowRequestFriendsView, RejectRequestFriendView, AcceptRequestFriendView, RequestFriendView, DeleteFriendView, \
    UserSettingPhotoView
from django.urls import path

app_name = 'users'

urlpatterns = [
    path('registr/', RegistrUserView.as_view(), name='registr'),
    path('setting/', UserSettingView.as_view(), name='setting'),
    path('setting/photo/', UserSettingPhotoView.as_view()),
    path('check/', CheckUserView.as_view(), name='checkuser'),
    path('<int:pk>/', UserView.as_view(), name='user'),
    path('', HomeUserView.as_view(), name='home'),
    path('friends/', ShowFriendsView.as_view()),
    path('friends/requestall/', ShowRequestFriendsView.as_view()),
    path('friends/request/', RequestFriendView.as_view()),
    path('friends/reject/', RejectRequestFriendView.as_view()),
    path('friends/accept/', AcceptRequestFriendView.as_view()),
    path('friends/delete/', DeleteFriendView.as_view()),
]