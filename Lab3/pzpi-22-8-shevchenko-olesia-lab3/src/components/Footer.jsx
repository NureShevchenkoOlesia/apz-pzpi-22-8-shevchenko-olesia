import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-gray-500 text-sm text-center py-6">
      <div>© 2025 Cosmorum. {t('footer.rights')}</div>
    </footer>
  );
}
