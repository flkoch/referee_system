from django.urls import path, include

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import CreateUserView

urlpatterns = [
    path("user/register/", CreateUserView.as_view(), name="user-register"),
    path("token/", TokenObtainPairView.as_view(), name="token-get"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/", include("rest_framework.urls", namespace="rest_framework")),
]
