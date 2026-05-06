import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "time" | "select" | "checkbox";
  required?: boolean;
  options?: { value: string; label: string }[];
};

type Props = {
  table: string;
  title: string;
  description?: string;
  fields: Field[];
  columns: { key: string; label: string; render?: (row: any) => React.ReactNode }[];
  orderBy?: string;
  ascending?: boolean;
};

export function CrudPage({ table, title, description, fields, columns, orderBy = "created_at", ascending = false }: Props) {
  const qc = useQueryClient();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const { data, isLoading } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from(table).select("*").order(orderBy, { ascending });
      if (error) throw error;
      return data as any[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (payload: any) => {
      if (editing?.id) {
        const { error } = await (supabase as any).from(table).update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from(table).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Modifié" : "Ajouté");
      qc.invalidateQueries({ queryKey: [table] });
      setOpen(false); setEditing(null); setForm({});
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Supprimé"); qc.invalidateQueries({ queryKey: [table] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const openNew = () => { setEditing(null); setForm({}); setOpen(true); };
  const openEdit = (row: any) => {
    setEditing(row);
    const f: any = {};
    fields.forEach((fd) => { f[fd.name] = row[fd.name] ?? ""; });
    setForm(f); setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {};
    fields.forEach((fd) => {
      let v = form[fd.name];
      if (fd.type === "number" && v !== "" && v != null) v = Number(v);
      if (v === "") v = null;
      payload[fd.name] = v;
    });
    upsert.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openNew}><Plus className="size-4 mr-1" /> Ajouter</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouveau"}</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                {fields.map((fd) => (
                  <div key={fd.name}>
                    <Label>{fd.label}{fd.required && " *"}</Label>
                    {fd.type === "select" ? (
                      <Select value={form[fd.name] ?? ""} onValueChange={(v) => setForm({ ...form, [fd.name]: v })}>
                        <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                        <SelectContent>
                          {fd.options?.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={fd.type ?? "text"}
                        required={fd.required}
                        value={form[fd.name] ?? ""}
                        onChange={(e) => setForm({ ...form, [fd.name]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
                <DialogFooter><Button type="submit" disabled={upsert.isPending}>Enregistrer</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
              {isAdmin && <TableHead className="w-24 text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8">Chargement…</TableCell></TableRow>
            ) : data?.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8">Aucune donnée</TableCell></TableRow>
            ) : data?.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => <TableCell key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? "—")}</TableCell>)}
                {isAdmin && (
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(row)}><Pencil className="size-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Supprimer ?")) del.mutate(row.id); }}><Trash2 className="size-4" /></Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
