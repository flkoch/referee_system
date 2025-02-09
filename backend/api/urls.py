from django.urls import path, include

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import (
    CreateListApplicationView,
    CreateUserView,
    DetailCompetitionView,
    DetailEventView,
    DetailLocationView,
    DetailUserView,
    ListExaminationsView,
    ListFurtureEventsView,
    ListLicenseView,
    ListLocationsView,
    UpdateAddressView,
    UpdateUserView,
    ListEventsView,
    CreateEventView,
)

urlpatterns = [
    path("user/register/", CreateUserView.as_view(), name="user-register"),
    path("user/<int:pk>/", DetailUserView.as_view(), name="user"),
    path("user/<int:pk>/update/", UpdateUserView.as_view(), name="user"),
    path("token/", TokenObtainPairView.as_view(), name="token-get"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("events/", ListEventsView.as_view(), name="event-list"),
    path("events/future/", ListFurtureEventsView.as_view(), name="event-list-future"),
    path("events/<int:pk>/", DetailEventView.as_view(), name="event-detail"),
    path(
        "competition/<int:pk>/",
        DetailCompetitionView.as_view(),
        name="competition-detail",
    ),
    path("locations/", ListLocationsView.as_view(), name="locations-list"),
    path("locations/<int:pk>/", DetailLocationView.as_view(), name="locations-detail"),
    path("licenses/", ListLicenseView.as_view(), name="license-list"),
    path(
        "applications/",
        CreateListApplicationView.as_view(),
        name="application-create-list",
    ),
    path("address/<int:pk>/", UpdateAddressView.as_view(), name="address-update"),
    path(
        "examinations/user/", ListExaminationsView.as_view(), name="examinations-user"
    ),
]
