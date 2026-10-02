"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { revalidatePath } from "next/cache";

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
}

export async function signInAction(formData: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const { email, password } = formData;
    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis." };
    }

    if (!isSupabaseConfigured()) {
      // Mock session fallback for offline development
      return {
        success: true,
        user: { id: "mock_user_1", email, name: email.split("@")[0] },
      };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      // Friendly French error translation
      if (error.message.includes("Invalid login credentials")) {
        return {
          success: false,
          error: "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.",
        };
      }
      if (error.message.includes("Email not confirmed")) {
        return {
          success: false,
          error: "Adresse email non confirmée. Veuillez vérifier votre boîte mail ou contacter le support.",
        };
      }
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0],
      },
    };
  } catch (err: any) {
    console.error("Erreur signInAction:", err);
    return {
      success: false,
      error: err?.message || "Erreur de connexion. Veuillez réessayer.",
    };
  }
}

export async function signUpAction(formData: {
  name?: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const { name, email, password } = formData;
    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis." };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Le mot de passe doit contenir au moins 6 caractères.",
      };
    }

    const defaultName = name?.trim() || "RDSH";

    if (!isSupabaseConfigured()) {
      return {
        success: true,
        user: { id: "mock_user_1", email, name: defaultName },
      };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: defaultName,
        },
      },
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        return {
          success: false,
          error: "Un compte existe déjà avec cette adresse email. Connectez-vous.",
        };
      }
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Create associated organization if none exists
      const { data: existingOrg } = await supabase
        .from("organizations")
        .select("id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!existingOrg) {
        await supabase.from("organizations").insert({
          user_id: data.user.id,
          name: defaultName,
          email: "",
          phone: "+257 ",
          city: "Bujumbura",
          country: "Burundi",
          currency: "BIF",
          default_tax_rate: 15,
          default_payment_terms_days: 30,
          invoice_prefix: "RDSH",
          next_invoice_number: 1,
          payment_instructions:
            "Paiement par virement bancaire sur notre compte IBB ou par Lumicash Marchand.",
          footer_note: "Facture payable sous 30 jours.",
        });
      }
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      user: {
        id: data.user?.id || "",
        email: data.user?.email,
        name: defaultName,
      },
    };
  } catch (err: any) {
    console.error("Erreur signUpAction:", err);
    return {
      success: false,
      error: err?.message || "Erreur lors de la création du compte.",
    };
  }
}

export async function signOutAction(): Promise<{ success: boolean }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      await supabase.auth.signOut();
    }
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    console.error("Erreur signOutAction:", err);
    return { success: false };
  }
}

export async function resetPasswordAction(formData: {
  email: string;
}): Promise<AuthResponse> {
  try {
    const { email } = formData;
    if (!email || !email.trim()) {
      return { success: false, error: "Veuillez renseigner votre adresse email." };
    }

    if (!isSupabaseConfigured()) {
      // Mock mode: immediately simulate sending email
      return { success: true };
    }

    const supabase = await createClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectTo = `${appUrl}/auth/callback?next=/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Erreur resetPasswordAction:", err);
    return {
      success: false,
      error: err?.message || "Erreur lors de la réinitialisation du mot de passe.",
    };
  }
}

export async function updatePasswordAction(formData: {
  password: string;
}): Promise<AuthResponse> {
  try {
    const { password } = formData;
    if (!password || password.length < 6) {
      return {
        success: false,
        error: "Le mot de passe doit comporter au moins 6 caractères.",
      };
    }

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    console.error("Erreur updatePasswordAction:", err);
    return {
      success: false,
      error: err?.message || "Erreur lors de la mise à jour du mot de passe.",
    };
  }
}

export async function getCurrentUserAction() {
  if (!isSupabaseConfigured()) {
    return {
      id: "mock_user_1",
      email: "contact@rdsh-digital.bi",
      name: "RDSH Solutions Tech",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilisateur",
    };
  } catch (err) {
    return null;
  }
}
