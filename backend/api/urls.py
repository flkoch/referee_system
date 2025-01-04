from django.urls import path, include

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import (
    CreateListApplicationView,
    CreateUserView,
    DetailEventView,
    ListFurtureEventsView,
    ListLicenseView,
    ListLocationsView,
    UpdateUserView,
    ListEventsView,
    CreateEventView,
)

urlpatterns = [
    path("user/register/", CreateUserView.as_view(), name="user-register"),
    path("user/update/<int:pk>", UpdateUserView.as_view(), name="user-update"),
    path("token/", TokenObtainPairView.as_view(), name="token-get"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("events/", ListEventsView.as_view(), name="event-list"),
    path("events/future/", ListFurtureEventsView.as_view(), name="event-list-future"),
    path("events/<int:pk>/", DetailEventView.as_view(), name="event-list"),
    path("locations/", ListLocationsView.as_view(), name="locations-list"),
    path("licenses/", ListLicenseView.as_view(), name="license-list"),
    path(
        "applications/",
        CreateListApplicationView.as_view(),
        name="application-create-list",
    ),
]
