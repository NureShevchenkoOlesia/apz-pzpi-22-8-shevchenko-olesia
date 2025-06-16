import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="font-serif text-white">
      <section
        id="home"
        className="px-6 md:px-10 py-48 text-left bg-cover bg-center"
        style={{
          backgroundImage: `url(photos/home/top2.jpeg)`,
        }}
      >
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold leading-tight mb-6">
            Join Our Vibrant<br />Community Today
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-8">
            Welcome to a place where astronomy enthusiasts unite to share their observations and insights.
            Connect with fellow stargazers and explore the wonders of the universe together.
          </p>
          <div className="space-x-4">
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/upload")}
                className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition"
              >
                Add Observation
              </button>
            ) : (
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Join
              </button>
            )}

            <button
              onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
              className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black transition"
            >
              Learn More
            </button>
          </div>

        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="px-10 py-20 grid md:grid-cols-2 gap-16 items-center bg-black font-proza-libre"
      >
        {/* Text block */}
        <div>
          <h3 className="text-4xl font-serif font-semibold leading-snug text-white text-left mb-6">
            Join a vibrant community of astronomy enthusiasts and share your passion.
          </h3>
          <p className="text-gray-300 text-lg text-left mb-12 max-w-xl">
            Our platform connects astronomy amateurs from around the world,
            allowing you to share observations, insights, and experiences.
            Discover new perspectives and enhance your knowledge in a
            supportive environment.
          </p>

          {/* Two features */}
          <div className="flex flex-col sm:flex-row gap-10">
            <div>
              <h4 className="text-2xl font-semibold text-left text-white mb-1">Community</h4>
              <p className="text-gray-400 text-left">Share your discoveries and learn from others.</p>
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-left text-white mb-1">Explore</h4>
              <p className="text-gray-400 text-left">Engage with fellow stargazers and expand your horizons.</p>
            </div>
          </div>
        </div>
        {/* Image block */}
        <div>
          <img
            src="/photos/home/abUs.jpg"
            alt="astronomy"
            className="rounded-2xl shadow-lg w-full mt-10"
          />
        </div>
      </section>

      {/* Gallery / Features */}
      <section id="gallery" className="px-10 py-28 text-center bg-black">
        <h3 className="text-3xl font-serif font-semibold mb-6 text-white">Discover the Universe Together</h3>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">Join a vibrant community of astronomy enthusiasts. Share your observations and insights.</p>
        <div className="grid md:grid-cols-3 gap-10 text-left">
          <div>
            <img src="/photos/home/option2.jpg" alt="Observation" className="rounded-xl mb-2" />
            <h4 className="text-lg font-semibold text-center text-yellow-400">Share Your Astronomical Observations</h4>
            <p className="text-sm text-center text-gray-400">Easily upload and showcase your celestial findings.</p>
          </div>
          <div>
            <img src="/photos/home/option1.jpg" alt="Engage" className="rounded-xl mb-2" />
            <h4 className="text-lg font-semibold text-center text-yellow-400">Engage with Fellow Astronomy Lovers</h4>
            <p className="text-sm text-center text-gray-400">Comment on observations and exchange ideas.</p>
          </div>
          <div>
            <img src="/photos/home/option2.jpg" alt="Profile" className="rounded-xl mb-2" />
            <h4 className="text-lg font-semibold text-center text-yellow-400">Create Your Unique User Profile</h4>
            <p className="text-sm text-center text-gray-400">Personalize your experience and connect with others.</p>
          </div>
        </div>
      </section>

      {/* Creator */}
      <section className="bg-[#593B0C] text-white px-10 py-20 text-center">
        <h3 className="text-xl font-medium uppercase tracking-wider mb-2">Explore</h3>
        <h2 className="text-4xl font-serif font-semibold mb-4">Our Dearest Creator</h2>
        <p className="text-sm mb-4">Passionate space enthusiast building a welcoming community</p>

        <div className="flex flex-col items-center">
          <div className="p-6 rounded-lg mb-2">
            <img src="/photos/home/author.jpg" alt="Olesia" className="w-64 h-64 object-cover rounded-lg" />
          </div>
          <h4 className="font-semibold text-lg">Olesia Shevchenko</h4>
          <p className="text-sm text-white/70 mb-3">Software Engineering student</p>
          <p className="text-sm text-white/60 mt-2 max-w-md mx-auto">
            Olesia has always been obsessed with the stars, so naturally, she just had to drag you into it too.
          </p>

          {/* Social icons placeholder */}
          <div className="flex gap-6 justify-center mt-4 text-white/80 text-xl">
            <i className="fa-brands fa-linkedin"></i>
            <i className="fa-brands fa-x-twitter"></i>
            <i className="fa-solid fa-basketball"></i>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-black text-white px-10 py-20 text-center">
        <h3 className="text-4xl font-serif font-semibold mb-4">Join Our Astronomy Community</h3>
        <p className="text-sm text-white/60 mb-8">Share your celestial observations and connect with fellow astronomy enthusiasts today!</p>
        <div className="space-x-4">
          <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-white-300 transition">Join</button>
          <button className="border border-yellow-400 text-yellow-400 px-6 py-2 rounded-lg hover:bg-black-400 hover:text-white transition">Learn More</button>
        </div>
      </section>

      {/* Subscription */}
      <section
        className="bg-cover bg-center text-white px-10 py-32"
        style={{ backgroundImage: "url('/photos/home/bottom.jpg')" }}
      >
        <div className="max-w-2xl text-left">
          <h2 className="text-5xl font-serif font-semibold mb-4">Stay Updated with Astronomy News</h2>
          <p className="text-lg text-white/80 mb-8">
            Subscribe to our newsletter for the latest updates and insights from the world of astronomy.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email Here"
              className="w-full sm:w-96 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur-md focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-black rounded-lg font-medium shadow-md hover:bg-gray-200 transition">
              Join Now
            </button>
          </div>
          <p className="text-xs text-white/60 mt-4">
            By clicking Join Now, you agree to our Terms and Conditions.
          </p>
        </div>
      </section>
    </div>
  );
}
