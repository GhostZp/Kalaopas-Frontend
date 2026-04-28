import { useUserContext } from '../hooks/ContextHooks';
import { useState, useEffect } from 'react';
import { useLike } from '../hooks/apiHooks';
import type { MediaItemWithOwner } from 'hybrid-types/DBTypes';
import MediaRow from '../components/MediaRow';
import SingleView from '../components/SingleView';

const MyUploads = () => {
  const { user } = useUserContext();
  const { getUserLikedMedia } = useLike();

  const [favorites, setFavorites] = useState<MediaItemWithOwner[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<MediaItemWithOwner[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<
    MediaItemWithOwner | undefined
  >(undefined);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!user || !token) {
        setIsLoading(false);
        return;
      }

      try {
        const likedMedia = await getUserLikedMedia(user.user_id, token);
        setFavorites(likedMedia);
        setFilteredFavorites(likedMedia);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
        setFavorites([]);
        setFilteredFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    setFilteredFavorites(favorites);
  }, [favorites]);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredFavorites(favorites);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filtered = favorites.filter((item) =>
      item.fish_name?.toLowerCase().startsWith(lowerQuery)
    );

    setFilteredFavorites(filtered);
  };

  const handleUnlike = async (media_id: number) => {
    setFavorites((prev) => prev.filter((item) => item.media_id !== media_id));
  };

  if (isLoading) {
    return <div className="text-center py-8">Ladataan tykkäyksiä...</div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Ei tykkäyksiä vielä. Tykkää mediasta nähdäksesi ne tässä!</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 space-y-3 text-center text-sm text-gray-600">
        <p className="line-clamp-3 rounded border border-gray-400 bg-gray-100 p-3 text-sm text-gray-700 shadow-inner">
          Täältä löydät kaikki tykkäämäsi kalat. Voit poistaa tykkäyksen
          klikkaamalla tähteä uudestaan.
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Hae suosikeista..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            handleSearch(value);
          }}
          className="w-full rounded border border-gray-400 bg-gray-100 p-3 text-sm text-black shadow-inner"
        />
      </div>

      {selectedItem && (
        <SingleView item={selectedItem} setSelectedItem={setSelectedItem} />
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredFavorites.map((item) => (
          <MediaRow
            key={item.media_id}
            item={item}
            setSelectedItem={setSelectedItem}
            onDelete={handleUnlike}
          />
        ))}
      </section>
    </>
  );
};

export default MyUploads;
