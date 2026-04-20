from django.contrib import admin
from .models import Company, Person, Seller, Lead
# Register your models here.
admin.site.register(Company)
admin.site.register(Person)
admin.site.register(Seller)
admin.site.register(Lead)