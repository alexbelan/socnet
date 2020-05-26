from .views import NewGroupViews, NewSubscribeViews, UnsubscribeViews, DataGroupViews, ListSubscribersViews, \
    NewPostViews, ListPostsGroupViews, ListPostsGroupsSubViews, PostAddLikeViews, PostRemoveLikeViews, \
    PostAddRepostViews, PostRemoveRepostViews, RemovePostViews, UserSubscriptionsViews, RepostsViews
from django.urls import path

app_name = 'groups'

urlpatterns = [
    path('new/', NewGroupViews.as_view(), name='new-group'),
    path('subscribe/', NewSubscribeViews.as_view(), name="new-subscribe"),
    path('unsubscribe/', UnsubscribeViews.as_view(), name="unsubscribeViews"),
    path('<int:pk>/', DataGroupViews.as_view()),
    path('<int:pk>/subscribers/', ListSubscribersViews.as_view()),
    path('subscriptions/', UserSubscriptionsViews.as_view()),

    path('post/new/', NewPostViews.as_view()),
    path('posts/<pk>/', ListPostsGroupViews.as_view()),
    path('posts/sub/', ListPostsGroupsSubViews.as_view()),
    path('post/addlike/', PostAddLikeViews.as_view()),
    path('post/removelike/', PostRemoveLikeViews.as_view()),
    path('post/addrepost/', PostAddRepostViews.as_view()),
    path('post/removerepost/', PostRemoveRepostViews.as_view()),
    path('post/remove/', RemovePostViews.as_view()),
    path('post/reposts/<pk>/', RepostsViews.as_view()),
]