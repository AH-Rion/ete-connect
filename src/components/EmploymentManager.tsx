import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Briefcase, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface Employment {
  id: string;
  user_id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
}

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '';

export const EmploymentManager = ({ userId }: { userId: string }) => {
  const [list, setList] = useState<Employment[]>([]);
  const [editing, setEditing] = useState<Partial<Employment> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('employment')
      .select('*')
      .eq('user_id', userId)
      .order('is_current', { ascending: false })
      .order('start_date', { ascending: false });
    setList((data as Employment[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const save = async () => {
    if (!editing?.company?.trim() || !editing?.position?.trim()) {
      toast.error('Company & position are required');
      return;
    }
    const payload = {
      user_id: userId,
      company: editing.company.trim(),
      position: editing.position.trim(),
      location: editing.location?.trim() || null,
      start_date: editing.start_date || null,
      end_date: editing.is_current ? null : editing.end_date || null,
      is_current: !!editing.is_current,
    };
    const { error } = editing.id
      ? await supabase.from('employment').update(payload).eq('id', editing.id)
      : await supabase.from('employment').insert(payload);
    if (error) return toast.error(error.message);
    toast.success('Saved');
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this employment entry?')) return;
    const { error } = await supabase.from('employment').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Deleted');
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-heading text-sm">Employment History</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setEditing({ is_current: true })}
          className="font-heading"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Employment
        </Button>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : list.length === 0 && !editing ? (
        <p className="text-xs text-muted-foreground italic">
          No entries yet. Add your work experience — like LinkedIn.
        </p>
      ) : (
        <ul className="space-y-2">
          {list.map((e) => (
            <li
              key={e.id}
              className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border bg-card"
            >
              <div className="flex gap-3 items-start min-w-0 flex-1">
                <Briefcase className="w-4 h-4 text-accent mt-1 shrink-0" />
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold truncate">{e.position}</p>
                  <p className="text-xs text-muted-foreground truncate">{e.company}</p>
                  <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                    {fmt(e.start_date) || '—'} – {e.is_current ? 'Present' : fmt(e.end_date) || '—'}
                    {e.location && (
                      <span className="inline-flex items-center gap-1 ml-2">
                        <MapPin className="w-3 h-3" />
                        {e.location}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditing(e)}
                  className="p-1.5 rounded hover:bg-muted"
                  aria-label="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="p-4 rounded-lg border border-accent/40 bg-accent/5 space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-heading text-sm font-semibold">
              {editing.id ? 'Edit Employment' : 'New Employment'}
            </p>
            <button type="button" onClick={() => setEditing(null)} aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Position *</Label>
              <Input
                value={editing.position || ''}
                onChange={(e) => setEditing({ ...editing, position: e.target.value })}
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div>
              <Label className="text-xs">Company *</Label>
              <Input
                value={editing.company || ''}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                placeholder="e.g., Google"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Location</Label>
              <Input
                value={editing.location || ''}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                placeholder="e.g., Dhaka, Bangladesh"
              />
            </div>
            <div>
              <Label className="text-xs">Start date</Label>
              <Input
                type="date"
                value={editing.start_date || ''}
                onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">End date</Label>
              <Input
                type="date"
                value={editing.end_date || ''}
                disabled={!!editing.is_current}
                onChange={(e) => setEditing({ ...editing, end_date: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <Checkbox
                id="is_current"
                checked={!!editing.is_current}
                onCheckedChange={(v) => setEditing({ ...editing, is_current: !!v })}
              />
              <Label htmlFor="is_current" className="text-xs cursor-pointer">
                I currently work here
              </Label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={save}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
