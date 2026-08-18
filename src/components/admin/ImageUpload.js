'use client';
// src/components/admin/ImageUpload.js
// Sube una sola imagen a Cloudinary y devuelve la URL. Pensado para
// campos de contenido (hero, colecciones, etc.), no para galerías de producto.

import { useState } from 'react';
import { Loader2, AlertCircle, Image as ImageIcon, X } from 'lucide-react';

export default function ImageUpload({ value = '', onChange, folder = 'chloe/contenido', aspectRatio = '3/4' }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error,    setError]    = useState('');

  async function subirACloudinary(file) {
    const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'chloeimage';

    if (!cloudName) throw new Error('Falta NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME en el .env');

    const formData = new FormData();
    formData.append('file',          file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder',        folder);

    const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body:   formData,
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error?.message ?? 'Error al subir imagen');

    return data.secure_url;
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (!file.type.startsWith('image/')) { setError('El archivo debe ser una imagen'); return; }
    if (file.size > 50 * 1024 * 1024)     { setError('La imagen no puede superar 50MB'); return; }

    setSubiendo(true);
    setError('');

    try {
      const url = await subirACloudinary(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
    }
  }

  const inputId = `img-upload-${folder}-${Math.random().toString(36).slice(2, 8)}`;

  if (value) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#eee', aspectRatio, maxWidth: 160 }}>
          <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button type="button" onClick={() => onChange('')} title="Quitar imagen"
            style={{
              position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%',
              background: '#ef4444', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <X size={12} color="#fff" />
          </button>
        </div>
        <label htmlFor={inputId} style={{ fontSize: 11, color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>
          Cambiar imagen
          <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect} disabled={subiendo} style={{ display: 'none' }} />
        </label>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label
        htmlFor={inputId}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: 20, borderRadius: 10,
          border: `2px dashed ${subiendo ? '#111' : '#ddd'}`,
          background: subiendo ? '#f7f7f7' : '#fafafa',
          cursor: subiendo ? 'not-allowed' : 'pointer', textAlign: 'center',
        }}
      >
        <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect} disabled={subiendo} style={{ display: 'none' }} />
        {subiendo ? (
          <>
            <Loader2 size={24} style={{ color: '#111', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 12, color: '#111' }}>Subiendo...</span>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          <>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon size={16} color="#888" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>Subir imagen</span>
            <span style={{ fontSize: 10, color: '#aaa' }}>PNG, JPG, WebP · Máx. 50MB</span>
          </>
        )}
      </label>
      {error && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 10px' }}>
          <AlertCircle size={12} color="#ef4444" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 11, color: '#dc2626', margin: 0 }}>{error}</p>
        </div>
      )}
    </div>
  );
}
