import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { formationRequestSchema } from './schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = formationRequestSchema.parse(body);
    
    console.log("Formation registration request:", {
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message || "Aucun message",
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Formation registration error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}