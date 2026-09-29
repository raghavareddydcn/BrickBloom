import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center section-pad">
      <div className="text-center max-w-md mx-auto">
        <span className="eyebrow">404 Error</span>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl text-slate-900">
          Page Not Found
        </h1>
        <p className="mt-4 text-base text-slate-500 leading-relaxed">
          The page or product format you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/#products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Products
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
