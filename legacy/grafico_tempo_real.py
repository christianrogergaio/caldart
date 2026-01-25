import tkinter as tk
from tkinter import ttk
from google.cloud import firestore
import matplotlib.pyplot as plt
from datetime import datetime
import os
from relatorio_mildio import abrir_tabela_regras, gerar_relatorio_mildio

import config
import calculos

# Inicializa o Firestore
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = config.CREDENCIAIS_FIREBASE
db = firestore.Client()

def carregar_dados():
    docs = db.collection('teste').stream()
    dados = []
    doenca = doenca_var.get()
    planta = planta_var.get()
    estadio = estadio_var.get()

    for doc in docs:
        data = doc.to_dict()
        temperatura = data.get("temperatura", 0)
        umidade = data.get("umidade", 0)
        # USA MÓDULO CÁLCULO
        risco = calculos.calcular_nivel_risco_imediato(temperatura, umidade, doenca, planta, estadio)
        dados.append([doc.id, temperatura, umidade, risco])

    return sorted(dados, key=lambda x: x[0], reverse=True)

def mostrar_tabela():
    for item in tree.get_children():
        tree.delete(item)

    dados = carregar_dados()
    for item in dados:
        tree.insert("", "end", values=item)

    if dados:
        risco_atual = dados[0][3]
        datahora = dados[0][0]
        label_ultima_atualizacao.config(text=f"Última leitura: {datahora.replace('_', ' ')}")
        
        # ⬇️ NOVO: calcula VDS do dia atual
        hoje = datetime.now().strftime("%Y-%m-%d")
        vds_total = 0
        doenca = doenca_var.get()
        planta = planta_var.get()
        estadio = estadio_var.get()
        
        for item in dados:
            if item[0].startswith(hoje):
                temp = item[1]
                umid = item[2]
                # USA MODULO DE CALCULO
                vds = calculos.calcular_vds_numerico(temp, umid, doenca, planta, estadio)
                vds_total += vds

        # Define o nível usando MODULO DE CALCULO
        nivel, cor = calculos.classificar_risco_por_vds_acumulado(vds_total)

        label_risco.config(text=f"RISCO ATUAL: {risco_atual} | VDS: {vds_total} → {nivel}", fg=cor)
    else:
        label_ultima_atualizacao.config(text="Nenhuma leitura encontrada.")
        atualizar_status_risco("BAIXO")


def atualizar_status_risco(risco):
    cores = {
        "BAIXO": "green",
        "MODERADO": "orange",
        "ALTO": "red"
    }
    label_risco.config(text=f"RISCO: {risco}", fg=cores.get(risco, "black"))

def mostrar_grafico():
    dados = carregar_dados()
    if not dados:
        return

    timestamps = [datetime.strptime(item[0], "%Y-%m-%d_%H-%M-%S") for item in dados]
    temperaturas = [item[1] for item in dados]
    umidades = [item[2] for item in dados]

    plt.figure(figsize=(10, 4))
    plt.plot(timestamps, temperaturas, label="Temperatura (°C)", color="orange")
    plt.plot(timestamps, umidades, label="Umidade (%)", color="blue")
    plt.xlabel("Data/Hora")
    plt.ylabel("Valor")
    plt.title("Histórico Climático")
    plt.legend()
    plt.tight_layout()
    plt.show()

def abrir_seletor_relatorio():
    try:
        docs = db.collection('teste').stream()
        datas = set()
        for doc in docs:
            try:
                dt = datetime.strptime(doc.id, "%Y-%m-%d_%H-%M-%S")
                datas.add(dt.strftime("%Y-%m-%d"))
            except:
                continue
        datas_ordenadas = sorted(datas)

        if not datas_ordenadas:
            tk.messagebox.showinfo("Aviso", "Nenhuma data encontrada no banco de dados.")
            return

        popup = tk.Toplevel(janela)
        popup.title("Selecionar Data para Relatório")
        popup.geometry("300x200")

        tk.Label(popup, text="Data do relatório:").pack(pady=5)
        data_var = tk.StringVar(value=datas_ordenadas[-1])
        menu = tk.OptionMenu(popup, data_var, *datas_ordenadas)
        menu.pack()

        def confirmar():
            popup.destroy()
            gerar_relatorio_mildio(doenca_var.get(), planta_var.get(), estadio_var.get(), data_var.get())

        tk.Button(popup, text="Gerar Relatório", command=confirmar).pack(pady=15)
    except Exception as e:
        print("Erro ao abrir seletor de relatório:", e)

