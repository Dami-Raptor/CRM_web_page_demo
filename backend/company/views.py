from rest_framework import viewsets
from .models import Person, Lead, Company, Seller
from .serializers import PersonSerializers, LeadSerializers, CompanySerializers, SellerSerializers
# Create your views here. 
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all() # Obtiene todos los datos de la tabla Company
    serializer_class = CompanySerializers # Especifica el serializador a usar

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializers
    
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializers

class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializers