from django.db import models

# Create your models here.
class Person(models.Model):
    name = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    email = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f"{self.name.title()} {self.lastname.title()} \n {self.email}"
    
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
    
    def __str__(self):
        return f"Nombre: {self.person.name.title()} {self.person.lastname.title()}\nEmail: {self.person.email}\nPresupuesto: ${self.budget}\nEstado: {self.status}\nPrioridad: {self.priority}"