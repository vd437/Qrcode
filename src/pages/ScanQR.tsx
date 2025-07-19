import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Link, FileText, Mail, Phone, Copy, ExternalLink } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { useQR } from '@/contexts/QRContext';
import { useToast } from '@/hooks/use-toast';

interface ScannedResult {
  content: string;
  type: string;
  timestamp: Date;
}

const ScanQR: React.FC = () => {
  const [scannedResult, setScannedResult] = useState<ScannedResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addScannedQR } = useQR();
  const { toast } = useToast();

  const detectContentType = (content: string): string => {
    if (content.startsWith('http://') || content.startsWith('https://')) {
      return 'url';
    } else if (content.startsWith('mailto:')) {
      return 'email';
    } else if (content.startsWith('tel:')) {
      return 'phone';
    } else {
      return 'text';
    }
  };

  const formatDisplayContent = (content: string, type: string): string => {
    if (type === 'email' && content.startsWith('mailto:')) {
      return content.substring(7);
    } else if (type === 'phone' && content.startsWith('tel:')) {
      return content.substring(4);
    }
    return content;
  };

  const scanFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "نوع ملف غير صحيح",
        description: "يرجى اختيار ملف صورة",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    try {
      const result = await QrScanner.scanImage(file);
      const type = detectContentType(result);
      
      const scannedData: ScannedResult = {
        content: result,
        type,
        timestamp: new Date()
      };
      
      setScannedResult(scannedData);
      addScannedQR(result, type);
      
      toast({
        title: "تم قراءة الرمز بنجاح!",
        description: "تم استخراج البيانات من رمز QR",
      });
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast({
        title: "فشل في قراءة الرمز",
        description: "لم يتم العثور على رمز QR صالح في الصورة",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  }, [addScannedQR, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      scanFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      scanFile(file);
    }
  };

  const copyToClipboard = () => {
    if (scannedResult) {
      const displayContent = formatDisplayContent(scannedResult.content, scannedResult.type);
      navigator.clipboard.writeText(displayContent);
      toast({
        title: "تم النسخ",
        description: "تم نسخ المحتوى إلى الحافظة",
      });
    }
  };

  const openLink = () => {
    if (scannedResult && scannedResult.type === 'url') {
      window.open(scannedResult.content, '_blank');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'url': return Link;
      case 'email': return Mail;
      case 'phone': return Phone;
      default: return FileText;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'url': return 'رابط';
      case 'email': return 'بريد إلكتروني';
      case 'phone': return 'رقم هاتف';
      default: return 'نص';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            قراءة رمز QR
          </h1>
          <p className="text-xl text-muted-foreground">
            ارفع صورة رمز QR لاستخراج محتواه
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="p-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Upload className="h-6 w-6 text-emerald" />
                رفع الصورة
              </h2>

              {/* Drag & Drop Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-emerald bg-emerald/5'
                    : 'border-border hover:border-emerald/50'
                }`}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-emerald/10 rounded-xl flex items-center justify-center mx-auto">
                    <Camera className="h-8 w-8 text-emerald" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2">
                      اسحب وأفلت صورة رمز QR هنا
                    </p>
                    <p className="text-muted-foreground">
                      أو اضغط لاختيار ملف من جهازك
                    </p>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                    className="btn-hero"
                  >
                    {isScanning ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                        جاري القراءة...
                      </>
                    ) : (
                      <>
                        <Upload className="ml-2 h-5 w-5" />
                        اختيار صورة
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="text-center text-sm text-muted-foreground">
                <p>الأنواع المدعومة: JPG, PNG, GIF, WebP</p>
              </div>
            </div>
          </Card>

          {/* Results Section */}
          <Card className="p-8">
            {scannedResult ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-emerald">
                  تم قراءة الرمز بنجاح!
                </h2>

                <div className="bg-gradient-to-br from-emerald/5 to-teal/5 border border-emerald/20 rounded-xl p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-emerald/20">
                    {React.createElement(getIcon(scannedResult.type), {
                      className: "h-8 w-8 text-emerald"
                    })}
                    <div>
                      <span className="text-xl font-bold text-emerald">
                        {getTypeLabel(scannedResult.type)}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        تم القراءة في: {scannedResult.timestamp.toLocaleDateString('ar-EG')} - {scannedResult.timestamp.toLocaleTimeString('ar-EG')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-soft">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground">المحتوى المستخرج:</label>
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                        <p className="text-lg font-medium break-all leading-relaxed text-foreground">
                          {formatDisplayContent(scannedResult.content, scannedResult.type)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button onClick={copyToClipboard} className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    نسخ
                  </Button>
                  
                  {scannedResult.type === 'url' && (
                    <Button onClick={openLink} variant="outline" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      فتح الرابط
                    </Button>
                  )}
                  
                  {scannedResult.type === 'email' && (
                    <Button 
                      onClick={() => window.location.href = scannedResult.content}
                      variant="outline" 
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      إرسال بريد
                    </Button>
                  )}
                  
                  {scannedResult.type === 'phone' && (
                    <Button 
                      onClick={() => window.location.href = scannedResult.content}
                      variant="outline" 
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      اتصال
                    </Button>
                  )}

                  <Button 
                    onClick={() => setScannedResult(null)}
                    variant="ghost"
                  >
                    مسح وإعادة المحاولة
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-12">
                <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center mx-auto">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground">
                  في انتظار رفع الصورة
                </h3>
                <p className="text-muted-foreground">
                  اختر صورة تحتوي على رمز QR لبدء القراءة
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;