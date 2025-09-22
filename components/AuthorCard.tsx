import Link from 'next/link';

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagen del autor */}
      <div className="h-64 bg-gray-200 overflow-hidden">
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
      
      {/* Información del autor */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-900 truncate">
            {author.name}
          </h2>
          <span className="text-sm text-gray-500">
            ID: {author.id}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">
          Nacido: {formatDate(author.birthDate)}
        </p>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {author.description.length > 120 
            ? author.description.substring(0, 120) + '...'
            : author.description
          }
        </p>
        
        {/* Estadísticas */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>{author.books?.length || 0} libros</span>
          <span>{author.prizes?.length || 0} premios</span>
        </div>
        
        {/* Libros destacados */}
        {author.books && author.books.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Libros destacados:</p>
            <div className="flex flex-wrap gap-1">
              {author.books.slice(0, 2).map((book) => (
                <span 
                  key={book.id} 
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate"
                  title={book.name}
                >
                  {book.name.length > 18 ? book.name.substring(0, 18) + '...' : book.name}
                </span>
              ))}
              {author.books.length > 2 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  +{author.books.length - 2} más
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Acciones */}
        <div className="flex gap-2">
          <Link
            href={`/authors/${author.id}`}
            className="flex-1 bg-green-500 text-white text-center py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors"
          >
            Ver
          </Link>
          <Link
            href={`/authors/${author.id}/edit`}
            className="flex-1 bg-blue-500 text-white text-center py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Editar
          </Link>
          <button
            onClick={() => onDelete(author.id, author.name)}
            className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}