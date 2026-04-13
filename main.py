import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core_engine.models import Lead
from core_engine.database import inicializar_db, insert_datos, obtener_leads, obtener_all_leads, actualizar_estado_lead

#Metodo para generar leas de prueba
def generar_leads_prueba_automatico():
    print("\nGenerando leads de prueba...")
    leads_data = [
        ("Ana", "Gomez", "ana@empresa.com", 15000),
        ("Juan", "Perez", "juan@gmail.com", 3000),
        ("Maria", "Lopez", "maria@consultora.net", 7500),
    ]
    creados = 0
    #Desempaquetar e insertar datos
    for nombre, apellido, email, presupuesto in leads_data:
        try:
            lead = Lead(nombre, apellido, email, presupuesto)
            insert_datos(
                nombre=lead.nombre,
                apellido=lead.apellido,
                email=lead.email,
                presupuesto=lead.presupuesto_estimado,
                estado=lead.estado,
                email_corporativo=1 if lead.es_correo_corporativo() else 0,
                prioridad=lead.semaforo()
            )
            creados += 1
        except ValueError:
            pass
#Metodo para registrar
def registrar_nuevo_lead():
    print("-" * 30)
    print("REGISTRAR")
    
    nombre = input("Nombre: ")
    apellido = input("Apellido: ")
    email = input("Email: ").strip().lower()
    try:
        presupuesto = float(input("Presupuesto estimado: $").strip())
    except ValueError:
        print("\nError: El presupuesto debe ser un numero valido.")
        return
    
    print("\n  Creando...")
    try:
        lead = Lead(nombre, apellido, email, presupuesto)
        insert_datos(
            nombre=lead.nombre,
            apellido=lead.apellido,
            email=lead.email,
            presupuesto=lead.presupuesto_estimado,
            estado=lead.estado,
            email_corporativo=1 if lead.es_correo_corporativo() else 0, #Validacion de correo corporativo para la base de datos
            prioridad=lead.semaforo()
        )
        print("-" * 20)
        print(f"REGISTRADO EXITOSAMENTE")
        print(f"Nombre: {lead.get_full_name()}")
        print(f"Email: {lead.email}")
        print(f"Presupuesto: ${lead.presupuesto_estimado:,.2f}")
        print(f"Tipo: {'Corporativo' if lead.es_correo_corporativo() else 'Personal'}")
        print(f"Prioridad: {lead.semaforo()}")
        print("-" * 20)
    except ValueError as e:
        print("-" * 20)
        print(f"PRUEBA DE RESILIENCIA")
        print(f"El sistema rechazo el duplicado")
        print(f"{e}")
        print("-" * 20)
#Metodo de consulta de todos los datos de la db
def ver_todos_los_leads():
    print("-" * 30)
    print("LEADS REGISTRADOS")
    
    leads = obtener_all_leads()
    if not leads:
        print("\nNo hay personas registrados en la base de datos.")
    else:
        print(f"\nTotal de personas: {len(leads)}\n")
        #Desempaqueta y enumera cada diccionario desempaquetado
        for idx, (nombre, apellido, email, estado, presupuesto, prioridad) in enumerate(leads, 1):
            lead_temp = Lead(nombre, apellido, email, presupuesto)
            tipo = "Corporativo" if lead_temp.es_correo_corporativo() else "Personal"
            print("-" * 30)
            print(f"{idx}. {nombre} {apellido}")
            print(f"Email: {email}")
            print(f"Estado: {estado}")
            print(f"Presupuesto: ${presupuesto:,.2f}")
            print(f"Prioridad: {prioridad}")
            print(f"Tipo: {tipo}")

