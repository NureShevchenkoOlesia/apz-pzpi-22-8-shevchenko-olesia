import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Home() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const { t } = useTranslation();

  return (
    <div className="font-serif text-white">
      {/* Hero Section */}
      <section
        id="home"
        className="px-6 md:px-10 py-48 text-left bg-cover bg-center"
        style={{ backgroundImage: `url(photos/home/top2.jpeg)` }}
      >
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold leading-tight mb-6">
            {t("home.joinCommunityLine1")}<br />
            {t("home.joinCommunityLine2")}
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-8">
            {t("home.description")}
          </p>
          <div className="space-x-4">
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/upload")}
                className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition"
              >
                {t("buttonsHome.addObservation")}
              </button>
            ) : (
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                {t("buttonsHome.join")}
              </button>
            )}
            <button
              onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
              className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black transition"
            >
              {t("buttonsHome.learnMore")}
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="px-10 py-20 grid md:grid-cols-2 gap-16 items-center bg-black font-proza-libre"
      >
        <div>
          <h3 className="text-4xl font-serif font-semibold leading-snug text-white text-left mb-6">
            {t("home.aboutTitle")}
          </h3>
          <p className="text-gray-300 text-lg text-left mb-12 max-w-xl">
            {t("home.aboutText")}
          </p>

          <div className="flex flex-col sm:flex-row gap-10">
            <div>
              <h4 className="text-2xl font-semibold text-left text-white mb-1">
                {t("home.features.communityTitle")}
              </h4>
              <p className="text-gray-400 text-left">
                {t("home.features.communityText")}
              </p>
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-left text-white mb-1">
                {t("home.features.exploreTitle")}
              </h4>
              <p className="text-gray-400 text-left">
                {t("home.features.exploreText")}
              </p>
            </div>
          </div>
        </div>

        <div>
          <img
            src="/photos/home/abUs.jpg"
            alt={t("home.creator.name")}
            className="rounded-2xl shadow-lg w-full mt-10"
          />
        </div>
      </section>

      {/* Gallery / Features */}
      <section id="gallery" className="px-10 py-28 text-center bg-black">
        <h3 className="text-3xl font-serif font-semibold mb-6 text-white">
          {t("home.galleryTitle")}
        </h3>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">
          {t("home.galleryText")}
        </p>
        <div className="grid md:grid-cols-3 gap-10 text-left">
          <div>
            <img
              src="/photos/home/option2.jpg"
              alt="Observation"
              className="rounded-xl mb-2"
            />
            <h4 className="text-lg font-semibold text-center text-yellow-400">
              {t("home.galleryCard1.title")}
            </h4>
            <p className="text-sm text-center text-gray-400">
              {t("home.galleryCard1.text")}
            </p>
          </div>
          <div>
            <img
              src="/photos/home/option1.jpg"
              alt="Engage"
              className="rounded-xl mb-2"
            />
            <h4 className="text-lg font-semibold text-center text-yellow-400">
              {t("home.galleryCard2.title")}
            </h4>
            <p className="text-sm text-center text-gray-400">
              {t("home.galleryCard2.text")}
            </p>
          </div>
          <div>
            <img
              src="/photos/home/option2.jpg"
              alt="Profile"
              className="rounded-xl mb-2"
            />
            <h4 className="text-lg font-semibold text-center text-yellow-400">
              {t("home.galleryCard3.title")}
            </h4>
            <p className="text-sm text-center text-gray-400">
              {t("home.galleryCard3.text")}
            </p>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="bg-[#593B0C] text-white px-10 py-20 text-center">
        <h3 className="text-xl font-medium uppercase tracking-wider mb-2">
          {t("buttonsHome.learnMore")}
        </h3>
        <h2 className="text-4xl font-serif font-semibold mb-4">
          {t("home.creator.title")}
        </h2>
        <p className="text-sm mb-4">{t("home.creator.description")}</p>

        <div className="flex flex-col items-center">
          <div className="p-6 rounded-lg mb-2">
            <img
              src="/photos/home/author.jpg"
              alt="Olesia"
              className="w-64 h-64 object-cover rounded-lg"
            />
          </div>
          <h4 className="font-semibold text-lg">{t("home.creator.name")}</h4>
          <p className="text-sm text-white/70 mb-3">
            {t("home.creator.role")}
          </p>
          <p className="text-sm text-white/60 mt-2 max-w-md mx-auto">
            {t("home.creator.quote")}
          </p>

          <div className="flex gap-6 justify-center mt-4 text-white/80 text-xl">
            <i className="fa-brands fa-linkedin"></i>
            <i className="fa-brands fa-x-twitter"></i>
            <i className="fa-solid fa-basketball"></i>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-black text-white px-10 py-20 text-center">
        <h3 className="text-4xl font-serif font-semibold mb-4">
          {t("home.callToAction.title")}
        </h3>
        <p className="text-sm text-white/60 mb-8">
          {t("home.callToAction.subtitle")}
        </p>
        <div className="space-x-4">
          <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-white-300 transition">
            {t("buttonsHome.join")}
          </button>
          <button className="border border-yellow-400 text-yellow-400 px-6 py-2 rounded-lg hover:bg-black-400 hover:text-white transition">
            {t("buttonsHome.learnMore")}
          </button>
        </div>
      </section>

      {/* Subscription */}
      <section
        className="bg-cover bg-center text-white px-10 py-32"
        style={{ backgroundImage: "url('/photos/home/bottom.jpg')" }}
      >
        <div className="max-w-2xl text-left">
          <h2 className="text-5xl font-serif font-semibold mb-4">
            {t("home.subscription.title")}
          </h2>
          <p className="text-lg text-white/80 mb-8">
            {t("home.subscription.text")}
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-full sm:w-96 px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 backdrop-blur-md flex items-center justify-between">
              <span id="emailText" className="truncate">
                olesia.shevchenko245@gmail.com
              </span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText("olesia.shevchenko245@gmail.com")
                }
                className="ml-4 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition"
              >
                {t("buttonsHome.copy")}
              </button>
            </div>
          </div>

          <p className="text-xs text-white/60 mt-4">
            {t("home.subscription.copyHint")}
          </p>
        </div>
      </section>
    </div>
  );
}
