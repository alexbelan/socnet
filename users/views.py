from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView

from .models import User
from .serializers import UserRegistrSerializer


# Create your views here.
class RegistrUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrSerializer

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
