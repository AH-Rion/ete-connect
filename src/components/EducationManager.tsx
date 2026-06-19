import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Education {
  id: string;
  user_id: string;
  degree: string;
  institution: string;
  year: number | null;
}

interface Props {
  userId: string;
  defaultYear?: number;
}

export const EducationManager = ({ userId, defaultYear }: Props) => {
  const [list, setList] = useState<Education[]>([]);
  const [editing, setEditing] = useState<Partial<Education> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', userId)
      .order('year', { ascending: false });
    setList((data as Education[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const openAdd = () => {
    const isFirst = list.length === 0;
    setEditing(
      isFirst
        ? {
            degree: 'BSc in ETE',
            institution: 'CUET — Electronics & Telecommunication Engineering',
            year: defaultYear ?? new Date().getFullYear(),
          }
        : { degree: '', institution: '', year: null }
    );
  };

  const save = async () => {
    if (!editing?.degree?.trim() || !editing?.institution?.trim()) {
      toast.error('Degree & institution are required');
      return;
    }
    const payload = {
      user_id: userId,
      degree: editing.degree.trim(),
      institution: editing.institution.trim(),
      year: editing.year || null,
    };
    const { error } = editing.id
      ? await supabase.from('education').update(payload).eq('id', editing.id)
      : await supabase.from('education').insert(payload);
    if (error) return toast.error(error.message);
    toast.success('Saved');
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this education entry?')) return;
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Deleted');
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-heading text-sm">Education History</Label>
        <Button type="button" size="sm" variant="outline" onClick={openAdd} className="font-heading">
          <Plus className="w-4 h-4 mr-1" /> Add Education
        </Button>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : list.length === 0 && !editing ? (
        <p className="text-xs text-muted-foreground italic">
          No entries yet. Click "Add Education" — your BSc in ETE will be pre-filled.
        </p>
      ) : (
        <ul className="space-y-2">
          {list.map((e) => (
            <li
              key={e.id}
              className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border bg-card"
            >
              <div className="flex gap-3 items-start min-w-0 flex-1">
                <GraduationCap className="w-4 h-4 text-accent mt-1 shrink-0" />
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold truncate">{e.degree}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {e.institution}
                    {e.year ? ` · ${e.year}` : ''}
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
              {editing.id ? 'Edit Education' : 'New Education'}
            </p>
            <button type="button" onClick={() => setEditing(null)} aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Degree *</Label>
              <Input
                value={editing.degree || ''}
                onChange={(e) => setEditing({ ...editing, degree: e.target.value })}
                placeholder="e.g., MSc in Computer Science"
              />
            </div>
            <div>
              <Label className="text-xs">Year</Label>
              <Input
                type="number"
                value={editing.year ?? ''}
                onChange={(e) =>
                  setEditing({ ...editing, year: e.target.value ? parseInt(e.target.value) : null })
                }
                placeholder="e.g., 2018"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Institution *</Label>
              <Input
                value={editing.institution || ''}
                onChange={(e) => setEditing({ ...editing, institution: e.target.value })}
                placeholder="e.g., CUET, MIT, Stanford"
              />
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
