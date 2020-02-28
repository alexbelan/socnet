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
        model = User
        fields = ['email', 'username']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserMainDataSerializer(read_only=True)

    class Meta:
        model = UserData
        fields = '__all__'

class UserProfileSettingSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserData
        fields = ['first_name', 'last_name', 'gender', 'about_myself', 'status', 'year_of_birth']