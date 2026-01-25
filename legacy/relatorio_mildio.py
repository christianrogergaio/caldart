import tkinter as tk
from tkinter import ttk
from google.cloud import firestore
from datetime import datetime
from collections import defaultdict
import os

import config
import calculos

# Configura Firestore
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = config.CREDENCIAIS_FIREBASE
db = firestore.Client()

def gerar_relatorio_mildio(doenca, planta, estadio, data_escolhida):
    docs = db.collection('teste').stream()
    dados_por_hora = defaultdict(list)

    for doc in docs:
        data = doc.to_dict()
        temp = data.get('temperatura')
        umid = data.get('umidade')
        timestamp = doc.id

        try:
            dt = datetime.strptime(timestamp, "%Y-%m-%d_%H-%M-%S")
            if dt.strftime("%Y-%m-%d") != data_escolhida:
                continue
            chave = dt.strftime("%Y-%m-%d %H:00")
            dados_por_hora[chave].append((temp, umid))
        except:
            continue

    resultados = []
    vds_total = 0

    for hora, valores in sorted(dados_por_hora.items()):
        temps = [t for t, _ in valores if t is not None]
        umids = [u for _, u in valores if u is not None]
        if not temps or not umids:
            continue

        temp_media = sum(temps) / len(temps)
        umid_media = sum(umids) / len(umids)
        # USA MÓDULO DE CÁLCULO
        vds = calculos.calcular_vds_numerico(temp_media, umid_media, doenca, planta, estadio)
        vds_total += vds

        resultados.append({
            "hora": hora,
            "temp": round(temp_media, 2),
            "umid": round(umid_media, 2),
            "vds": vds
        })

    # Interface do relatório
    relatorio = tk.Toplevel()
    relatorio.title(f"Relatório: {doenca.capitalize()} em {planta.capitalize()} ({data_escolhida})")
    relatorio.geometry("820x600")

    tk.Label(relatorio, text=f"Estádio Fenológico: {estadio}", font=("Arial", 12)).pack(pady=5)
    tk.Label(relatorio, text=f"VDS Total: {vds_total}", font=("Arial", 16, "bold")).pack(pady=5)

    # USA MÓDULO DE CÁLCULO PARA CLASSIFICAR RISCO
    nivel, cor = calculos.classificar_risco_por_vds_acumulado(vds_total)

    tk.Label(relatorio, text=f"Nível: {nivel}", fg=cor, font=("Arial", 14, "bold")).pack(pady=5)

    colunas = ("Hora", "Temp. Média (°C)", "Umid. Média (%)", "VDS Parcial")
    tree = ttk.Treeview(relatorio, columns=colunas, show="headings")
    for col in colunas:
        tree.heading(col, text=col)
        tree.column(col, anchor=tk.CENTER)
    tree.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)

    for r in resultados:
        tree.insert("", "end", values=(r["hora"], r["temp"], r["umid"], r["vds"]))

    # Gráfico
    try:
        import matplotlib.pyplot as plt

        horas = [r["hora"][-5:] for r in resultados]
        vds_vals = [r["vds"] for r in resultados]
        temps = [r["temp"] for r in resultados]
        umids = [r["umid"] for r in resultados]

        fig, ax1 = plt.subplots(figsize=(10, 4))
        ax1.set_xlabel("Hora")
        ax1.set_ylabel("Temperatura (°C)", color="red")
        ax1.plot(horas, temps, label="Temperatura", color="red", marker="o")
        ax1.tick_params(axis="y", labelcolor="red")

        ax2 = ax1.twinx()
        ax2.set_ylabel("Umidade (%) / VDS", color="blue")
        ax2.plot(horas, umids, label="Umidade", color="blue", marker="s")
        ax2.plot(horas, vds_vals, label="VDS", color="purple", marker="D", linestyle="--")
        ax2.tick_params(axis="y", labelcolor="blue")
        ax2.set_ylim(0, 100)

        plt.title(f"Condições e VDS: {doenca.capitalize()} em {planta.capitalize()}")
        fig.tight_layout()
        fig.legend(loc="upper right", bbox_to_anchor=(1, 1), bbox_transform=ax1.transAxes)
        plt.xticks(rotation=45)
        plt.grid(True)
        plt.show()
    except Exception as e:
        print("Erro ao gerar gráfico:", e)
    
    relatorio.mainloop()

def abrir_tabela_regras():
    janela_regras = tk.Toplevel()
    janela_regras.title("Tabela de Regras de Risco (VDS)")
    janela_regras.geometry("700x500")

    tk.Label(janela_regras, text="Critérios de VDS por Doença e Cultura", font=("Arial", 14, "bold")).pack(pady=10)

    notebook = ttk.Notebook(janela_regras)
    notebook.pack(fill=tk.BOTH, expand=True)

    # USA REGRAS DO CONFIG/CALCULOS
    for categoria, linhas in calculos.REGRAS_DESCRITIVAS.items():
        frame = tk.Frame(notebook)
        notebook.add(frame, text=categoria)

        colunas = ("Temperatura", "Umidade", "VDS", "Comentário")
        tree = ttk.Treeview(frame, columns=colunas, show="headings")
        for col in colunas:
            tree.heading(col, text=col)
            tree.column(col, anchor=tk.CENTER)
        tree.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        for linha in linhas:
            tree.insert("", "end", values=linha)
