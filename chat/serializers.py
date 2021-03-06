from rest_framework import serializers

from chat.models import Chat, Message
from django.core.exceptions import ObjectDoesNotExist
from users.models import User


class NewChatSerializers(serializers.ModelSerializer):

    id_user1 = serializers.IntegerField(write_only=True)
    id_user2 = serializers.IntegerField(write_only=True)

    class Meta:
        model = Chat
        fields = ['id_user1', 'id_user2']

    def create(self, validated_data):
        id_user1 = validated_data.get('id_user1')
        id_user2 = validated_data.get('id_user2')
        try:
            chats = Chat.objects.filter(users=id_user1)
            chat = chats.get(users=id_user2)
        except ObjectDoesNotExist:
            instance = Chat.objects.create()
            instance.users.set([id_user1, id_user2])
            return instance
        else:
            return chat


class ShowChatsSerializers(serializers.ModelSerializer):

    class Meta:
        model = Chat
        fields = "__all__"

    def list(self, request, *args, **kwargs):
        user_id = request.user.id
        chats_res = dict()
        chats = Chat.objects.filter(users__id=user_id).values_list('id', flat=True)
        for chat_id in chats:
            chat = Chat.objects.get(id=chat_id)
            chat_data_user = chat.users.exclude(id=user_id)
            chats_res[chat_id] = {
                'user_id': chat_data_user.get().id,
                'username': chat_data_user.get().username,
                'photo_user': chat_data_user.get().user_data.photo_user.url,
            }
        return chats_res


class SendMessageSerializers(serializers.ModelSerializer):

    id_chat = serializers.IntegerField(write_only=True)
    id_user = serializers.IntegerField(write_only=True)

    class Meta:
        model = Message
        fields = ["id_chat", 'id_user', "text"]

    def create(self, validated_data):
        id_chat = validated_data.get('id_chat')
        id_user = validated_data.get('id_user')
        user = User.objects.get(id=id_user)
        chat = Chat.objects.get(id=id_chat)
        text = validated_data.get('text')
        return Message.objects.create(user=user, chat=chat, text=text)


class UserNameSerializers(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'


class ListMessageSerializers(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ['text', 'user']


class GetUserDataForChat(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username']





