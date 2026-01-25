import database
import sys
import io

# Fix encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def limpar_simulacao():
    print("🧹 Removendo dados de Simulação...")
    conn = database.get_connection()
    c = conn.cursor()
    
    # Remove apenas o que foi gerado pelo script de demonstração
    c.execute("DELETE FROM sensores WHERE origem = 'Simulacao'")
    rows = c.rowcount
    
    conn.commit()
    conn.close()
    
    print(f"✅ {rows} registros simulados removidos!")
    print("👉 Agora o sistema mostrará APENAS dados reais (origem='Bluetooth' ou 'Arduino').")

if __name__ == "__main__":
    limpar_simulacao()
