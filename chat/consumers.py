import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from chat.models import Chat, Message
from chat.serializers import SendMessageSerializers
from users.models import User


class ChatConsumer(AsyncWebsocketConsumer):
    chat_id = ""

    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = "{}".format(self.chat_id)
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def new_message(self, id_user, message):
        user = User.objects.get(id=id_user)
        chat = Chat.objects.get(id=self.chat_id)
        Message.objects.create(user=user, chat=chat, text=message)

    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        id_user = text_data_json['id_user']
        message = text_data_json['message']

        await self.new_message(id_user=id_user, message=message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id_user': id_user,
                'message': message,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        id_user = event['id_user']

        await self.send(text_data=json.dumps({
            'id_user': id_user,
            'message': message,
        }, ensure_ascii=False))