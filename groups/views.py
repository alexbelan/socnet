from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from groups.pagination import GroupPostsPagination
from .serializers import NewGroupsSerializers, SubscribeSerializers, NewPostSerializers, ListPostsGroupSerializers, \
    PostWorkSerializers, RemovePostSerializers
from .models import Groups, Posts


class NewGroupViews(CreateAPIView):
    queryset = Groups.objects.all()
    serializer_class = NewGroupsSerializers
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NewGroupsSerializers(data=request.data)
        data = {}
        if serializer.is_valid():
            group = serializer.save()
            data['res'] = group.id
        return Response(data)


class DataGroupViews(RetrieveAPIView):
    queryset = Groups.objects.all()
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        group = Groups.objects.get(pk=pk)
        data = {
            'id': group.id,
            'name': group.name,
            'subscribe': group.subscribers.count(),
        }
        return Response(data)


class ListSubscribersViews(RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        group = Groups.objects.get(pk=pk)
        return Response(group.subscribers.all().values('id', 'username'))


class NewSubscribeViews(APIView):
    queryset = Groups.objects.all()
    serializer_class = SubscribeSerializers
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubscribeSerializers(data=request.data)
        if serializer.is_valid():
            res = serializer.newSubscribe(request.data, id_user=request.user.id)
        return Response(res)


class NewPostViews(CreateAPIView):
    serializer_class = NewPostSerializers
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = NewPostSerializers(data=request.data)
        data = {}
        if serializer.is_valid():
            post = serializer.save()
            data['res'] = post.id
        return Response(data)


class ListPostsGroupViews(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        group = Groups.objects.get(pk=pk)
        queryset = Posts.objects.filter(group=group).order_by('-id')
        paginator = GroupPostsPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = ListPostsGroupSerializers(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class ListPostsGroupsSubViews(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        groups = Groups.objects.filter(subscribers=request.user.id).values_list('id', flat=True)
        queryset = Posts.objects.filter(group__in=groups).order_by('-id')
        paginator = GroupPostsPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = ListPostsGroupSerializers(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class PostAddLikeViews(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostWorkSerializers

    def post(self, request):
        serializer = PostWorkSerializers(data=request.data)
        if serializer.is_valid():
            res = serializer.addLike(request.data, request.user.id)
        else:
            res = False
        return Response(res)


class PostRemoveLikeViews(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostWorkSerializers

    def post(self, request):
        serializer = PostWorkSerializers(data=request.data)
        if serializer.is_valid():
            res = serializer.removeLike(request.data, request.user.id)
        else:
            res = False
        return Response(res)


class PostAddRepostViews(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostWorkSerializers

    def post(self, request):
        serializer = PostWorkSerializers(data=request.data)
        if serializer.is_valid():
            res = serializer.addRepost(request.data, request.user.id)
        else:
            res = False
        return Response(res)


class PostRemoveRepostViews(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostWorkSerializers

    def post(self, request):
        serializer = PostWorkSerializers(data=request.data)
        if serializer.is_valid():
            res = serializer.removeRepost(request.data, request.user.id)
        else:
            res = False
        return Response(res)


class RemovePostViews(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RemovePostSerializers

    def post(self, request):
        serializer = RemovePostSerializers(data=request.data)
        res = serializer.remove_post(request.data, request.user.id)
        return Response(res)


class UnsubscribeViews(APIView):
    queryset = Groups.objects.all()
    serializer_class = SubscribeSerializers
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubscribeSerializers(data=request.data)
        if serializer.is_valid():
            res = serializer.removeSubscribe(request.data, id_user=request.user.id)
        return Response(res)