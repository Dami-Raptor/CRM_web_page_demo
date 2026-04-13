# CRM_web_page_demo
Proyecto para crear un crm con python y django

### **Gestión de Leads**
> Registro de prospectos con validaciones automáticas  
>Clasificación B2B/B2C según dominio de correo  
>Sistema de semáforo de prioridad (Alta/Media/Baja)  
>Conversión de prospectos a clientes  
>Prevención de duplicados por email

### **Gestión de Vendedores**
>Cálculo automático de comisiones (0>100%)  
>Registro de ventas con validación de montos positivos  
>Acumulación de ventas totales por vendedor

### **Gestión de Cuentas B2B**
>Asociación de leads a la empresa  
>Cálculo de potencial de ventas  
>Prevención de duplicados

### **Estadísticas y Reportes**
>Total de leads registrados  
>Potencial total de ventas  
>Distribución por prioridad  
>Distribución por estado (Prospecto/Cliente)  
>Clasificación por tipo de correo (Corporativo/Personal)

### **Validaciones y Seguridad**
>Nombres en formato título automático  
>Validación de emails con formato correcto  
>Bloqueo de presupuestos negativos  
>Constraint UNIQUE en base de datos  
>Prueba de resiliencia automática  

 ## ***Ejecucion del sistema***
### Ejecucion del main, interactuando con la base de datos
```powershell 
   python -u "\main.py" 
   ```
### Ejecucion del test para probar el sistema antes de interactuar con la base de datos
```powershell
pytest tests/test_core.py/ -v 
```