import requests
import config

def get_updates():
    url = f"https://api.telegram.org/bot{config.TELEGRAM_TOKEN}/getUpdates"
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print("Response:", response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_updates()
