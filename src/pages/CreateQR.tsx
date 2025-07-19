import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Eye, Palette, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import { useQR } from '@/contexts/QRContext';
import { useToast } from '@/hooks/use-toast';

const CreateQR: React.FC = () => {
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'url' | 'text' | 'email' | 'phone'>('url');
  const [style, setStyle] = useState('default');
  const [qrDataURL, setQrDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addQRCode, incrementDownload, qrCodes } = useQR();
  const { toast } = useToast();

  const qrStyles = [
    { id: 'default', name: 'كلاسيكي', preview: '⬛' },
    { id: 'rounded', name: 'دائري', preview: '⚫' },
    { id: 'dots', name: 'نقاط', preview: '⬜' },
    { id: 'elegant', name: 'أنيق', preview: '◆' },
  ];

  const contentTypes = [
    { id: 'url', name: 'رابط (URL)', placeholder: 'https://example.com', icon: '🔗' },
    { id: 'text', name: 'نص', placeholder: 'أدخل النص هنا...', icon: '📝' },
    { id: 'email', name: 'بريد إلكتروني', placeholder: 'user@example.com', icon: '📧' },
    { id: 'phone', name: 'رقم هاتف', placeholder: '+966501234567', icon: '📞' },
  ];

  const generateQR = async () => {
    if (!content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال المحتوى أولاً",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم للرمز",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      let finalContent = content;
      
      // Format content based on type
      if (type === 'email' && !content.startsWith('mailto:')) {
        finalContent = `mailto:${content}`;
      } else if (type === 'phone' && !content.startsWith('tel:')) {
        finalContent = `tel:${content}`;
      }

      const options = {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M' as const,
      };

      // Apply style modifications
      if (style === 'rounded') {
        options.color = {
          dark: '#059669', // emerald-600
          light: '#F0FDF4' // emerald-50
        };
      } else if (style === 'dots') {
        options.color = {
          dark: '#0891B2', // cyan-600
          light: '#F0F9FF' // sky-50
        };
      } else if (style === 'elegant') {
        options.color = {
          dark: '#7C3AED', // violet-600
          light: '#FAF5FF' // violet-50
        };
      }

      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, finalContent, options);
        const dataURL = canvas.toDataURL('image/png');
        setQrDataURL(dataURL);

        // Save to context
        addQRCode({
          name,
          content: finalContent,
          type,
          style
        });

        toast({
          title: "تم إنشاء الرمز بنجاح!",
          description: `تم إنشاء رمز QR باسم "${name}"`,
        });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "خطأ في إنشاء الرمز",
        description: "حدث خطأ أثناء إنشاء رمز QR",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (qrDataURL) {
      const link = document.createElement('a');
      link.download = `${name || 'qr-code'}.png`;
      link.href = qrDataURL;
      link.click();
      
      // Find the QR code in context and increment download
      const qrCode = qrCodes.find(qr => qr.name === name);
      if (qrCode) {
        incrementDownload(qrCode.id);
      }
      
      toast({
        title: "تم تحميل الرمز",
        description: "تم تحميل رمز QR بنجاح",
      });
    }
  };

  const currentType = contentTypes.find(t => t.id === type);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            إنشاء رمز QR جديد
          </h1>
          <p className="text-xl text-muted-foreground">
            أنشئ رموز QR مخصصة وجميلة لاحتياجاتك
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Creation Form */}
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg font-semibold mb-2 block">
                  اسم الرمز
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: رابط موقعي الشخصي"
                  className="text-lg"
                />
              </div>

              <div>
                <Label className="text-lg font-semibold mb-2 block">
                  نوع المحتوى
                </Label>
                <Select value={type} onValueChange={(value: any) => setType(value)}>
                  <SelectTrigger className="text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((contentType) => (
                      <SelectItem key={contentType.id} value={contentType.id}>
                        <span className="flex items-center gap-2">
                          <span>{contentType.icon}</span>
                          <span>{contentType.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content" className="text-lg font-semibold mb-2 block">
                  المحتوى
                </Label>
                {type === 'text' ? (
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={currentType?.placeholder}
                    className="text-lg min-h-[100px]"
                  />
                ) : (
                  <Input
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={currentType?.placeholder}
                    className="text-lg"
                  />
                )}
              </div>

              <div>
                <Label className="text-lg font-semibold mb-3 block flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  تصميم الرمز
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {qrStyles.map((qrStyle) => (
                    <button
                      key={qrStyle.id}
                      onClick={() => setStyle(qrStyle.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        style === qrStyle.id
                          ? 'border-emerald bg-emerald/10'
                          : 'border-border hover:border-emerald/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{qrStyle.preview}</div>
                      <div className="text-sm font-medium">{qrStyle.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={generateQR}
                disabled={isGenerating}
                className="w-full btn-hero text-lg py-6"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Sparkles className="ml-2 h-5 w-5" />
                    إنشاء رمز QR
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-8 flex flex-col items-center justify-center min-h-[600px]">
            {qrDataURL ? (
              <div className="text-center space-y-6">
                <div className="qr-card p-6">
                  <img
                    src={qrDataURL}
                    alt="Generated QR Code"
                    className="mx-auto rounded-lg shadow-soft max-w-[250px]"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">{name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {type === 'url' && '🔗 '}
                    {type === 'text' && '📝 '}
                    {type === 'email' && '📧 '}
                    {type === 'phone' && '📞 '}
                    {content.length > 50 ? content.substring(0, 50) + '...' : content}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={downloadQR} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    تحميل
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    معاينة
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mb-6">
                  <Sparkles className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground">
                  معاينة رمز QR
                </h3>
                <p className="text-muted-foreground">
                  املأ النموذج واضغط إنشاء لرؤية رمزك
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Hidden canvas for QR generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default CreateQR;