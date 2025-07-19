import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, Search, Filter, QrCode, Link, FileText, Mail, Phone, Calendar } from 'lucide-react';
import QRCode from 'qrcode';
import { useQR } from '@/contexts/QRContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MyQRs: React.FC = () => {
  const { qrCodes, deleteQRCode, incrementDownload } = useQR();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filteredAndSortedQRs = React.useMemo(() => {
    let filtered = qrCodes.filter(qr => {
      const matchesSearch = qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          qr.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || qr.type === filterType;
      return matchesSearch && matchesType;
    });

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        break;
      case 'downloads':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
    }

    return filtered;
  }, [qrCodes, searchTerm, filterType, sortBy]);

  const generateQRForDownload = async (qr: any): Promise<string> => {
    const options = {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const,
    };

    // Apply style modifications
    if (qr.style === 'rounded') {
      options.color = {
        dark: '#059669',
        light: '#F0FDF4'
      };
    } else if (qr.style === 'dots') {
      options.color = {
        dark: '#0891B2',
        light: '#F0F9FF'
      };
    } else if (qr.style === 'elegant') {
      options.color = {
        dark: '#7C3AED',
        light: '#FAF5FF'
      };
    }

    const canvas = canvasRef.current;
    if (canvas) {
      await QRCode.toCanvas(canvas, qr.content, options);
      return canvas.toDataURL('image/png');
    }
    return '';
  };

  const handleDownload = async (qr: any) => {
    try {
      const dataURL = await generateQRForDownload(qr);
      if (dataURL) {
        const link = document.createElement('a');
        link.download = `${qr.name}.png`;
        link.href = dataURL;
        link.click();
        
        incrementDownload(qr.id);
        toast({
          title: "تم التحميل",
          description: `تم تحميل رمز "${qr.name}" بنجاح`,
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل الرمز",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (qr: any) => {
    deleteQRCode(qr.id);
    toast({
      title: "تم الحذف",
      description: `تم حذف رمز "${qr.name}" بنجاح`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'url': return Link;
      case 'text': return FileText;
      case 'email': return Mail;
      case 'phone': return Phone;
      default: return QrCode;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'url': return 'رابط';
      case 'text': return 'نص';
      case 'email': return 'بريد';
      case 'phone': return 'هاتف';
      default: return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'url': return 'bg-emerald/10 text-emerald border-emerald/20';
      case 'text': return 'bg-sky/10 text-sky border-sky/20';
      case 'email': return 'bg-purple/10 text-purple border-purple/20';
      case 'phone': return 'bg-orange/10 text-orange border-orange/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            رموز QR المحفوظة
          </h1>
          <p className="text-xl text-muted-foreground">
            إدارة وتنزيل رموز QR التي أنشأتها
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="البحث في الرموز..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="نوع المحتوى" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="url">روابط</SelectItem>
                <SelectItem value="text">نصوص</SelectItem>
                <SelectItem value="email">بريد إلكتروني</SelectItem>
                <SelectItem value="phone">هاتف</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">الأحدث</SelectItem>
                <SelectItem value="oldest">الأقدم</SelectItem>
                <SelectItem value="name">الاسم</SelectItem>
                <SelectItem value="downloads">التحميلات</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">{filteredAndSortedQRs.length}</span> من {qrCodes.length} رمز
              </p>
            </div>
          </div>
        </Card>

        {/* QR Codes Grid */}
        {filteredAndSortedQRs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedQRs.map((qr) => {
              const TypeIcon = getTypeIcon(qr.type);
              return (
                <Card key={qr.id} className="qr-card group">
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-5 w-5 text-emerald" />
                        <Badge className={getTypeBadgeColor(qr.type)}>
                          {getTypeLabel(qr.type)}
                        </Badge>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(qr)}
                          className="h-8 w-8 p-0 hover:bg-emerald/10"
                        >
                          <Download className="h-4 w-4 text-emerald" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive-foreground text-destructive border border-destructive/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                              <AlertDialogDescription>
                                هل أنت متأكد من حذف رمز QR "{qr.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(qr)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {/* QR Preview */}
                    <div className="bg-white p-4 rounded-lg border border-border/50 flex items-center justify-center">
                      <div className="w-24 h-24 bg-pattern-qr bg-center bg-no-repeat flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-foreground/80" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{qr.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 break-all">
                        {qr.content.length > 80 ? qr.content.substring(0, 80) + '...' : qr.content}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{qr.createdAt.toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{qr.downloadCount} تحميل</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownload(qr)}
                        className="flex-1 btn-hero"
                        size="sm"
                      >
                        <Download className="h-4 w-4 ml-1" />
                        تحميل
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center mx-auto">
                <QrCode className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-muted-foreground">
                {searchTerm || filterType !== 'all' ? 'لا توجد نتائج' : 'لا توجد رموز محفوظة'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm || filterType !== 'all' 
                  ? 'جرب تغيير كلمات البحث أو المرشحات'
                  : 'ابدأ بإنشاء رموز QR جديدة لتظهر هنا'
                }
              </p>
            </div>
          </Card>
        )}

        {/* Hidden canvas for QR generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default MyQRs;