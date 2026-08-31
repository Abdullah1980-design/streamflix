import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: "Home",
      movies: "Movies",
      tvShows: "TV Shows",
      myList: "My List",
      search: "Search movies...",
      trending: "Trending",
      all: "All",
      action: "Action",
      drama: "Drama",
      comedy: "Comedy",
      horror: "Horror",
      romance: "Romance",
      kids: "Kids",
      documentary: "Documentary",
    },
  },

  ur: {
    translation: {
      home: "ہوم",
      movies: "فلمیں",
      tvShows: "ٹی وی شوز",
      myList: "میری فہرست",
      search: "فلمیں تلاش کریں...",
      trending: "مقبول",
      all: "سب",
      action: "ایکشن",
      drama: "ڈرامہ",
      comedy: "کامیڈی",
      horror: "ہارر",
      romance: "رومانس",
      kids: "بچوں کے لیے",
      documentary: "دستاویزی",
    },
  },

  es: {
    translation: {
      home: "Inicio",
      movies: "Películas",
      tvShows: "Series",
      myList: "Mi lista",
      search: "Buscar películas...",
      trending: "Tendencias",
      all: "Todo",
      action: "Acción",
      drama: "Drama",
      comedy: "Comedia",
      horror: "Terror",
      romance: "Romance",
      kids: "Niños",
      documentary: "Documentales",
    },
  },

  fr: {
    translation: {
      home: "Accueil",
      movies: "Films",
      tvShows: "Séries",
      myList: "Ma liste",
      search: "Rechercher des films...",
      trending: "Tendances",
      all: "Tous",
      action: "Action",
      drama: "Drame",
      comedy: "Comédie",
      horror: "Horreur",
      romance: "Romance",
      kids: "Enfants",
      documentary: "Documentaires",
    },
  },

  de: {
    translation: {
      home: "Startseite",
      movies: "Filme",
      tvShows: "Serien",
      myList: "Meine Liste",
      search: "Filme suchen...",
      trending: "Beliebt",
      all: "Alle",
      action: "Action",
      drama: "Drama",
      comedy: "Komödie",
      horror: "Horror",
      romance: "Romantik",
      kids: "Kinder",
      documentary: "Dokumentationen",
    },
  },

  ar: {
    translation: {
      home: "الرئيسية",
      movies: "الأفلام",
      tvShows: "المسلسلات",
      myList: "قائمتي",
      search: "ابحث عن الأفلام...",
      trending: "الأكثر رواجًا",
      all: "الكل",
      action: "أكشن",
      drama: "دراما",
      comedy: "كوميديا",
      horror: "رعب",
      romance: "رومانسية",
      kids: "الأطفال",
      documentary: "وثائقي",
    },
  },

  hi: {
    translation: {
      home: "होम",
      movies: "फ़िल्में",
      tvShows: "टीवी शो",
      myList: "मेरी सूची",
      search: "फ़िल्में खोजें...",
      trending: "ट्रेंडिंग",
      all: "सभी",
      action: "एक्शन",
      drama: "ड्रामा",
      comedy: "कॉमेडी",
      horror: "हॉरर",
      romance: "रोमांस",
      kids: "बच्चों के लिए",
      documentary: "डॉक्यूमेंट्री",
    },
  },

  zh: {
    translation: {
      home: "首页",
      movies: "电影",
      tvShows: "电视剧",
      myList: "我的列表",
      search: "搜索电影...",
      trending: "热门",
      all: "全部",
      action: "动作",
      drama: "剧情",
      comedy: "喜剧",
      horror: "恐怖",
      romance: "爱情",
      kids: "儿童",
      documentary: "纪录片",
    },
  },

  ja: {
    translation: {
      home: "ホーム",
      movies: "映画",
      tvShows: "テレビ番組",
      myList: "マイリスト",
      search: "映画を検索...",
      trending: "トレンド",
      all: "すべて",
      action: "アクション",
      drama: "ドラマ",
      comedy: "コメディ",
      horror: "ホラー",
      romance: "ロマンス",
      kids: "キッズ",
      documentary: "ドキュメンタリー",
    },
  },

  ko: {
    translation: {
      home: "홈",
      movies: "영화",
      tvShows: "TV 프로그램",
      myList: "내 목록",
      search: "영화 검색...",
      trending: "인기",
      all: "전체",
      action: "액션",
      drama: "드라마",
      comedy: "코미디",
      horror: "공포",
      romance: "로맨스",
      kids: "어린이",
      documentary: "다큐멘터리",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
