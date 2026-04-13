import re

DOMINIOS_PERSONALES = ['gmail', 'hotmail', 'yahoo', 'outlook']

class Persona:
    def __init__(self, nombre, apellido, email):
        if not self.validar_solo_letras(nombre):
            raise ValueError(f"ERROR: El nombre '{nombre}' debe contener solo letras")
        if not self.validar_solo_letras(apellido):
            raise ValueError(f"ERROR: El apellido '{apellido}' debe contener solo letras")
        if not self.validar_email(email):
            raise ValueError(f"ERROR: El email '{email}' debe ser válido y contener '@'")
                
        self.nombre = nombre
        self.apellido = apellido
        self.email = email
    #Valida solo texto por medio de expresiones regulares
    def validar_solo_letras(self, texto :str) -> bool:
        return bool(re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', texto))
    
    def validar_email(self, email :str) -> bool:
        if '@' not in email:
            return False
        # Opcional: validar que no esté vacío antes o después del @
        partes = email.split('@')
        if len(partes) != 2 or not partes[0] or not partes[1]:
            return False
        return True
        #Apliacar formato de titulo
    def get_full_name(self):
        return f"{self.nombre} {self.apellido}".title()

class Lead(Persona):
    def __init__(self, nombre, apellido, email, presupuesto_estimado):
        super().__init__(nombre, apellido, email)
        self.estado = "Prospecto"
        self._presupuesto = 0
        self.presupuesto_estimado = presupuesto_estimado 

    @property
    def presupuesto_estimado(self):
        return self._presupuesto

    @presupuesto_estimado.setter
    def presupuesto_estimado(self, valor :int) -> int:
        if valor < 0:
            self._presupuesto = 0
            raise ValueError(f"ERROR: El presupuesto no puede ser negativo (recibido: {valor})")
        else:
            self._presupuesto = valor
    
    def es_correo_corporativo(self):
        if '@' not in self.email:
            return False
        dominio_email = self.email.split('@')[1].lower()
        es_personal = any(opcion in dominio_email for opcion in DOMINIOS_PERSONALES)
        
        return not es_personal

    def convert_to_customer(self):
        self.estado = "Cliente"
        print(f"{self.get_full_name()} ahora es Cliente.")
        return self.estado
    
    def semaforo(self):
        if self.presupuesto_estimado >= 10000:
            return "Alta"
        elif self.presupuesto_estimado >= 5000:
            return "Media"
        else:
            return "Baja"

class Vendedor(Persona):
    def __init__(self, nombre, apellido, email, n_empleado):
        super().__init__(nombre, apellido, email)
        self.n_empleado = n_empleado
        self.ventas_totales = 0
        self._comision_pct = 0.05
    
    @property
    def comision_pct(self):
        return self._comision_pct
    
    @comision_pct.setter
    def comision_pct(self, valor):
        if 0 <= valor <= 100:
            self._comision_pct = valor / 100
        else:
            raise ValueError("Comision debe estar entre 0% y 100%")
    
    def registrar_venta(self, monto :int) -> int:
        if monto <= 0:
            raise ValueError("Solo se pueden registrar ventas positivas")
        self.ventas_totales += monto
        
class CuentaB2B:
    def __init__(self, nombre_empresa):
        self.nombre_empresa = nombre_empresa
        self._prospectos_c = {}
    
    def agregar_prospecto(self, lead):
        if not isinstance(lead, Lead):
            raise TypeError(f"Solo se pueden agregar objetos Lead, se recibió: {type(lead).__name__}")
        
        if lead.email in self._prospectos_c:
            raise ValueError(f"El prospecto {lead.email} ya existe en {self.nombre_empresa}")
        
        self._prospectos_c[lead.email] = lead
        print(f"Prospecto agregado a {self.nombre_empresa}")
    
    def potencial_ventas(self):
        return sum(lead.presupuesto_estimado for lead in self._prospectos_c.values())
    
# class IRepositorioEscritura(ABC):
#     @abstractmethod
#     def guardar(self, entidad):
#         pass

# class IRepositorioLectura(ABC):
#     @abstractmethod
#     def obtener_todos(self):
#         pass
    
# class LeadRepositoryMemoria(IRepositorioEscritura, IRepositorioLectura):
#     def __init__(self):
#         self._db_simulada = [] 

#     def guardar(self, lead: Lead):
#         self._db_simulada.append(lead)
#         print(f"Guardando a {lead.email}.")

#     def obtener_todos(self):
#         return self._db_simulada

# class VendedorRepositoryMemoria(IRepositorioEscritura):
#     def __init__(self):
#         self._db_simulada = []

#     def guardar(self, vendedor: Vendedor):
#         self._db_simulada.append(vendedor)
#         print(f"Guardando al vendedor {vendedor.n_empleado}.")

# class LeadService:
#     def __init__(self, repositorio: IRepositorioEscritura):
#         self.repositorio = repositorio

#     def registrar_nuevo_lead(self, nombre, apellido, email, presupuesto):
#         print(f"\n[Servicio] Iniciando registro para: {email}")
        
#         if "@" not in email:
#             print(f"Error: El email '{email}' no tiene un formato válido.")
#             return None
        
#         nuevo_lead = Lead(nombre, apellido, email, presupuesto)
        
#         # El servicio usa el método del contrato (interfaz)
#         self.repositorio.guardar(nuevo_lead)
#         self._enviar_email_bienvenida(nuevo_lead)
#         return nuevo_lead

#     def _enviar_email_bienvenida(self, lead: Lead):
#         print(f"[Email] Mandando correo de bienvenida a {lead.email}...\n")

# class VendedorService:
#     def __init__(self, repositorio: IRepositorioEscritura):
#         self.repositorio = repositorio

#     def contratar_vendedor(self, nombre, apellido, email, n_empleado):
#         print(f"\n[RRHH] Iniciando contratación para: {nombre} {apellido}")
        
#         if not str(n_empleado).startswith("V-"):
#             print(f"Error: El gafete '{n_empleado}' es inválido.")
#             return None
        
#         nuevo_vendedor = Vendedor(nombre, apellido, email, n_empleado)
#         self.repositorio.guardar(nuevo_vendedor)
#         print(f"[RRHH] {nuevo_vendedor.get_full_name()} ha sido dado de alta.")
#         return nuevo_vendedor