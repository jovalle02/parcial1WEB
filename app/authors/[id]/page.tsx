// app/authors/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuthors } from '@/hooks/useAuthors';
import Link from 'next/link';
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

export default function AuthorDetailPage() {
  const params = useParams();
  const { getAuthor, deleteAuthor } = useAuthors();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authorId = Number(params.id);

  useEffect(() => {
    const loadAuthor = async () => {
      try {
        setLoading(true);
        setError('');
        const authorData = await getAuthor(authorId);
        setAuthor(authorData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el autor';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      loadAuthor();
    }
  }, [authorId, getAuthor]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Cargando autor...</p>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error || 'Autor no encontrado'}</p>
          <Link 
            href="/" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ← Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
          ← Volver a la lista
        </Link>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-3xl font-bold">{author.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ID</p>
                <p className="font-medium">{author.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                <p className="font-medium">{formatDate(author.birthDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Libros Publicados</p>
                <p className="font-medium">{author.books?.length || 0}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Biografía</p>
              <p className="mt-1 text-gray-900 leading-relaxed">{author.description}</p>
            </div>
          </div>

          {/* Libros */}
          {author.books && author.books.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Obras Publicadas ({author.books.length})</h2>
                <div className="text-sm text-gray-500">
                  Solo lectura
                </div>
              </div>
              
              <div className="space-y-4">
                {author.books.map((book) => (
                  <div key={book.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={book.image || '/placeholder-book.jpg'}
                          alt={book.name}
                          className="w-16 h-20 object-contain bg-gray-100 rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-book.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{book.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                          <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
                          <p><span className="font-medium">Editorial:</span> {book.editorial.name}</p>
                          <p><span className="font-medium">Publicado:</span> {formatDate(book.publishingDate)}</p>
                          <p><span className="font-medium">ID:</span> {book.id}</p>
                        </div>
                        <p className="text-sm text-gray-700">{book.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Premios y Reconocimientos */}
          {author.prizes && author.prizes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Premios y Reconocimientos ({author.prizes.length})</h2>
              <div className="space-y-4">
                {author.prizes.map((prize) => (
                  <div key={prize.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">{prize.name}</h3>
                      <span className="text-sm text-gray-500">ID: {prize.id}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                      <p><span className="font-medium">Organización:</span> {prize.organization.name}</p>
                      <p><span className="font-medium">Tipo:</span> {prize.organization.tipo}</p>
                      <p><span className="font-medium">Fecha:</span> {formatDate(prize.premiationDate)}</p>
                    </div>
                    <p className="text-sm text-gray-700">{prize.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje si no hay libros ni premios */}
          {(!author.books || author.books.length === 0) && (!author.prizes || author.prizes.length === 0) && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500 mb-4">
                Este autor aún no tiene libros publicados ni premios registrados.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/books/new"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Agregar Libro
                </Link>
                <Link
                  href="/prizes/new"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  Agregar Premio
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Imagen del autor */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                src={author.image || '/placeholder-author.jpg'}
                alt={author.name}
                className="w-full h-full object-contain bg-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-author.jpg';
                }}
              />
            </div>
            <p className="text-center text-sm text-gray-500">
              Foto del autor
            </p>
          </div>

          {/* Estadísticas rápidas */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Libros publicados</span>
                <span className="font-medium text-lg">{author.books?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Premios recibidos</span>
                <span className="font-medium text-lg">{author.prizes?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}