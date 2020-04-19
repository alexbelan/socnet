from django.urls import path
from .views import NewChatView, ChatsShowView, SendMessageView, listMessageView

app_name = 'chat'

urlpatterns = [
    path('new/', NewChatView.as_view(), name='new'),
    path('views/', ChatsShowView.as_view(), name='views'),
    path('sendmsg/', SendMessageView.as_view(), name='sendmsg'),
    path('listmsgs/<int:pk>/', listMessageView.as_view(), name='listmsgs'),
]