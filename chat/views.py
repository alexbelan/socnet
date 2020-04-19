from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.http import JsonResponse
import request as request

from .models import Chat, Message
from .serializers import NewChatSerializers, ShowChatsSerializers, SendMessageSerializers, ListMessageSerializers


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


class SendMessageView(CreateAPIView):
    serializer_class = SendMessageSerializers
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SendMessageSerializers(data=request.data)
        data = {}
        if serializer.is_valid():
            msg = serializer.save()
            data['response'] = msg.id
            return Response(data, status=status.HTTP_200_OK)
        else:
            data = serializer.errors
            return Response(data)


class listMessageView(ListAPIView):
    queryset = Message.objects.all()
    serializer_class = ListMessageSerializers
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        serializer = ListMessageSerializers(request)
        msgs = serializer.list(request, pk=pk)
        data = {
            "response": list(msgs)
        }
        return Response(data)

