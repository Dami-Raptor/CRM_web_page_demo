from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Person, Lead, Company, Seller
from .serialzers import PersonSerialzers, LeadSerialzers, CompanySerialzers, SellerSerialzers
# Create your views here. 
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all() # Obtiene todos los datos de la tabla Company
    serializer_class = CompanySerialzers # Especifica el serializador a usar
    permission_classes = [IsAuthenticated] # Requiere autenticacion

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerialzers
    permission_classes = [IsAuthenticated]
    
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerialzers
    permission_classes = [IsAuthenticated]

class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerialzers
    permission_classes = [IsAuthenticated]