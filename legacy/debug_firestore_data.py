import firebase_admin
from firebase_admin import credentials, firestore
import config
import datetime
import calculos
import os

# Setup mimicando app.py
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = config.CREDENCIAIS_FIREBASE
try:
    if not firebase_admin._apps:
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred, {'projectId': 'agromonitor-b8445',}) # ID do projeto pode variar, melhor usar o client direto como app.py
    db = firestore.Client()
except Exception as e:
    print(f"Erro init firestore: {e}")
    # Tenta fallback igual app.py
    db = firestore.Client()

def check_data():
    print("--- Buscando dados do Firestore (lite) ---")
    docs = db.collection('teste').stream()
    count = 0
    valid_count = 0
    
    # Pega ultimos 5
    all_data = []
    
    for doc in docs:
        count += 1
        data = doc.to_dict()
        doc_id = doc.id
        
        t = data.get('temperatura')
        u = data.get('umidade')
        
        if t is not None and u is not None:
            valid_count += 1
            vds = calculos.calcular_vds_numerico(t, u, "Míldio", "Videira", "Frutificação")
            all_data.append({
                "id": doc_id,
                "t": t,
                "u": u,
                "vds": vds,
                "type_t": type(t),
                "type_u": type(u)
            })
            
    print(f"Total Docs: {count}")
    print(f"Valid Docs (com temp/umid): {valid_count}")
    
    if all_data:
        print("\n--- Amostra dos últimos 5 dados ---")
        # Ordena por ID (data)
        all_data.sort(key=lambda x: x['id'])
        for d in all_data[-5:]:
            print(f"ID: {d['id']} | T: {d['t']} ({d['type_t']}) | U: {d['u']} ({d['type_u']}) | VDS: {d['vds']}")
    else:
        print("Nenhum dado válido encontrado para amostra.")

if __name__ == "__main__":
    check_data()
