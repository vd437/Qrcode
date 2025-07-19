import React, { createContext, useContext, useState, useEffect } from 'react';

export interface QRCode {
  id: string;
  name: string;
  content: string;
  type: 'url' | 'text' | 'email' | 'phone';
  style: string;
  createdAt: Date;
  downloadCount: number;
}

interface QRContextType {
  qrCodes: QRCode[];
  addQRCode: (qr: Omit<QRCode, 'id' | 'createdAt' | 'downloadCount'>) => void;
  deleteQRCode: (id: string) => void;
  incrementDownload: (id: string) => void;
  scannedQRs: { content: string; type: string; scannedAt: Date }[];
  addScannedQR: (content: string, type: string) => void;
}

const QRContext = createContext<QRContextType | undefined>(undefined);

export const useQR = () => {
  const context = useContext(QRContext);
  if (!context) {
    throw new Error('useQR must be used within a QRProvider');
  }
  return context;
};

interface QRProviderProps {
  children: React.ReactNode;
}

export const QRProvider: React.FC<QRProviderProps> = ({ children }) => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [scannedQRs, setScannedQRs] = useState<{ content: string; type: string; scannedAt: Date }[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedQRs = localStorage.getItem('qr-craft-codes');
    const savedScanned = localStorage.getItem('qr-craft-scanned');
    
    if (savedQRs) {
      try {
        const parsed = JSON.parse(savedQRs);
        setQRCodes(parsed.map((qr: any) => ({
          ...qr,
          createdAt: new Date(qr.createdAt)
        })));
      } catch (error) {
        console.error('Failed to parse saved QR codes:', error);
      }
    }
    
    if (savedScanned) {
      try {
        const parsed = JSON.parse(savedScanned);
        setScannedQRs(parsed.map((item: any) => ({
          ...item,
          scannedAt: new Date(item.scannedAt)
        })));
      } catch (error) {
        console.error('Failed to parse scanned QRs:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('qr-craft-codes', JSON.stringify(qrCodes));
  }, [qrCodes]);

  useEffect(() => {
    localStorage.setItem('qr-craft-scanned', JSON.stringify(scannedQRs));
  }, [scannedQRs]);

  const addQRCode = (qr: Omit<QRCode, 'id' | 'createdAt' | 'downloadCount'>) => {
    const newQR: QRCode = {
      ...qr,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      downloadCount: 0
    };
    setQRCodes(prev => [...prev, newQR]);
  };

  const deleteQRCode = (id: string) => {
    setQRCodes(prev => prev.filter(qr => qr.id !== id));
  };

  const incrementDownload = (id: string) => {
    setQRCodes(prev => prev.map(qr => 
      qr.id === id ? { ...qr, downloadCount: qr.downloadCount + 1 } : qr
    ));
  };

  const addScannedQR = (content: string, type: string) => {
    setScannedQRs(prev => [...prev, { content, type, scannedAt: new Date() }]);
  };

  return (
    <QRContext.Provider value={{
      qrCodes,
      addQRCode,
      deleteQRCode,
      incrementDownload,
      scannedQRs,
      addScannedQR
    }}>
      {children}
    </QRContext.Provider>
  );
};