import request as request
from rest_framework import status
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView, UpdateAPIView, \
    get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from .models import User, UserData
from .serializers import UserRegistrSerializer, UserProfileSerializer, UserProfileSettingSerializer


# Create your views here.
class RegistrUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserRegistrSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            user = serializer.save()
            data['response'] = 'Ошибок нет'
            data['email'] = user.email
            data['username'] = user.username
            return Response(data, status=status.HTTP_200_OK)
        else:
            data = serializer.errors
            return Response(data)


class HelloUserView(APIView):
    queryset = UserData.objects.all()
    permission_classes = [AllowAny]

    def get(self, request, pk):
        content = {'user': request.user.id}
        return Response(content)


class UserSettingView(UpdateAPIView):
    queryset = UserData.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSettingSerializer

    def get(self, request):
        user = User.objects.get(id=request.user.id)
        user_data = user.user_data
        data = {
            # 'avatar': user_data.avatar,
            'first_name': user_data.first_name,
            'last_name': user_data.last_name,
            'about_myself': user_data.about_myself,
            'gender': user_data.gender,
            'status': user_data.status,
            'year_of_birth': user_data.year_of_birth
        }
        return Response(data)

    def put(self, request, *args, **kwargs):
        user = User.objects.get(id=request.user.id)
        user_data_id = user.user_data.id
        user_data = get_object_or_404(UserData.objects.all(), id=user_data_id)
        serializer = UserProfileSettingSerializer(instance=user_data, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            user_data = serializer.update(user_data, request.data)
            data = {
                'first_name': user_data.first_name,
                'last_name': user_data.last_name,
                'about_myself': user_data.about_myself,
                'gender': user_data.gender,
                'status': user_data.status,
                'year_of_birth': user_data.year_of_birth,
                'response': True
            }
        else:
            data = serializer.errors
        return Response(data)
