import React, { useState, useEffect, useRef } from 'react';
import { Phone, MapPin, Clock, ChefHat, Utensils, Anchor, Menu as MenuIcon, X, Facebook, Instagram, ChevronRight, Settings, LogIn, LogOut, Save, AlertCircle } from 'lucide-react';
import restaurantLogo from './logo.png';

const STORAGE_KEY = 'reczna-robota-cms-cache';
const TOKEN_STORAGE_KEY = 'reczna-robota-cms-token';
const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:4000';

const defaultContent = {
  branding: {
    name: 'Ręczna Robota',
    accent: '2.0',
    phone: '537 961 666',
    logo: restaurantLogo,
  },
  navLinks: [
    { label: 'O nas', href: '#o-nas' },
    { label: 'Menu', href: '#menu' },
    { label: 'Kontakt', href: '#kontakt' },
  ],
  hero: {
    badge: 'Sezon 2026 otwarty!',
    titleTop: 'Prawdziwy smak',
    titleAccent: 'nad Zalewem',
    description: 'Port Nieporęt. Świeże ryby, rzemieślnicza pizza i prawdziwa, ręczna robota.',
    backgroundImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80',
    ctaPrimary: 'Zobacz Menu',
    ctaSecondary: 'Nasz Facebook',
  },
  aboutCards: [
    {
      icon: 'chef',
      title: 'Ręczna Robota',
      text: 'Wszystko przygotowujemy od podstaw. Nasze ciasto do pizzy i domowe zupy to nasz powód do dumy.',
    },
    {
      icon: 'anchor',
      title: 'Klimat Portu',
      text: 'Idealne miejsce na odpoczynek. Poczuj mazurski klimat nad Zalewem Zegrzyńskim w Porcie Nieporęt.',
    },
    {
      icon: 'utensils',
      title: 'Świeże Składniki',
      text: 'Od pysznego sandacza po wysokiej jakości włoskie sery na naszej pizzy. Nie uznajemy kompromisów.',
    },
  ],
  menuCategories: [
    {
      id: 'zupy',
      label: 'Zupy',
      items: [
        { name: 'Żurek z białą kiełbasą', desc: 'Podgrzybki / Jajo', price: '18' },
        { name: 'Pomidorowa z makaronem', desc: 'Klasyczna, domowa', price: '15' },
      ],
    },
    {
      id: 'dania_glowne',
      label: 'Dania Główne',
      items: [
        { name: 'Schabowy', desc: 'Ziemniaki / Koperek / Kapusta zasmażana', price: '38' },
        { name: 'Grillowana pierś z kurczaka', desc: 'Frytki / Sos tzatziki / Surówka z białej kapusty', price: '37' },
        { name: 'Sandacz 180g', desc: 'Opiekane ziemniaki / Blanszowany szpinak', price: '57' },
        { name: 'Pieczona karkówka', desc: 'Sos pieczarkowy / Kopytka / Surówka z białej kapusty', price: '39' },
        { name: 'Frytki', desc: 'Porcja', price: '12' },
        { name: 'Frytki z parmezanem', desc: 'Z dodatkiem sera parmezan', price: '15' },
      ],
    },
    {
      id: 'pizza',
      label: 'Pizza 32cm',
      items: [
        { name: 'Salame Picante', desc: 'Sos pomidorowy / Mozzarella / Spianata / Ricotta / Papryka', price: '42' },
        { name: 'Cotto Funghi', desc: 'Sos pomidorowy / Mozzarella / Szynka Cotto / Pieczarki / Rukola', price: '37' },
        { name: 'Amatriciana', desc: 'Sos pomidorowy / Mozzarella / Boczek / Czosnek / Cebula czerwona / Piri-piri', price: '39' },
        { name: 'Diavola', desc: 'Sos pomidorowy / Mozzarella / Spianata / Jalapeno', price: '41' },
        { name: 'Margherita', desc: 'Sos pomidorowy / Mozzarella / Bazylia', price: '31' },
        { name: 'Havajska', desc: 'Sos pomidorowy / Mozzarella / Szynka / Ananas', price: '36' },
      ],
    },
    {
      id: 'napoje',
      label: 'Napoje & Alkohole',
      items: [
        { name: 'Lemoniada Cytrynowa 0,3L', desc: 'Orzeźwiająca', price: '13' },
        { name: 'Woda z cytryną 0,5L', desc: 'Karafka', price: '12' },
        { name: 'Jungle IPA', desc: 'Piwo butelkowe kraftowe', price: '18' },
        { name: 'Śmietanka Pszeniczne', desc: 'Piwo butelkowe kraftowe', price: '17' },
        { name: 'Żywiec z nalewaka', desc: 'Zimne z beczki', price: '14' },
        { name: 'Espresso Doppio', desc: 'Podwójne pobudzenie', price: '8' },
        { name: 'Caffe Latte', desc: 'Delikatna kawa mleczna', price: '13' },
      ],
    },
  ],
  gallery: [
    { alt: 'Pizza', url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80' },
    { alt: 'Danie', url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80' },
    { alt: 'Zupa', url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=600&q=80' },
    { alt: 'Drinki', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80' },
  ],
  contact: {
    sectionTitle: 'Zapraszamy do nas',
    locationTitle: 'Lokalizacja',
    address: 'Zegrzyńska 10',
    city: '05-126 Nieporęt',
    locationNote: '(Teren portu Wodnik)',
    hoursTitle: 'Godziny otwarcia',
    hoursDays: 'Poniedziałek - Niedziela',
    hoursTime: '12:00 - 21:00',
    contactTitle: 'Kontakt',
  },
  footer: {
    copyright: '2026 Ręczna Robota 2.0 Wodnik.',
    implementation: 'Projekt i realizacja: TwójBrand',
  },
};

const iconMap = {
  chef: ChefHat,
  anchor: Anchor,
  utensils: Utensils,
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ąćęłńóśźż]+/g, '_')
    .replace(/^_+|_+$/g, '');

const mergeContent = (incoming) => ({
  ...defaultContent,
  ...incoming,
  branding: { ...defaultContent.branding, ...(incoming?.branding || {}) },
  hero: { ...defaultContent.hero, ...(incoming?.hero || {}) },
  contact: { ...defaultContent.contact, ...(incoming?.contact || {}) },
  footer: { ...defaultContent.footer, ...(incoming?.footer || {}) },
  navLinks: incoming?.navLinks || defaultContent.navLinks,
  aboutCards: incoming?.aboutCards || defaultContent.aboutCards,
  menuCategories: incoming?.menuCategories || defaultContent.menuCategories,
  gallery: incoming?.gallery || defaultContent.gallery,
});

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);
  const [content, setContent] = useState(defaultContent);
  const [activeCategory, setActiveCategory] = useState(defaultContent.menuCategories[0]?.id || '');
  const [authToken, setAuthToken] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  });
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [loginError, setLoginError] = useState('');
  const [cmsStatus, setCmsStatus] = useState({ type: '', message: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const initialLoadDone = useRef(false);

  const loadFromLocalCache = () => {
    if (typeof window === 'undefined') return defaultContent;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try {
      return mergeContent(JSON.parse(saved));
    } catch (error) {
      return null;
    }
  };

  const saveLocalCache = (nextContent) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContent));
  };

  // Efekt dla przezroczystości nawigacji
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (authToken) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [authToken]);

  useEffect(() => {
    const initializeContent = async () => {
      const localCache = loadFromLocalCache();
      if (localCache) setContent(localCache);

      try {
        const response = await fetch(`${API_BASE_URL}/api/content`);
        if (!response.ok) throw new Error('API content fetch failed');
        const serverContent = await response.json();
        const merged = mergeContent(serverContent);
        setContent(merged);
        saveLocalCache(merged);
        setIsBackendAvailable(true);
      } catch (error) {
        setIsBackendAvailable(false);
      } finally {
        initialLoadDone.current = true;
      }
    };

    initializeContent();
  }, []);

  useEffect(() => {
    if (!content.menuCategories.find((category) => category.id === activeCategory)) {
      setActiveCategory(content.menuCategories[0]?.id || '');
    }
  }, [content.menuCategories, activeCategory]);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    saveLocalCache(content);
  }, [content]);

  const phoneHref = `tel:${content.branding.phone.replace(/\s+/g, '')}`;
  const activeMenu = content.menuCategories.find((category) => category.id === activeCategory) || content.menuCategories[0];
  const isLoggedIn = Boolean(authToken);

  const saveContentToBackend = async (nextContent = content) => {
    if (!isLoggedIn) {
      setCmsStatus({ type: 'error', message: 'Zaloguj się, aby zapisać zmiany na serwerze.' });
      return;
    }

    setIsSaving(true);
    setCmsStatus({ type: '', message: '' });
    try {
      const response = await fetch(`${API_BASE_URL}/api/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(nextContent),
      });

      if (!response.ok) {
        throw new Error('Błąd zapisu');
      }

      const savedContent = mergeContent(await response.json());
      setContent(savedContent);
      saveLocalCache(savedContent);
      setCmsStatus({ type: 'success', message: 'Zmiany zapisane na serwerze.' });
      setIsBackendAvailable(true);
    } catch (error) {
      setCmsStatus({ type: 'error', message: 'Nie udało się zapisać zmian na serwerze.' });
      setIsBackendAvailable(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      if (!response.ok) {
        throw new Error('Nieprawidłowy login lub hasło');
      }

      const payload = await response.json();
      setAuthToken(payload.token);
      setLoginForm({ username: loginForm.username, password: '' });
      setCmsStatus({ type: 'success', message: 'Zalogowano do panelu CMS.' });
      setIsBackendAvailable(true);
    } catch (error) {
      setLoginError('Błędny login lub hasło albo brak połączenia z backendem.');
      setIsBackendAvailable(false);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthToken('');
    setCmsStatus({ type: '', message: '' });
  };

  const updateSimple = (section, key, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const updateArrayItem = (section, index, key, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: prev[section].map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  };

  const updateMenuCategory = (categoryIndex, key, value) => {
    setContent((prev) => ({
      ...prev,
      menuCategories: prev.menuCategories.map((category, idx) =>
        idx === categoryIndex
          ? { ...category, [key]: value, id: key === 'label' ? slugify(value) || category.id : category.id }
          : category
      ),
    }));
  };

  const updateMenuItem = (categoryIndex, itemIndex, key, value) => {
    setContent((prev) => ({
      ...prev,
      menuCategories: prev.menuCategories.map((category, idx) =>
        idx === categoryIndex
          ? {
              ...category,
              items: category.items.map((item, i) => (i === itemIndex ? { ...item, [key]: value } : item)),
            }
          : category
      ),
    }));
  };

  return (
    <div className="font-sans text-gray-800 bg-stone-50 min-h-screen">
      <button
        onClick={() => setCmsOpen((prev) => !prev)}
        className="fixed right-4 bottom-4 z-[60] bg-stone-900 hover:bg-black text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-semibold"
      >
        <Settings className="w-4 h-4" />
        {cmsOpen ? 'Zamknij CMS' : 'Panel CMS'}
      </button>

      {cmsOpen && (
        <aside className="fixed top-0 right-0 z-[55] h-screen w-full max-w-xl bg-white border-l border-stone-200 shadow-2xl overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900">CMS Administratora</h2>
            <button onClick={() => setCmsOpen(false)} className="text-stone-600 hover:text-stone-900">
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className={`mb-5 rounded-lg px-3 py-2 text-sm ${isBackendAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {isBackendAvailable
              ? `Backend online: ${API_BASE_URL}`
              : `Backend offline: pracujesz na cache lokalnym. Ustaw API pod ${API_BASE_URL}`}
          </div>

          {!isLoggedIn && (
            <form onSubmit={handleLogin} className="mb-6 border rounded-xl p-4 bg-stone-50 space-y-3">
              <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Logowanie administratora
              </h3>
              <input
                value={loginForm.username}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Login"
              />
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Hasło"
              />
              {loginError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {loginError}
                </p>
              )}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-stone-900 hover:bg-black text-white py-2.5 rounded-lg font-semibold disabled:opacity-60"
              >
                {isLoggingIn ? 'Logowanie...' : 'Zaloguj się'}
              </button>
            </form>
          )}

          {isLoggedIn && (
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => saveContentToBackend(content)}
                disabled={isSaving}
                className="bg-stone-900 hover:bg-black text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Zapisywanie...' : 'Zapisz na serwerze'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-stone-200 hover:bg-stone-300 text-stone-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Wyloguj
              </button>
            </div>
          )}

          {cmsStatus.message && (
            <p className={`mb-6 text-sm ${cmsStatus.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
              {cmsStatus.message}
            </p>
          )}

          {!isLoggedIn ? (
            <p className="text-sm text-stone-500 bg-stone-100 p-3 rounded-lg">
              Zaloguj się, aby edytować i zapisywać treści dla całej strony.
            </p>
          ) : (
          <div className="space-y-7 pb-16">
            <section className="border rounded-xl p-4">
              <h3 className="font-bold text-lg mb-3">Branding i telefon</h3>
              <div className="space-y-2">
                <input value={content.branding.name} onChange={(e) => updateSimple('branding', 'name', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Nazwa restauracji" />
                <input value={content.branding.accent} onChange={(e) => updateSimple('branding', 'accent', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Akcent nazwy (np. 2.0)" />
                <input value={content.branding.phone} onChange={(e) => updateSimple('branding', 'phone', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Telefon" />
              </div>
            </section>

            <section className="border rounded-xl p-4">
              <h3 className="font-bold text-lg mb-3">Menu nawigacji</h3>
              <div className="space-y-2">
                {content.navLinks.map((link, index) => (
                  <div key={`${link.href}-${index}`} className="grid grid-cols-12 gap-2">
                    <input value={link.label} onChange={(e) => updateArrayItem('navLinks', index, 'label', e.target.value)} className="col-span-4 border rounded-lg px-3 py-2" placeholder="Etykieta" />
                    <input value={link.href} onChange={(e) => updateArrayItem('navLinks', index, 'href', e.target.value)} className="col-span-6 border rounded-lg px-3 py-2" placeholder="#sekcja" />
                    <button
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          navLinks: prev.navLinks.filter((_, navIndex) => navIndex !== index),
                        }))
                      }
                      className="col-span-2 rounded-lg bg-red-100 text-red-700 text-xs"
                    >
                      Usuń
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    navLinks: [...prev.navLinks, { label: 'Nowy link', href: '#nowa-sekcja' }],
                  }))
                }
                className="mt-3 text-sm px-3 py-2 bg-stone-100 rounded-lg"
              >
                + Dodaj link
              </button>
            </section>

            <section className="border rounded-xl p-4">
              <h3 className="font-bold text-lg mb-3">Hero</h3>
              <div className="space-y-2">
                <input value={content.hero.badge} onChange={(e) => updateSimple('hero', 'badge', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Badge" />
                <input value={content.hero.titleTop} onChange={(e) => updateSimple('hero', 'titleTop', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Tytuł linia 1" />
                <input value={content.hero.titleAccent} onChange={(e) => updateSimple('hero', 'titleAccent', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Tytuł akcent" />
                <textarea value={content.hero.description} onChange={(e) => updateSimple('hero', 'description', e.target.value)} className="w-full border rounded-lg px-3 py-2 min-h-20" placeholder="Opis" />
                <input value={content.hero.backgroundImage} onChange={(e) => updateSimple('hero', 'backgroundImage', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="URL tła" />
              </div>
            </section>

            <section className="border rounded-xl p-4">
              <h3 className="font-bold text-lg mb-3">Karty O nas</h3>
              <div className="space-y-3">
                {content.aboutCards.map((card, index) => (
                  <div key={`${card.title}-${index}`} className="border rounded-lg p-3 space-y-2">
                    <select value={card.icon} onChange={(e) => updateArrayItem('aboutCards', index, 'icon', e.target.value)} className="w-full border rounded-lg px-3 py-2">
                      <option value="chef">Chef</option>
                      <option value="anchor">Anchor</option>
                      <option value="utensils">Utensils</option>
                    </select>
                    <input value={card.title} onChange={(e) => updateArrayItem('aboutCards', index, 'title', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Tytuł" />
                    <textarea value={card.text} onChange={(e) => updateArrayItem('aboutCards', index, 'text', e.target.value)} className="w-full border rounded-lg px-3 py-2 min-h-20" placeholder="Opis" />
                  </div>
                ))}
              </div>
            </section>

            <section className="border rounded-xl p-4">
              <h3 className="font-bold text-lg mb-3">Menu restauracji (kategorie i pozycje)</h3>
              <div className="space-y-4">
                {content.menuCategories.map((category, categoryIndex) => (
                  <div key={`${category.id}-${categoryIndex}`} className="border rounded-lg p-3 space-y-2">
                    <div className="flex gap-2">
                      <input value={category.label} onChange={(e) => updateMenuCategory(categoryIndex, 'label', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Nazwa kategorii" />
                      <button
                        onClick={() =>
                          setContent((prev) => ({
                            ...prev,
                            menuCategories: prev.menuCategories.filter((_, index) => index !== categoryIndex),
                          }))
                        }
                        className="text-xs px-3 py-2 rounded-lg bg-red-100 text-red-700"
                      >
                        Usuń
                      </button>
                    </div>

                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={`${item.name}-${itemIndex}`} className="grid grid-cols-12 gap-2">
                          <input
                            value={item.name}
                            onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'name', e.target.value)}
                            className="col-span-5 border rounded-lg px-2 py-2 text-sm"
                            placeholder="Nazwa"
                          />
                          <input
                            value={item.desc}
                            onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'desc', e.target.value)}
                            className="col-span-4 border rounded-lg px-2 py-2 text-sm"
                            placeholder="Opis"
                          />
                          <input
                            value={item.price}
                            onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'price', e.target.value)}
                            className="col-span-2 border rounded-lg px-2 py-2 text-sm"
                            placeholder="Cena"
                          />
                          <button
                            onClick={() =>
                              setContent((prev) => ({
                                ...prev,
                                menuCategories: prev.menuCategories.map((cat, idx) =>
                                  idx === categoryIndex ? { ...cat, items: cat.items.filter((_, i) => i !== itemIndex) } : cat
                                ),
                              }))
                            }
                            className="col-span-1 text-red-700 text-xs"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          menuCategories: prev.menuCategories.map((cat, idx) =>
                            idx === categoryIndex
                              ? { ...cat, items: [...cat.items, { name: 'Nowa pozycja', desc: 'Opis', price: '0' }] }
                              : cat
                          ),
                        }))
                      }
                      className="text-sm px-3 py-2 bg-stone-100 rounded-lg"
                    >
                      + Dodaj pozycję
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    menuCategories: [...prev.menuCategories, { id: `kategoria_${Date.now()}`, label: 'Nowa Kategoria', items: [] }],
                  }))
                }
                className="mt-3 text-sm px-3 py-2 bg-stone-900 text-white rounded-lg"
              >
                + Dodaj kategorię
              </button>
            </section>

            <section className="border rounded-xl p-4">
              <h3 className="font-bold text-lg mb-3">Kontakt</h3>
              <div className="space-y-2">
                <input value={content.contact.sectionTitle} onChange={(e) => updateSimple('contact', 'sectionTitle', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Tytuł sekcji" />
                <input value={content.contact.address} onChange={(e) => updateSimple('contact', 'address', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Adres" />
                <input value={content.contact.city} onChange={(e) => updateSimple('contact', 'city', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Kod i miasto" />
                <input value={content.contact.hoursDays} onChange={(e) => updateSimple('contact', 'hoursDays', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Dni" />
                <input value={content.contact.hoursTime} onChange={(e) => updateSimple('contact', 'hoursTime', e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Godziny" />
              </div>
            </section>

            <section className="border rounded-xl p-4">
              <h3 className="font-bold text-lg mb-3">Galeria</h3>
              <div className="space-y-2">
                {content.gallery.map((image, index) => (
                  <div key={`${image.url}-${index}`} className="grid grid-cols-12 gap-2">
                    <input
                      value={image.alt}
                      onChange={(e) => updateArrayItem('gallery', index, 'alt', e.target.value)}
                      className="col-span-3 border rounded-lg px-3 py-2"
                      placeholder="Alt"
                    />
                    <input
                      value={image.url}
                      onChange={(e) => updateArrayItem('gallery', index, 'url', e.target.value)}
                      className="col-span-8 border rounded-lg px-3 py-2"
                      placeholder="URL zdjęcia"
                    />
                    <button
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          gallery: prev.gallery.filter((_, imageIndex) => imageIndex !== index),
                        }))
                      }
                      className="col-span-1 text-red-700 text-xs"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    gallery: [...prev.gallery, { alt: 'Nowe zdjęcie', url: 'https://images.unsplash.com' }],
                  }))
                }
                className="mt-3 text-sm px-3 py-2 bg-stone-100 rounded-lg"
              >
                + Dodaj zdjęcie
              </button>
            </section>

            <section className="border rounded-xl p-4">
              <h3 className="font-bold text-lg mb-3">Stopka</h3>
              <div className="space-y-2">
                <input value={content.footer.copyright} onChange={(e) => updateSimple('footer', 'copyright', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                <input value={content.footer.implementation} onChange={(e) => updateSimple('footer', 'implementation', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </section>

            <button
              onClick={() => {
                setContent(defaultContent);
                saveLocalCache(defaultContent);
                setCmsStatus({ type: 'success', message: 'Przywrócono dane domyślne lokalnie.' });
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
            >
              Przywróć dane domyślne
            </button>
          </div>
          )}
        </aside>
      )}

      {/* NAWIGACJA */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-5' : 'bg-black/45 backdrop-blur-sm py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
              {isScrolled && (
                <img
                  src={content.branding.logo}
                  alt={`${content.branding.name} logo`}
                  className="h-28 md:h-32 w-auto transition-all duration-300"
                />
              )}
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {content.navLinks.map((link) => (
                <a key={link.href} href={link.href} className={`font-medium hover:text-red-500 transition-colors ${isScrolled ? 'text-stone-700' : 'text-stone-200'}`}>
                  {link.label}
                </a>
              ))}
              <a href={phoneHref} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-red-500/30">
                <Phone className="w-4 h-4" /> {content.branding.phone}
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`${isScrolled ? 'text-stone-900' : 'text-white'}`}>
                {mobileMenuOpen ? <X className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t absolute w-full shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {content.navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-stone-700 hover:bg-stone-50 border-b">
                  {link.label}
                </a>
              ))}
              <a href={phoneHref} className="block mt-4 px-3 py-3 text-center text-base font-medium text-white bg-red-600 rounded-lg shadow-md">
                Zadzwoń: {content.branding.phone}
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center">
        {/* Tło - w docelowej wersji tutaj wrzucamy piękne zdjęcie portu w Nieporęcie lub ich pizzy */}
        <div className="absolute inset-0 z-0">
          <img 
            src={content.hero.backgroundImage}
            alt="Restauracja tło" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-stone-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <img
            src={content.branding.logo}
            alt={`${content.branding.name} logo`}
            className="h-56 md:h-72 w-auto mx-auto mb-8 brightness-0 invert drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          />
          <div className="mb-6 inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-white text-sm font-semibold tracking-widest uppercase">{content.hero.badge}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg leading-tight">
            {content.hero.titleTop} <br/><span className="text-red-500 italic">{content.hero.titleAccent}</span>
          </h1>
          <p className="text-lg md:text-2xl text-stone-200 mb-10 max-w-2xl mx-auto font-light">
            {content.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#menu" className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 font-medium">
              {content.hero.ctaPrimary} <ChevronRight className="w-5 h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/30 text-lg px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 font-medium">
              <Facebook className="w-5 h-5" /> {content.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* SEKCJA O NAS / CECHY */}
      <section id="o-nas" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {content.aboutCards.map((card, index) => {
              const Icon = iconMap[card.icon] || ChefHat;
              return (
                <div key={`${card.title}-${index}`} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center group hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-serif">{card.title}</h3>
                  <p className="text-stone-500">{card.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-red-600 tracking-widest uppercase mb-2">Nasza Karta</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">Menu Ręczna Robota</h3>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-6"></div>
          </div>

          {/* Menu Nawigacja */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {content.menuCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === cat.id 
                  ? 'bg-stone-900 text-white shadow-lg' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Wyświetlanie Menu */}
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 animate-in fade-in duration-500">
            {activeMenu?.items.map((item, index) => (
              <div key={index} className="border-b border-stone-200 pb-4 group">
                <div className="flex justify-between items-baseline mb-2">
                  <h4 className="text-xl font-bold text-stone-900 group-hover:text-red-600 transition-colors uppercase font-serif">
                    {item.name}
                  </h4>
                  <div className="flex-grow border-b-2 border-dotted border-stone-300 mx-4 relative top-[-6px]"></div>
                  <span className="text-xl font-bold text-red-600 whitespace-nowrap">
                    {item.price} <span className="text-sm text-stone-500">zł</span>
                  </span>
                </div>
                {item.desc && (
                  <p className="text-stone-500 text-sm italic">{item.desc}</p>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <p className="text-stone-500 mb-6">Chcesz zamówić jedzenie z odbiorem osobistym?</p>
             <a href={phoneHref} className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-white px-8 py-4 rounded-full transition-all text-lg font-medium">
                <Phone className="w-5 h-5 text-red-500" /> Zadzwoń: {content.branding.phone}
             </a>
          </div>
        </div>
      </section>

      {/* SEKCJA ZDJĘĆ / INSTAGRAM WIEDZA (Zamiast rolek) */}
      <section className="py-2 bg-stone-900">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {content.gallery.map((image, index) => (
              <img key={`${image.alt}-${index}`} src={image.url} alt={image.alt} className="w-full h-64 object-cover opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
            ))}
         </div>
      </section>

      {/* KONTAKT I MAPA - PITCH SPRZEDAŻOWY */}
      <section id="kontakt" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Informacje kontaktowe */}
            <div>
              <h2 className="text-4xl font-serif font-bold text-stone-900 mb-8">{content.contact.sectionTitle}</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-stone-900">{content.contact.locationTitle}</h4>
                    <p className="text-stone-600 text-lg mt-1">{content.contact.address}<br/>{content.contact.city}<br/><span className="text-sm text-stone-400">{content.contact.locationNote}</span></p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-stone-900">{content.contact.hoursTitle}</h4>
                    <p className="text-stone-600 text-lg mt-1">{content.contact.hoursDays}<br/><span className="font-medium text-stone-900">{content.contact.hoursTime}</span></p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-stone-900">{content.contact.contactTitle}</h4>
                    <a href={phoneHref} className="text-stone-600 text-lg mt-1 hover:text-red-600 transition-colors block">
                      {content.branding.phone}
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Mapa Google z pinezka lokalu */}
            <div className="bg-white p-2 rounded-2xl shadow-xl overflow-hidden">
              <div className="aspect-square md:aspect-[4/3] bg-stone-200 rounded-xl overflow-hidden">
                <iframe
                  title="Google Maps - Zegrzyńska 10, Nieporęt"
                  src="https://maps.google.com/maps?q=52.4351973,21.0329947&z=18&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={content.branding.logo} alt={`${content.branding.name} logo`} className="h-10 w-auto opacity-80" />
            <span className="font-serif font-bold text-lg tracking-wider uppercase text-stone-300">
              {content.branding.name} <span className="text-red-700">{content.branding.accent}</span>
            </span>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors"><Facebook className="w-6 h-6" /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram className="w-6 h-6" /></a>
          </div>

          <div className="text-sm text-center md:text-right">
            <p>&copy; {content.footer.copyright}</p>
            <p className="mt-1 text-stone-600">{content.footer.implementation}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}