import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle, Star, Mail, Eye, Trash2, Check, X as XIcon, LayoutDashboard, MessageSquare, Settings, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cloudSupabase } from '@/lib/cloudClient';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { pageTransition } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

const AdminPage = () => {
  const [tab, setTab] = useState('overview');
  const [alumni, setAlumni] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const syncToSheets = async () => {
    setSyncing(true);
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'fhzsksqfvkviwhwndhdw';
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/sync-alumni-sheets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoenNrc3Fmdmt2aXdod25kaGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NzI3ODUsImV4cCI6MjA4ODU0ODc4NX0.APBcxgbc1veGEuIywN8d_EO9XuymxbCsZy4QuKbkUs0'}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Sheet synced! ${data.total_alumni} alumni updated.`);
      } else {
        toast.error(`Sync failed: ${data.error}`);
      }
    } catch (e: any) {
      toast.error('Sheet sync failed');
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const [alumniRes, messagesRes, settingsRes] = await Promise.all([
      supabase.from('alumni').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      cloudSupabase.from('site_settings').select('*').order('key', { ascending: true }),
    ]);
    setAlumni(alumniRes.data || []);
    setMessages(messagesRes.data || []);
    setSettings(settingsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from('alumni').update({ is_approved: true, is_rejected: false, approved_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast.error('Failed'); return; }
    toast.success('Alumni approved!');
    fetchData();
    syncToSheets();
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from('alumni').update({ is_rejected: true, is_approved: false, rejected_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast.error('Failed'); return; }
    toast.success('Alumni rejected');
    fetchData();
    syncToSheets();
  };

  const handleFeature = async (id: string, current: boolean) => {
    const { error } = await supabase.from('alumni').update({ is_featured: !current }).eq('id', id);
    if (error) { toast.error('Failed'); return; }
    toast.success(current ? 'Unfeatured' : 'Featured!');
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('alumni').delete().eq('id', id);
    if (error) { toast.error('Failed'); return; }
    toast.success('Deleted');
    setDeleteDialog(null);
    fetchData();
    syncToSheets();
  };

  const handleMarkRead = async (id: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    fetchData();
  };

  const handleSaveSetting = async (key: string, value: string) => {
    setSavingSettings(true);
    const { error } = await cloudSupabase.from('site_settings').update({ value }).eq('key', key);
    setSavingSettings(false);
    if (error) {
      toast.error('Failed to update setting');
    } else {
      toast.success('Setting updated successfully');
      // No need to fetch all data again, state is already updated locally
    }
  };

  const handleSettingsChange = (key: string, value: string) => {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
  };


  const totalAlumni = alumni.length;
  const pending = alumni.filter(a => !a.is_approved && !a.is_rejected).length;
  const approved = alumni.filter(a => a.is_approved).length;
  const featured = alumni.filter(a => a.is_featured).length;
  const unreadMessages = messages.filter(m => !m.is_read).length;

  const filteredAlumni = alumni.filter(a => {
    const matchesSearch = !search || a.full_name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase());
    if (filter === 'pending') return matchesSearch && !a.is_approved && !a.is_rejected;
    if (filter === 'approved') return matchesSearch && a.is_approved;
    if (filter === 'rejected') return matchesSearch && a.is_rejected;
    return matchesSearch;
  });

  const stats = [
    { icon: Users, label: 'Total Alumni', value: totalAlumni, color: 'border-primary' },
    { icon: Clock, label: 'Pending', value: pending, color: 'border-warning' },
    { icon: CheckCircle, label: 'Approved', value: approved, color: 'border-success' },
    { icon: Star, label: 'Featured', value: featured, color: 'border-accent' },
  ];

  return (
    <motion.div {...pageTransition} className="pt-20 pb-16 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">Admin Dashboard</h1>
          <Button onClick={syncToSheets} disabled={syncing} variant="outline" className="font-heading gap-2">
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync to Sheets'}
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview" className="font-heading gap-2"><LayoutDashboard className="w-4 h-4" />Overview</TabsTrigger>
            <TabsTrigger value="alumni" className="font-heading gap-2"><Users className="w-4 h-4" />Submissions</TabsTrigger>
            <TabsTrigger value="messages" className="font-heading gap-2">
              <MessageSquare className="w-4 h-4" />Messages
              {unreadMessages > 0 && <Badge variant="destructive" className="ml-1 text-xs px-1.5 py-0">{unreadMessages}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-heading gap-2"><Settings className="w-4 h-4" />Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((s, i) => (
                <motion.div key={i} variants={fadeInUp} className={`bg-card rounded-xl p-5 shadow-sm border-l-4 ${s.color}`}>
                  <s.icon className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-3xl font-heading font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground font-body">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h2 className="font-heading font-semibold text-foreground mb-4">Recent Submissions</h2>
              {alumni.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-sm font-heading font-bold text-accent-foreground">{a.full_name?.charAt(0)}</div>
                    <div>
                      <p className="font-heading font-medium text-sm text-foreground">{a.full_name}</p>
                      <p className="text-xs text-muted-foreground font-body">{a.company || 'N/A'} · Batch {a.graduation_year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={a.is_approved ? 'default' : a.is_rejected ? 'destructive' : 'secondary'} className="text-xs">
                      {a.is_approved ? 'Approved' : a.is_rejected ? 'Rejected' : 'Pending'}
                    </Badge>
                    {!a.is_approved && !a.is_rejected && (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => handleApprove(a.id)} className="h-8 w-8 text-success"><Check className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleReject(a.id)} className="h-8 w-8 text-destructive"><XIcon className="w-4 h-4" /></Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alumni">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="max-w-xs" />
              <div className="flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map(f => (
                  <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'}
                    className={`font-heading capitalize ${filter === f ? 'bg-accent text-accent-foreground' : ''}`}
                    onClick={() => setFilter(f)}>{f}</Button>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-heading">Name</TableHead>
                      <TableHead className="font-heading">Email</TableHead>
                      <TableHead className="font-heading">Dept</TableHead>
                      <TableHead className="font-heading">Batch</TableHead>
                      <TableHead className="font-heading">Company</TableHead>
                      <TableHead className="font-heading">Status</TableHead>
                      <TableHead className="font-heading">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlumni.map(a => (
                      <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedAlumni(a)}>
                        <TableCell className="font-body font-medium">{a.full_name}</TableCell>
                        <TableCell className="font-body text-sm text-muted-foreground">{a.email}</TableCell>
                        <TableCell className="font-body text-sm text-muted-foreground max-w-[120px] truncate">{a.department}</TableCell>
                        <TableCell className="font-body text-sm">{a.graduation_year}</TableCell>
                        <TableCell className="font-body text-sm">{a.company}</TableCell>
                        <TableCell>
                          <Badge variant={a.is_approved ? 'default' : a.is_rejected ? 'destructive' : 'secondary'} className="text-xs">
                            {a.is_approved ? 'Approved' : a.is_rejected ? 'Rejected' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => handleApprove(a.id)} className="h-7 w-7 text-success" title="Approve"><Check className="w-3 h-3" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => handleReject(a.id)} className="h-7 w-7 text-destructive" title="Reject"><XIcon className="w-3 h-3" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => handleFeature(a.id, a.is_featured)} className={`h-7 w-7 ${a.is_featured ? 'text-accent' : 'text-muted-foreground'}`} title="Feature"><Star className="w-3 h-3" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => setDeleteDialog(a.id)} className="h-7 w-7 text-destructive" title="Delete"><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredAlumni.length === 0 && <p className="text-center text-muted-foreground py-8 font-body">No results found</p>}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="bg-card rounded-xl shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-heading">Name</TableHead>
                    <TableHead className="font-heading">Email</TableHead>
                    <TableHead className="font-heading">Subject</TableHead>
                    <TableHead className="font-heading">Message</TableHead>
                    <TableHead className="font-heading">Date</TableHead>
                    <TableHead className="font-heading">Status</TableHead>
                    <TableHead className="font-heading">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="font-body font-medium">{m.name}</TableCell>
                      <TableCell className="font-body text-sm text-muted-foreground">{m.email}</TableCell>
                      <TableCell className="font-body text-sm">{m.subject || '-'}</TableCell>
                      <TableCell className="font-body text-sm max-w-[200px] truncate">{m.message}</TableCell>
                      <TableCell className="font-body text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</TableCell>
                      <TableCell><Badge variant={m.is_read ? 'secondary' : 'default'} className="text-xs">{m.is_read ? 'Read' : 'New'}</Badge></TableCell>
                      <TableCell>
                        {!m.is_read && <Button size="sm" variant="ghost" onClick={() => handleMarkRead(m.id)} className="text-xs font-heading"><Eye className="w-3 h-3 mr-1" />Mark Read</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {messages.length === 0 && <p className="text-center text-muted-foreground py-8 font-body">No messages yet</p>}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-card rounded-xl p-6 shadow-sm max-w-3xl">
              <h2 className="font-heading font-semibold text-foreground mb-6">Frontend Settings</h2>
              <div className="space-y-6">
                {settings.map(setting => (
                  <div key={setting.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor={setting.key} className="font-heading font-medium text-sm text-foreground capitalize">
                          {setting.key.replace(/_/g, ' ')}
                        </label>
                        {setting.description && (
                          <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSaveSetting(setting.key, setting.value)}
                        disabled={savingSettings}
                        className="font-heading"
                      >
                        Save
                      </Button>
                    </div>
                    <Input
                      id={setting.key}
                      value={setting.value || ''}
                      onChange={e => handleSettingsChange(setting.key, e.target.value)}
                      placeholder={`Enter ${setting.key.replace(/_/g, ' ')}`}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              {settings.length === 0 && (
                <p className="text-center text-muted-foreground py-8 font-body">No settings available</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Alumni Detail Sheet */}
      <Sheet open={!!selectedAlumni} onOpenChange={() => setSelectedAlumni(null)}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          {selectedAlumni && (
            <>
              <SheetHeader><SheetTitle className="font-heading">{selectedAlumni.full_name}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-4 text-sm font-body">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Email', selectedAlumni.email],
                    ['Phone', selectedAlumni.phone],
                    ['Gender', selectedAlumni.gender],
                    ['City', selectedAlumni.city],
                    ['Country', selectedAlumni.country],
                    ['Department', selectedAlumni.department],
                    ['Degree', selectedAlumni.degree],
                    ['Batch', selectedAlumni.graduation_year],
                    ['Student ID', selectedAlumni.student_id],
                    ['Job Title', selectedAlumni.job_title],
                    ['Company', selectedAlumni.company],
                    ['Industry', selectedAlumni.industry],
                    ['Experience', `${selectedAlumni.years_of_experience} years`],
                    ['Employment', selectedAlumni.employment_status],
                    ['Mentor', selectedAlumni.willing_to_mentor ? 'Yes' : 'No'],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium text-foreground">{value || '-'}</p>
                    </div>
                  ))}
                </div>
                {selectedAlumni.bio && <div><p className="text-xs text-muted-foreground">Bio</p><p className="text-foreground">{selectedAlumni.bio}</p></div>}
                {selectedAlumni.skills && <div><p className="text-xs text-muted-foreground mb-1">Skills</p><div className="flex flex-wrap gap-1">{selectedAlumni.skills.split(',').map((s: string, i: number) => <Badge key={i} variant="outline" className="text-xs">{s.trim()}</Badge>)}</div></div>}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading">Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground font-body">Are you sure you want to delete this alumni record? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)} className="font-heading">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteDialog && handleDelete(deleteDialog)} className="font-heading">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminPage;
