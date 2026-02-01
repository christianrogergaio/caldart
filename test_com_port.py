import serial
import time
import sys

# Configuração da porta (Padrão COM4 conforme solicitado, mas pode ser alterado)
PORTA = 'COM4'
BAUDRATE = 115200

def testar_conexao():
    print(f"--- Iniciando Teste de Conexão na porta {PORTA} ---")
    print(f"Baudrate: {BAUDRATE}")
    print("Tentando abrir a porta...")

    try:
        ser = serial.Serial(PORTA, BAUDRATE, timeout=1)
        print(f"SUCESSO: Porta {PORTA} aberta corretamente!")
        print("Aguardando dados... (Pressione Ctrl+C para parar)")
        print("-" * 50)

        while True:
            if ser.in_waiting > 0:
                # Lê a linha e decodifica para texto
                linha = ser.readline().decode('utf-8', errors='ignore').strip()
                if linha:
                    print(f"[RECEBIDO]: {linha}")
            
            # Pequena pausa para não consumir 100% da CPU
            time.sleep(0.1)

    except serial.SerialException as e:
        print("\n[ERRO CRÍTICO]: Não foi possível conectar!")
        print(f"Motivo: {e}")
        print("\nDicas de solução:")
        print("1. Verifique se o cabo USB está bem conectado.")
        print("2. Certifique-se de que a porta COM4 é a correta (Olhe no Gerenciador de Dispositivos).")
        print("3. Feche qualquer outro programa usando a porta COM4 (Arduino IDE, outro terminal).")
    except KeyboardInterrupt:
        print("\n--- Teste finalizado pelo usuário ---")
    except Exception as e:
        print(f"\n[ERRO INESPERADO]: {e}")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()
            print("Porta fechada.")

if __name__ == "__main__":
    testar_conexao()
