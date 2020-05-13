from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .serializers import NewGroupsSerializers, SubscribeSerializers, DataGroupSerializers, SubscribersSerializers
from .models import Groups


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


class UnsubscribeViews(APIView):
    queryset = Groups.objects.all()
    serializer_class = SubscribeSerializers
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubscribeSerializers(data=request.data)
        if serializer.is_valid():
            res = serializer.removeSubscribe(request.data, id_user=request.user.id)
        return Response(res)