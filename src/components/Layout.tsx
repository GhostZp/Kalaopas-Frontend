import {Link, Outlet} from 'react-router';
import {useUserContext} from '../hooks/ContextHooks';
import {useEffect} from 'react';

const Layout = () => {
  const {handleAutoLogin, user, loading} = useUserContext();
  useEffect(() => {
    handleAutoLogin();
  }, [handleAutoLogin]);

  if (!loading) {
    return <div className="text-2xl">Ladataan...</div>;
  }

  return (
    <div>
      <header className="bg-card text-card-foreground shadow-sm bg-linear-to-b from-blue-600 to-blue-800 rounded-md mb-4">
        <div className="mx-auto mb-4 flex w-full max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
          <Link
            className="hover:bg-accent hover:text-accent-foreground block rounded px-2 py-2 text-center text-2xl font-bold transition-all duration-500 ease-in-out"
            to="/"
          >
            Annan Kalaopas
          </Link>
          <nav>
            <ul className="m-0 flex items-center justify-end gap-1 p-0">
              <li>
                <Link
                  className="hover:bg-accent hover:text-accent-foreground block rounded px-3 py-2 text-center font-bold transition-all duration-500 ease-in-out"
                  to="/"
                >
                  Koti
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      className="hover:bg-accent hover:text-accent-foreground block rounded px-3 py-2 text-center font-bold transition-all duration-500 ease-in-out"
                      to="/profile"
                    >
                      Profiili
                    </Link>
                  </li>
                  {user?.level_name === 'Admin' && (
                    <li>
                      <Link
                        className="hover:bg-accent hover:text-accent-foreground block rounded px-3 py-2 text-center font-bold transition-all duration-500 ease-in-out"
                        to="/upload"
                      >
                        Julkaisu
                      </Link>
                    </li>
                  )}
                  {user?.level_name !== 'Admin' && (
                    <li>
                      <Link
                        className="hover:bg-accent hover:text-accent-foreground block rounded px-3 py-2 text-center font-bold transition-all duration-500 ease-in-out"
                        to="/favorites"
                      >
                        Suosikit
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      className="hover:bg-accent hover:text-accent-foreground block rounded px-3 py-2 text-center font-bold transition-all duration-500 ease-in-out"
                      to="/logout"
                    >
                      Uloskirjautuminen
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    className="hover:bg-accent hover:text-accent-foreground block rounded px-3 py-2 text-center font-bold transition-all duration-500 ease-in-out"
                    to="/login"
                  >
                    Sisäänkirjautuminen
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
