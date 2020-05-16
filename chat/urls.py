from django.urls import path
from .views import NewChatView, ChatsShowView, ListMessageView, GetUserData

app_name = 'chat'

urlpatterns = [
    path('new/', NewChatView.as_view(), name='new'),
    path('views/', ChatsShowView.as_view(), name='views'),
    path('listmsgs/<int:pk>/', ListMessageView.as_view(), name='listmsgs'),
    path('user/', GetUserData.as_view()),
]