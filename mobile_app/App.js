import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
// import RNBluetoothClassic from 'react-native-bluetooth-classic'; // Removed for web compatibility
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

export default function App() {
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [logs, setLogs] = useState([]);
    const [apiUrl, setApiUrl] = useState('http://192.168.0.100:8000/readings'); // Default IP, user must change
    const [isScanning, setIsScanning] = useState(false);
    const [dataBuffer, setDataBuffer] = useState('');

    // Conditionally load Bluetooth module
    let RNBluetoothClassic = null;
    if (Platform.OS !== 'web') {
        try {
            RNBluetoothClassic = require('react-native-bluetooth-classic').default;
        } catch (e) {
            console.warn("Bluetooth module not found (ignore if on web)");
        }
    }

    // Auto-scroll logs
    const scrollViewRef = useRef();

    const addLog = (msg) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 50));
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                // Dynamically require PermissionsAndroid to avoid web build errors
                const { PermissionsAndroid } = require('react-native');

                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                ]);

                const allGranted = Object.values(granted).every(
                    (status) => status === PermissionsAndroid.RESULTS.GRANTED
                );

                if (!allGranted) {
                    addLog("Permissions not granted. Cannot scan.");
                    return false;
                }
                return true;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    // --- Web Simulation Logic ---
    useEffect(() => {
        if (Platform.OS === 'web') {
            addLog("WEB MODE DETECTED: Bluetooth is not supported.");
            addLog("Use 'Simulate Connection' to test logic.");
        }
    }, []);

    const simulateConnection = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setConnectedDevice({ name: "Arduino Simulator", address: "00:00:00:00:00:00" });
            addLog("Connected to Simulator");

            // Start Mock Data Stream
            const interval = setInterval(() => {
                const temp = (20 + Math.random() * 10).toFixed(2);
                const hum = (50 + Math.random() * 20).toFixed(2);
                const mockLine = `Temp: ${temp} | Umid: ${hum}`;
                processLine(mockLine);
            }, 5000);

            // Save interval to clear later if needed (not implemented for simplicity)
        }, 1500);
    };
    // -----------------------------

    const scanDevices = async () => {
        if (Platform.OS === 'web') {
            simulateConnection();
            return;
        }

        const hasPerms = await requestPermissions();
        if (!hasPerms) return;

        setIsScanning(true);
        setDevices([]);
        try {
            addLog("Starting scan...");
            // For HC-05/06 (Classic), sometimes list() is better than startDiscovery() if already paired
            if (!RNBluetoothClassic) {
                addLog("Bluetooth module missing. Switching to simulation.");
                simulateConnection();
                return;
            }
            const unbounded = await RNBluetoothClassic.startDiscovery();
            const bonded = await RNBluetoothClassic.getBondedDevices();

            // Merge unique
            const allDevices = [...bonded];
            unbounded.forEach(d => {
                if (!allDevices.find(bd => bd.address === d.address)) {
                    allDevices.push(d);
                }
            });

            setDevices(allDevices);
            addLog(`Found ${allDevices.length} devices.`);
        } catch (err) {
            addLog(`Scan Error: ${err.message}`);
        } finally {
            setIsScanning(false);
        }
    };

    const connectToDevice = async (device) => {
        if (connectedDevice) {
            await disconnectDevice();
        }

        addLog(`Connecting to ${device.name || device.address}...`);
        try {
            const connection = await device.connect();
            if (connection) {
                setConnectedDevice(device);
                addLog(`Connected to ${device.name}`);

                // Start listening
                startReading(device);
            }
        } catch (err) {
            addLog(`Connection Failed: ${err.message}`);
        }
    };

    const disconnectDevice = async () => {
        if (connectedDevice) {
            try {
                await connectedDevice.disconnect();
                addLog("Disconnected.");
            } catch (err) {
                addLog(`Disconnect Error: ${err.message}`);
            }
            setConnectedDevice(null);
        }
    };

    const startReading = (device) => {
        // Note: React Native Bluetooth Classic uses event listeners often, but can also strictly read
        // We'll use onDataReceived event which is efficient
        const sub = device.onDataReceived((data) => {
            handleDataChunk(data.data);
        });

        // Store subscription to remove later if needed (not implemented deeply here for simplicity)
    };

    const handleDataChunk = (chunk) => {
        // Append to buffer
        let newBuffer = dataBuffer + chunk;

        // Check for delimiter (newline)
        if (newBuffer.includes('\n')) {
            const parts = newBuffer.split('\n');
            // The last part might be incomplete, keep it in buffer
            const remainder = parts.pop();
            setDataBuffer(remainder);

            // Process complete lines
            parts.forEach(line => {
                const cleanLine = line.trim();
                if (cleanLine.length > 0) {
                    processLine(cleanLine);
                }
            });
        } else {
            setDataBuffer(newBuffer);
        }
    };

    const processLine = async (line) => {
        // Expected format: "Temp: 25.00 | Umid: 65.00"
        // Or similar. Let's look for numbers.
        addLog(`RX: ${line}`);

        // Simple parsing logic derived from python script
        // replace chars
        const clean = line.replace(/C/g, "").replace(/%/g, "").replace(/\*/g, "").replace(/\|/g, ":");
        const parts = clean.split(":");

        // Looking for structure like ["Temp", " 25.00 ", " Umid", " 65.00"]
        // We can try regex for robustness
        // Temp... [number] ... Umid ... [number]

        const tempMatch = clean.match(/Temp.*?([\d\.]+)/);
        const umidMatch = clean.match(/Umid.*?([\d\.]+)/);

        if (tempMatch && umidMatch) {
            const temp = parseFloat(tempMatch[1]);
            const umid = parseFloat(umidMatch[1]);

            if (!isNaN(temp) && !isNaN(umid)) {
                await sendDataToApi(temp, umid);
            }
        }
    };

    const sendDataToApi = async (temp, umid) => {
        try {
            const payload = {
                temperatura: temp,
                umidade: umid,
                origem: "App Android",
                latitude: 0,
                longitude: 0
            };

            // Try to determine location if possible (skipping for brevity, can add expo-location later)

            const response = await axios.post(apiUrl, payload, { timeout: 3000 });
            if (response.status === 200) {
                addLog(`Synced: ${temp}°C / ${umid}%`);
            }
        } catch (err) {
            addLog(`API Error: ${err.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.header}>
                <Text style={styles.title}>AgroMonitor Mobile</Text>
            </View>

            <View style={styles.config}>
                <Text style={styles.label}>API URL (PC IP):</Text>
                <TextInput
                    style={styles.input}
                    value={apiUrl}
                    onChangeText={setApiUrl}
                    placeholder="http://192.168.x.x:8000/readings"
                />
            </View>

            <View style={styles.controls}>
                <Button
                    title={isScanning ? "Scanning..." : "Scan Bluetooth"}
                    onPress={scanDevices}
                    disabled={isScanning || !!connectedDevice}
                />
                {connectedDevice && (
                    <Button title="Disconnect" onPress={disconnectDevice} color="red" />
                )}
            </View>

            {connectedDevice ? (
                <View style={styles.status}>
                    <Text style={styles.statusText}>Connected to: {connectedDevice.name}</Text>
                </View>
            ) : (
                <Text style={styles.subtitle}>Available Devices:</Text>
            )}

            {!connectedDevice && (
                <FlatList
                    style={styles.deviceList}
                    data={devices}
                    keyExtractor={item => item.address}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.deviceItem}
                            onPress={() => connectToDevice(item)}
                        >
                            <Text style={styles.deviceName}>{item.name || "Unknown"}</Text>
                            <Text style={styles.deviceAddr}>{item.address}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            <Text style={styles.subtitle}>Logs:</Text>
            <ScrollView
                style={styles.logs}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                {logs.map((log, i) => (
                    <Text key={i} style={styles.logText}>{log}</Text>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    config: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: '#7f8c8d',
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 10,
    },
    deviceList: {
        maxHeight: 200,
    },
    deviceItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deviceAddr: {
        fontSize: 12,
        color: '#888',
    },
    status: {
        padding: 15,
        backgroundColor: '#d4edda',
        borderRadius: 8,
        borderColor: '#c3e6cb',
        borderWidth: 1,
    },
    statusText: {
        color: '#155724',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    logs: {
        flex: 1,
        backgroundColor: '#2d3436',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    logText: {
        color: '#00cec9',
        fontFamily: 'monospace',
        fontSize: 12,
        marginBottom: 2,
    },
});
