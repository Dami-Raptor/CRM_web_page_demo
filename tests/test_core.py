import pytest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core_engine.database import inicializar_db, insert_datos, obtener_leads, actualizar_estado_lead
from core_engine.models import Persona, Lead, Vendedor, CuentaB2B

@pytest.fixture
def db_test():
    nombre_db = 'test_crm.db'
    if os.path.exists(nombre_db):
        os.remove(nombre_db)
    
    inicializar_db(nombre_db)
    yield nombre_db
    if os.path.exists(nombre_db):
        os.remove(nombre_db)
        

@pytest.mark.parametrize("nombre, apellido, esperado", [
    ("Damian", "gonzalez", "Damian Gonzalez"),
    ("MARIA", "GONZALEZ", "Maria Gonzalez"),
    ("cArLoS", "dE lA tOrRe", "Carlos De La Torre"),
    ("ana", "maria", "Ana Maria"),
    ("PEDRO", "ramirez", "Pedro Ramirez"),
])
def test_formato_nombre_completo(nombre, apellido, esperado):
    persona = Persona(nombre, apellido, "test@test.com")
    resultado = persona.get_full_name()
    assert resultado == esperado


@pytest.mark.parametrize("estado_inicial, esperado_cliente", [
    ('Prospecto', 'Cliente'),
    ('Cliente', 'Cliente'),
])
def test_conversion_prospecto_cliente(db_test, estado_inicial, esperado_cliente):
    nombre_db = db_test
    email = f"conversion_{estado_inicial}@test.com"
    insert_datos(
        nombre="Nombre",
        apellido="Apellido",
        email=email,
        presupuesto=1000,
        estado=estado_inicial,
        email_corporativo=1,
        prioridad="Media",
        nombre_db=nombre_db
    )
    
    lead_bd = obtener_leads(email, nombre_db)
    assert lead_bd[3] == estado_inicial
    
    lead = Lead("Nombre", "Apellido", email, 1000)
    lead.estado = estado_inicial
    resultado = lead.convert_to_customer()
    assert resultado == esperado_cliente
    
    actualizar_estado_lead(email, resultado, nombre_db)
    
    lead_final = obtener_leads(email, nombre_db)
    assert lead_final[3] == esperado_cliente


@pytest.mark.parametrize("email, esperado_corporativo", [
    ("ana@gmail.com", False),
    ("gmail@innova.com", True),
    ("gobierno@gob.mx", True),
    ("usuario@yahoo.com", False),
    ("ventas@consultora.net", True),
    ("test@outlook.com", False),
    ("empresa@corporativo.com", True),
    ("ceo@tech.org", True)
])
def test_b2b_correo_corporativo(email, esperado_corporativo):
    lead = Lead("Nombre", "Apellido", email, 1000)
    resultado = lead.es_correo_corporativo()
    assert resultado == esperado_corporativo


@pytest.mark.parametrize("presupuesto, prioridad_esperada", [
    (15000, "Alta"),
    (10000, "Alta"),
    (9999, "Media"),
    (5000, "Media"),
    (4999, "Baja"),
    (100, "Baja"),
    (0, "Baja")
])
def test_semaforo_prioridad(db_test, presupuesto, prioridad_esperada):
    """
    MODIFICADO: Ahora inserta en BD y verifica que la prioridad se guardó correctamente.
    """
    nombre_db = db_test
    email = f"prioridad_{presupuesto}@test.com"
    
    lead = Lead("Test", "Prioridad", email, presupuesto)
    resultado = lead.semaforo()
    assert resultado == prioridad_esperada
    
    # Insertar en BD
    insert_datos(
        nombre=lead.nombre,
        apellido=lead.apellido,
        email=lead.email,
        presupuesto=presupuesto,
        estado=lead.estado,
        email_corporativo=1 if lead.es_correo_corporativo() else 0,
        prioridad=resultado,
        nombre_db=nombre_db
    )
    
    lead_bd = obtener_leads(email, nombre_db)
    assert lead_bd is not None
    assert lead_bd[4] == presupuesto
    assert lead_bd[5] == prioridad_esperada


