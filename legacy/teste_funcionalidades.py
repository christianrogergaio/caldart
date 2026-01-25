import calculos
import config
from datetime import datetime, timedelta
import random
import sys
import io

# Force UTF-8 output for Windows terminals
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def titulo(texto):
    print(f"\n{'='*50}")
    print(f" {texto}")
    print(f"{'='*50}")

def teste_previsao_colheita_gdd():
    titulo("TESTE 1: PREVISÃO DE COLHEITA (GDD)")
    
    # Parâmetros de Simulação
    planta = "Videira"
    gdd_alvo = 1400  # Exemplo: Cabernet Sauvignon precisa de ~1400 GDD
    temp_base = 10   # Base para uva
    
    # Data fictícia de início da safra (ex: 1º de Setembro)
    data_inicio = datetime(2025, 9, 1)
    gdd_acumulado = 0
    dias_simulados = 0
    
    print(f"🌱 Cultura: {planta}")
    print(f"🎯 GDD Alvo para Colheita: {gdd_alvo}")
    print(f"📅 Data Início Ciclo: {data_inicio.strftime('%d/%m/%Y')}")
    print("-" * 30)
    
    # Simula dia a dia
    data_atual = data_inicio
    while gdd_acumulado < gdd_alvo:
        # Simula temperaturas de primavera/verão (variando entre 15 e 30 graus)
        t_max = random.uniform(22, 32)
        t_min = random.uniform(12, 18)
        
        gdd_dia = calculos.calcular_gdd(t_max, t_min, temp_base)
        gdd_acumulado += gdd_dia
        
        data_atual += timedelta(days=1)
        dias_simulados += 1
        
        if dias_simulados % 15 == 0: # Mostra status a cada 15 dias
            print(f"Dia {dias_simulados:03d} ({data_atual.strftime('%d/%m')}): GDD Acumulado = {gdd_acumulado:.1f} (Dia: {gdd_dia:.1f})")

    print("-" * 30)
    print(f"✅ GDD ALVO ATINGIDO!")
    print(f"📅 Data Estimada de Colheita: {data_atual.strftime('%d/%m/%Y')}")
    print(f"⏳ Duração do Ciclo: {dias_simulados} dias")

def teste_alertas_doencas():
    titulo("TESTE 2: DISPARO DE ALERTAS DE DOENÇAS")
    
    casos_teste = [
        # (Temp, Umid, Planta, Doença, Estádio, Esperado)
        (23.0, 90.0, "Videira", "Míldio", "Floração (EL 19-25)", "ALTO"), # Perigoso
        (25.0, 50.0, "Videira", "Míldio", "Floração (EL 19-25)", "BAIXO"), # Seco
        (20.0, 95.0, "Tomateiro", "Requeima", "Frutificação (Verde)", "ALTO"), # Frio e úmido
        (30.0, 40.0, "Tomateiro", "Requeima", "Frutificação (Verde)", "BAIXO"), # Muito quente e seco
    ]
    
    for temp, umid, planta, doenca, estadio, esperado in casos_teste:
        print(f"\n🔎 Testando: {planta} | {doenca} | {estadio}")
        print(f"   Condições: {temp}°C | {umid}%")
        
        # 1. Calcula VDS Numérico
        vds = calculos.calcular_vds_numerico(temp, umid, doenca, planta, estadio)
        
        # 2. Avalia Risco
        risco = calculos.calcular_nivel_risco_imediato(temp, umid, doenca, planta, estadio)
        
        print(f"   📊 Resultado: VDS={vds} | Risco={risco}")
        
        if risco == esperado or (esperado == "ALTO" and risco in ["ALTO", "MODERADO"]):
            print(f"   ✅ SUCESSO! Resultado conforme esperado ({esperado}).")
            if risco in ["ALTO", "MODERADO"]:
                print("   🚨 [SIMULAÇÃO] ALERTA ENVIADO PARA TELEGRAM/APP")
        else:
            print(f"   ❌ FALHA! Esperava {esperado}, obteve {risco}")

if __name__ == "__main__":
    teste_previsao_colheita_gdd()
    teste_alertas_doencas()
