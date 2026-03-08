import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Upload, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { pageTransition, fadeInUp } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const steps = ['Personal', 'Academic', 'Professional', 'Review'];

const departments = [
  'Electronics & Telecommunication Engineering (ETE)',
  'Computer Science & Engineering (CSE)',
  'Electrical & Electronic Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Industrial & Production Engineering (IPE)',
  'Chemical Engineering (ChE)',
  'Textile Engineering',
  'Architecture',
  'Urban & Regional Planning',
  'Business Administration',
  'Pharmacy',
  'Other',
];

const degrees = ["Bachelor's", "Master's", 'PhD', 'Diploma', 'Postdoc'];
const industries = ['IT/Software', 'Telecom', 'Banking/Finance', 'Healthcare', 'Education', 'Engineering/Manufacturing', 'Government', 'Startup', 'NGO/Development', 'Research/Academia', 'Defense', 'Real Estate', 'Energy', 'Media', 'Other'];
const salaryRanges = ['Prefer not to say', 'Below $30k', '$30k-$60k', '$60k-$100k', '$100k-$150k', '$150k-$200k', '$200k+'];
const employmentStatuses = [
  { value: 'Employed', icon: '💼' },
  { value: 'Entrepreneur / Self-Employed', icon: '🚀' },
  { value: 'Freelancer', icon: '💻' },
  { value: 'Government Job', icon: '🏛️' },
  { value: 'Further Studies', icon: '📚' },
  { value: 'Looking for Opportunities', icon: '🔍' },
  { value: 'Retired', icon: '🏖️' },
];

const countries = ['Bangladesh', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'Singapore', 'India', 'Japan', 'UAE', 'Malaysia', 'South Korea', 'Saudi Arabia', 'Qatar', 'Other'];

const RegisterPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [existingRecord, setExistingRecord] = useState<any>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', date_of_birth: '', photo_url: '',
    gender: '', city: '', country: '', linkedin_url: '', website_url: '',
    department: 'Electronics & Telecommunication Engineering (ETE)',
    degree: '', graduation_year: '', student_id: '', hall_of_residence: '', university_memory: '',
    employment_status: '', job_title: '', company: '', industry: '',
    years_of_experience: 0, previous_companies: '', skills: '' as string,
    salary_range: '', willing_to_mentor: false, bio: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [agreeAccuracy, setAgreeAccuracy] = useState(false);
  const [agreeVisibility, setAgreeVisibility] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setForm(f => ({
      ...f,
      full_name: profile?.full_name || '',
      email: user.email || '',
    }));
    supabase.from('alumni').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => {
        setExistingRecord(data);
        setCheckingExisting(false);
      });
  }, [user, profile]);

  const updateForm = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Max file size is 5MB'); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { toast.error('Only JPG, PNG, WEBP allowed'); return; }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user!.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('alumni-photos').upload(path, file);
    if (error) { toast.error('Upload failed'); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('alumni-photos').getPublicUrl(path);
    updateForm('photo_url', publicUrl);
    setUploading(false);
    toast.success('Photo uploaded!');
  };

  const addSkill = (value: string) => {
    const skill = value.trim();
    if (skill && !skillTags.includes(skill) && skillTags.length < 15) {
      setSkillTags([...skillTags, skill]);
    }
    setSkillInput('');
  };

  const handleSubmit = async () => {
    if (!agreeAccuracy || !agreeVisibility) { toast.error('Please agree to both checkboxes'); return; }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('alumni').insert({
        ...form,
        user_id: user!.id,
        skills: skillTags.join(', '),
        graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
        date_of_birth: form.date_of_birth || null,
        is_approved: false,
      });
      if (error) throw error;
      setShowConfetti(true);
      setTimeout(() => { setShowConfetti(false); setShowSuccess(true); }, 3000);
    } catch (e: any) {
      toast.error(e.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingExisting) return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-muted-foreground">Checking...</p></div>;

  if (existingRecord) {
    const isPending = !existingRecord.is_approved && !existingRecord.is_rejected;
    const isApproved = existingRecord.is_approved;
    return (
      <motion.div {...pageTransition} className="min-h-screen pt-24 bg-background">
        <div className="container mx-auto px-4 max-w-lg text-center space-y-4">
          <div className="text-5xl">{isPending ? '⏳' : isApproved ? '🎉' : '❌'}</div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            {isPending ? 'Registration Under Review' : isApproved ? 'Profile is Live!' : 'Registration Not Approved'}
          </h1>
          <p className="text-muted-foreground font-body">
            {isPending ? "Your registration is under review. We'll notify you once approved!" :
             isApproved ? 'Your profile is live on the alumni directory!' :
             'Your registration was not approved. Please contact admin.'}
          </p>
          {isApproved && <Link to={`/alumni/${existingRecord.id}`}><Button className="bg-accent text-accent-foreground hover:bg-accent-hover font-heading">View My Profile</Button></Link>}
          <Link to="/"><Button variant="outline" className="font-heading">Go to Homepage</Button></Link>
        </div>
      </motion.div>
    );
  }

  if (showSuccess) {
    return (
      <motion.div {...pageTransition} className="min-h-screen pt-24 bg-background">
        <div className="container mx-auto px-4 max-w-lg text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Welcome to the ETE Family!</h1>
          <p className="text-muted-foreground font-body">Your registration has been submitted successfully. Our admin team will review your profile shortly.</p>
          <Link to="/"><Button className="bg-accent text-accent-foreground hover:bg-accent-hover font-heading">Go to Homepage</Button></Link>
        </div>
      </motion.div>
    );
  }

  const years = Array.from({ length: 46 }, (_, i) => (2025 - i).toString());

  return (
    <motion.div {...pageTransition} className="min-h-screen pt-20 pb-16 bg-background">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="absolute w-3 h-3 rounded-sm" style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#FFD700', '#1e3a8a', '#10b981', '#ef4444', '#f59e0b'][i % 5],
              animation: `confetti-fall ${2 + Math.random() * 2}s linear forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
            }} />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-heading font-bold text-foreground text-center mb-2">Alumni Registration</h1>
        <p className="text-muted-foreground font-body text-center mb-8">Fill in your details to join the ETE Family network</p>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-heading font-bold transition-all
                  ${i < step ? 'bg-accent text-accent-foreground' : i === step ? 'bg-accent text-accent-foreground ring-4 ring-accent/30' : 'bg-muted text-muted-foreground'}
                `}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs font-heading mt-1 text-muted-foreground hidden sm:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-12 sm:w-20 h-0.5 mx-1 ${i < step ? 'bg-accent' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="bg-card rounded-xl p-6 md:p-8 shadow-sm space-y-5">
            {step === 0 && (
              <>
                <h2 className="text-xl font-heading font-semibold text-foreground">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="font-heading text-sm">Full Name *</Label><Input value={form.full_name} onChange={e => updateForm('full_name', e.target.value)} placeholder="Your full name" /></div>
                  <div><Label className="font-heading text-sm">Email *</Label><Input value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="Email address" type="email" /></div>
                  <div><Label className="font-heading text-sm">Phone *</Label><Input value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+880..." /></div>
                  <div><Label className="font-heading text-sm">Date of Birth</Label><Input type="date" value={form.date_of_birth} onChange={e => updateForm('date_of_birth', e.target.value)} /></div>
                </div>
                <div>
                  <Label className="font-heading text-sm">Profile Photo</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors" onClick={() => fileInputRef.current?.click()}>
                    {form.photo_url ? (
                      <div className="flex flex-col items-center gap-2">
                        <img src={form.photo_url} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                        <p className="text-sm text-accent font-heading">Photo uploaded ✓</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <p className="text-sm font-body">{uploading ? 'Uploading...' : 'Click to upload photo (JPG, PNG, max 5MB)'}</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoUpload} className="hidden" />
                </div>
                <div>
                  <Label className="font-heading text-sm">Gender</Label>
                  <RadioGroup value={form.gender} onValueChange={v => updateForm('gender', v)} className="flex gap-4 mt-2">
                    {['Male', 'Female', 'Other'].map(g => (
                      <div key={g} className="flex items-center gap-2">
                        <RadioGroupItem value={g} id={g} /><Label htmlFor={g} className="font-body text-sm">{g}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="font-heading text-sm">Current City</Label><Input value={form.city} onChange={e => updateForm('city', e.target.value)} placeholder="e.g., Dhaka" /></div>
                  <div>
                    <Label className="font-heading text-sm">Country</Label>
                    <Select value={form.country} onValueChange={v => updateForm('country', v)}>
                      <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="font-heading text-sm">LinkedIn URL</Label><Input value={form.linkedin_url} onChange={e => updateForm('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
                  <div><Label className="font-heading text-sm">Website URL</Label><Input value={form.website_url} onChange={e => updateForm('website_url', e.target.value)} placeholder="https://..." /></div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-xl font-heading font-semibold text-foreground">Academic Information</h2>
                <div>
                  <Label className="font-heading text-sm">Department</Label>
                  <Select value={form.department} onValueChange={v => updateForm('department', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Degree</Label>
                    <Select value={form.degree} onValueChange={v => updateForm('degree', v)}>
                      <SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger>
                      <SelectContent>{degrees.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-heading text-sm">Graduation Year</Label>
                    <Select value={form.graduation_year} onValueChange={v => updateForm('graduation_year', v)}>
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label className="font-heading text-sm">Student ID / Roll Number *</Label><Input value={form.student_id} onChange={e => updateForm('student_id', e.target.value)} placeholder="e.g., ETE-2015-042" /></div>
                <div><Label className="font-heading text-sm">Hall of Residence</Label><Input value={form.hall_of_residence} onChange={e => updateForm('hall_of_residence', e.target.value)} placeholder="e.g., Shaheed Titumir Hall" /></div>
                <div>
                  <Label className="font-heading text-sm">Memorable University Memory</Label>
                  <Textarea value={form.university_memory} onChange={e => updateForm('university_memory', e.target.value.slice(0, 300))} placeholder="Share your favorite campus memory..." maxLength={300} className="resize-none" rows={3} />
                  <p className="text-xs text-muted-foreground text-right mt-1">{form.university_memory.length}/300</p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-heading font-semibold text-foreground">Professional Information</h2>
                <div>
                  <Label className="font-heading text-sm">Employment Status</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {employmentStatuses.map(es => (
                      <button key={es.value} type="button" onClick={() => updateForm('employment_status', es.value)}
                        className={`p-3 rounded-lg border text-left text-sm font-body transition-all ${form.employment_status === es.value ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}>
                        <span className="mr-2">{es.icon}</span>{es.value}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="font-heading text-sm">Job Title</Label><Input value={form.job_title} onChange={e => updateForm('job_title', e.target.value)} placeholder="e.g., Software Engineer" /></div>
                  <div><Label className="font-heading text-sm">Company</Label><Input value={form.company} onChange={e => updateForm('company', e.target.value)} placeholder="e.g., Google" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-heading text-sm">Industry</Label>
                    <Select value={form.industry} onValueChange={v => updateForm('industry', v)}>
                      <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                      <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label className="font-heading text-sm">Years of Experience</Label><Input type="number" value={form.years_of_experience} onChange={e => updateForm('years_of_experience', parseInt(e.target.value) || 0)} min={0} max={50} /></div>
                </div>
                <div><Label className="font-heading text-sm">Previous Companies</Label><Textarea value={form.previous_companies} onChange={e => updateForm('previous_companies', e.target.value)} placeholder="Enter each company on a new line" rows={3} className="resize-none" /></div>
                <div>
                  <Label className="font-heading text-sm">Key Skills (max 15)</Label>
                  <div className="flex gap-2 mt-2">
                    <Input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(skillInput); } }}
                      placeholder="Type a skill and press Enter" />
                    <Button type="button" onClick={() => addSkill(skillInput)} variant="outline" className="shrink-0 font-heading">Add</Button>
                  </div>
                  {skillTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skillTags.map((s, i) => (
                        <Badge key={i} variant="secondary" className="font-body">
                          {s} <button onClick={() => setSkillTags(skillTags.filter((_, j) => j !== i))}><X className="w-3 h-3 ml-1" /></button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="font-heading text-sm">Salary Range</Label>
                  <Select value={form.salary_range} onValueChange={v => updateForm('salary_range', v)}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>{salaryRanges.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.willing_to_mentor} onCheckedChange={v => updateForm('willing_to_mentor', v)} />
                  <Label className="font-body text-sm">Willing to mentor current students?</Label>
                </div>
                <div>
                  <Label className="font-heading text-sm">Bio / Message to Juniors</Label>
                  <Textarea value={form.bio} onChange={e => updateForm('bio', e.target.value.slice(0, 500))} placeholder="Share your journey, advice, or message for current students..." rows={4} className="resize-none" maxLength={500} />
                  <p className="text-xs text-muted-foreground text-right mt-1">{form.bio.length}/500</p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-xl font-heading font-semibold text-foreground">Review & Submit</h2>
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Personal</h3>
                    <div className="text-sm font-body text-muted-foreground space-y-1">
                      <p><strong>Name:</strong> {form.full_name}</p>
                      <p><strong>Email:</strong> {form.email}</p>
                      <p><strong>Phone:</strong> {form.phone}</p>
                      <p><strong>Location:</strong> {form.city}, {form.country}</p>
                    </div>
                    <button onClick={() => setStep(0)} className="text-xs text-accent font-heading mt-2">Edit ✏️</button>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Academic</h3>
                    <div className="text-sm font-body text-muted-foreground space-y-1">
                      <p><strong>Department:</strong> {form.department}</p>
                      <p><strong>Degree:</strong> {form.degree} · {form.graduation_year}</p>
                      <p><strong>Student ID:</strong> {form.student_id}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-xs text-accent font-heading mt-2">Edit ✏️</button>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Professional</h3>
                    <div className="text-sm font-body text-muted-foreground space-y-1">
                      <p><strong>Status:</strong> {form.employment_status}</p>
                      <p><strong>Role:</strong> {form.job_title} at {form.company}</p>
                      <p><strong>Industry:</strong> {form.industry}</p>
                      {skillTags.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{skillTags.map((s, i) => <Badge key={i} variant="outline" className="text-xs">{s}</Badge>)}</div>}
                    </div>
                    <button onClick={() => setStep(2)} className="text-xs text-accent font-heading mt-2">Edit ✏️</button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Checkbox checked={agreeAccuracy} onCheckedChange={(v) => setAgreeAccuracy(!!v)} id="accuracy" />
                    <label htmlFor="accuracy" className="text-sm font-body text-muted-foreground cursor-pointer">I confirm that all information provided is accurate and up to date</label>
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox checked={agreeVisibility} onCheckedChange={(v) => setAgreeVisibility(!!v)} id="visibility" />
                    <label htmlFor="visibility" className="text-sm font-body text-muted-foreground cursor-pointer">I agree to have my profile visible to current students and fellow alumni of ETE Family</label>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button onClick={() => setStep(s => s - 1)} disabled={step === 0} variant="outline" className="font-heading">
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)} className="bg-accent text-accent-foreground hover:bg-accent-hover font-heading">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting || !agreeAccuracy || !agreeVisibility} className="bg-accent text-accent-foreground hover:bg-accent-hover font-heading px-8">
              {submitting ? 'Submitting...' : 'Submit Registration'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
