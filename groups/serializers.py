from rest_framework import serializers

from users.models import User
from .models import Groups


class NewGroupsSerializers(serializers.ModelSerializer):

    id_user = serializers.IntegerField(write_only=True)

    class Meta:
        model = Groups
        fields = ["id_user", "name"]

    def create(self, validated_data):
        id = validated_data.get("id_user")
        name = validated_data.get("name")

        instance = Groups.objects.create(name=name)
        instance.subscribers.set([id])
        instance.admins.set([id])
        return instance


class DataGroupSerializers(serializers.ModelSerializer):

    class Meta:
        model = Groups
        fields = "__all__"


class SubscribersSerializers(serializers.ModelSerializer):

    class Meta:
        model = Groups
        fields =[ "subscribers"]


class SubscribeSerializers(serializers.ModelSerializer):

    id_group = serializers.IntegerField(write_only=True)

    class Meta:
        model = Groups
        fields = ["id_group"]

    def newSubscribe(self, validated_data, id_user):
        id_group = validated_data.get("id_group")
        group = Groups.objects.get(id=id_group)
        group.subscribers.add(id_user)
        return True

    def removeSubscribe(self, validated_data, id_user):
        id_group = validated_data.get("id_group")
        group = Groups.objects.get(id=id_group)
        group.subscribers.remove(id_user)
        return True