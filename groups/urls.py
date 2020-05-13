from .views import NewGroupViews, NewSubscribeViews, UnsubscribeViews, DataGroupViews, ListSubscribersViews
from django.urls import path

app_name = 'groups'

urlpatterns = [
    path('new/', NewGroupViews.as_view(), name='new-group'),
    path('subscribe/', NewSubscribeViews.as_view(), name="new-subscribe"),
    path('unsubscribe/', UnsubscribeViews.as_view(), name="unsubscribeViews"),
    path('<int:pk>/', DataGroupViews.as_view()),
    path('<int:pk>/subscribers/', ListSubscribersViews.as_view()),
]