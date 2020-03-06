from rest_framework import serializers
from .models import User, UserData


class UserRegistrSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

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
        return user


class UserMainDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserData
        fields = ['first_name', 'last_name', 'about_myself', 'gender', 'status']


class UserProfileSerializer(serializers.ModelSerializer):
    user_data = UserMainDataSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'user_data']


class UserProfileSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ['avatar', 'first_name', 'last_name', 'about_myself', 'gender', 'status', 'year_of_birth', ]

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.first_name)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.about_myself = validated_data.get('about_myself', instance.about_myself)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.status = validated_data.get('status', instance.status)
        # instance.year_of_birth = validated_data.get('year_of_birth', instance.year_of_birth)
        instance.save()
        return instance
