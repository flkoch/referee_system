from django.contrib.auth.models import User
from django.db.models import Q
from django.utils import timezone

from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import (
    AllowAny,
    DjangoModelPermissions,
    IsAdminUser,
    IsAuthenticated,
)
from rest_framework.exceptions import MethodNotAllowed, PermissionDenied

from api.serializers import UserCreateSerializer, UserSerializer

from competition.models import (
    Accommodation,
    Application,
    Competition,
    CompetitionCategory,
    Event,
    Invitation,
)
from competition.serializers import (
    AccommodationSerializer,
    ApplicationSerializer,
    CompetitionSerializer,
    CompetitionCategorySerializer,
    EventSerializer,
    InvitationSerializer,
)
from helper.models import Address, Location
from helper.serializers import AddressSerializer, LocationSerializer
from referee.models import RefereeLicense
from referee.serializers import RefereeLicenseSerializer


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]


class UpdateUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()


class CreateEventView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [DjangoModelPermissions]


class ListEventsView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]


class ListFurtureEventsView(generics.ListAPIView):
    queryset = Event.objects.filter(start__gte=timezone.now())
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]


class DetailEventView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [DjangoModelPermissions]


class CreateCompetitionView(generics.CreateAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [DjangoModelPermissions]


class CreateCompetitionCategoryView(generics.CreateAPIView):
    queryset = CompetitionCategory.objects.all()
    serializer_class = CompetitionCategorySerializer
    permission_classes = [DjangoModelPermissions]


class CreateAccommodationView(generics.CreateAPIView):
    queryset = Accommodation.objects.all()
    serializer_class = AccommodationSerializer
    permission_classes = [DjangoModelPermissions]


class CreateListApplicationView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(user=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            if serializer.validated_data.get("user") != self.request.user.referee:
                print("Applying for someone else.")
                raise PermissionDenied(
                    detail="You are not allowed to apply someone else."
                )
            else:
                print("Applying for yourself.")
            serializer.save(user=self.request.user.referee)
        else:
            print(serializer.errors)


class DeleteApplicationView(generics.DestroyAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(user=user).filter(
            status=Application.Status.APPLIED
        )

    def perform_destroy(self, instance):
        if timezone.now() - instance.created < timezone.timedelta(minutes=30):
            return super().perform_destroy(instance)
        instance.status = Application.Status.CANCLED
        instance.save()
        raise MethodNotAllowed(instance)


class CreateInvitationView(generics.CreateAPIView):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [DjangoModelPermissions]


class CreateAddressView(generics.CreateAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]


class CreateLocationView(generics.CreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [DjangoModelPermissions]


class ListLocationsView(generics.ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]


class ListLicenseView(generics.ListAPIView):
    queryset = RefereeLicense.objects.all()
    serializer_class = RefereeLicenseSerializer
    permission_classes = [IsAuthenticated]
