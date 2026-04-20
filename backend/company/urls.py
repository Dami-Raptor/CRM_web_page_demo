from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, PersonViewSet, SellerViewSet, LeadViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'persons', PersonViewSet)
router.register(r'sellers', SellerViewSet)
router.register(r'leads', LeadViewSet)

urlpatterns = [
    path('', include(router.urls)),
]