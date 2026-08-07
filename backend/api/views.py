from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed, PermissionDenied
from rest_framework.permissions import (
    DjangoModelPermissions,
    IsAuthenticated,
)
from rest_framework.response import Response

from api.serializers import UserSerializer
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
    CompetitionCategorySerializer,
    CompetitionSerializer,
    EventSerializer,
    InvitationSerializer,
)
from helper.models import Address, Location
from helper.serializers import AddressSerializer, LocationSerializer
from referee.models import Examination, RefereeLicense
from referee.serializers import ExaminationSerializer, RefereeLicenseSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise PermissionDenied("You need to login to access this endpoint.")
        qs = super().get_queryset()
        match self.action:
            case "list" | "retrieve":
                if self.request.user.has_perm("auth.models.view_user"):
                    return qs
            case "update" | "partial_update":
                if self.request.user.has_perm("auth.models.change_user"):
                    return qs
            case "delete":
                if self.request.user.has_perm("auth.models.delete_user"):
                    return qs
                raise PermissionDenied("You don't have permission to delete users.")
        return qs.filter(pk=self.request.user.id)


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise PermissionDenied("You need to login to access this endpoint.")
        qs = super().get_queryset()
        match self.action:
            case "list" | "retrieve":
                return qs
            case "destroy":
                if self.request.user.has_perm("referee.models.delete_event"):
                    return qs
                raise PermissionDenied()
        raise PermissionDenied()

    @action(methods=["GET"], detail=False, url_path="future")
    def list_future(self, request):
        if self.request.user.is_anonymous:
            raise PermissionDenied("You need to login to access this endpoint.")
        future_events = super().get_queryset().filter(start__gte=timezone.now())
        page = self.paginate_queryset(future_events)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(future_events, many=True)
        return Response(serializer.data)


class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise PermissionDenied("You need to login to access this endpoint.")
        qs = super().get_queryset()
        match self.action:
            case "list" | "retrieve":
                return qs
            case "update" | "partial_update":
                if self.request.user.has_perm("referee_competition_change"):
                    return qs
            case "create":
                if self.request.user.has_perm("referee_competition_create"):
                    return qs
            case "destroy":
                if self.request.user.has_perm("referee_competition_delete"):
                    return qs
        raise PermissionDenied()


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
        user = self.request.user.referee
        return Application.objects.filter(user=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            if serializer.validated_data.get("user") != self.request.user.referee:
                raise PermissionDenied(
                    detail="You are not allowed to apply someone else."
                )
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


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise PermissionDenied("You need to login to access this endpoint.")
        qs = super().get_queryset()
        match self.action:
            case "update" | "partial_update":
                if self.request.user.has_perm("helper_address_update"):
                    return qs
                return qs.filter(id=self.request.user.referee.address)
            case "create":
                if (
                    self.request.user.has_perm("helper_address_create")
                    or self.request.user.referee.address is None
                ):
                    return qs
            case "list" | "retrieve":
                return qs
            case "destroy":
                if self.request.user.has_perm("helper_address_delete"):
                    return qs
        raise PermissionDenied()


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise PermissionDenied("You need to login to access this endpoint.")
        qs = super().get_queryset()
        match self.action:
            case "retrieve" | "list":
                return qs
            case "create":
                if self.request.user.has_perm("helper_location_create"):
                    return qs
            case "update" | "partial_update":
                if self.request.user.has_perm("helper_location_update"):
                    return qs
            case "destroy":
                if self.request.user.has_perm("helper_location_delete"):
                    return qs
        raise PermissionDenied()


class LicenseViewSet(viewsets.ModelViewSet):
    queryset = RefereeLicense.objects.all()
    serializer_class = RefereeLicenseSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise PermissionDenied("You need to login to access this endpoint.")
        qs = super().get_queryset()
        match self.action:
            case "list" | "retrieve":
                return qs
            case "update" | "partial_update":
                if self.request.user.has_perm("referee_refereelicense_update"):
                    return qs
            case "destroy":
                if self.request.user.has_perm("referee_refereelicense_delete"):
                    return qs
        raise PermissionDenied()


class ListExaminationsView(generics.ListAPIView):
    serializer_class = ExaminationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Examination.objects.filter(candidate=user.referee)
