'use client';
import { useAuthors } from '@/hooks/useAuthors';
import Link from 'next/link';
import AuthorCard from '@/components/AuthorCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const { authors, loading, error, deleteAuthor, clearError } = useAuthors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [alertMessage, setAlertMessage] = useState<string>('');
  const alertRef = useRef<HTMLDivElement>(null);
  
  const handleDelete = async (id: number, name: string) => {
    if (confirm(`¿Seguro que quieres eliminar a "${name}"?`)) {
      try {
        await deleteAuthor(id);
        setAlertMessage(`El autor "${name}" ha sido eliminado correctamente.`);
        setTimeout(() => setAlertMessage(''), 5000);
      } catch (error) {
        setAlertMessage(`Error al eliminar al autor "${name}". Inténtalo de nuevo.`);
        setTimeout(() => setAlertMessage(''), 5000);
      }
    }
  };

  // Limpiar mensajes de alerta cuando se monta el componente
  useEffect(() => {
    if (error) {
      setAlertMessage('Ha ocurrido un error al cargar los autores.');
      setTimeout(() => {
        clearError();
        setAlertMessage('');
      }, 5000);
    }
  }, [error, clearError]);

  // Focus en el mensaje de alerta cuando aparece
  useEffect(() => {
    if (alertMessage && alertRef.current) {
      alertRef.current.focus();
    }
  }, [alertMessage]);

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
          <p className="mt-2">Cargando autores favoritos...</p>
        </div>
      </div>
    );
  }

  const favoriteAuthors = authors.filter(author => isFavorite(author.id));

  return (
    <div className="container mx-auto p-4">
      {/* Mensaje de alerta accesible */}
      {alertMessage && (
        <div 
          ref={alertRef}
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
          className="mb-4 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {alertMessage}
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h1 
          className="text-3xl font-bold"
          id="page-title"
        >
          Autores Favoritos
        </h1>
        <Link 
          href="/" 
          className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 transition-colors"
          aria-label="Volver a la lista completa de autores"
        >
          ← Volver a la lista
        </Link>
      </div>

      {favoriteAuthors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            {authors.length === 0 
              ? "No hay autores registrados" 
              : "No tienes autores marcados como favoritos"
            }
          </p>
          {authors.length === 0 ? (
            <Link 
              href="/authors/new" 
              className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-3 py-2 inline-block transition-colors"
              aria-label="Crear el primer autor"
            >
              Crear el primero
            </Link>
          ) : (
            <Link 
              href="/" 
              className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-3 py-2 inline-block transition-colors"
              aria-label="Ver todos los autores para marcar favoritos"
            >
              Ver todos los autores
            </Link>
          )}
        </div>
      ) : (
        <div>
          
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="region"
            aria-labelledby="page-title"
            aria-describedby="authors-count"
          >
            {favoriteAuthors.map((author, index) => (
              <AuthorCard
                key={author.id} 
                author={author} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}