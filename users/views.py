from rest_framework import status
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from .models import User, UserData
from .serializers import UserRegistrSerializer, UserProfileSerializer


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


class HelloUserView(RetrieveAPIView):
    queryset = UserData.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserProfileSerializer

    # def get(self, request):
    #     serializer = UserProfileSerializer(pk)
    #     content = {'email': serializer.email}
    #     return Response(content)
