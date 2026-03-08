import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageTransition } from '@/lib/animations';

const NotFoundPage = () => (
  <motion.div {...pageTransition} className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <h1 className="text-8xl font-heading font-black text-gradient-gold">404</h1>
      <GraduationCap className="w-16 h-16 text-muted-foreground/40 mx-auto" />
      <h2 className="text-2xl font-heading font-bold text-foreground">Page Not Found</h2>
      <p className="text-muted-foreground font-body">The page you're looking for doesn't exist.</p>
      <div className="flex gap-3 justify-center">
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent-hover font-heading"><Link to="/">Go Home</Link></Button>
        <Button asChild variant="outline" className="font-heading"><Link to="/alumni">Browse Alumni</Link></Button>
      </div>
    </div>
  </motion.div>
);

export default NotFoundPage;
