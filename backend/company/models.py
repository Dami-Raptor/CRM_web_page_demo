from django.db.models import Sum
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=100, unique=True)
    fundation = models.DateField(auto_now_add=True)
    def __str__(self):
        return self.name

class Person(models.Model):
    name = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    email = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f"{self.name.title()} {self.lastname.title()} \n {self.email}"
    
class Seller(models.Model):
    badget = models.CharField(max_length=10, unique=True)
    performance = models.FloatField(default=0)
    commission = models.FloatField(default=0.05)
    person = models.ForeignKey(Person, related_name='sellers', on_delete=models.CASCADE)
    company     = models.ForeignKey(Company, related_name='sellers', on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Nombre: {self.person.name.title()} {self.person.lastname.title()}\nEmail: {self.person.email}\nNo Empleado: {self.badge}\nVentas: ${self.performance}\nComision: {self.commission}"
    
class Lead(models.Model):
    STATUS_CHOICES = [
        ('Prospecto', 'Prospecto'),
        ('Cliente', 'Cliente')
        ]
    PRIORITY_CHOICES = [
        ('Alta', 'Alta'),
        ('Media', 'Media'),
        ('Baja', 'Baja')
        ]
    butget = models.FloatField(default=1.0)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Prospecto')
    priority = models.CharField(max_length=50, choices=PRIORITY_CHOICES, null=False)
    person = models.ForeignKey(Person, related_name='leads', on_delete=models.CASCADE)
    company  = models.ForeignKey(Company, related_name='leads',  on_delete=models.CASCADE)
    seller   = models.ForeignKey(Seller,  related_name='leads',  on_delete=models.SET_NULL, null=True, blank=True)
    
    def __init__(self, *args, **kwargs): # Sobrescribe el metodo init para guardar el vendedor original
        super().__init__(*args, **kwargs) # LLama al constructor original de DJango
        self.__original_seller = self.seller # Guarda el vendedor en un atributo "Privado" Python internamente renombra este atributo como _Lead__original_seller
    
    def __str__(self):
        return f"Nombre: {self.person.name.title()} {self.person.lastname.title()}\nEmail: {self.person.email}\nPresupuesto: ${self.butget}\nEstado: {self.status}\nPrioridad: {self.priority}"
    
def update_performance(seller):
    if seller:
        total = Lead.objects.filter(seller=seller).aggregate(total_suma=Sum('butget')) # Suma los presupuestos de todos los leads asignados al vendedor
        seller.performance = total['total_suma'] or 0 # Si no hay leads se establece en 0
        seller.save() # Actualiza el rendimiento del vendedor
        
@receiver(post_save, sender=Lead)
def update_on_save(sender, instance, **kwargs):
    update_performance(instance.seller) # Actualizar el rendimiento del vendedor actual
    original_seller = getattr(instance, '_Lead__original_seller', None) # Detecta si el vendedor ha cambiado comparando con el vendedor actual
    if original_seller and instance.seller != original_seller: # Evalua si el vendedor cambio
        update_performance(original_seller) # Actualiza el rendimiento de los vendedores
@receiver(post_delete, sender=Lead)
def update_on_delete(sender, instance, **kwargs):
    if instance.seller:
        update_performance(instance.seller)