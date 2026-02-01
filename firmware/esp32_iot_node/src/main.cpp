#include <Arduino.h>
#include <BluetoothSerial.h>
#include <WiFi.h>
#include <HTTPClient.h>

// --- CONFIGURAÇÃO ---
// SUBSTITUA COM SUAS CONFIGURAÇÕES DE DADOS WI-FI
const char* ssid = "VALQUIRIA_5G";
const char* password = "sergio-gio";

// Configure o IP do seu computador onde a API está rodando
// Ex: "http://192.168.1.10:8000/api/readings"
const char* serverUrl = "http://192.168.0.18:8000/api/readings";

// Nome do módulo Bluetooth do Arduino
String deviceName = "HC-05";

// --- OBJETOS ---
BluetoothSerial SerialBT;
bool connected = false;

// --- FUNÇÕES AUXILIARES ---

void connectToWiFi() {
  Serial.print("Conectando ao WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFalha ao conectar no WiFi.");
  }
}

bool connectToBluetooth() {
  Serial.print("Tentando conectar ao dispositivo Bluetooth: ");
  Serial.println(deviceName);

  // Conecta ao dispositivo pelo nome. 
  // Nota: O ESP32 precisa ter pareado anteriormente ou o dispositivo deve estar visível e aceitar conexões.
  // Em alguns casos, pode ser necessário usar o endereço MAC: SerialBT.connect(address)
  connected = SerialBT.connect(deviceName);

  if(connected) {
    Serial.println("Conectado ao Bluetooth com sucesso!");
  } else {
    // Se falhar, tenta reconectar após 5 segundos no loop principal
    Serial.println("Falha na conexão Bluetooth. Certifique-se que o HC-05 está ligado.");
  }
  return connected;
}

void sendDataToAPI(float temp, float hum) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Cria JSON manual para evitar dependência de ArduinoJson por enquanto (mas recomendado usar lib)
    String jsonPayload = "{\"temperatura\": " + String(temp) + ", \"umidade\": " + String(hum) + ", \"origem\": \"ESP32\"}";
    
    Serial.print("Enviando POST para API... Payload: ");
    Serial.println(jsonPayload);
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("Código HTTP: ");
      Serial.println(httpResponseCode);
      Serial.println("Resposta: " + response);
    } else {
      Serial.print("Erro no envio HTTP: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi desconectado. Não foi possível enviar dados.");
    connectToWiFi(); // Tenta reconectar
  }
}

// Analisa a string "Temp: 25.45 | Umid: 65.00"
void parseAndSend(String data) {
  Serial.println("Dados Recebidos: " + data);
  
  // Procura pelos marcadores
  int tempIndex = data.indexOf("Temp: ");
  int umidIndex = data.indexOf("| Umid: ");
  
  if (tempIndex != -1 && umidIndex != -1) {
    // Extrai substrings
    String tempStr = data.substring(tempIndex + 6, umidIndex);
    String umidStr = data.substring(umidIndex + 8);
    
    // Remove espaços em branco
    tempStr.trim();
    umidStr.trim();
    
    float temp = tempStr.toFloat();
    float hum = umidStr.toFloat();
    
    // Validação básica
    if (temp != 0.0 || hum != 0.0) {
      sendDataToAPI(temp, hum);
    }
  } else {
    Serial.println("Formato de dados desconhecido.");
  }
}

void setup() {
  Serial.begin(115200);
  
  // Inicializa Bluetooth como Master (Cliente)
  // O parametro 'true' indica Mestre
  SerialBT.begin("ESP32_Agro_Node", true); 
  SerialBT.setPin("1234", 4);
  Serial.println("ESP32 Bluetooth iniciado como Mestre");
  
  connectToWiFi();
  
  // A conexão Bluetooth inicial pode demorar um pouco
  if(connectToBluetooth()) {
    Serial.println("Pronto para receber dados!");
  }
}

void loop() {
  // 1. Manter Conexão Bluetooth
  if (!SerialBT.connected(0)) { // 0 é o ID padrão se conectado por nome
     Serial.println("Bluetooth desconectado. Tentando reconectar...");
     if(connectToBluetooth()) {
        delay(1000);
     } else {
        delay(5000); // Espera mais antes de tentar de novo
     }
  }

  // 2. Ler dados do Bluetooth
  if (SerialBT.available()) {
    String line = SerialBT.readStringUntil('\n');
    line.trim();
    if (line.length() > 0) {
      parseAndSend(line);
    }
  }
  
  // Pequeno delay para estabilidade
  delay(20);
}
