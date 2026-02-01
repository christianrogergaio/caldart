import serial
import sys

PORT = 'COM4'
print(f"Tentando abrir {PORT}...")
try:
    s = serial.Serial(PORT, 115200)
    print(f"SUCESSO: {PORT} aberto!")
    s.close()
    print("Porta fechada.")
except Exception as e:
    print(f"FALHA: {e}")
