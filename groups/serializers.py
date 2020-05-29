from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from users.models import User
from .models import Groups, Posts


class NewGroupsSerializers(serializers.ModelSerializer):

    class Meta:
        model = Groups
        fields = ["name"]

    def create_group(self, validated_data, id_user):
        name = validated_data.get("name")
        instance = Groups.objects.create(name=name)
        instance.subscribers.set([id_user])
        instance.admins.set([id_user])
        return instance


class DataGroupSerializers(serializers.ModelSerializer):

    class Meta:
        model = Groups
        fields = "__all__"


class SubscribersSerializers(serializers.ModelSerializer):

    class Meta:
        model = Groups
        fields =["subscribers"]


class NewPostSerializers(serializers.ModelSerializer):

    id_group = serializers.IntegerField(write_only=True)

    class Meta:
        model = Posts
        fields = ['id_group', 'text', 'image']

    def new_post(self, validated_data, id_user):
        id_group = validated_data.get("id_group")
        text = validated_data.get("text")
        img = validated_data.get("image")

        user = User.objects.get(id=id_user)
        group = Groups.objects.get(id=id_group)

        try:
            group.admins.get(id=id_user)
        except ObjectDoesNotExist:
            return False
        instance = Posts.objects.create(
            text=text,
            image=img,
            author=user,
            group=group,
        )
        return instance


class ListPostsGroupSerializers(serializers.ModelSerializer):

    class Meta:
        model = Posts
        fields = "__all__"


class PostWorkSerializers(serializers.ModelSerializer):

    id_post = serializers.IntegerField(write_only=True)

    class Meta:
        model = Posts
        fields = ["id_post"]

    def addLike(self, validated_data, id_user):
        id_post = validated_data.get("id_post")
        post = Posts.objects.get(id=id_post)
        post.likes.add(id_user)
        return True

    def removeLike(self, validated_data, id_user):
        id_post = validated_data.get("id_post")
        post = Posts.objects.get(id=id_post)
        post.likes.remove(id_user)
        return True

    def addRepost(self, validated_data, id_user):
        id_post = validated_data.get("id_post")
        post = Posts.objects.get(id=id_post)
        post.reposts.add(id_user)
        return True

    def removeRepost(self, validated_data, id_user):
        id_post = validated_data.get("id_post")
        post = Posts.objects.get(id=id_post)
        post.reposts.remove(id_user)
        return True


class RemovePostSerializers(serializers.ModelSerializer):

     id_post = serializers.IntegerField(write_only=True)

     class Meta:
         model = Posts
         fields = ["id_post"]

     def remove_post(self, validated_data, id_user):
        id_post = validated_data.get("id_post")
        post = Posts.objects.get(id=id_post)
        group = Groups.objects.get(id=post.group.id)
        try:
            group.admins.get(id=id_user)
        except ObjectDoesNotExist:
            return False
        post.delete()
        return True


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


class RepostsShowSerializers(serializers.ModelSerializer):

    id_user = serializers.IntegerField(write_only=True)

    class Meta:
        model = Posts
        fields = ["id_user"]