"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Building2, ArrowRight, Loader2, ShieldCheck, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signUpAction } from "@/app/actions/auth";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Veuillez renseigner un email et un mot de passe.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUpAction({
        email: email.trim(),
        password,
      });

      if (res.success) {
        toast.success("Compte créé avec succès !");
        router.push("/dashboard");
        router.refresh();
      } else {
        setErrorMsg(res.error || "Erreur lors de la création du compte.");
        toast.error(res.error || "Erreur lors de l'inscription.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Erreur d'inscription inattendue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand Identity */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="h-7 w-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z"
                fill="currentColor"
                opacity="0.9"
              />
            </svg>
          </div>
          <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
            RDSH
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Créer votre compte
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Démarrez votre facturation professionnelle en Franc Burundais (BIF) en quelques secondes.
        </p>
      </div>

      {/* Register Card */}
      <Card className="border-slate-200/90 shadow-md dark:border-slate-800 dark:bg-slate-900/90">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Créer un compte
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Renseignez votre adresse email et un mot de passe pour commencer.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/50 dark:border-red-900/80 dark:text-red-300">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>Adresse email</span>
              </label>
              <Input
                type="email"
                placeholder="contact@exemple.bi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="h-11 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Mot de passe</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="h-11 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>Confirmation</span>
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmer mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="h-11 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                    aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Note d'information entreprise */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 text-xs dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-300">
              <Building2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <span>
                Le nom de l'entreprise et les détails de facturation (NIF, RC, comptes bancaires) pourront être définis dans vos paramètres à l'intérieur.
              </span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Création de votre compte...</span>
                </>
              ) : (
                <>
                  <span>Créer mon compte</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 dark:border-slate-800">
            <span>Vous avez déjà un compte ? </span>
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Security Trust Badge */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Sécurisé par Supabase Auth • Données isolées par compte</span>
      </div>
    </div>
  );
}
