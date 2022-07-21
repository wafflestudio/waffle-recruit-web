from rest_framework import permissions, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import SubmissionService, SkeletonService

class SubmissionViewSet(ModelViewSet):
    @action(
        detail=False,
        methods=["POST"],
        permission_classes=(permissions.IsAuthenticated,),
        serializer_class=SubmissionService,
    )
    def submit(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return serializer.execute()
    
    @action(
        detail=False,
        methods=["POST"],
        permission_classes=(permissions.IsAuthenticated,),
        serializer_class=SkeletonService,
    )
    def skeleton(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return serializer.execute()

    