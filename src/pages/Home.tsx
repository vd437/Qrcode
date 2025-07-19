import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Scan, BarChart3, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Home: React.FC = () => {
  const features = [
    {
      icon: QrCode,
      title: 'إنشاء رموز QR',
      description: 'أنشئ رموز QR مخصصة وجميلة لروابطك ونصوصك',
      color: 'text-emerald',
      bgColor: 'bg-emerald/10'
    },
    {
      icon: Scan,
      title: 'قراءة الرموز',
      description: 'امسح أي رمز QR واستخرج محتواه بسهولة',
      color: 'text-teal',
      bgColor: 'bg-teal/10'
    },
    {
      icon: BarChart3,
      title: 'إحصائيات متقدمة',
      description: 'تتبع استخدام رموزك وحصل على تحليلات مفصلة',
      color: 'text-sky',
      bgColor: 'bg-sky/10'
    }
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: 'تصاميم متنوعة',
      description: 'اختر من مجموعة واسعة من التصاميم الجميلة'
    },
    {
      icon: Zap,
      title: 'سرعة فائقة',
      description: 'إنشاء وقراءة الرموز في ثوانٍ معدودة'
    },
    {
      icon: Shield,
      title: 'آمان وخصوصية',
      description: 'بياناتك محفوظة ومحمية بأعلى المعايير'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto text-center text-white">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              صانع رموز
              <span className="block bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 mt-2 inline-block">
                QR العربي
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              أداة احترافية لإنشاء وقراءة رموز QR باللغة العربية مع تصاميم مذهلة وإحصائيات متقدمة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create">
                <Button size="lg" className="btn-hero text-lg px-8 py-4">
                  <QrCode className="ml-2 h-6 w-6" />
                  ابدأ الإنشاء
                </Button>
              </Link>
              <Link to="/scan">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4"
                >
                  <Scan className="ml-2 h-6 w-6" />
                  امسح رمز QR
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Floating QR Code Animation */}
          <div className="mt-16 relative">
            <div className="float-animation">
              <div className="mx-auto w-32 h-32 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-glow">
                <QrCode className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              ميزات متقدمة
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اكتشف مجموعة شاملة من الأدوات لإدارة رموز QR بأسلوب احترافي
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="p-8 text-center hover:shadow-strong transition-all duration-300 hover:-translate-y-2 border-border/50"
                >
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              لماذا تختار منصتنا؟
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-secondary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            جاهز للبدء؟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            انضم إلى آلاف المستخدمين وابدأ في إنشاء رموز QR احترافية
          </p>
          <Link to="/create">
            <Button size="lg" className="bg-white text-purple hover:bg-white/90 text-lg px-8 py-4">
              <QrCode className="ml-2 h-6 w-6" />
              ابدأ مجاناً
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;