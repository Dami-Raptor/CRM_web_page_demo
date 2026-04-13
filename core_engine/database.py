import sqlite3

def obtener_conexion(nombre_db='crm_demo.db'):
    conexion = sqlite3.connect(nombre_db)
    conexion.execute("PRAGMA foreign_keys = ON")
    return conexion

def inicializar_db(nombre_db='crm_demo.db'):
    conexion = obtener_conexion(nombre_db)
    cursor = conexion.cursor()
    try:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                apellido TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                presupuesto_estimado REAL DEFAULT 0,
                estado TEXT DEFAULT 'Prospecto',
                email_corporativo INTEGER DEFAULT 0,
                prioridad TEXT NOT NULL
            )
        ''')
        conexion.commit()
        print(f"Base de datos crm_demo.db ha sido inicializada...")
        
    except sqlite3.Error as e:
        conexion.rollback()
        print(f"Error: {e}")
    finally:
        conexion.close()
    
def insert_datos(nombre, apellido, email, presupuesto, estado, email_corporativo, prioridad, nombre_db='crm_demo.db'):
    conexion = obtener_conexion(nombre_db)
    cursor = conexion.cursor()
    try:
        cursor.execute('''
            INSERT INTO leads (nombre, apellido, email, estado, presupuesto_estimado, email_corporativo, prioridad)
            VALUES(?, ?, ?, ?, ?, ?, ?)
        ''', (nombre, apellido, email, estado, presupuesto, email_corporativo, prioridad))
        conexion.commit()
        print("Datos insertados correctamente...")
        return True
    except sqlite3.IntegrityError:
        conexion.rollback()
        raise ValueError(f"Email duplicado {email}")
    except sqlite3.Error as e:
        conexion.rollback()
        print(f"Error {e}")
        return False
    finally:
        conexion.close()
    
def obtener_leads(email, nombre_db='crm_demo.db'):
    conexion = obtener_conexion(nombre_db)
    cursor = conexion.cursor()
    try:
        cursor.execute('''
            SELECT nombre, apellido, email, estado, presupuesto_estimado, prioridad 
            FROM leads WHERE email = ?
        ''', (email,))
        return cursor.fetchone()
    except sqlite3.Error as e:
        print(f"Error: {e}")
        return None
    finally:
        conexion.close()


def obtener_all_leads(nombre_db='crm_demo.db'):
    conexion = obtener_conexion(nombre_db)
    cursor = conexion.cursor()
    try:
        cursor.execute('''
            SELECT nombre, apellido, email, estado, presupuesto_estimado, prioridad 
            FROM leads ORDER BY presupuesto_estimado DESC
        ''')
        return cursor.fetchall()
    except sqlite3.Error as e:
        print(f"Error: {e}")
        return []
    finally:
        conexion.close()

def actualizar_estado_lead(email, nuevo_estado, nombre_db='crm_demo.db'):
    conexion = obtener_conexion(nombre_db)
    cursor = conexion.cursor()
    try:
        cursor.execute('''
            UPDATE leads SET estado = ? WHERE email = ?
        ''', (nuevo_estado, email))
        conexion.commit()
        
        if cursor.rowcount > 0:
            print(f"Estado actualizado en BD {email} -> {nuevo_estado}")
            return True
        else:
            print(f"No se encontró {email}")
            return False
    except sqlite3.Error as e:
        conexion.rollback()
        print(f"Error al actualizar {e}")
        return False
    finally:
        conexion.close()