def buscar_lead_por_email():
    print("-" * 30)
    print("BUSCAR LEAD")

    email = input("\nEmail a buscar: ").strip().lower()
    lead_bd = obtener_leads(email)
    #Buscar si existe el email
    if lead_bd:
        nombre, apellido, email, estado, presupuesto, prioridad = lead_bd
        lead_temp = Lead(nombre, apellido, email, presupuesto)
        tipo = "Corporativo" if lead_temp.es_correo_corporativo() else "Personal"
        print("-" * 20)
        print(f"CLIENTE ENCONTRADO")
        print(f"Nombre: {nombre} {apellido}")
        print(f"Email: {email}")
        print(f"Estado: {estado}")
        print(f"Presupuesto: ${presupuesto:,.2f}")
        print(f"Prioridad: {prioridad}")
        print(f"Tipo: {tipo}")
    else:
        print(f"\nNo se encontro ninguna persona con el email: {email}")


def convertir_lead_a_cliente():
    print("-" * 30)
    print("CONVERTIR PROSPECTO A CLIENTE")
    
    email = input("\nEmail del lead a convertir: ").strip().lower()
    lead_bd = obtener_leads(email)
    if not lead_bd:
        print(f"\nNo se encontro ninguna persona con el email: {email}")
        return
    #Asignar variables a cada elemento de la lsita
    nombre, apellido, email, estado, presupuesto, prioridad = lead_bd
    if estado == "Cliente":
        print(f"\n{nombre} {apellido} ya es CLIENTE.")
        return
    print(f"\nLead encontrado: {nombre} {apellido}")
    print(f"Estado actual: {estado}")
    print(f"Presupuesto: ${presupuesto:,.2f}")
    print(f"Prioridad: {prioridad}")
    lead = Lead(nombre, apellido, email, presupuesto)
    lead.convert_to_customer()
    actualizar_estado_lead(email, "Cliente")

def mostrar_estadisticas():
    print("\n" + "-" * 30)
    print("ESTADISTICAS")
    
    leads = obtener_all_leads()
    if not leads:
        print("\nNo hay personas registrados.")
        return
    total = len(leads)
    #Calcula la cantidad de los presupuestos
    suma_presupuestos = sum(lead[4] for lead in leads)
    #Contador de cada uno de los datos encontrados
    alta = sum(1 for lead in leads if lead[5] == "Alta")
    media = sum(1 for lead in leads if lead[5] == "Media")
    baja = sum(1 for lead in leads if lead[5] == "Baja")
    prospectos = sum(1 for lead in leads if lead[3] == "Prospecto")
    clientes = sum(1 for lead in leads if lead[3] == "Cliente")
    corporativos = 0
    personales = 0
    for nombre, apellido, email, estado, presupuesto, prioridad in leads:
        lead_temp = Lead(nombre, apellido, email, presupuesto)
        if lead_temp.es_correo_corporativo():
            corporativos += 1
        else:
            personales += 1
    print("-" * 20)
    print("ESTADISTICAS GENERALES")
    print("-" * 20)
    print(f"Total leads: {total}")
    print(f"Potencial total: ${suma_presupuestos:,.2f}")
    print("-" * 20)
    print(f"Prioridad Alta: {alta}")
    print(f"Prioridad Media: {media}")
    print(f"Prioridad Baja: {baja}")
    print("-" * 20)
    print(f"Prospectos: {prospectos}")
    print(f"Clientes: {clientes}")
    print("-" * 20)
    print(f"Corporativos: {corporativos}")
    print(f"Personales: {personales}")
    print("-" * 20)

def menu():
    
    inicializar_db()
    generar_leads_prueba_automatico()
    
    while True:
        print("1. Registrar nuevo lead")
        print("2. Ver todos los leads")
        print("3. Buscar lead por email")
        print("4. Convertir prospecto a cliente")
        print("5. Mostrar estadisticas")
        print("6. Salir")
        opcion = int(input("Ingrese una opcion: "))
        if opcion == 1:
            registrar_nuevo_lead()
        elif opcion == 2:
            ver_todos_los_leads()
        elif opcion == 3:
            buscar_lead_por_email()
        elif opcion == 4:
            convertir_lead_a_cliente()
        elif opcion == 5:
            mostrar_estadisticas()
        elif opcion == 6:
            break
        else:
            print("\nOpcion invalida")


if __name__ == "__main__":
    menu()