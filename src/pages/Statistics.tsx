import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, QrCode, Scan, Download, Calendar } from 'lucide-react';
import { useQR } from '@/contexts/QRContext';

const Statistics: React.FC = () => {
  const { qrCodes, scannedQRs } = useQR();

  const stats = useMemo(() => {
    const totalQRs = qrCodes.length;
    const totalDownloads = qrCodes.reduce((sum, qr) => sum + qr.downloadCount, 0);
    const totalScanned = scannedQRs.length;
    
    // Most used type
    const typeCount = qrCodes.reduce((acc, qr) => {
      acc[qr.type] = (acc[qr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostUsedType = Object.entries(typeCount).reduce((a, b) => 
      typeCount[a[0]] > typeCount[b[0]] ? a : b, ['text', 0]
    );

    // QRs created per month
    const monthlyData = qrCodes.reduce((acc, qr) => {
      const month = qr.createdAt.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Type distribution for pie chart
    const typeDistribution = Object.entries(typeCount).map(([type, count]) => ({
      name: getTypeLabel(type),
      value: count,
      color: getTypeColor(type)
    }));

    // Recent activity for line chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('ar-SA', { weekday: 'short' });
    }).reverse();

    const dailyActivity = last7Days.map(day => {
      const dayQRs = qrCodes.filter(qr => 
        qr.createdAt.toLocaleDateString('ar-SA', { weekday: 'short' }) === day
      ).length;
      const dayScans = scannedQRs.filter(scan => 
        scan.scannedAt.toLocaleDateString('ar-SA', { weekday: 'short' }) === day
      ).length;
      
      return {
        day,
        created: dayQRs,
        scanned: dayScans
      };
    });

    return {
      totalQRs,
      totalDownloads,
      totalScanned,
      mostUsedType: getTypeLabel(mostUsedType[0]),
      monthlyData: Object.entries(monthlyData).map(([month, count]) => ({ month, count })),
      typeDistribution,
      dailyActivity
    };
  }, [qrCodes, scannedQRs]);

  function getTypeLabel(type: string): string {
    switch (type) {
      case 'url': return 'روابط';
      case 'text': return 'نصوص';
      case 'email': return 'بريد إلكتروني';
      case 'phone': return 'هاتف';
      default: return type;
    }
  }

  function getTypeColor(type: string): string {
    switch (type) {
      case 'url': return '#059669'; // emerald
      case 'text': return '#0891B2'; // cyan
      case 'email': return '#7C3AED'; // violet
      case 'phone': return '#EA580C'; // orange
      default: return '#6B7280'; // gray
    }
  }

  const statCards = [
    {
      title: 'إجمالي الرموز المُنشأة',
      value: stats.totalQRs,
      icon: QrCode,
      color: 'text-emerald',
      bgColor: 'bg-emerald/10'
    },
    {
      title: 'إجمالي عمليات التحميل',
      value: stats.totalDownloads,
      icon: Download,
      color: 'text-teal',
      bgColor: 'bg-teal/10'
    },
    {
      title: 'إجمالي عمليات المسح',
      value: stats.totalScanned,
      icon: Scan,
      color: 'text-sky',
      bgColor: 'bg-sky/10'
    },
    {
      title: 'النوع الأكثر استخداماً',
      value: stats.mostUsedType,
      icon: TrendingUp,
      color: 'text-purple',
      bgColor: 'bg-purple/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            إحصائيات الاستخدام
          </h1>
          <p className="text-xl text-muted-foreground">
            تتبع نشاطك وتحليلات استخدام رموز QR
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-strong transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Type Distribution */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald" />
              توزيع أنواع الرموز
            </h3>
            {stats.typeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.typeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>لا توجد بيانات لعرضها</p>
                </div>
              </div>
            )}
          </Card>

          {/* Daily Activity */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal" />
              النشاط الأسبوعي
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `يوم ${label}`}
                  formatter={(value, name) => [value, name === 'created' ? 'تم إنشاؤها' : 'تم مسحها']}
                />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="#059669" 
                  strokeWidth={3}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="scanned" 
                  stroke="#0891B2" 
                  strokeWidth={3}
                  dot={{ fill: '#0891B2', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Monthly Statistics */}
        {stats.monthlyData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart className="h-5 w-5 text-sky" />
              الرموز المُنشأة شهرياً
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `شهر ${label}`}
                  formatter={(value) => [value, 'عدد الرموز']}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#colorGradient)" 
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0891B2" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Empty State */}
        {stats.totalQRs === 0 && (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center mx-auto">
                <BarChart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-muted-foreground">
                لا توجد إحصائيات بعد
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                ابدأ بإنشاء رموز QR أو مسح رموز موجودة لرؤية الإحصائيات هنا
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Statistics;