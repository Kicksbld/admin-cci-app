import { NextResponse } from "next/server";
import { authClient } from "@/app/lib/auth-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, image } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    // Inscription via authClient
    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
        image,
      },
      {
        onRequest: (ctx) => {
          console.log("Enregistrement en cours...");
        },
        onSuccess: (ctx) => {
          console.log("Utilisateur créé avec succès !");
        },
        onError: (ctx) => {
          console.error("Erreur lors de la création :", ctx.error.message);
        },
      }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data }, { status: 201 });
  } catch (err: any) {
    console.error("Erreur serveur", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
