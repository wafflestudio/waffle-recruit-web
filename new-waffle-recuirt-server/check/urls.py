from django.urls import include, path
from rest_framework.routers import SimpleRouter

from .views import SubmissionViewSet

router = SimpleRouter()
router.register("submit", SubmissionViewSet, basename="submit")

urlpatterns = (path("", include(router.urls)),)
