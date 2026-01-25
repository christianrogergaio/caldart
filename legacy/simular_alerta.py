import requests
import config
import calculos
from datetime import datetime

def enviar_alerta_telegram(mensagem):
    url = f"https://api.telegram.org/bot{config.TELEGRAM_TOKEN}/sendMessage"
    data = {"chat_id": config.TELEGRAM_CHAT_ID, "text": mensagem, "parse_mode": "Markdown"}
    try:
        response = requests.post(url, data=data)
        if response.status_code == 200:
            print("[OK] Mensagem enviada para o Telegram!")
        else:
            print(f"[ERRO] Erro Telegram: {response.status_code}")
            print(f"Detalhes: {response.text}")
    except Exception as e:
        print(f"[ERRO] Erro de conexao Telegram: {e}")

def simular_alerta():
    # 1. Definir condições de ALTO RISCO (Hardcoded)
    # Exemplo: Míldio na Videira precisa de 18-25°C e >85% umidade
    temp_simulada = 22.5
    umid_simulada = 92.0
    planta = "Videira"
    doenca = "Míldio"
    estadio = "Floração (EL 19-25)" # Estádio muito suscetível (Fator 2.0)

    print(f"--- SIMULANDO CONDICÕES ---")
    print(f"Planta: {planta} | Doença: {doenca}")
    print(f"Temp: {temp_simulada}°C | Umid: {umid_simulada}% | Estádio: {estadio}")

    # 2. Calcular Risco usando a lógica do sistema
    vds = calculos.calcular_vds_numerico(temp_simulada, umid_simulada, doenca, planta, estadio)
    nivel_risco = calculos.calcular_nivel_risco_imediato(temp_simulada, umid_simulada, doenca, planta, estadio)

    print(f"VDS Calculado: {vds}")
    print(f"Nível de Risco: {nivel_risco}")

    # 3. Se for risco Alto, enviar alerta (como seria no sistema real)
    if nivel_risco in ["ALTO", "MODERADO"]: # Forçando envio
        agora = datetime.now().strftime("%d/%m/%Y %H:%M")
        
        msg = (
            f"🚨 *ALERTA DE DOENÇA DETECTADO* 🚨\n\n"
            f"📅 *Data:* {agora}\n"
            f"🌿 *Cultura:* {planta}\n"
            f"🦠 *Doença:* {doenca}\n"
            f"🌡 *Condições:* {temp_simulada}°C / {umid_simulada}%\n\n"
            f"⚠ *Nível de Risco:* {nivel_risco} (VDS: {vds})\n"
            f"🔎 *Recomendação:* Verificar vinhedo imediatamente."
        )
        
        print("\nEnviando mensagem para o Telegram...")
        enviar_alerta_telegram(msg)
    else:
        print("Risco baixo, nenhum alerta enviado (na simulação real).")

if __name__ == "__main__":
    simular_alerta()
