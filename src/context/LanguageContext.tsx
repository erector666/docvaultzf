import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { SupportedLanguage } from '../types';
import { STORAGE_KEYS, APP_CONFIG } from '../constants';
import { setUserPreference, getUserPreference } from '../utils/secureStorage';

// Translation interface
interface Translations {
  [key: string]: string | Translations;
}

// Translation data (simplified for now)
const translations: Record<SupportedLanguage, Translations> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      upload: 'Upload',
      download: 'Download',
      share: 'Share',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      displayName: 'Display Name',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      loginSuccess: 'Welcome back!',
      registerSuccess: 'Account created successfully!',
    },
    documents: {
      title: 'Documents',
      upload: 'Upload Documents',
      recent: 'Recent Documents',
      all: 'All Documents',
      categories: 'Categories',
      tags: 'Tags',
      processing: 'Processing...',
      processed: 'Processed',
      failed: 'Processing Failed',
    },
    dashboard: {
      title: 'Dashboard',
      overview: 'Overview',
      statistics: 'Statistics',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
    },
  },
  mk: {
    common: {
      loading: 'Се вчитува...',
      error: 'Грешка',
      success: 'Успех',
      cancel: 'Откажи',
      confirm: 'Потврди',
      save: 'Зачувај',
      delete: 'Избриши',
      edit: 'Уреди',
      close: 'Затвори',
      back: 'Назад',
      next: 'Следно',
      previous: 'Претходно',
      search: 'Пребарај',
      filter: 'Филтер',
      sort: 'Сортирај',
      upload: 'Прикачи',
      download: 'Преземи',
      share: 'Сподели',
    },
    auth: {
      login: 'Најави се',
      register: 'Регистрирај се',
      logout: 'Одјави се',
      email: 'Е-пошта',
      password: 'Лозинка',
      confirmPassword: 'Потврди лозинка',
      displayName: 'Име за приказ',
      forgotPassword: 'Заборавена лозинка?',
      resetPassword: 'Ресетирај лозинка',
      loginSuccess: 'Добредојдовте назад!',
      registerSuccess: 'Сметката е креирана успешно!',
    },
    documents: {
      title: 'Документи',
      upload: 'Прикачи документи',
      recent: 'Неодамнешни документи',
      all: 'Сите документи',
      categories: 'Категории',
      tags: 'Ознаки',
      processing: 'Се обработува...',
      processed: 'Обработено',
      failed: 'Обработката не успеа',
    },
    dashboard: {
      title: 'Контролна табла',
      overview: 'Преглед',
      statistics: 'Статистики',
      recentActivity: 'Неодамнешна активност',
      quickActions: 'Брзи акции',
    },
  },
  fr: {
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      close: 'Fermer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      upload: 'Télécharger',
      download: 'Télécharger',
      share: 'Partager',
    },
    auth: {
      login: 'Connexion',
      register: "S'inscrire",
      logout: 'Déconnexion',
      email: 'E-mail',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      displayName: "Nom d'affichage",
      forgotPassword: 'Mot de passe oublié?',
      resetPassword: 'Réinitialiser le mot de passe',
      loginSuccess: 'Bon retour!',
      registerSuccess: 'Compte créé avec succès!',
    },
    documents: {
      title: 'Documents',
      upload: 'Télécharger des documents',
      recent: 'Documents récents',
      all: 'Tous les documents',
      categories: 'Catégories',
      tags: 'Étiquettes',
      processing: 'Traitement...',
      processed: 'Traité',
      failed: 'Échec du traitement',
    },
    dashboard: {
      title: 'Tableau de bord',
      overview: 'Aperçu',
      statistics: 'Statistiques',
      recentActivity: 'Activité récente',
      quickActions: 'Actions rapides',
    },
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const savedLanguage = getUserPreference('language') as SupportedLanguage;
    return savedLanguage || APP_CONFIG.defaultLanguage;
  });

  useEffect(() => {
    setUserPreference('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if no translation found
          }
        }
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
