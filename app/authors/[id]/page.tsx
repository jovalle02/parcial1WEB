// app/authors/[id]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
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
  const errorRef = useRef<HTMLDivElement>(null);

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
        toast.error(errorMessage, {
          duration: 5000,
          ariaProps: {
            role: 'alert',
            'aria-live': 'assertive',
          }
        });
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      loadAuthor();
    }
  }, [authorId, getAuthor]);

  // Focus en mensaje de error cuando aparece
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

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
        <div className="text-center py-8" role="status" aria-live="polite">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"
            aria-hidden="true"
          ></div>
          <p className="mt-2">Cargando información del autor...</p>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <div 
            ref={errorRef}
            role="alert"
            aria-live="assertive"
            tabIndex={-1}
            className="text-red-500 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-2"
          >
            {error || 'Autor no encontrado'}
          </div>
          <Link 
            href="/" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="Volver a la lista de autores"
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
      <header className="mb-6">
        <nav aria-label="Navegación">
          <Link 
            href="/" 
            className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 mb-4 inline-block transition-colors"
            aria-label="Volver a la lista de autores"
          >
            ← Volver a la lista
          </Link>
        </nav>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 
            className="text-3xl font-bold"
            id="author-name"
          >
            {author.name}
          </h1>
          <div 
            className="flex gap-2"
            role="group"
            aria-label={`Acciones para ${author.name}`}
          >
            <Link
              href={`/authors/${author.id}/edit`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label={`Editar información de ${author.name}`}
            >
              Editar
            </Link>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <main className="lg:col-span-2">
          {/* Información básica */}
          <section 
            className="bg-white rounded-lg shadow-md p-6 mb-6"
            aria-labelledby="personal-info-title"
          >
            <h2 
              id="personal-info-title"
              className="text-xl font-semibold mb-4"
            >
              Información Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-600">ID del Autor</dt>
                <dd className="font-medium">{author.id}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Fecha de Nacimiento</dt>
                <dd 
                  className="font-medium"
                  aria-label={`Nacido el ${formatDate(author.birthDate)}`}
                >
                  {formatDate(author.birthDate)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Libros Publicados</dt>
                <dd 
                  className="font-medium"
                  aria-label={`Ha publicado ${author.books?.length || 0} libros`}
                >
                  {author.books?.length || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Premios Recibidos</dt>
                <dd 
                  className="font-medium"
                  aria-label={`Ha recibido ${author.prizes?.length || 0} premios`}
                >
                  {author.prizes?.length || 0}
                </dd>
              </div>
            </div>
            <div className="mt-4">
              <dt className="text-sm text-gray-600 mb-2">Biografía</dt>
              <dd 
                className="text-gray-900 leading-relaxed"
                id="author-biography"
              >
                {author.description}
              </dd>
            </div>
          </section>

          {/* Libros */}
          {author.books && author.books.length > 0 && (
            <section 
              className="bg-white rounded-lg shadow-md p-6 mb-6"
              aria-labelledby="books-title"
              aria-describedby="books-description"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 
                  id="books-title"
                  className="text-xl font-semibold"
                >
                  Obras Publicadas ({author.books.length})
                </h2>
                <div 
                  id="books-description"
                  className="text-sm text-gray-500"
                  aria-label="Esta sección muestra información de solo lectura de los libros"
                >
                  Solo lectura
                </div>
              </div>
              
              <div className="space-y-4" role="list" aria-label="Lista de libros publicados">
                {author.books.map((book, index) => (
                  <article 
                    key={book.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-blue-500"
                    role="listitem"
                    aria-labelledby={`book-title-${book.id}`}
                    aria-describedby={`book-details-${book.id}`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={book.image || '/placeholder-book.jpg'}
                          alt={`Portada del libro ${book.name}`}
                          className="w-16 h-20 object-contain bg-gray-100 rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-book.jpg';
                            target.alt = `Portada no disponible para ${book.name}`;
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 
                          id={`book-title-${book.id}`}
                          className="font-medium text-gray-900 mb-2"
                        >
                          {book.name}
                        </h3>
                        <dl 
                          id={`book-details-${book.id}`}
                          className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2"
                        >
                          <div>
                            <dt className="inline font-medium">ISBN: </dt>
                            <dd className="inline">{book.isbn}</dd>
                          </div>
                          <div>
                            <dt className="inline font-medium">Editorial: </dt>
                            <dd className="inline">{book.editorial.name}</dd>
                          </div>
                          <div>
                            <dt className="inline font-medium">Publicado: </dt>
                            <dd className="inline">{formatDate(book.publishingDate)}</dd>
                          </div>
                          <div>
                            <dt className="inline font-medium">ID: </dt>
                            <dd className="inline">{book.id}</dd>
                          </div>
                        </dl>
                        <p className="text-sm text-gray-700">{book.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Premios y Reconocimientos */}
          {author.prizes && author.prizes.length > 0 && (
            <section 
              className="bg-white rounded-lg shadow-md p-6"
              aria-labelledby="prizes-title"
            >
              <h2 
                id="prizes-title"
                className="text-xl font-semibold mb-4"
              >
                Premios y Reconocimientos ({author.prizes.length})
              </h2>
              <div className="space-y-4" role="list" aria-label="Lista de premios y reconocimientos">
                {author.prizes.map((prize, index) => (
                  <article 
                    key={prize.id} 
                    className="border-l-4 border-yellow-500 pl-4 py-2 focus-within:ring-2 focus-within:ring-yellow-500 rounded-r"
                    role="listitem"
                    aria-labelledby={`prize-name-${prize.id}`}
                    aria-describedby={`prize-details-${prize.id}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        id={`prize-name-${prize.id}`}
                        className="font-medium text-lg"
                      >
                        {prize.name}
                      </h3>
                      <span 
                        className="text-sm text-gray-500"
                        aria-label={`Identificador del premio: ${prize.id}`}
                      >
                        ID: {prize.id}
                      </span>
                    </div>
                    <dl 
                      id={`prize-details-${prize.id}`}
                      className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2"
                    >
                      <div>
                        <dt className="inline font-medium">Organización: </dt>
                        <dd className="inline">{prize.organization.name}</dd>
                      </div>
                      <div>
                        <dt className="inline font-medium">Tipo: </dt>
                        <dd className="inline">{prize.organization.tipo}</dd>
                      </div>
                      <div>
                        <dt className="inline font-medium">Fecha: </dt>
                        <dd className="inline">{formatDate(prize.premiationDate)}</dd>
                      </div>
                    </dl>
                    <p className="text-sm text-gray-700">{prize.description}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="space-y-6" aria-label="Información complementaria">
          {/* Imagen del autor */}
          <section 
            className="bg-white rounded-lg shadow-md p-6"
            aria-labelledby="author-photo-title"
          >
            <h2 
              id="author-photo-title"
              className="sr-only"
            >
              Fotografía del autor
            </h2>
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                src={author.image || '/placeholder-author.jpg'}
                alt={`Fotografía de ${author.name}`}
                className="w-full h-full object-contain bg-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-author.jpg';
                  target.alt = `Imagen no disponible para ${author.name}`;
                }}
              />
            </div>
            <p className="text-center text-sm text-gray-500">
              Foto del autor
            </p>
          </section>

          {/* Estadísticas rápidas */}
          <section 
            className="bg-white rounded-lg shadow-md p-6"
            aria-labelledby="stats-title"
          >
            <h2 
              id="stats-title"
              className="text-lg font-semibold mb-4"
            >
              Estadísticas
            </h2>
            <dl className="space-y-3">
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Libros publicados</dt>
                <dd 
                  className="font-medium text-lg"
                  aria-label={`${author.books?.length || 0} libros publicados`}
                >
                  {author.books?.length || 0}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Premios recibidos</dt>
                <dd 
                  className="font-medium text-lg"
                  aria-label={`${author.prizes?.length || 0} premios recibidos`}
                >
                  {author.prizes?.length || 0}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}