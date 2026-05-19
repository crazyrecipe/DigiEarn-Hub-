import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { api, money, fallbackImg } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const empty = {
  id: "",
  title: "",
  description: "",
  category: "",
  price: 0,
  commission: 0,
  level2Commission: 0,
  image: "",
  pdfUrl: "",
  status: "active",
  activation: false,
  featured: false,
  bestseller: false,
};

function AdminProducts() {
  const { products, refresh } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(empty);
  const [busy, setBusy] = useState(false);

  const edit = (p: any) => {
    setForm({ ...empty, ...p });
    setOpen(true);
  };
  const add = () => {
    setForm(empty);
    setOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.price) return toast.error("Title aur price required");
    setBusy(true);
    const action = form.id ? "updateProduct" : "addProduct";
    const r: any = await api(action, form);
    setBusy(false);
    if (r?.success) {
      toast.success("Saved");
      setOpen(false);
      refresh();
    } else toast.error(r?.message || "Save failed");
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const r: any = await api("deleteProduct", { id });
    if (r?.success) {
      toast.success("Deleted");
      refresh();
    } else toast.error(r?.message || "Delete failed");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-extrabold">Products ({products.length})</h2>
        <Button onClick={add} className="bg-gradient-brand">
          <Plus className="w-4 h-4 mr-1" />
          Add Product
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p: any) => (
          <div
            key={p.id}
            className="rounded-2xl bg-card border border-border overflow-hidden shadow-elegant"
          >
            <img src={p.image || fallbackImg} alt={p.title} className="w-full h-32 object-cover" />
            <div className="p-4">
              <p className="font-extrabold truncate">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.category}</p>
              <p className="text-sm mt-1">
                <b>{money(p.price)}</b> · +{money(p.commission)} L1
              </p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {String(p.activation) === "true" && (
                  <span className="text-[10px] font-bold bg-warning/20 text-warning px-2 py-0.5 rounded-full">
                    ACTIVATION
                  </span>
                )}
                {String(p.featured) === "true" && (
                  <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    FEATURED
                  </span>
                )}
                {String(p.bestseller) === "true" && (
                  <span className="text-[10px] font-bold bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">
                    BESTSELLER
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => edit(p)}>
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => del(p.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit" : "Add"} Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="L1 Comm."
                value={form.commission}
                onChange={(e) => setForm({ ...form, commission: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="L2 Bonus"
                value={form.level2Commission}
                onChange={(e) => setForm({ ...form, level2Commission: Number(e.target.value) })}
              />
            </div>
            <Input
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
            <Input
              placeholder="PDF/ZIP URL"
              value={form.pdfUrl}
              onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
            />
            <div className="flex flex-wrap gap-3 text-sm py-2">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={!!form.activation && form.activation !== "false"}
                  onChange={(e) => setForm({ ...form, activation: e.target.checked })}
                />{" "}
                Activation
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={!!form.featured && form.featured !== "false"}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />{" "}
                Featured
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={!!form.bestseller && form.bestseller !== "false"}
                  onChange={(e) => setForm({ ...form, bestseller: e.target.checked })}
                />{" "}
                Bestseller
              </label>
            </div>
            <Button onClick={save} disabled={busy} className="w-full bg-gradient-brand">
              {busy ? "Saving…" : "Save Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
