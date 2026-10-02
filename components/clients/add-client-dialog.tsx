"use client";

import * as React from "react";
import { Plus, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClientAction } from "@/app/actions/clients";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddClientDialog() {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [nif, setNif] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("Bujumbura");
  const [country, setCountry] = React.useState("Burundi");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Veuillez saisir le nom du client");
      return;
    }

    startTransition(async () => {
      const res = await createClientAction({
        name: name.trim(),
        nif: nif.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || "Bujumbura",
        country: country.trim() || "Burundi",
      });

      if (res.success) {
        toast.success(`Client "${name}" enregistré avec succès dans Supabase !`);
        setOpen(false);
        // Reset form
        setName("");
        setNif("");
        setEmail("");
        setPhone("");
        setAddress("");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur lors de l'enregistrement du client");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 px-5 rounded-xl font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20">
          <Plus className="h-4 w-4" />
          <span>Ajouter un client</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  Nouveau Client
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Enregistrer un nouveau compte client dans Supabase.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-3.5 py-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nom ou Raison sociale <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Ex : Brarudi SA, Lumitel..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  NIF fiscal
                </label>
                <Input
                  placeholder="Ex : 4000123456"
                  value={nif}
                  onChange={(e) => setNif(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Téléphone
                </label>
                <Input
                  placeholder="+257 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email de facturation
              </label>
              <Input
                type="email"
                placeholder="contact@client.bi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Adresse physique
              </label>
              <Input
                placeholder="Quartier, Boulevard ou Avenue..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ville
                </label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Pays
                </label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 shadow-sm shadow-blue-500/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>Enregistrer le client</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
