# AgroMonitor Mobile - Configuração

Este aplicativo serve para conectar via Bluetooth (Classic) ao Arduino/ESP32, ler os dados de temperatura/umidade e enviar para a API do sistema.

## ⚠️ Requisitos Prévios

Para rodar este projeto, você precisa instalar:

1.  **Node.js LTS**: Baixe e instale do site oficial https://nodejs.org/ (Versão LTS recomendada).
    - Após instalar, reinicie o computador.
2.  **Expo Go**: Instale este aplicativo no seu celular Android (via Play Store).

## 🚀 Como Rodar o Aplicativo

1.  Abra um terminal (PowerShell ou CMD) na pasta `mobile_app`:
    ```bash
    cd c:\Users\crg\Desktop\python-crg\sistema_monitoramento_doencas\mobile_app
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npx expo start --android
    ```
    *(Isso deve gerar um QR Code)*

4.  **No Celular**:
    - Abra o app **Expo Go**.
    - Escaneie o QR Code mostrado no terminal (ou se estiver conectado via USB, ele pode abrir direto).

## 🔧 Configuração no App

1.  Ao abrir o app, você verá "API URL".
2.  Você deve colocar o **IP do computador** onde o sistema web está rodando.
    - Para descobrir o IP do computador: Abra o terminal e digite `ipconfig`. Procure por "Endereço IPv4" (ex: `192.168.1.15`).
    - Coloque no app: `http://192.168.1.15:8000/readings` (Ajuste o IP conforme necessário).
3.  Clique em "Scan Bluetooth", conecte no **HC-05** ou **HC-06** (ou ESP32).
4.  Os dados devem começar a aparecer no Log e ser enviados para o sistema.

## ❗ Observação sobre Bluetooth

O `react-native-bluetooth-classic` pode exigir uma "Development Build" do Expo se nao funcionar diretamente no Expo Go padrão. Se você encontrar erros de "Native Module not found", será necessário configurar o ambiente de desenvolvimento Android completo (Android Studio), o que é mais complexo.

Se isso ocorrer, podemos tentar uma abordagem usando apenas BLE (Bluetooth Low Energy) que é mais compatível com o Expo Go padrão, mas isso exigiria que o Arduino use um módulo BLE (como o HM-10 ou o próprio ESP32 configurado como BLE).
