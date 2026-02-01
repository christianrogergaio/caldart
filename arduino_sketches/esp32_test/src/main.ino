void setup() {
  // Inicializa a Serial com velocidade 115200 (padrao ESP32)
  Serial.begin(115200);
  
  // Configura o pino do LED interno (Geralmente pino 2 no ESP32)
  pinMode(2, OUTPUT);
}

void loop() {
  Serial.println("ESP32 Funcionando! Teste OK.");
  
  // Liga LED
  digitalWrite(2, HIGH);
  delay(1000); // Espera 1 segundo
  
  // Desliga LED
  digitalWrite(2, LOW);
  delay(1000); // Espera 1 segundo
}
