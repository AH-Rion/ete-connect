import { useEffect, useState } from 'react';
import { Upload, Trash2, Edit2, X, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { EventGalleryItem as BaseEventGalleryItem } from '@/components/EventGallery';

type EventGalleryItem = BaseEventGalleryItem & { batch_year?: number | null };

const BATCH_YEARS = Array.from({ length: 2030 - 2012 + 1 }, (_, i) => 2012 + i);

const BUCKET = 'event-gallery';

export const AdminEventGallery = () => {
  const [items, setItems] = useState<EventGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [batchYear, setBatchYear] = useState<string>('');
  const [editing, setEditing] = useState<EventGalleryItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<EventGalleryItem | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('event_gallery' as any)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load gallery');
    setItems((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setEventDate('');
    setBatchYear('');
    const input = document.getElementById('gallery-file-input') as HTMLInputElement | null;
    if (input) input.value = '';
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error('Image and title are required');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const { error: insErr } = await supabase.from('event_gallery' as any).insert({
        image_url: pub.publicUrl,
        title: title.trim(),
        description: description.trim() || null,
        event_date: eventDate || null,
        batch_year: batchYear ? parseInt(batchYear, 10) : null,
      });
      if (insErr) throw insErr;
      toast.success('Event uploaded!');
      resetForm();
      load();
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (it: EventGalleryItem) => {
    try {
      // best-effort storage cleanup
      const m = it.image_url.match(/\/event-gallery\/(.+)$/);
      if (m?.[1]) await supabase.storage.from(BUCKET).remove([decodeURIComponent(m[1])]);
      const { error } = await supabase.from('event_gallery' as any).delete().eq('id', it.id);
      if (error) throw error;
      toast.success('Deleted');
      setConfirmDelete(null);
      load();
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    const { error } = await supabase.from('event_gallery' as any).update({
      title: editing.title,
      description: editing.description,
      event_date: editing.event_date,
      batch_year: editing.batch_year ?? null,
    }).eq('id', editing.id);
    if (error) { toast.error('Update failed'); return; }
    toast.success('Updated');
    setEditing(null);
    load();
  };

  return (
    <div className="space-y-6">
      {/* Upload form */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Event Image
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">Image *</label>
            <Input
              id="gallery-file-input"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">Event Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Industrial Tour 2025" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">Event Date</label>
            <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs text-muted-foreground font-medium">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description..." rows={3} />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleUpload} disabled={uploading || !file || !title.trim()} className="font-heading">
            {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</> : <><Upload className="w-4 h-4 mr-2" />Upload</>}
          </Button>
        </div>
      </div>

      {/* Existing items */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4">Gallery ({items.length})</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground py-4">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No images yet. Upload your first event above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <div key={it.id} className="rounded-xl overflow-hidden border border-border bg-background group relative">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={it.image_url} alt={it.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-foreground truncate">{it.title}</p>
                  {it.event_date && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> {new Date(it.event_date).toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => setEditing(it)}>
                      <Edit2 className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1 h-8" onClick={() => setConfirmDelete(it)}>
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading">Edit Event</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Title</label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Date</label>
                <Input type="date" value={editing.event_date || ''} onChange={(e) => setEditing({ ...editing, event_date: e.target.value || null })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <Textarea rows={3} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}><X className="w-4 h-4 mr-1" />Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading">Delete Event</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Delete "<span className="font-medium text-foreground">{confirmDelete?.title}</span>"? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => confirmDelete && handleDelete(confirmDelete)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEventGallery;
