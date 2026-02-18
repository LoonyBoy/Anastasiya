import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'anastasiya_portfolio_data';

const defaultData = {
  hero: {
    name: 'Анастасия Черенкова',
    title: 'Барбер / Стилист',
    subtitle: 'Искусство стрижки и стиля',
    year: '2025',
    image: '/photo/DSC05530.jpg',
  },
  about: {
    heading: 'Обо мне',
    text: 'Профессиональный барбер с многолетним опытом работы. Специализируюсь на мужских стрижках, оформлении бороды и создании индивидуального стиля для каждого клиента. Мой подход — сочетание классических техник и современных трендов, внимание к деталям и комфорту клиента.',
    image: '/photo/DSC05505.jpg',
    stats: [
      { label: 'Лет опыта', value: '7+' },
      { label: 'Довольных клиентов', value: '3000+' },
      { label: 'Наград', value: '12' },
    ],
  },
  experience: {
    heading: 'Опыт работы',
    items: [
      {
        id: 1,
        period: '2022 — настоящее время',
        position: 'Старший барбер',
        company: 'TOPGUN Barbershop',
        description: 'Ведущий мастер салона. Проведение мастер-классов для начинающих барберов.',
      },
      {
        id: 2,
        period: '2019 — 2022',
        position: 'Барбер',
        company: 'Chop-Chop Barbershop',
        description: 'Выполнение мужских стрижек, оформление бороды, уход за волосами.',
      },
      {
        id: 3,
        period: '2018 — 2019',
        position: 'Стажёр-барбер',
        company: 'OldBoy Barbershop',
        description: 'Обучение основам барберинга, работа с клиентами под наставничеством.',
      },
    ],
  },
  education: {
    heading: 'Обучение и сертификаты',
    items: [
      {
        id: 1,
        year: '2023',
        title: 'International Barber Convention',
        institution: 'London, UK',
        description: 'Сертификат участника и призёра международного конкурса барберов.',
        image: '/photo/_DSC3629.jpg',
      },
      {
        id: 2,
        year: '2021',
        title: 'Продвинутый курс колористики',
        institution: 'Академия ESTEL',
        description: 'Техники окрашивания, тонирования и работы с цветом.',
        image: '/photo/_DSC3636.jpg',
      },
      {
        id: 3,
        year: '2020',
        title: 'Мужские стрижки: от классики до модерна',
        institution: 'Школа Барберов «Kontora»',
        description: 'Углублённый курс по техникам стрижки и работе с текстурой волос.',
        image: '/photo/_DSC3646.jpg',
      },
      {
        id: 4,
        year: '2018',
        title: 'Базовый курс парикмахерского искусства',
        institution: 'Колледж Индустрии Красоты',
        description: 'Фундаментальное образование по парикмахерскому делу.',
        image: '/photo/_DSC3652.jpg',
      },
    ],
  },
  services: {
    heading: 'Услуги',
    items: [
      { id: 1, name: 'Мужская стрижка', price: '1 500 ₽', duration: '60 мин', description: 'Классическая или современная стрижка с учётом типа лица и структуры волос.', image: '/photo/_DSC3534.jpg' },
      { id: 2, name: 'Стрижка бороды', price: '800 ₽', duration: '30 мин', description: 'Оформление и моделирование бороды, подбор формы.', image: '/photo/_DSC3551.jpg' },
      { id: 3, name: 'Комплекс: стрижка + борода', price: '2 000 ₽', duration: '90 мин', description: 'Полный уход: стрижка, оформление бороды, укладка.', image: '/photo/_DSC3556.jpg' },
      { id: 4, name: 'Камуфляж седины', price: '1 200 ₽', duration: '45 мин', description: 'Натуральное тонирование для маскировки седых волос.', image: '/photo/_DSC3568.jpg' },
      { id: 5, name: 'Королевское бритьё', price: '1 000 ₽', duration: '40 мин', description: 'Бритьё опасной бритвой с горячим полотенцем и уходовыми средствами.', image: '/photo/_DSC3594.jpg' },
      { id: 6, name: 'Детская стрижка', price: '1 000 ₽', duration: '45 мин', description: 'Стрижка для детей до 12 лет в комфортной обстановке.', image: '/photo/_DSC3669.jpg' },
    ],
  },
  works: {
    heading: 'Галерея работ',
    items: [
      { id: 1, image: '/photo/_DSC3288.jpg', title: 'Классический фейд', category: 'Стрижка' },
      { id: 2, image: '/photo/_DSC3297.jpg', title: 'Текстурная стрижка', category: 'Стрижка' },
      { id: 3, image: '/photo/_DSC3353.jpg', title: 'Оформление бороды', category: 'Борода' },
      { id: 4, image: '/photo/_DSC3402.jpg', title: 'Кроп с чёлкой', category: 'Стрижка' },
      { id: 5, image: '/photo/_DSC3417.jpg', title: 'Помпадур', category: 'Стрижка' },
      { id: 6, image: '/photo/_DSC3435.jpg', title: 'Королевское бритьё', category: 'Бритьё' },
    ],
  },
  contact: {
    heading: 'Контакты',
    subtitle: 'Доступна для записи',
    email: 'anastasiya.cherenkova@mail.ru',
    phone: '+7 (999) 123-45-67',
    telegram: '@anastasiya_barber',
    instagram: '@anastasiya.barber',
    address: 'Москва, ул. Тверская, 15',
    workingHours: 'Пн-Сб: 10:00 — 20:00',
  },
};

const SiteDataContext = createContext();

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultData, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load saved data:', e);
    }
    return defaultData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save data:', e);
      if (e?.name === 'QuotaExceededError') {
        alert('⚠️ Хранилище переполнено. Попробуйте удалить некоторые загруженные изображения или используйте ссылки вместо файлов.');
      }
    }
  }, [data]);

  const updateSection = (section, newValue) => {
    setData((prev) => ({ ...prev, [section]: newValue }));
  };

  const resetData = () => {
    setData(defaultData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SiteDataContext.Provider value={{ data, updateSection, resetData }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
}

export { defaultData };
