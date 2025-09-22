'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthors } from '@/hooks/useAuthors';
import Link from 'next/link';

export default function EditAuthorPage() {
  const router = useRouter();
  const params = useParams();
  const { getAuthor, updateAuthor } = useAuthors();
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    description: '',
    image: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingAuthor, setLoadingAuthor] = useState(true);
  const [error, setError] = useState('');

  const authorId = Number(params.id);

  // Cargar datos del autor
  useEffect(() => {
    const loadAuthor = async () => {
      try {
        setLoadingAuthor(true);
        const author = await getAuthor(authorId);
        
        setFormData({
          name: author.name || '',
          birthDate: author.birthDate ? author.birthDate.split('T')[0] : '', // Solo la fecha, sin hora
          description: author.description || '',
          image: author.image || ''
        });
      } catch (err) {
        setError('Error al cargar el autor');
      } finally {
        setLoadingAuthor(false);
      }
    };

    if (authorId) {
      loadAuthor();
    }
  }, [authorId, getAuthor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.birthDate || !formData.description.trim()) {
      setError('Los campos nombre, fecha de nacimiento y descripción son obligatorios');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await updateAuthor(authorId, {
        name: formData.name.trim(),
        birthDate: formData.birthDate,
        description: formData.description.trim(),
        image: formData.image.trim() || ''
      });
      
      router.push('/');
    } catch (err) {
      setError('Error al actualizar el autor');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  if (loadingAuthor) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Cargando autor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Editar Autor</h1>
        <Link 
          href="/" 
          className="text-blue-500 hover:text-blue-700"
        >
          ← Volver a la lista
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre completo del autor"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Nacimiento *
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange('birthDate')}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de la Imagen
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={handleInputChange('image')}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/imagen.jpg"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              URL de la imagen del autor (opcional)
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={handleInputChange('description')}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Biografía y descripción del autor..."
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
            
            <Link
              href="/"
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}