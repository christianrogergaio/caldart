#include <DHT.h>
#include <SoftwareSerial.h>
#include <EEPROM.h>

// --- CONFIGURAÇÃO ---
#define DHTPIN 2     // Sensor de Dados (Pino 2)
#define GNDPIN 9     // Terra Virtual do Sensor (Pino 9)
#define DHTTYPE DHT22

// Intervalos (em milissegundos)
const long INTERVALO_LEITURA_LIVE = 2000;      // 2 segundos (Tempo Real)
const long INTERVALO_GRAVACAO_OFFLINE = 600000; // 10 minutos (Gravar na Memória)

// --- BLUETOOTH (SoftwareSerial) ---
// Arduino RX (Pino 10) -> Bluetooth TX
// Arduino TX (Pino 11) -> Bluetooth RX
SoftwareSerial bluetooth(10, 11); 

DHT dht(DHTPIN, DHTTYPE);

// Variáveis de Tempo
unsigned long ultimoTempoLive = 0;
unsigned long ultimoTempoGravacao = 0;

// Endereço da EEPROM (Memória)
// Cada leitura ocupa 3 bytes: 2 para Temp (int * 100), 1 para Umid (byte)
// Arduino Uno tem 1024 bytes. Max de ~340 leituras.
int enderecoAtual = 0;
const int MAX_ENDERECO = 1000; // Limite de segurança

void setup() {
  Serial.begin(9600);
  bluetooth.begin(9600);
  
  Serial.println("Inicializando AgroMonitor Offline...");
  bluetooth.println("AgroMonitor Iniciado (Modo Hibrido)");

  // Configura Terra Virtual
  pinMode(GNDPIN, OUTPUT);
  digitalWrite(GNDPIN, LOW); 
  
  delay(500); 
  dht.begin();
}

void loop() {
  unsigned long atual = millis();

  // 1. CHECAR COMANDOS BLUETOOTH (SYNC)
  if (bluetooth.available()) {
    String comando = bluetooth.readStringUntil('\n');
    comando.trim();
    if (comando == "SYNC") {
      sincronizarDadosGuardados();
    }
  }
  // Checar Comandos USB também (Debug)
  if (Serial.available()) {
    String comando = Serial.readStringUntil('\n');
    comando.trim();
    if (comando == "SYNC") {
      sincronizarDadosGuardados();
    }
    // Comando secreto para limpar memoria
    if (comando == "CLEAR") {
      limparMemoria();
    }
  }

  // 2. LEITURA EM TEMPO REAL (A cada 2s)
  if (atual - ultimoTempoLive >= INTERVALO_LEITURA_LIVE) {
    ultimoTempoLive = atual;
    lerEEnviar(); // Apenas envia, não grava
  }

  // 3. GRAVAÇÃO OFFLINE (A cada 10min)
  if (atual - ultimoTempoGravacao >= INTERVALO_GRAVACAO_OFFLINE) {
    ultimoTempoGravacao = atual;
    lerEGravar();
  }
}

void lerEEnviar() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Erro sensor!");
    return;
  }

  String msg = formatarMensagem(t, h);
  Serial.println(msg);
  bluetooth.println(msg);
}

void lerEGravar() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) return;

  if (enderecoAtual >= MAX_ENDERECO) {
    bluetooth.println("Memoria cheia! Sobrescrevendo inicio..."); // Debug
    enderecoAtual = 0; // Circular buffer (sobrescreve os mais antigos)
  }

  // Comprimir dados para salvar espaço
  int tempInt = (int)(t * 100); // Ex: 25.45 -> 2545
  byte umidByte = (byte)h;      // Ex: 65.00 -> 65 (Perde decimal, mas ok pra umidade)

  // Gravar (3 bytes total)
  EEPROM.put(enderecoAtual, tempInt);
  EEPROM.put(enderecoAtual + 2, umidByte);
  
  // Marcador de "Dado Valido" simples: Se temp não é -1 (0xFFFF)
  
  enderecoAtual += 3;
  
  // Feedback visual no terminal (Debug)
  Serial.print(" [REC] Gravado na memoria: ");
  Serial.print(enderecoAtual/3);
  Serial.println(" registros.");
}

void sincronizarDadosGuardados() {
  Serial.println("--- INICIANDO SYNC ---");
  bluetooth.println("--- SYNC START ---");
  
  int leituraTemp;
  byte leituraUmid;
  
  // Percorre toda a memória até o endereço atual
  // Nota: Se usarmos buffer circular, ideal seria ler tudo. 
  // Por simplificacao, vamos ler do 0 até onde o ponteiro está.
  // Se reiniciou o Arduino, o ponteiro zera. (Limitação: Dados persistem, mas ponteiro não sem salvar ponteiro na EEPROM).
  // FIX: Vamos ler TUDO que parece válido (Temp != 0 e != -1).
  // Melhor: Vamos ler do 0 até MAX_ENDERECO para garantir.
  
  for (int i = 0; i < MAX_ENDERECO; i += 3) {
    EEPROM.get(i, leituraTemp);
    EEPROM.get(i + 2, leituraUmid);
    
    // Filtro básico de lixo de memória
    if (leituraTemp != 0 && leituraTemp != -1 && leituraUmid > 0 && leituraUmid <= 100) {
       float tReal = leituraTemp / 100.0;
       String msg = formatarMensagem(tReal, (float)leituraUmid);
       
       bluetooth.println(msg); // O App vai receber isso como se fosse dado novo
       Serial.println("SYNC: " + msg);
       delay(50); // Delay pequeno para não engasgar o Bluetooth
    }
  }
  
  bluetooth.println("--- SYNC END ---");
  Serial.println("--- SYNC FINALIZADO ---");
}

void limparMemoria() {
  for (int i = 0 ; i < MAX_ENDERECO ; i++) {
    EEPROM.write(i, 0);
  }
  enderecoAtual = 0;
  Serial.println("Memoria Limpa!");
  bluetooth.println("Memoria Limpa!");
}

String formatarMensagem(float t, float h) {
  return "Temp: " + String(t) + " | Umid: " + String(h);
}
