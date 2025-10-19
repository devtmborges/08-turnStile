import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner = ({ onScanSuccess, onScanError }) => {
    const qrcodeRef = useRef(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        // Garante que o scanner só seja inicializado uma vez
        if (!scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                // ID do elemento HTML onde o scanner será renderizado
                qrcodeRef.current.id,
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            const successCallback = (decodedText, decodedResult) => {
                // Para o scanner após a leitura bem-sucedida e passa o texto
                scannerRef.current.clear(); 
                onScanSuccess(decodedText);
            };

            scannerRef.current.render(successCallback, onScanError);
        }

        // Cleanup: Desliga a câmera ao sair da página
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Falha ao desligar o scanner de QR Code.", error);
                });
            }
        };
    }, [onScanSuccess, onScanError]);

    // O div com este ID é onde a câmera será exibida
    return <div id="qrcode-reader" ref={qrcodeRef} className="w-full h-auto" />;
};

export default QRCodeScanner;