@pytest.mark.parametrize("presupuesto_invalido", [
    -100,
    -1000000,
    -0.01,
    -999999999,
])
def test_error_presupuesto_negativo(presupuesto_invalido):
    with pytest.raises(ValueError) as exc_info:
        Lead("Nombre", "Apellido", "error@test.com", presupuesto_invalido)
    assert "negativo" in str(exc_info.value).lower()


def test_comision_defoul():
    vendedor = Vendedor("nombre", "apellido", "test@test.com", "V-52")
    assert vendedor.comision_pct == 0.05


@pytest.mark.parametrize("comision, comision_esperada", [
    (10, 0.10),
    (0, 0.0),
    (100, 1.0),
    (50, 0.50),
    (25.5, 0.255),
])
def test_comision_ajustable(comision, comision_esperada):
    vendedor = Vendedor("nombre", "apellido", "test@test.com", "V-52")
    vendedor.comision_pct = comision
    assert vendedor.comision_pct == comision_esperada


@pytest.mark.parametrize("valor_invalido", [
    150,
    -10,
    101,
    -1,
])
def test_comision_fuera_rango_error(valor_invalido):
    vendedor = Vendedor("nombre", "apellido", "test@test.com", "V-52")
    with pytest.raises(ValueError) as exc_info:
        vendedor.comision_pct = valor_invalido
    assert "0%" in str(exc_info.value) and "100%" in str(exc_info.value)


@pytest.mark.parametrize("presupuestos_previos, nuevo_presupuesto, total_esperado", [
    ([], 15000, 15000),
    ([15000], 7500, 22500),
    ([15000, 7500], 3000, 25500),
])
def test_potencial_ventas_2b2(db_test, presupuestos_previos, nuevo_presupuesto, total_esperado):
    nombre_db = db_test
    cuenta = CuentaB2B("TechSolutions S.A.")
    for i, presupuesto in enumerate(presupuestos_previos):
        email = f"email{i}@tech.com"
        lead = Lead(f"Nombre", "Apellido", email, presupuesto)
        cuenta.agregar_prospecto(lead)
        
        insert_datos(
            nombre=lead.nombre,
            apellido=lead.apellido,
            email=lead.email,
            presupuesto=presupuesto,
            estado=lead.estado,
            email_corporativo=1 if lead.es_correo_corporativo() else 0,
            prioridad=lead.semaforo(),
            nombre_db=nombre_db
        )
    
    email_nuevo = f"nuevo_{nuevo_presupuesto}@tech.com"
    nuevo_lead = Lead("Nuevo", "Lead", email_nuevo, nuevo_presupuesto)
    cuenta.agregar_prospecto(nuevo_lead)
    
    insert_datos(
        nombre=nuevo_lead.nombre,
        apellido=nuevo_lead.apellido,
        email=nuevo_lead.email,
        presupuesto=nuevo_presupuesto,
        estado=nuevo_lead.estado,
        email_corporativo=1 if nuevo_lead.es_correo_corporativo() else 0,
        prioridad=nuevo_lead.semaforo(),
        nombre_db=nombre_db
    )
    
    potencial = cuenta.potencial_ventas()
    assert potencial == total_esperado, f"Error: esperado {total_esperado}, obtenido {potencial}"
    
    lead_bd = obtener_leads(email_nuevo, nombre_db)
    assert lead_bd is not None
    assert lead_bd[4] == nuevo_presupuesto

@pytest.mark.parametrize("ventas, comision, comision_esperada",[
    ([1000], 24.5, 245),
    ([1000], 10, 100),
    ([1500], 0, 0),
    ([2500], 100, 2500),
    ([], 10, 0),
])
def test_calculo_comision(ventas, comision, comision_esperada):
    vendedor = Vendedor("Nombre", "Apellido", "test@ventas.com", "V-001")
    vendedor.comision_pct = comision
    for monto in ventas:
        vendedor.registrar_venta(monto)
    comision_calculada = vendedor.ventas_totales * vendedor.comision_pct
    assert comision_calculada == comision_esperada
    assert vendedor.ventas_totales == sum(ventas)