import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        room_id = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = "{}".format(room_id)
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        id_user = text_data_json['id_user']
    #
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
            'message': message
        }, ensure_ascii=False))