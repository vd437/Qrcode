import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 px-4">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-6xl font-bold gradient-text">404</h1>
          <h2 className="text-2xl font-semibold">الصفحة غير موجودة</h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            عذراً، لا يمكن العثور على الصفحة التي تبحث عنها.
          </p>
        </div>
        
        <Link to="/">
          <Button className="btn-hero text-lg px-8 py-4">
            <Home className="ml-2 h-5 w-5" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
