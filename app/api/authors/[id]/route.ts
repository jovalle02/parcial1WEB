import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8080';

// GET /api/authors/[id] - Obtener un autor específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('Fetching author with id:', id);
    
    const response = await fetch(`${API_BASE_URL}/api/authors/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('GET author response status:', response.status);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Autor no encontrado' },
          { status: 404 }
        );
      }
      throw new Error(`Error: ${response.status}`);
    }

    const author = await response.json();
    console.log('Author fetched successfully:', author.name);
    return NextResponse.json(author);
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { 
        error: 'Error al obtener el autor',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// PUT /api/authors/[id] - Actualizar autor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const authorData = await request.json();
    console.log('Updating author with id:', id, 'data:', authorData);
    
    const response = await fetch(`${API_BASE_URL}/api/authors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authorData),
    });

    console.log('PUT author response status:', response.status);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Autor no encontrado' },
          { status: 404 }
        );
      }
      
      // Capturar mensaje específico del backend para PUT también
      let errorMessage = 'No se pudo actualizar el autor';
      try {
        const errorData = await response.json();
        if (errorData.apierror && errorData.apierror.message) {
          errorMessage = errorData.apierror.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        console.log('Could not parse PUT error response');
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const updatedAuthor = await response.json();
    console.log('Author updated successfully:', updatedAuthor.name);
    return NextResponse.json(updatedAuthor);
  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// DELETE /api/authors/[id] - Eliminar autor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('Deleting author with id:', id);
    
    const response = await fetch(`${API_BASE_URL}/api/authors/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('DELETE response status:', response.status);

    if (!response.ok) {
      // Capturar el mensaje de error específico del backend
      let userMessage = 'No se pudo eliminar el autor';
      
      try {
        const errorBody = await response.text();
        console.log('Backend error response:', errorBody);
        
        // Intentar parsear como JSON
        const backendError = JSON.parse(errorBody);
        
        // Extraer el mensaje específico según la estructura del backend
        if (backendError.apierror && backendError.apierror.message) {
          userMessage = backendError.apierror.message;
        } else if (backendError.message) {
          userMessage = backendError.message;
        } else if (backendError.error) {
          userMessage = backendError.error;
        }
      } catch (parseError) {
        console.log('Could not parse error response as JSON');
        // Si no es JSON, usar un mensaje genérico con el status
        userMessage = `No se pudo eliminar el autor (Error ${response.status})`;
      }

      console.log('Processed error message:', userMessage);

      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Autor no encontrado' },
          { status: 404 }
        );
      }
      
      // Devolver el error específico del backend
      return NextResponse.json(
        { 
          error: userMessage,
          status: response.status
        },
        { status: response.status }
      );
    }

    console.log('Author deleted successfully');
    
    return NextResponse.json(
      { message: 'Autor eliminado exitosamente' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
