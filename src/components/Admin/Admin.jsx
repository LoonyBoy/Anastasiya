import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import heic2any from 'heic2any';
import { useSiteData } from '../../context/SiteDataContext';
import './Admin.css';

/* ── Compress any image blob via canvas ── */
const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.75;

function compressImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Не удалось загрузить изображение'));
    };
    img.src = url;
  });
}

function AdminField({ label, value, onChange, type = 'text', rows }) {
  if (type === 'textarea') {
    return (
      <div className="admin__field">
        <label className="admin__field-label">{label}</label>
        <textarea
          className="admin__field-input admin__field-textarea"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows || 3}
        />
      </div>
    );
  }
  return (
    <div className="admin__field">
      <label className="admin__field-label">{label}</label>
      <input
        className="admin__field-input"
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* Reusable image field: URL input + file upload + preview + delete */
function AdminImageField({ label = 'Изображение', value, onChange }) {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      let blob = file;

      // Convert HEIC/HEIF to JPEG first
      const name = file.name.toLowerCase();
      const isHeic = name.endsWith('.heic') || name.endsWith('.heif')
        || file.type === 'image/heic' || file.type === 'image/heif';

      if (isHeic) {
        try {
          const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
          blob = Array.isArray(converted) ? converted[0] : converted;
        } catch (err) {
          setError('Не удалось сконвертировать HEIC. Попробуйте сначала сохранить фото как JPEG.');
          setLoading(false);
          e.target.value = '';
          return;
        }
      }

      // Compress & resize via canvas
      const dataUrl = await compressImage(blob);
      onChange(dataUrl);
    } catch (err) {
      console.error('Image processing error:', err);
      setError('Ошибка обработки изображения');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  }, [onChange]);

  return (
    <div className="admin__image-field">
      <label className="admin__field-label">{label}</label>
      <div className="admin__image-controls">
        <input
          className="admin__field-input admin__image-url"
          type="text"
          placeholder="/photo/example.jpg или https://..."
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="admin__btn-sm admin__btn--upload"
          disabled={loading}
          onClick={() => fileRef.current?.click()}
        >
          {loading ? '⏳…' : '📁 Файл'}
        </button>
        {value && (
          <button
            type="button"
            className="admin__btn-sm admin__btn--danger"
            onClick={() => onChange('')}
          >
            ✕
          </button>
        )}
      </div>
      {error && <p className="admin__image-error">{error}</p>}
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.heic,.heif,.avif,.webp,.svg,.raw,.cr2,.nef,.arw,.dng,.tiff,.tif,.bmp,.ico,.gif,.png,.jpg,.jpeg"
        className="admin__image-file-input"
        onChange={handleFile}
      />
      {value && (
        <img src={value} alt="" className="admin__card-preview" />
      )}
    </div>
  );
}

function AdminSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="admin__section">
      <button className="admin__section-header" onClick={() => setOpen(!open)}>
        <h3>{title}</h3>
        <span className={`admin__section-arrow ${open ? 'open' : ''}`}>▼</span>
      </button>
      {open && <div className="admin__section-body">{children}</div>}
    </div>
  );
}

