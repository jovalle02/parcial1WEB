import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8080';

// GET /api/authors - Listar todos los autores
export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/authors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const authors = await response.json();
    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

// POST /api/authors - Crear nuevo autor
export async function POST(request: NextRequest) {
  try {
    const authorData = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authorData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const newAuthor = await response.json();
    return NextResponse.json(newAuthor, { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
}
