from rest_framework import serializers
from .models import User, UserData, Friends


class UserRegistrSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField()

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']

    def save(self, *args, **kwargs):
        user_data = UserData()
        user_data.save()

        user = User(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
            user_data=user_data,
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({password: "Пароль не совпадает"})
        user.set_password(password)
        user.save()
        friends = Friends(user=user)
        friends.save()
        return user


class UserMainDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserData
        fields = ['first_name', 'last_name', "photo_user", 'about_myself', 'gender', 'status']


class FriendsDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = Friends
        fields = ['friends', 'request_friends']

    def validate_friends(self, value):
        return len(value.data)

    def validate_request_friends(self, value):
        return len(value.data)


class UserProfileSerializer(serializers.ModelSerializer):
    user_data = UserMainDataSerializer(read_only=True)
    friends = FriendsDataSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'user_data', 'friends']


class UserPhotoSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ["photo_user"]

    def update(self, instance, validated_data):
        instance.photo_user = validated_data.get('photo_user', instance.photo_user)
        instance.save()
        return instance


class UserProfileSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ['avatar', 'first_name', 'last_name', 'about_myself', 'gender', 'status', 'year_of_birth']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.first_name)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.about_myself = validated_data.get('about_myself', instance.about_myself)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance


# class UserPhotoSettingSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = UserData
#         fields = ["photo_user"]
#
#     def update(self, instance, validated_data):
#         instance.photo_user = validated_data.get('photo_user', instance.photo_user)
#         instance.save()
#         return instance


class FriendsWorkSerializer(serializers.ModelSerializer):

    id_user = serializers.IntegerField(write_only=True)

    class Meta:
        model = Friends
        fields = ["id_user"]

    def request_friend(self, validated_data, user):
        id_user = validated_data.get("id_user")
        friend = Friends.objects.get(user=id_user)
        friend.request_friends.add(user)
        return True

    def accept_request_friend(self, validated_data, user):
        id_user = validated_data.get("id_user")
        your_friends = Friends.objects.get(user=user)
        user_friends = Friends.objects.get(user=id_user)
        your_friends.request_friends.remove(id_user)
        your_friends.friends.add(id_user)
        user_friends.friends.add(user)
        return True

    def reject_request_friend(self, validated_data, user):
        id_user = validated_data.get("id_user")
        your_friends = Friends.objects.get(user=user)
        your_friends.request_friends.remove(id_user)
        return True

    def delete_friend(self, validated_data, user):
        id_user = validated_data.get("id_user")
        friends = Friends.objects.get(user=id_user)
        your_friends = Friends.objects.get(user=user)
        friends.friends.remove(user)
        your_friends.friends.remove(id_user)
        return True


class FriendsShowSerializer(serializers.ModelSerializer):

    def list(self, id_user):
        friends = Friends.objects.get(user=id_user)
        return friends.friends.all()


class FriendsRequestSerializer(serializers.ModelSerializer):

    def list(self, id_user):
        friends = Friends.objects.get(user=id_user)
        return friends.request_friends.all()


class FriendsDataShowSerializer(serializers.ModelSerializer):

    class Meta:
        model = Friends
        fields = ["friends", "request_friends"]