export default function Admin() {
  const { data, updateSection, resetData } = useSiteData();
  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // --- Hero ---
  const updateHero = (field, value) => {
    updateSection('hero', { ...data.hero, [field]: value });
  };

  // --- About ---
  const updateAbout = (field, value) => {
    updateSection('about', { ...data.about, [field]: value });
  };
  const updateAboutStat = (index, field, value) => {
    const stats = [...data.about.stats];
    stats[index] = { ...stats[index], [field]: value };
    updateSection('about', { ...data.about, stats });
  };

  // --- Experience ---
  const updateExpItem = (index, field, value) => {
    const items = [...data.experience.items];
    items[index] = { ...items[index], [field]: value };
    updateSection('experience', { ...data.experience, items });
  };
  const addExpItem = () => {
    const items = [
      ...data.experience.items,
      {
        id: Date.now(),
        period: '',
        position: 'Новая должность',
        company: '',
        description: '',
      },
    ];
    updateSection('experience', { ...data.experience, items });
  };
  const removeExpItem = (index) => {
    const items = data.experience.items.filter((_, i) => i !== index);
    updateSection('experience', { ...data.experience, items });
  };

  // --- Education ---
  const updateEduItem = (index, field, value) => {
    const items = [...data.education.items];
    items[index] = { ...items[index], [field]: value };
    updateSection('education', { ...data.education, items });
  };
  const addEduItem = () => {
    const items = [
      ...data.education.items,
      {
        id: Date.now(),
        year: new Date().getFullYear().toString(),
        title: 'Новый сертификат',
        institution: '',
        description: '',
      },
    ];
    updateSection('education', { ...data.education, items });
  };
  const removeEduItem = (index) => {
    const items = data.education.items.filter((_, i) => i !== index);
    updateSection('education', { ...data.education, items });
  };

  // --- Services ---
  const updateServiceItem = (index, field, value) => {
    const items = [...data.services.items];
    items[index] = { ...items[index], [field]: value };
    updateSection('services', { ...data.services, items });
  };
  const addServiceItem = () => {
    const items = [
      ...data.services.items,
      {
        id: Date.now(),
        name: 'Новая услуга',
        price: '0 ₽',
        duration: '30 мин',
        description: '',
        image: '',
      },
    ];
    updateSection('services', { ...data.services, items });
  };
  const removeServiceItem = (index) => {
    const items = data.services.items.filter((_, i) => i !== index);
    updateSection('services', { ...data.services, items });
  };

  // --- Works ---
  const updateWorkItem = (index, field, value) => {
    const items = [...data.works.items];
    items[index] = { ...items[index], [field]: value };
    updateSection('works', { ...data.works, items });
  };
  const addWorkItem = () => {
    const items = [
      ...data.works.items,
      {
        id: Date.now(),
        image: '',
        title: 'Новая работа',
        category: 'Стрижка',
      },
    ];
    updateSection('works', { ...data.works, items });
  };
  const removeWorkItem = (index) => {
    const items = data.works.items.filter((_, i) => i !== index);
    updateSection('works', { ...data.works, items });
  };

  // --- Contact ---
  const updateContact = (field, value) => {
    updateSection('contact', { ...data.contact, [field]: value });
  };

  return (
    <div className="admin">
      <div className="admin__header">
        <div className="admin__header-left">
          <Link to="/" className="admin__back">← На сайт</Link>
          <h1 className="admin__title">Админ-панель</h1>
        </div>
        <div className="admin__header-actions">
          <button className="admin__btn admin__btn--danger" onClick={resetData}>
            Сбросить
          </button>
          <button className="admin__btn admin__btn--primary" onClick={showSaved}>
            Сохранено ✓
          </button>
        </div>
      </div>

      {saved && <div className="admin__toast">Все изменения сохранены автоматически!</div>}

      <div className="admin__body">
        {/* Hero */}
        <AdminSection title="Главный экран" defaultOpen>
          <AdminField label="Имя" value={data.hero.name} onChange={(v) => updateHero('name', v)} />
          <AdminField label="Должность" value={data.hero.title} onChange={(v) => updateHero('title', v)} />
          <AdminField label="Подзаголовок" value={data.hero.subtitle} onChange={(v) => updateHero('subtitle', v)} />
          <AdminField label="Год" value={data.hero.year} onChange={(v) => updateHero('year', v)} />
          <AdminImageField label="Фото" value={data.hero.image} onChange={(v) => updateHero('image', v)} />
        </AdminSection>

        {/* About */}
        <AdminSection title="Обо мне">
          <AdminField label="Заголовок" value={data.about.heading} onChange={(v) => updateAbout('heading', v)} />
          <AdminField label="Текст" value={data.about.text} onChange={(v) => updateAbout('text', v)} type="textarea" rows={5} />
          <AdminImageField label="Изображение" value={data.about.image} onChange={(v) => updateAbout('image', v)} />
          <h4 className="admin__sub-heading">Статистика</h4>
          {data.about.stats.map((stat, i) => (
            <div className="admin__inline-group" key={i}>
              <AdminField label="Значение" value={stat.value} onChange={(v) => updateAboutStat(i, 'value', v)} />
              <AdminField label="Подпись" value={stat.label} onChange={(v) => updateAboutStat(i, 'label', v)} />
            </div>
          ))}
        </AdminSection>

        {/* Experience */}
        <AdminSection title="Опыт работы">
          <AdminField
            label="Заголовок раздела"
            value={data.experience.heading}
            onChange={(v) => updateSection('experience', { ...data.experience, heading: v })}
          />
          {data.experience.items.map((item, i) => (
            <div className="admin__card" key={item.id}>
              <div className="admin__card-header">
                <span>#{i + 1}</span>
                <button className="admin__btn-sm admin__btn--danger" onClick={() => removeExpItem(i)}>Удалить</button>
              </div>
              <AdminField label="Период" value={item.period} onChange={(v) => updateExpItem(i, 'period', v)} />
              <AdminField label="Должность" value={item.position} onChange={(v) => updateExpItem(i, 'position', v)} />
              <AdminField label="Компания" value={item.company} onChange={(v) => updateExpItem(i, 'company', v)} />
              <AdminField label="Описание" value={item.description} onChange={(v) => updateExpItem(i, 'description', v)} type="textarea" />
            </div>
          ))}
          <button className="admin__btn admin__btn--add" onClick={addExpItem}>+ Добавить</button>
        </AdminSection>

        {/* Education */}
        <AdminSection title="Обучение и сертификаты">
          <AdminField
            label="Заголовок раздела"
            value={data.education.heading}
            onChange={(v) => updateSection('education', { ...data.education, heading: v })}
          />
          {data.education.items.map((item, i) => (
            <div className="admin__card" key={item.id}>
              <div className="admin__card-header">
                <span>#{i + 1}</span>
                <button className="admin__btn-sm admin__btn--danger" onClick={() => removeEduItem(i)}>Удалить</button>
              </div>
              <AdminField label="Год" value={item.year} onChange={(v) => updateEduItem(i, 'year', v)} />
              <AdminField label="Название" value={item.title} onChange={(v) => updateEduItem(i, 'title', v)} />
              <AdminField label="Учреждение" value={item.institution} onChange={(v) => updateEduItem(i, 'institution', v)} />
              <AdminField label="Описание" value={item.description} onChange={(v) => updateEduItem(i, 'description', v)} type="textarea" />
            </div>
          ))}
          <button className="admin__btn admin__btn--add" onClick={addEduItem}>+ Добавить</button>
        </AdminSection>

        {/* Services */}
        <AdminSection title="Услуги">
          <AdminField
            label="Заголовок раздела"
            value={data.services.heading}
            onChange={(v) => updateSection('services', { ...data.services, heading: v })}
          />
          {data.services.items.map((item, i) => (
            <div className="admin__card" key={item.id}>
              <div className="admin__card-header">
                <span>#{i + 1}</span>
                <button className="admin__btn-sm admin__btn--danger" onClick={() => removeServiceItem(i)}>Удалить</button>
              </div>
              <AdminField label="Название" value={item.name} onChange={(v) => updateServiceItem(i, 'name', v)} />
              <AdminImageField label="Изображение" value={item.image} onChange={(v) => updateServiceItem(i, 'image', v)} />
              <div className="admin__inline-group">
                <AdminField label="Цена" value={item.price} onChange={(v) => updateServiceItem(i, 'price', v)} />
                <AdminField label="Длительность" value={item.duration} onChange={(v) => updateServiceItem(i, 'duration', v)} />
              </div>
              <AdminField label="Описание" value={item.description} onChange={(v) => updateServiceItem(i, 'description', v)} type="textarea" />
            </div>
          ))}
          <button className="admin__btn admin__btn--add" onClick={addServiceItem}>+ Добавить</button>
        </AdminSection>

        {/* Works */}
        <AdminSection title="Галерея работ">
          <AdminField
            label="Заголовок раздела"
            value={data.works.heading}
            onChange={(v) => updateSection('works', { ...data.works, heading: v })}
          />
          {data.works.items.map((item, i) => (
            <div className="admin__card" key={item.id}>
              <div className="admin__card-header">
                <span>#{i + 1}</span>
                <button className="admin__btn-sm admin__btn--danger" onClick={() => removeWorkItem(i)}>Удалить</button>
              </div>
              <AdminImageField label="Изображение" value={item.image} onChange={(v) => updateWorkItem(i, 'image', v)} />
              <div className="admin__inline-group">
                <AdminField label="Название" value={item.title} onChange={(v) => updateWorkItem(i, 'title', v)} />
                <AdminField label="Категория" value={item.category} onChange={(v) => updateWorkItem(i, 'category', v)} />
              </div>
            </div>
          ))}
          <button className="admin__btn admin__btn--add" onClick={addWorkItem}>+ Добавить</button>
        </AdminSection>

        {/* Contact */}
        <AdminSection title="Контакты">
          <AdminField label="Заголовок" value={data.contact.heading} onChange={(v) => updateContact('heading', v)} />
          <AdminField label="Подзаголовок" value={data.contact.subtitle} onChange={(v) => updateContact('subtitle', v)} />
          <AdminField label="Email" value={data.contact.email} onChange={(v) => updateContact('email', v)} />
          <AdminField label="Телефон" value={data.contact.phone} onChange={(v) => updateContact('phone', v)} />
          <AdminField label="Telegram" value={data.contact.telegram} onChange={(v) => updateContact('telegram', v)} />
          <AdminField label="Instagram" value={data.contact.instagram} onChange={(v) => updateContact('instagram', v)} />
          <AdminField label="Адрес" value={data.contact.address} onChange={(v) => updateContact('address', v)} />
          <AdminField label="Часы работы" value={data.contact.workingHours} onChange={(v) => updateContact('workingHours', v)} />
        </AdminSection>
      </div>
    </div>
  );
}
