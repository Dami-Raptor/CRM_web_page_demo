from rest_framework import viewsets
from .models import Person, Lead, Company, Seller
from .serializers import PersonSerialzers, LeadSerialzers, CompanySerialzers, SellerSerialzers
# Create your views here. 
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all() # Obtiene todos los datos de la tabla Company
    serializer_class = CompanySerialzers # Especifica el serializador a usar

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerialzers
    
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerialzers

class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerialzers