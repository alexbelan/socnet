from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from chat.pagination import MessagesPagination
from users.models import User
from .models import Chat, Message
from chat.serializers import NewChatSerializers, ShowChatsSerializers, ListMessageSerializers, GetUserDataForChat


class NewChatView(APIView):
    queryset = Chat.objects.all()
    serializer_class = NewChatSerializers
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NewChatSerializers(data=request.data)
        data = {}
        if serializer.is_valid():
            chat = serializer.save()
            data['response'] = chat.id
            return Response(data, status=status.HTTP_200_OK)
        else:
            data = serializer.errors
            return Response(data)


class ChatsShowView(ListAPIView):
    serializer_class = ShowChatsSerializers
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ShowChatsSerializers(request)
        chats = serializer.list(request)
        data = {
            "response": chats
        }
        return Response(data)


class ListMessageView(ListAPIView):
    queryset = Message.objects.all()
    serializer_class = ListMessageSerializers
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        chat = Chat.objects.get(pk=pk)
        queryset = Message.objects.filter(chat=chat).order_by('-id')
        paginator = MessagesPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = ListMessageSerializers(page, many=True)
        data = {
            'msgs': paginator.get_paginated(serializer.data),
            'user': chat.users.all().exclude(id=request.user.id).values('id', 'username')
        }
        return Response(data)


class GetUserData(RetrieveAPIView):
    # queryset = User.objects.all()
    serializer_class = GetUserDataForChat
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = User.objects.get(id=request.user.id)
        serializer = GetUserDataForChat(queryset)
        return Response(serializer.data)