# Interface
janela = tk.Tk()
janela.title("Monitor de Risco de Doenças")
janela.geometry("820x620")

label_risco = tk.Label(janela, text="RISCO: --", font=("Arial", 24, "bold"))
label_risco.pack(pady=10)

label_ultima_atualizacao = tk.Label(janela, text="", font=("Arial", 10))
label_ultima_atualizacao.pack()

frame_doenca = tk.Frame(janela)
frame_doenca.pack(pady=5)
tk.Label(frame_doenca, text="Selecionar doença:").pack(side=tk.LEFT)
doenca_var = tk.StringVar(value=config.DOENCAS[0])
menu_doenca = tk.OptionMenu(frame_doenca, doenca_var, *config.DOENCAS)
menu_doenca.pack(side=tk.LEFT, padx=10)

frame_planta = tk.Frame(janela)
frame_planta.pack(pady=5)
tk.Label(frame_planta, text="Selecionar planta:").pack(side=tk.LEFT)
planta_var = tk.StringVar(value="Videira") # Padrão
menu_planta = tk.OptionMenu(frame_planta, planta_var, *config.PLANTAS)
menu_planta.pack(side=tk.LEFT, padx=10)

frame_estadio = tk.Frame(janela)
frame_estadio.pack(pady=5)
tk.Label(frame_estadio, text="Estádio Fenológico:").pack(side=tk.LEFT)
# Define valor padrão inicial
estadio_var = tk.StringVar(value=config.ESTADIOS_POR_PLANTA["Videira"][0])
menu_estadio = tk.OptionMenu(frame_estadio, estadio_var, *config.ESTADIOS_POR_PLANTA["Videira"])
menu_estadio.pack(side=tk.LEFT, padx=10)

def atualizar_opcoes_estadio(*args):
    planta_selecionada = planta_var.get()
    novos_estadios = config.ESTADIOS_POR_PLANTA.get(planta_selecionada, config.ESTADIOS_GENERICOS)
    
    # Atualiza o valor selecionado para o primeiro da nova lista
    estadio_var.set(novos_estadios[0])
    
    # Atualiza as opções do menu
    menu = menu_estadio["menu"]
    menu.delete(0, "end")
    for estadio in novos_estadios:
        menu.add_command(label=estadio, command=lambda v=estadio: estadio_var.set(v))

# Observa mudanças na variável planta_var
planta_var.trace("w", atualizar_opcoes_estadio)

colunas = ("Data/Hora", "Temperatura", "Umidade", "Risco")
tree = ttk.Treeview(janela, columns=colunas, show="headings")
for col in colunas:
    tree.heading(col, text=col)
    tree.column(col, anchor=tk.CENTER)
tree.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

frame_botoes = tk.Frame(janela)
frame_botoes.pack(pady=10)

tk.Button(frame_botoes, text="🔄 Atualizar Dados", command=mostrar_tabela).pack(side=tk.LEFT, padx=10)
tk.Button(frame_botoes, text="📈 Mostrar Gráfico", command=mostrar_grafico).pack(side=tk.LEFT, padx=10)
tk.Button(frame_botoes, text="📄 Gerar Relatório", command=abrir_seletor_relatorio).pack(side=tk.LEFT, padx=10)
btn_regras = tk.Button(frame_botoes, text="📋 Ver Regras de Risco", command=abrir_tabela_regras)
btn_regras.pack(side=tk.LEFT, padx=10)

mostrar_tabela()
janela.mainloop()
