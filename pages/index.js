import Head from 'next/head';
import { useEffect, useState } from 'react';

const PIN = '6699';

const contactLinks = [
  { href: 'https://www.linkedin.com/in/mokin/', label: 'Linkedin', external: true },
  { href: 'https://instagram.com/daniel.mkn', label: 'Instagram', external: true },
  { href: 'mailto:daniel@martib.app', label: 'Email', external: true },
  { href: '/main/lera', label: 'Fun for Lera', external: true },
];

const projectLinks = [
  { href: '/budget', label: 'Budget Tool' },
  { href: '/recipes/box', label: 'Recipe Box' },
  { href: '/travel-2026', label: 'Travel Plans' },
  { href: '/main/lxd/index.html', label: 'LxD 5 Years' },
  { href: '/main/bday/index.html', label: 'Lera BDay' },
];

export default function Home() {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setUnlocked(window.localStorage.getItem('martib_home_unlocked') === 'true');
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (pin === PIN) {
      window.localStorage.setItem('martib_home_unlocked', 'true');
      setUnlocked(true);
      setError('');
      return;
    }

    setError('Nope.');
  };

  return (
    <>
      <Head>
        <title>PMing, AI tests and trash.</title>
        <meta name="description" content="PMing, AI tests and trash. I do it for fun and to get cringe." />
      </Head>

      <div className="home">
        {!unlocked ? (
          <main className="gate" aria-label="Homepage PIN gate">
            <form className="gate-box" onSubmit={handleSubmit}>
              <h1>Martib</h1>
              <p>Enter PIN</p>
              <input
                autoFocus
                inputMode="numeric"
                maxLength={4}
                onChange={(event) => setPin(event.target.value)}
                placeholder="...."
                type="password"
                value={pin}
              />
              <button type="submit">Unlock</button>
              {error && <span role="alert">{error}</span>}
            </form>
          </main>
        ) : (
          <>
            <header>
              <h1>Martib</h1>
              <p className="tagline">PMing, AI tests and trash. I do it for fun and to get cringe.</p>
            </header>

            <main>
              <section>
                <h2>Contacts and links:</h2>
                <ul>
                  {contactLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        rel={link.external ? 'noreferrer' : undefined}
                        target={link.external ? '_blank' : undefined}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <br />
                <button type="button" onClick={() => setShowPopup(true)}>TEXT ME</button>
              </section>

              <section>
                <h2>Projects:</h2>
                <ul>
                  {projectLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </section>
            </main>

            {showPopup && (
              <div className="popup" role="dialog" aria-modal="true" aria-labelledby="rickroll-title">
                <div className="popup-content">
                  <h2 id="rickroll-title">YOU HAVE BEEN RICKROLLED</h2>
                  <img src="/main/images/rickroll.gif" alt="Rick Roll" />
                  <button id="close-popup" type="button" onClick={() => setShowPopup(false)}>&#10005;</button>
                </div>
              </div>
            )}

            <footer>
              <p>DM 2023 &copy;</p>
            </footer>
          </>
        )}
      </div>

      <style jsx global>{`
        @font-face {
          font-family: 'Apple Garamond';
          src: url('/main/fonts/AppleGaramond.ttf');
        }

        body {
          background: #000;
        }
      `}</style>

      <style jsx>{`
        .home {
          min-height: 100vh;
          max-width: 800px;
          margin: 0 auto;
          color: #fff;
          font-family: 'Apple Garamond', serif;
        }

        .home * {
          box-sizing: border-box;
        }

        header {
          text-align: left;
          margin: 2rem 0;
          border-bottom: 1px solid gray;
        }

        header h1,
        .gate h1 {
          font-size: 3rem;
          color: white;
          margin: 0;
        }

        header p.tagline {
          font-size: 1.5rem;
          margin-top: 1rem;
          line-height: 1.5;
          color: white;
        }

        main {
          padding: 2rem;
        }

        section {
          margin-bottom: 2rem;
        }

        section h2 {
          font-size: 2rem;
          margin: 0 0 1rem;
          color: white;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        ul li {
          margin-bottom: 1rem;
        }

        a {
          color: white;
          text-decoration: none;
          display: inline-block;
          background-image: url('/main/images/skull.png');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: left center;
          padding-left: 2rem;
        }

        a:hover {
          color: #7e7e7e;
        }

        a:visited {
          color: #bfbfbf;
        }

        a[target='_blank']::after {
          content: "↗";
          margin-left: 0.2em;
        }

        button {
          background-color: white;
          color: black;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-family: 'Apple Garamond', serif;
        }

        footer {
          padding: 0 2rem 2rem;
        }

        .gate {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 2rem;
        }

        .gate-box {
          width: min(100%, 360px);
          display: grid;
          gap: 1rem;
          padding: 2rem;
          border: 1px solid gray;
          border-radius: 0.75rem;
        }

        .gate-box p {
          margin: 0;
          font-size: 1.4rem;
        }

        .gate-box input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid #777;
          border-radius: 0.5rem;
          background: #050505;
          color: #fff;
          font: inherit;
          font-size: 1.4rem;
        }

        .gate-box span {
          color: #bfbfbf;
        }

        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .popup-content {
          background-color: black;
          padding: 2rem;
          text-align: center;
          border-radius: 0.5rem;
          position: relative;
          box-shadow: 0 0 0 2px white;
        }

        .popup-content h2 {
          font-size: 2rem;
          margin: 0 0 1rem;
          color: white;
        }

        .popup-content img {
          width: 100%;
          max-width: 400px;
          margin-bottom: 1rem;
        }

        #close-popup {
          background-color: black;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          font-size: 1.5rem;
          line-height: 1;
        }

        @media (max-width: 600px) {
          header {
            margin: 2rem;
          }

          header h1,
          .gate h1 {
            font-size: 2.5rem;
          }

          header p.tagline {
            font-size: 1rem;
          }

          section h2 {
            font-size: 1.5rem;
          }

          ul li {
            margin-bottom: 0.5rem;
          }

          button {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}
