from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import (
    AddressViewSet,
    CompetitionViewSet,
    CreateListApplicationView,
    EventViewSet,
    LicenseViewSet,
    ListExaminationsView,
    LocationViewSet,
    UserViewSet,
)

router = routers.SimpleRouter()
router.register("users", UserViewSet, "user")
router.register("events", EventViewSet, "event")
router.register("competitions", CompetitionViewSet, "competition")
router.register("addresses", AddressViewSet, "address")
router.register("locations", LocationViewSet, "location")
router.register("licenses", LicenseViewSet, "license")
urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token-get"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/", include("rest_framework.urls", namespace="rest_framework")),
    path(
        "applications/",
        CreateListApplicationView.as_view(),
        name="application-create-list",
    ),
    path(
        "examinations/user/", ListExaminationsView.as_view(), name="examinations-user"
    ),
]

urlpatterns += router.urls
