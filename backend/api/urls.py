from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import (
    CompetitionViewSet,
    CreateListApplicationView,
    DetailLocationView,
    EventViewSet,
    ListExaminationsView,
    ListLicenseView,
    ListLocationsView,
    UpdateAddressView,
    UserViewSet,
)

router = routers.SimpleRouter()
router.register("users", UserViewSet, "user")
router.register("events", EventViewSet, "event")
router.register("competitions", CompetitionViewSet, "competition")
urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token-get"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("locations/", ListLocationsView.as_view(), name="locations-list"),
    path("locations/<int:pk>/", DetailLocationView.as_view(), name="locations-detail"),
    path("licenses/", ListLicenseView.as_view(), name="license-list"),
    path(
        "applications/",
        CreateListApplicationView.as_view(),
        name="application-create-list",
    ),
    path("addresses/<int:pk>/", UpdateAddressView.as_view(), name="address-update"),
    path(
        "examinations/user/", ListExaminationsView.as_view(), name="examinations-user"
    ),
]

urlpatterns += router.urls
