from rest_framework import serializers
from .models import Person, Lead

class PersonSerialzers(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'name', 'lastname', 'email']
        
class LeadSerialzers(serializers.ModelSerializer):
    email = serializers.CharField(source='person.email', read_only=True)
    class Meta:
        model = Lead
        fields = ['id', 'person', 'email', 'butget', 'status', 'priority']