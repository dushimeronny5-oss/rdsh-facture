"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordAction } from "@/app/actions/auth";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Veuillez renseigner votre adresse email.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordAction({ email: email.trim() });
      if (res.success) {
        setIsSuccess(true);
        toast.success("Instructions de réinitialisation envoyées !");
      } else {
        setErrorMsg(res.error || "Une erreur est survenue lors de l'envoi.");
        toast.error(res.error || "Erreur lors de la demande.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Erreur inattendue.");
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
          Mot de passe oublié
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Récupérez l'accès à votre compte et à vos factures en toute sécurité.
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-slate-200/90 shadow-md dark:border-slate-800 dark:bg-slate-900/90">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/60 dark:text-blue-400">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Réinitialisation
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Saisissez votre email pour recevoir les instructions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="space-y-5 text-center py-2">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 dark:bg-emerald-950/50 dark:border-emerald-900/80 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Email de réinitialisation envoyé !
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Si un compte est associé à <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>, vous allez recevoir un lien pour créer votre nouveau mot de passe.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  asChild
                  className="w-full h-11 rounded-xl font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                >
                  <Link href="/reset-password">
                    <span>Saisir un nouveau mot de passe</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsSuccess(false)}
                  className="w-full h-10 rounded-xl text-xs text-slate-600 dark:text-slate-300"
                >
                  Renvoyer avec une autre adresse email
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/50 dark:border-red-900/80 dark:text-red-300">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>Adresse email de votre compte</span>
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer le lien de réinitialisation</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 dark:border-slate-800">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour à la connexion</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Security Trust Badge */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Lien de récupération sécurisé et chiffré</span>
      </div>
    </div>
  );
}
