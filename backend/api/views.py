from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Person, Lead
from .serialzers import PersonSerialzers, LeadSerialzers
# Create your views here. 

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerialzers
    permission_classes = [IsAuthenticated]
    
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerialzers
    permission_classes = [IsAuthenticated]