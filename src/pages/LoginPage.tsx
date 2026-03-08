import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { NeuralNetworkBg } from '@/components/NeuralNetworkBg';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pageTransition } from '@/lib/animations';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
const signupSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

const LoginPage = () => {
  const { isAuthenticated, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOpen, setResetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (isAuthenticated) navigate(params.get('redirect') || '/', { replace: true });
  }, [isAuthenticated, navigate, params]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm<z.infer<typeof signupSchema>>({ resolver: zodResolver(signupSchema) });

  const handleGoogleLogin = async () => {
    try { setLoading(true); await signInWithGoogle(); } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  const handleEmailLogin = async (data: z.infer<typeof loginSchema>) => {
    try { setLoading(true); await signInWithEmail(data.email, data.password); toast.success('Welcome back!'); } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  const handleSignup = async (data: z.infer<typeof signupSchema>) => {
    try { setLoading(true); await signUpWithEmail(data.email, data.password, data.fullName); toast.success('Account created! Check your email to verify.'); } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) { toast.error('Please enter your email'); return; }
    try { setLoading(true); await resetPassword(resetEmail); toast.success('Password reset link sent!'); setResetOpen(false); } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen pt-16 flex">
      {/* Left panel - desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden" style={{ background: '#020617' }}>
        <NeuralNetworkBg />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-transparent to-[#020617]/40 pointer-events-none z-[1]" />
        <div className="relative z-10 text-center space-y-6 p-8">
          <GraduationCap className="w-20 h-20 text-accent mx-auto" />
          <h2 className="text-4xl font-heading font-bold text-text-on-dark"><span className="text-accent">ETE</span> Family</h2>
          <p className="text-text-on-dark/70 font-body max-w-sm">Where Every Graduate Stays Connected Forever</p>
          <div className="flex gap-4 justify-center mt-8">
            {[{ n: '250+', l: 'Alumni' }, { n: '5+', l: 'Countries' }, { n: '30+', l: 'Companies' }].map((s, i) => (
              <div key={i} className="rounded-2xl px-6 py-4 text-center border border-accent/30 bg-accent/5 backdrop-blur-md">
                <p className="text-2xl font-heading font-black text-accent">{s.n}</p>
                <p className="text-xs text-text-on-dark/60 font-heading tracking-widest uppercase">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 lg:hidden mb-4">
              <GraduationCap className="w-8 h-8 text-accent" />
              <span className="font-heading font-bold text-xl text-primary"><span className="text-accent">ETE</span> Family</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Welcome Back!</h1>
            <p className="text-muted-foreground font-body text-sm">Sign in to connect with our alumni network</p>
          </div>

          <Button onClick={handleGoogleLogin} disabled={loading} variant="outline" className="w-full py-6 text-base font-heading">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground font-body">or continue with email</span></div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="font-heading">Login</TabsTrigger>
              <TabsTrigger value="signup" className="font-heading">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={loginForm.handleSubmit(handleEmailLogin)} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input {...loginForm.register('email')} placeholder="Email" className="pl-10" />
                  {loginForm.formState.errors.email && <p className="text-xs text-destructive mt-1">{loginForm.formState.errors.email.message}</p>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input {...loginForm.register('password')} type={showPassword ? 'text' : 'password'} placeholder="Password" className="pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {loginForm.formState.errors.password && <p className="text-xs text-destructive mt-1">{loginForm.formState.errors.password.message}</p>}
                </div>
                <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                  <DialogTrigger asChild>
                    <button type="button" className="text-xs text-accent hover:text-accent-hover font-heading">Forgot Password?</button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle className="font-heading">Reset Password</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <Input value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="Enter your email" />
                      <Button onClick={handleResetPassword} disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent-hover font-heading">Send Reset Link</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent-hover font-heading py-5">Sign In</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-4">
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input {...signupForm.register('fullName')} placeholder="Full Name" className="pl-10" />
                  {signupForm.formState.errors.fullName && <p className="text-xs text-destructive mt-1">{signupForm.formState.errors.fullName.message}</p>}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input {...signupForm.register('email')} placeholder="Email" className="pl-10" />
                  {signupForm.formState.errors.email && <p className="text-xs text-destructive mt-1">{signupForm.formState.errors.email.message}</p>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input {...signupForm.register('password')} type="password" placeholder="Password (min 6 chars)" className="pl-10" />
                  {signupForm.formState.errors.password && <p className="text-xs text-destructive mt-1">{signupForm.formState.errors.password.message}</p>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input {...signupForm.register('confirmPassword')} type="password" placeholder="Confirm Password" className="pl-10" />
                  {signupForm.formState.errors.confirmPassword && <p className="text-xs text-destructive mt-1">{signupForm.formState.errors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent-hover font-heading py-5">Create Account</Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-muted-foreground font-body">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
