import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

interface Author {
  id: number;
  name: string;
  birthDate: string;
  description: string;
  image: string;
  books?: any[];
  prizes?: any[];
}

interface AuthorFormData {
  name: string;
  birthDate: string;
  description: string;
  image: string;
}

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    setError(message);
    console.error('Error en API:', err);
    
    // Toast de error
    toast.error(message);
  };

  const clearError = () => setError(null);

  // LISTAR todos los autores
  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/authors');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAuthors(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // CREAR nuevo autor
  const createAuthor = useCallback(async (authorData: AuthorFormData) => {
    try {
      setError(null);
      
      // Toast de carga
      const loadingToast = toast.loading('Creando autor...');
      
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorData),
      });

      if (!response.ok) {
        let errorMessage = 'No se pudo crear el autor';
        
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          console.log('Could not parse create error response');
        }
        
        toast.dismiss(loadingToast);
        throw new Error(errorMessage);
      }

      const newAuthor = await response.json();
      setAuthors(prev => [...prev, newAuthor]);
      
      // Toast de éxito
      toast.success(`Autor "${newAuthor.name}" creado exitosamente`, {
        id: loadingToast,
      });
      
      return newAuthor;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, []);

  // OBTENER un autor específico
  const getAuthor = useCallback(async (id: number) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/authors/${id}`);
      if (!response.ok) {
        let errorMessage = 'Autor no encontrado';
        
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          console.log('Could not parse get error response');
        }
        
        throw new Error(errorMessage);
      }
      
      const author = await response.json();
      return author;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, []);

  // ACTUALIZAR autor
  const updateAuthor = useCallback(async (id: number, authorData: Partial<AuthorFormData>) => {
    try {
      setError(null);
      
      // Toast de carga
      const loadingToast = toast.loading('Actualizando autor...');
      
      const response = await fetch(`/api/authors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorData),
      });

      if (!response.ok) {
        let errorMessage = 'No se pudo actualizar el autor';
        
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          console.log('Could not parse update error response');
        }
        
        toast.dismiss(loadingToast);
        throw new Error(errorMessage);
      }

      const updatedAuthor = await response.json();
      setAuthors(prev => 
        prev.map(author => 
          author.id === id ? updatedAuthor : author
        )
      );
      
      // Toast de éxito
      toast.success(`Autor "${updatedAuthor.name}" actualizado exitosamente`, {
        id: loadingToast,
      });
      
      return updatedAuthor;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, []);

  // ELIMINAR autor
  const deleteAuthor = useCallback(async (id: number) => {
    try {
      setError(null);
      
      // Obtener el nombre del autor antes de eliminarlo
      const authorToDelete = authors.find(author => author.id === id);
      const authorName = authorToDelete?.name || `ID ${id}`;
      
      // Toast de carga
      const loadingToast = toast.loading('Eliminando autor...');
      
      const response = await fetch(`/api/authors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        let errorMessage = 'No se pudo eliminar el autor';
        
        try {
          const errorData = await response.json();
          console.log('Error data from DELETE API:', errorData);
          
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          console.log('Could not parse delete error response');
        }
        
        toast.dismiss(loadingToast);
        throw new Error(errorMessage);
      }

      // Solo actualizar la lista si la eliminación fue exitosa
      setAuthors(prev => prev.filter(author => author.id !== id));
      
      // Toast de éxito
      toast.success(`Autor "${authorName}" eliminado exitosamente`, {
        id: loadingToast,
      });
      
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [authors]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  return {
    authors,
    loading,
    error,
    createAuthor,
    getAuthor,
    updateAuthor,
    deleteAuthor,
    refetch: fetchAuthors,
    clearError,
  };
}