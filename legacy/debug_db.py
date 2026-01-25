import database
import sqlite3

def check_db():
    print("Checking database...")
    try:
        conn = database.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT count(*) FROM sensors")
        count_sensors = cursor.fetchone()[0]
        print(f"Sensores (sensors): {count_sensors}")
        
    except Exception as e:
        print(f"Error checking 'sensors': {e}")
        try:
            # Fallback path if table name is different (I used 'sensores' in the code?)
            cursor.execute("SELECT count(*) FROM sensores")
            count_sensores = cursor.fetchone()[0]
            print(f"Sensores (sensores): {count_sensores}")
        except Exception as e2:
             print(f"Error checking 'sensores': {e2}")

    try:
        cursor.execute("SELECT count(*) FROM intervencoes")
        count_int = cursor.fetchone()[0]
        print(f"Intervencoes: {count_int}")
    except Exception as e:
        print(f"Error checking 'intervencoes': {e}")

if __name__ == "__main__":
    check_db()
