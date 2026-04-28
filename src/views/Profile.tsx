import {useUserContext} from '../hooks/ContextHooks';

const Profile = () => {
  const {user} = useUserContext();

  return (
    <>
      {user && (
        <article className="w-full p-3 overflow-hidden bg-gray-200 border border-gray-400 rounded-md">
          <div className="p-4">
            <h3 className="rounded bg-linear-to-b from-blue-500 to-blue-700 px-3 py-2 text-xl font-bold text-white shadow-sm">{user.username}</h3>
            <div className="rounded border border-gray-400 bg-gray-100 p-3 text-sm text-gray-700 shadow-inner my-2">
              <p>Sähköposti: {user.email}</p>
              <p>Käyttötaso: {user.level_name}</p>
              <p>
                Rekisteröitynyt: {new Date(user.created_at).toLocaleString('fi-FI')}
              </p>
            </div>
          </div>
        </article>
      )}
    </>
  );
};

export default Profile;
