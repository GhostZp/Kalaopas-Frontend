import type {
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
} from 'hybrid-types/DBTypes';
import {useState, useEffect} from 'react';
import MediaRow from '../components/MediaRow';
import SingleView from '../components/SingleView';
import {useMedia} from '../hooks/apiHooks';
import {fetchData} from '../utils/fetch-data';

const Home = () => {
  const [selectedItem, setSelectedItem] = useState<
    MediaItemWithOwner | undefined
  >(undefined);

  const {mediaArray, deleteMedia} = useMedia();

  const [search, setSearch] = useState('');
  const [filteredMedia, setFilteredMedia] = useState<MediaItemWithOwner[]>([]);

  useEffect(() => {
    setFilteredMedia(mediaArray);
  }, [mediaArray]);

  const handleSearch = async (query: string) => {
    try {
      const media = await fetchData<MediaItem[]>(
        `${import.meta.env.VITE_MEDIA_API}/media?search=${query}`,
      );

      const mediaWithOwners = await Promise.all(
        media.map(async (item) => {
          try {
            const owner = await fetchData<UserWithNoPassword>(
              `${import.meta.env.VITE_AUTH_API}/users/${item.user_id}`,
            );

            return {
              ...item,
              username: owner.username,
            };
          } catch {
            return {
              ...item,
              username: 'not found',
            };
          }
        }),
      );

      setFilteredMedia(mediaWithOwners);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (media_id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    await deleteMedia(media_id, token);
  };

  return (
    <>
      <div className="mb-4 space-y-3 text-center text-sm text-gray-600">
        <h1 className="rounded bg-linear-to-b from-blue-500 to-blue-700 px-3 py-2 text-xl font-bold text-white shadow-sm">
          Annan Kalaopas
        </h1>
        <p className="line-clamp-3 rounded border border-gray-400 bg-gray-100 p-3 text-sm text-gray-700 shadow-inner">
          Tervetuloa käyttämään Annan Kalaopasta! Annan Kalaopas auttaa Sinua
          tekemään vastuullisia kalavalintoja. Opas ohjaa vastuulliseen
          kuluttamiseen liikennevaloin. Oppaan suosituksia seuraamalla voit olla
          mukana vaikuttamassa siihen, ettei maailman meriä kalasteta tyhjiksi.
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Hae lajia..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);

            if (!value) {
              setFilteredMedia(mediaArray);
              return;
            }

            handleSearch(value);
          }}
          className="w-full rounded border border-gray-400 bg-gray-100 p-3 text-sm text-black shadow-inner"
        />
      </div>

      {selectedItem && (
        <SingleView item={selectedItem} setSelectedItem={setSelectedItem} />
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredMedia.map((item) => (
          <MediaRow
            key={item.media_id}
            item={item}
            setSelectedItem={setSelectedItem}
            onDelete={handleDelete}
          />
        ))}
      </section>
    </>
  );
};

export default Home;
