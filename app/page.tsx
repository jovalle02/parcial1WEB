'use client';

import { useAuthors } from '@/hooks/useAuthors';
import Link from 'next/link';
import AuthorCard from '@/components/AuthorCard';

export default function HomePage() {
  const { authors, loading, error, deleteAuthor, clearError } = useAuthors();

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`¿Seguro que quieres eliminar a "${name}"?`)) {
      await deleteAuthor(id);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Cargando autores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Autores</h1>
        <div className='flex gap-2'>
            <Link 
              href="/authors/new" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Nuevo Autor
            </Link>
            <Link 
              href="/favoritos" 
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Favoritos
            </Link>
        </div>
      </div>

      {authors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay autores registrados</p>
          <Link 
            href="/authors/new" 
            className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
          >
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <AuthorCard
            key={author.id} 
            author={author} 
            onDelete={handleDelete} 
          />
        ))}
        </div>
      )}
    </div>
  );
}