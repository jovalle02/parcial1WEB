import { useFavorites } from '@/contexts/FavoritesContext';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';
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

interface AuthorCardProps {
  author: Author;
  onDelete: (id: number, name: string) => void;
}

export default function AuthorCard({ author, onDelete }: AuthorCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const errorRef = useRef<HTMLDivElement>(null);

  const handleStarClick = () => {
    const wasAlreadyFavorite = isFavorite(author.id);
    toggleFavorite(author.id);
    
    if (wasAlreadyFavorite) {
      toast.success(`${author.name} quitado de favoritos`, {
        id: `remove-favorite-${author.id}`,
        icon: '⭐',
        duration: 3000,
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        }
      });
    } else {
      toast.success(`${author.name} agregado a favoritos`, {
        id: `add-favorite-${author.id}`,
        icon: '⭐',
        duration: 3000,
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        }
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  const handleDeleteClick = async () => {
    try {
      await onDelete(author.id, author.name);
      
      // Toast de confirmación de eliminación
      toast.success(`${author.name} eliminado correctamente`, {
        id: `delete-success-${author.id}`,
        icon: '🗑️',
        duration: 4000,
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        }
      });
    } catch (error) {      
      // Toast de error
      toast.error(`Error al eliminar a ${author.name}`, {
        id: `delete-error-${author.id}`,
        duration: 5000,
        ariaProps: {
          role: 'alert',
          'aria-live': 'assertive',
        }
      });
      
      // Focus en el mensaje de error interno también
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.focus();
        }
      }, 100);
    }
  };

  const isAuthorFavorite = isFavorite(author.id);
  const cardId = `author-card-${author.id}`;
  const descriptionId = `author-description-${author.id}`;
  const statsId = `author-stats-${author.id}`;

  return (
    <article 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow focus-within:ring-4 focus-within:ring-blue-500"
      id={cardId}
      aria-labelledby={`author-name-${author.id}`}
      aria-describedby={`${descriptionId} ${statsId}`}
    >
      {/* Imagen del autor */}
      <div className="h-64 bg-gray-200 overflow-hidden">
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
      
      {/* Información del autor */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 
            id={`author-name-${author.id}`}
            className="text-xl font-semibold text-gray-900 truncate"
          >
            {author.name}
          </h2>
          <div className="flex items-center gap-2">
            <span className="flex text-sm text-gray-500" aria-label={`Identificador ${author.id}`}>
              ID: {author.id}
            </span>
            <button 
              onClick={handleStarClick}
              onKeyDown={(e) => handleKeyDown(e, handleStarClick)}
              className="transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded p-1"
              aria-pressed={isAuthorFavorite}
              aria-label={
                isAuthorFavorite 
                  ? `Quitar ${author.name} de favoritos` 
                  : `Agregar ${author.name} a favoritos`
              }
              type="button"
            >
              <Star 
                className={`w-5 h-5 cursor-pointer transition-colors ${
                  isAuthorFavorite 
                    ? 'text-yellow-400 fill-yellow-400 hover:text-yellow-500 hover:fill-yellow-500' 
                    : 'text-gray-300 hover:text-yellow-400'
                }`} 
                aria-hidden="true"
              />
              <span className="sr-only">
                {isAuthorFavorite ? 'Marcado como favorito' : 'No marcado como favorito'}
              </span>
            </button>
          </div>
        </div>
        
        <p 
          id={descriptionId}
          className="text-gray-700 text-sm mb-4 line-clamp-3"
        >
          {author.description.length > 120 
            ? author.description.substring(0, 120) + '...'
            : author.description
          }
        </p>
        
        {/* Estadísticas */}
        <div 
          id={statsId}
          className="flex justify-between text-sm text-gray-600 mb-4"
          aria-label={`Estadísticas: ${author.books?.length || 0} libros publicados, ${author.prizes?.length || 0} premios obtenidos`}
        >
          <span>{author.books?.length || 0} libros</span>
          <span>{author.prizes?.length || 0} premios</span>
        </div>
        
        {/* Libros destacados */}
        {author.books && author.books.length > 0 && (
          <div className="mb-4" role="region" aria-label="Libros destacados">
            <p className="text-xs text-gray-500 mb-2">Libros destacados:</p>
            <div className="flex flex-wrap gap-1">
              {author.books.slice(0, 2).map((book) => (
                <span 
                  key={book.id} 
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate"
                  title={book.name}
                  aria-label={`Libro: ${book.name}`}
                >
                  {book.name.length > 18 ? book.name.substring(0, 18) + '...' : book.name}
                </span>
              ))}
              {author.books.length > 2 && (
                <span 
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  aria-label={`${author.books.length - 2} libros adicionales`}
                >
                  +{author.books.length - 2} más
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Acciones */}
        <div 
          className="flex gap-2"
          role="group"
          aria-label={`Acciones para ${author.name}`}
        >
          <Link
            href={`/authors/${author.id}`}
            className="flex-1 bg-green-500 text-white text-center py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={`Ver detalles completos de ${author.name}`}
          >
            Ver
          </Link>
          <Link
            href={`/authors/${author.id}/edit`}
            className="flex-1 bg-blue-500 text-white text-center py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Editar información de ${author.name}`}
          >
            Editar
          </Link>
          <button
            onClick={handleDeleteClick}
            className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label={`Eliminar permanentemente a ${author.name}`}
            type="button"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}