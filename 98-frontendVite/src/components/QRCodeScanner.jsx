import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner = ({ onScanSuccess, onScanError }) => {
    const qrcodeRef = useRef(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        // Evita inicializar o scanner mais de uma vez
        if (!scannerRef.current) {
            // Verifica se o elemento de referência está disponível
            if (!qrcodeRef.current) return;
            
            scannerRef.current = new Html5QrcodeScanner(
                // ID do elemento HTML onde o scanner será renderizado
                qrcodeRef.current.id,
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            // A função onScanSuccess é o callback que lida com o QR Code lido
            const successCallback = (decodedText, decodedResult) => {
                // Para o scanner após a primeira leitura bem-sucedida
                scannerRef.current.clear(); 
                onScanSuccess(decodedText);
            };

            // Inicia o scanner
            scannerRef.current.render(successCallback, onScanError);
        }

        // Cleanup: Garante que a câmera seja desligada quando o componente for desmontado
        return () => {
            if (scannerRef.current) {
                // O método clear retorna uma Promise
                scannerRef.current.clear().catch(error => {
                    // console.error("Falha ao desligar o scanner de QR Code.", error);
                });
            }
        };
    }, [onScanSuccess, onScanError]);

    // O ID deve ser renderizado para o Html5QrcodeScanner encontrá-lo
    return <div id="qrcode-reader" ref={qrcodeRef} className="w-full h-auto" />;
};

export default QRCodeScanner;
