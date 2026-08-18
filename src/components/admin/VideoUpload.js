'use client';
// src/components/admin/VideoUpload.js
// Sube un video a Cloudinary (resource_type=video) y devuelve la URL.

import { useState } from 'react';
import { Loader2, AlertCircle, Video, X } from 'lucide-react';

export default function VideoUpload({ value = '', onChange, folder = 'chloe/home' }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error,    setError]    = useState('');

  async function subirACloudinary(file) {
    const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'hokyimage';

    if (!cloudName) throw new Error('Falta NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME en el .env');

    const formData = new FormData();
    formData.append('file',          file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder',        folder);

    const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      method: 'POST',
      body:   formData,
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error?.message ?? 'Error al subir video');

    return data.secure_url;
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (!file.type.startsWith('video/')) {
      setError('El archivo debe ser un video');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('El video no puede superar 100MB');
      return;
    }

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

  if (value) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#111', aspectRatio: '9/16', maxWidth: 160 }}>
          <video src={value} muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onMouseEnter={e => e.currentTarget.play()}
            onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
          />
          <button type="button" onClick={() => onChange('')} title="Quitar video"
            style={{
              position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%',
              background: '#ef4444', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <X size={12} color="#fff" />
          </button>
        </div>
        <label htmlFor={`video-upload-${folder}`} style={{ fontSize: 11, color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>
          Cambiar video
          <input id={`video-upload-${folder}`} type="file" accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileSelect} disabled={subiendo} style={{ display: 'none' }} />
        </label>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label
        htmlFor={`video-upload-${folder}`}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: 20, borderRadius: 10,
          border: `2px dashed ${subiendo ? '#111' : '#ddd'}`,
          background: subiendo ? '#f7f7f7' : '#fafafa',
          cursor: subiendo ? 'not-allowed' : 'pointer', textAlign: 'center',
        }}
      >
        <input id={`video-upload-${folder}`} type="file" accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect} disabled={subiendo} style={{ display: 'none' }} />
        {subiendo ? (
          <>
            <Loader2 size={24} style={{ color: '#111', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 12, color: '#111' }}>Subiendo video...</span>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          <>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={16} color="#888" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>Subir video</span>
            <span style={{ fontSize: 10, color: '#aaa' }}>MP4, WebM · Máx. 100MB</span>
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
