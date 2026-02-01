.# Sistema de Monitoramento de Doenças

## Instalação

1.  Crie um ambiente virtual (opcional mas recomendado):
    ```bash
    python -m venv venv
    .\venv\Scripts\activate  # Windows
    ```

2.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```

## Execução

Certifique-se de estar na pasta raiz do projeto (`sistema_monitoramento_doencas`).

### 1. Iniciar a API (Backend)
Este serviço roda o servidor web e o dashboard.

```bash
python services/api/main.py
```
Acesse: [http://localhost:8000](http://localhost:8000)

### 2. Iniciar o Ingestor (Leitura de Sensores)
Este serviço lê dados do Arduino/Serial e envia para a API.

```bash
python services/ingestor/main.py
```

## Estrutura
- **config/**: Arquivos de configuração e credenciais.
- **core/**: Lógica compartilhada e constantes.
- **dados/**: Banco de dados SQLite e arquivos CSV.
- **services/**: Microsserviços (API e Ingestor).
- **scripts/**: Scripts utilitários.
