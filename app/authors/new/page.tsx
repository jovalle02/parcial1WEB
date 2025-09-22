'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthors } from '@/hooks/useAuthors';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NewAuthorPage() {
  const router = useRouter();
  const { createAuthor } = useAuthors();
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    description: '',
    image: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const errorRef = useRef<HTMLDivElement>(null);
  
  const nameRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones con errores específicos por campo
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.birthDate) {
      errors.birthDate = 'La fecha de nacimiento es obligatoria';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      if (birthDate >= today) {
        errors.birthDate = 'La fecha de nacimiento debe ser anterior a hoy';
      }
    }
    
    if (!formData.description.trim()) {
      errors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'La descripción debe tener al menos 10 caracteres';
    }
    
    if (formData.image && !isValidURL(formData.image)) {
      errors.image = 'La URL de la imagen no es válida';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('Por favor, corrige los errores en el formulario');
      
      // Focus en el primer campo con error en el orden del formulario
      setTimeout(() => {
        if (errors.name && nameRef.current) {
          nameRef.current.focus();
        } else if (errors.birthDate && birthDateRef.current) {
          birthDateRef.current.focus();
        } else if (errors.image && imageRef.current) {
          imageRef.current.focus();
        } else if (errors.description && descriptionRef.current) {
          descriptionRef.current.focus();
        } else if (errorRef.current) {
          errorRef.current.focus();
        }
      }, 100);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await createAuthor({
        name: formData.name.trim(),
        birthDate: formData.birthDate,
        description: formData.description.trim(),
        image: formData.image.trim() || ''
      });
      
      router.push('/');
    } catch (err) {
      const errorMessage = 'Error al crear el autor';
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

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Focus en mensaje de error general
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const isValidURL = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <h1 
          className="text-2xl font-bold mb-2"
          id="page-title"
        >
          Nuevo Autor
        </h1>
        <Link 
          href="/" 
          className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
          aria-label="Volver a la lista de autores"
        >
          ← Volver a la lista
        </Link>
      </div>

      {error && (
        <div 
          ref={errorRef}
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <form 
          onSubmit={handleSubmit}
          aria-labelledby="page-title"
          noValidate
        >
          <fieldset disabled={loading} className="space-y-4">
            <legend className="sr-only">Información del nuevo autor</legend>
            
            {/* Campo Nombre */}
            <div>
              <label 
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                ref={nameRef}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Nombre completo del autor"
                required
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : "name-help"}
                disabled={loading}
              />
              <div id="name-help" className="text-xs text-gray-500 mt-1">
                Ingresa el nombre completo del autor
              </div>
              {fieldErrors.name && (
                <div 
                  id="name-error"
                  role="alert"
                  aria-live="polite"
                  className="text-red-600 text-sm mt-1"
                >
                  {fieldErrors.name}
                </div>
              )}
            </div>

            {/* Campo Fecha de Nacimiento */}
            <div>
              <label 
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fecha de Nacimiento *
              </label>
              <input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange('birthDate')}
                ref={birthDateRef}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.birthDate 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
                aria-invalid={!!fieldErrors.birthDate}
                aria-describedby={fieldErrors.birthDate ? "birthDate-error" : "birthDate-help"}
                disabled={loading}
                max={new Date().toISOString().split('T')[0]}
              />
              <div id="birthDate-help" className="text-xs text-gray-500 mt-1">
                Fecha en la que nació el autor
              </div>
              {fieldErrors.birthDate && (
                <div 
                  id="birthDate-error"
                  role="alert"
                  aria-live="polite"
                  className="text-red-600 text-sm mt-1"
                >
                  {fieldErrors.birthDate}
                </div>
              )}
            </div>

            {/* Campo URL Imagen */}
            <div>
              <label 
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                URL de la Imagen
              </label>
              <input
                id="image"
                type="url"
                value={formData.image}
                onChange={handleInputChange('image')}
                ref={imageRef}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.image 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="https://ejemplo.com/imagen.jpg"
                aria-invalid={!!fieldErrors.image}
                aria-describedby={fieldErrors.image ? "image-error" : "image-help"}
                disabled={loading}
              />
              <div id="image-help" className="text-xs text-gray-500 mt-1">
                URL de la imagen del autor (opcional)
              </div>
              {fieldErrors.image && (
                <div 
                  id="image-error"
                  role="alert"
                  aria-live="polite"
                  className="text-red-600 text-sm mt-1"
                >
                  {fieldErrors.image}
                </div>
              )}
            </div>

            {/* Campo Descripción */}
            <div>
              <label 
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descripción *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange('description')}
                ref={descriptionRef}
                rows={4}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.description 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Biografía y descripción del autor..."
                required
                aria-invalid={!!fieldErrors.description}
                aria-describedby={fieldErrors.description ? "description-error" : "description-help"}
                disabled={loading}
                maxLength={1000}
              />
              <div id="description-help" className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>Biografía y descripción del autor</span>
                <span>{formData.description.length}/1000</span>
              </div>
              {fieldErrors.description && (
                <div 
                  id="description-error"
                  role="alert"
                  aria-live="polite"
                  className="text-red-600 text-sm mt-1"
                >
                  {fieldErrors.description}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div 
              className="flex gap-3 pt-4"
              role="group"
              aria-label="Acciones del formulario"
            >
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={loading ? 'Creando autor, por favor espera' : 'Crear nuevo autor'}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span 
                      className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" 
                      aria-hidden="true"
                    ></span>
                    Creando...
                  </span>
                ) : (
                  'Crear Autor'
                )}
              </button>
              
              <Link
                href="/"
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center transition-colors"
                aria-label="Cancelar creación y volver a la lista"
              >
                Cancelar
              </Link>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}