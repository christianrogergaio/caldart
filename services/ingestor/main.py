import serial
import time
import logging
import sys
import os

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Add project root to sys.path to allow importing core
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from core import config, database

# Config
SERIAL_PORT = config.PORTA_SERIAL
BAUD_RATE = config.BAUD_RATE

def parse_line(line):
    """
    Parses "Temp: 25.00 | Umid: 65.00" -> (25.0, 65.0)
    """
    try:
        limpa = line.replace("C", "").replace("%", "").replace("*", "").replace("|", ":")
        partes = limpa.split(":")
        # parts: ['Temp', ' 25.00 ', ' Umid', ' 65.00']
        
        temperatura = float(''.join(c for c in partes[1] if c.isdigit() or c == '.'))
        umidade = float(''.join(c for c in partes[3] if c.isdigit() or c == '.'))
        return temperatura, umidade
    except Exception as e:
        return None, None

def main():
    # Initialize DB (creates tables if missing)
    database.init_db()
    
    try:
        arduino = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2)
        logging.info(f"Connected to Arduino on {SERIAL_PORT}")
    except Exception as e:
        logging.error(f"Failed to connect to Serial: {e}")
        return

    while True:
        try:
            if arduino.in_waiting > 0:
                line = arduino.readline().decode('utf-8', errors='ignore').strip()
                if not line:
                    continue
                
                logging.debug(f"Received: {line}")
                
                if ("Umidade" in line or "Umid" in line) and ("Temperatura" in line or "Temp" in line):
                    temp, umid = parse_line(line)
                    
                    if temp is not None and umid is not None:
                        try:
                            # Save directly to DB
                            success = database.salvar_leitura(temp, umid, config.LATITUDE, config.LONGITUDE)
                            if success:
                                logging.info(f"Saved to DB: {temp}C, {umid}%")
                            else:
                                logging.error("Failed to save to DB")
                        except Exception as db_err:
                            logging.error(f"Database Error: {db_err}")

        except serial.SerialException:
             logging.error("Serial connection lost.")
             break
        except Exception as e:
            logging.error(f"Error: {e}")
            time.sleep(1)

if __name__ == "__main__":
    main()
