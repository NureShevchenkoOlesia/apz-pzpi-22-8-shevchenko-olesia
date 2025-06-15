import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProfileMenu from "../components/ProfileMenu";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="font-serif text-white">
      <header className="font-serif flex justify-between items-center px-10 py-4 bg-black/90 backdrop-blur-md">
        <div className="flex items-center space-x-10">
          <img
            src="/photos/home/logo.svg"
            alt="Cosmorum Logo"
            className="h-8 w-auto"
          />
          <nav className="space-x-6 hidden md:flex text-sm font-medium text-white">
            <a href="/" className="hover:text-yellow-400 transition">{t('navbar.home')}</a>
            <a href="/search" className="hover:text-yellow-400 transition">{t('navbar.search')}</a>
            <a href="/gallery" className="hover:text-yellow-400 transition">{t('navbar.gallery')}</a>
            <a href="/astronomical-events" className="hover:text-yellow-400 transition">{t('navbar.events')}</a>
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <div className="space-x-2 text-sm">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`hover:text-yellow-400 py-1 px-3 ${i18n.language === 'en' ? 'text-yellow-400' : 'text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('uk')}
              className={`hover:text-yellow-400 py-1 px-2 ${i18n.language === 'uk' ? 'text-yellow-400' : 'text-white'}`}
            >
              УКР
            </button>
          </div>
          {token && <ProfileMenu />}
        </div>
      </header>
    </div>
  );
}
