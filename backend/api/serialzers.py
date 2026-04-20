from rest_framework import serializers
from .models import Person, Lead, Company, Seller
class CompanySerialzers(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'nameCompany']
        
class PersonSerialzers(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'name', 'lastname', 'email']
        
class LeadSerialzers(serializers.ModelSerializer):
    email = serializers.CharField(source='person.email', read_only=True)
    class Meta:
        model = Lead
        fields = ['id', 'email', 'butget', 'status', 'priority', 'company', 'person', 'seller']
        
class SellerSerialzers(serializers.ModelSerializer):
    name = serializers.CharField(source='person.name', read_only=True)
    lastname = serializers.CharField(source='person.lastname', read_only=True)
    email = serializers.CharField(source='person.email', read_only=True)
    class Meta:
        model = Seller
        fields =['id', 'name', 'lastname', 'email', 'badget', 'performance', 'commission', 'company', 'person']