import sqlite3
import random
import time
import sys
import io

# Forçar saída UTF-8 para terminais Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from datetime import datetime, timedelta
import config
import calculos
import requests
import json
import database

def limpar_banco():
    print("🧹 Limpando dados antigos para a demo...")
    conn = database.get_connection()
    c = conn.cursor()
    # Limpa tabela sensores
    c.execute("DELETE FROM sensores")
    conn.commit()
    conn.close()
    print("✅ Banco limpo!")

def gerar_historico(dias=30):
    print(f"⏳ Gerando histórico 'Storytelling' para os últimos {dias} dias...")
    conn = database.get_connection()
    c = conn.cursor()
    
    # Limpa intervenções antigas também para garantir consistência
    c.execute("DELETE FROM intervencoes")
    
    agora = datetime.now()
    
    # DATA STORY:
    # Dias 1-10: Risco Baixo (Seco)
    # Dias 11-15: Chuva forte -> Risco Alto
    # Dia 13: Intervenção (Fungicida)
    # Dias 16-30: Risco caindo/Baixo
    
    dia_intervencao = agora - timedelta(days=10) # Intervenção foi há 10 dias
    
    for d in range(dias):
        dia_atual = agora - timedelta(days=(dias - d))
        timestamp_base = dia_atual
        
        # Determina o "Clima" do dia
        # Se estivermos entre 15 e 5 dias atrás -> PERIGO (Risco Alto)
        dias_atras = dias - d
        modo_perigo = (15 >= dias_atras >= 8) 
        
        for h in range(0, 24, 2):
            data_hora = dia_atual.replace(hour=h, minute=0, second=0)
            
            if modo_perigo:
                # Clima favorável a doença (Úmido e Temp Avariada)
                if 9 <= h <= 17:
                    temp = random.uniform(23, 26) # Ameno
                    umid = random.uniform(75, 90) # Úmido mesmo de dia
                else:
                    temp = random.uniform(20, 24) # Ideal pro fungo
                    umid = random.uniform(90, 99) # Molhado
            else:
                # Clima "Seguro" (Mais seco ou muito quente/frio)
                if 9 <= h <= 17:
                    temp = random.uniform(28, 33) # Quente e Seco
                    umid = random.uniform(40, 60)
                else:
                    temp = random.uniform(18, 22)
                    umid = random.uniform(60, 80) # Normal

            timestamp = data_hora.strftime('%Y-%m-%d %H:%M:%S')
            c.execute("INSERT INTO sensores (temperatura, umidade, data_hora, latitude, longitude, origem) VALUES (?, ?, ?, ?, ?, ?)",
                      (temp, umid, timestamp, -23.5505, -46.6333, "Simulacao"))

    # INSERIR INTERVENÇÃO
    # No meio do período de perigo
    ts_intervencao = dia_intervencao.replace(hour=10).strftime('%Y-%m-%d %H:%M:%S')
    c.execute("INSERT INTO intervencoes (tipo, produto, observacoes, data_hora) VALUES (?, ?, ?, ?)",
              ("FUNGICIDA", "Cobre Premium", "Aplicação preventiva devido a alta umidade.", ts_intervencao))
            
    conn.commit()
    conn.close()
    print("✅ Histórico com narrativa gerado: Crise -> Intervenção -> Controle")

def testar_alerta_telegram():
    print("\n🚀 Testando BOT do Telegram...")
    msg = "🚨 *SIMULAÇÃO DE ALERTA* 🚨\n\nIsso é um teste do sistema de demonstração. O monitoramento está ATIVO."
    url = f"https://api.telegram.org/bot{config.TELEGRAM_TOKEN}/sendMessage"
    data = {"chat_id": config.TELEGRAM_CHAT_ID, "text": msg, "parse_mode": "Markdown"}
    try:
        requests.post(url, data=data)
        print("✅ Mensagem enviada!")
    except Exception as e:
        print(f"❌ Falha no Telegram: {e}")

def simular_leitura_critica_soja():
    print("\n🔥 Simulando Leitura CRÍTICA para Soja (Ferrugem)...")
    
    # Condição perfeita para Ferrugem: 22°C + 95% Umidade
    temp = 22.5
    umid = 96.0
    
    # Salva no banco "Agora"
    conn = database.get_connection()
    c = conn.cursor()
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Calcula Risco Real usando o backend
    vds = calculos.calcular_vds_numerico(temp, umid, "Ferrugem Asiática", "Soja", "R1 (Início Floração)")
    
    c.execute("INSERT INTO sensores (temperatura, umidade, data_hora, latitude, longitude, origem) VALUES (?, ?, ?, ?, ?, ?)",
              (temp, umid, timestamp, -23.5505, -46.6333, "Simulacao"))
    conn.commit()
    conn.close()
    
    print(f"✅ Leitura Crítica Inserida: {temp}°C / {umid}%")

if __name__ == "__main__":
    print("=== INICIANDO DEMONSTRAÇÃO DO SISTEMA AGROINTELLIGENCE ===")
    
    # 1. Preparar Terreno
    limpar_banco()
    gerar_historico(dias=45) # 45 dias para dar Bastante GDD
    
    # 2. Testar Bot
    testar_alerta_telegram()
    
    # 3. Criar Pânico (Simulado)
    simular_leitura_critica_soja()
    
    print("\n========================================================")
    print("🎉 DEMONSTRAÇÃO CONCLUÍDA!")
    print("👉 Agora vá para a Dashboard e ATUALIZE a página.")
    print("1. Selecione a Planta: SOJA")
    print("2. Veja o Risco SEVERO/ALTO (Devido à leitura crítica)")
    print("3. Configure o Ciclo da Safra (Data Plantio = 45 dias atrás)")
    print("========================================================")
