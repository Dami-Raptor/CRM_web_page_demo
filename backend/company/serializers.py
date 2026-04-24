from rest_framework import serializers
from .models import Person, Lead, Company, Seller
from django.db import transaction

class CompanySerializers(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class PersonSerializers(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class SellerSerializers(serializers.ModelSerializer):
    person = PersonSerializers()
    full_name = serializers.CharField(source='__str__', read_only=True)
    
    class Meta:
        model = Seller
        fields = ['id', 'badge', 'performance', 'commission', 'person', 'company', 'full_name']

    @transaction.atomic
    def create(self, validated_data):
        person_data = validated_data.pop('person') # Captura los datos ya validados de person convirtiendolo en person_data para recibir un objeto y no un diccionario
        person, _ = Person.objects.get_or_create( # Guarda en person el primer dato de la tupla devuelta, los (datos) y un booleano de la validacion en "_" solo me importa el objeto, no si fue creado o no
            email=person_data.get('email'), # Busca el email a registrar en la tabla de person para validar si existe
            defaults=person_data # Si no existe el email usa todos esos datos para la ceacion
        )
        return Seller.objects.create(person=person, **validated_data) # Inserta los datos 

    @transaction.atomic
    def update(self, instance, validated_data):
        person_data = validated_data.pop('person', None) # Captura los datos Con valor por defecto None si no viene 'person' -> person_data = None (sin error)
        if person_data: #Valida si vienen los datos de Person para actualizar en caso de no venir no tocara los datos de person
            person_serializer = PersonSerializers(instance.person, data=person_data, partial=True) # Guarda los datos en person serializer
            person_serializer.is_valid(raise_exception=True) # Verifica si la validacion es correcta
            person_serializer.save() # Si es valida guarda los datos
        
        return super().update(instance, validated_data) # Actualiza con validated_data heredando de ModelSerializer para el update

class LeadSerializers(serializers.ModelSerializer):
    person = PersonSerializers()
    company_name = serializers.CharField(source='company.name', read_only=True)
    seller_name = serializers.CharField(source='seller.person.name', read_only=True, default="Sin asignar")

    class Meta:
        model = Lead
        fields = [
            'id', 'butget', 'status', 'priority', 
            'person', 'company', 'seller', 
            'company_name', 'seller_name'
        ]

    @transaction.atomic
    def create(self, validated_data):
        person_data = validated_data.pop('person')
        person, _ = Person.objects.get_or_create(
            email=person_data.get('email'),
            defaults=person_data
        )
        return Lead.objects.create(person=person, **validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        person_data = validated_data.pop('person', None)
        if person_data:
            person_serializer = PersonSerializers(instance.person, data=person_data, partial=True)
            person_serializer.is_valid(raise_exception=True)
            person_serializer.save()
        return super().update(instance, validated_data)