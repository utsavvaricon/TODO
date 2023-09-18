from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core_app.entrypoints.route_handlers import TodoViewset


router = DefaultRouter()
router.register(r"todo", TodoViewset)

# urlpatterns should include the router.urls from DefaultRouter
urlpatterns = [
    path("", include(router.urls)),
]
