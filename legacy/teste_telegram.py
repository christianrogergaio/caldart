import requests
import config

def testar_telegram():
    print(f"Testando com Token: {config.TELEGRAM_TOKEN[:10]}...")
    print(f"Chat ID: {config.TELEGRAM_CHAT_ID}")

    msg = "🚨 *TESTE DE ALERTA AGROMONITOR* 🚨\n\nSe você recebeu isso, o bot está configurado corretamente! ✅"
    
    url = f"https://api.telegram.org/bot{config.TELEGRAM_TOKEN}/sendMessage"
    data = {"chat_id": config.TELEGRAM_CHAT_ID, "text": msg, "parse_mode": "Markdown"}
    
    try:
        response = requests.post(url, data=data)
        if response.status_code == 200:
            print("✅ Mensagem enviada com sucesso!")
        else:
            print(f"❌ Erro ao enviar: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Erro de conexão: {e}")

if __name__ == "__main__":
    testar_telegram()
