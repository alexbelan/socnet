import request as request
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, \
    get_object_or_404, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from .models import User, UserData, Friends
from .serializers import UserRegistrSerializer, UserProfileSerializer, UserProfileSettingSerializer, \
    FriendsShowSerializer, FriendsRequestSerializer, FriendsWorkSerializer


# Create your views here.
class RegistrUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserRegistrSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            serializer.save()
            data['response'] = True
            return Response(data, status=status.HTTP_200_OK)
        else:
            data = serializer.errors
            return Response(data)


class CheckUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'Authenticated': True}
        return Response(content)


class UserView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]

    # def get(self, request, pk, *args, **kwargs):
    #     serializer = UserProfileSerializer(request)
    #     user_data = UserData.objects.get(id=queryset.user_data)
    #     # data = {
    #     #     'username': serializer.username,
    #     #     'email': serializer.email,
    #     #     'first_name': user_data.first_name,
    #     #     'last_name': user_data.last_name,
    #     #     'about_myself': user_data.about_myself,
    #     #     'gender': user_data.gender,
    #     #     'status': user_data.status,
    #     #     'year_of_birth': user_data.year_of_birth,
    #     # }
    #     return Response(data)


class HomeUserView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = User.objects.get(id=request.user.id)
        user_data = user.user_data
        friends = Friends.objects.get(user=request.user.id)
        data = {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'first_name': user_data.first_name,
            'last_name': user_data.last_name,
            'about_myself': user_data.about_myself,
            'gender': user_data.gender,
            'status': user_data.status,
            'year_of_birth': user_data.year_of_birth,
            'freands': len(friends.friends.all()),
            'request_freands': len(friends.request_friends.all())
        }
        return Response(data)

    # def post (self, request):
    #     return Response({'user': request.user.id})


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
            # 'year_of_birth': user_data.year_of_birth
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


class ShowFriendsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendsShowSerializer

    def get(self, request, *args, **kwargs):
        serializer = FriendsShowSerializer()
        res = serializer.list(request.user.id)
        return Response(res.values('id', 'username'))


class ShowRequestFriendsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendsRequestSerializer

    def get(self, request, *args, **kwargs):
        serializer = FriendsRequestSerializer()
        res = serializer.list(request.user.id)
        return Response(res.values('id', 'username'))


class RejectRequestFriendView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendsWorkSerializer

    def post(self, request):
        serializer = FriendsWorkSerializer(data=request.data)
        res = serializer.reject_request_friend(request.data, request.user.id)
        return Response(res)


class AcceptRequestFriendView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendsWorkSerializer

    def post(self, request):
        serializer = FriendsWorkSerializer(data=request.data)
        res = serializer.accept_request_friend(request.data, request.user.id)
        return Response(res)


class RequestFriendView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendsWorkSerializer

    def post(self, request):
        serializer = FriendsWorkSerializer(data=request.data)
        res = serializer.request_friend(request.data, request.user.id)
        return Response(res)


