import sqlite3
import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core import config

def clear_database():
    db_path = os.path.join(config.PASTA_DADOS, "dados_locais.db")
    
    if not os.path.exists(db_path):
        print(f"Banco de dados não encontrado em: {db_path}")
        return

    print(f"Limpando banco de dados: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        tables = ["sensores", "avaliacoes", "intervencoes"]
        
        for table in tables:
            try:
                cursor.execute(f"DELETE FROM {table}")
                print(f"Tabela '{table}' limpa com sucesso.")
            except sqlite3.OperationalError as e:
                print(f"Erro ao limpar tabela '{table}' (pode não existir): {e}")

        # Vacuum to reclaim space
        cursor.execute("VACUUM")
        print("Banco de dados otimizado (VACUUM).")
        
        conn.commit()
        conn.close()
        print("Limpeza concluída com sucesso.")
        
    except Exception as e:
        print(f"Erro crítico ao acessar o banco de dados: {e}")

if __name__ == "__main__":
    confirm = input("ATENCAO: Isso apagara TODOS os dados. Digite 'APAGAR' para confirmar: ")
    if confirm == "APAGAR":
        clear_database()
    else:
        print("Operacao cancelada.")
