from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from api.serializers import UserCreateSerializer


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]
