import {useEffect, useReducer, useState} from 'react';
import type {Like, MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useLike} from '../hooks/apiHooks';
import {Button} from './ui/button';
import {Star} from 'lucide-react';

type LikesType = {
  item: MediaItemWithOwner | undefined;
};

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction = {
  type: 'setLikeCount' | 'like';
  like?: Like | null;
  count?: number;
};

const likeInitialState: LikeState = {
  count: 0,
  userLike: null,
};

const Likes = ({item}: LikesType) => {
  const [likeState, likeDispatch] = useReducer(likeReducer, likeInitialState);

  const {postLike, deleteLike, getCountByMediaId, getUserLike} = useLike();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const getLikes = async () => {
    const token = localStorage.getItem('token');

    if (!item || !token) {
      return;
    }

    try {
      const userLike = await getUserLike(item.media_id, token);
      likeDispatch({type: 'like', like: userLike});
    } catch (error) {
      likeDispatch({type: 'like', like: null});
      console.log('get user like error', (error as Error).message);
    }
  };

  const getLikeCount = async () => {
    if (!item) {
      return;
    }

    try {
      const {count} = await getCountByMediaId(item.media_id);
      likeDispatch({type: 'setLikeCount', count});
    } catch (error) {
      console.log('get user like error', (error as Error).message);
    }
  };

  useEffect(() => {
    getLikes();
    getLikeCount();
  }, []);

  function likeReducer(state: LikeState, action: LikeAction): LikeState {
    switch (action.type) {
      case 'setLikeCount':
        return {...state, count: action.count ?? 0};
      case 'like':
        if (action.like !== undefined) {
          return {...state, userLike: action.like};
        }
        return state;
      default:
        return state;
    }
  }

  const handleLike = async () => {
    const token = localStorage.getItem('token');

    if (!item) return;

    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      if (likeState.userLike) {
        await deleteLike(likeState.userLike.like_id, token);
      } else {
        await postLike(item.media_id, token);
      }

      getLikes();
      getLikeCount();
    } catch (e) {
      console.log('like error', (e as Error).message);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={handleLike} title={!localStorage.getItem('token') ? 'Kirjaudu sisään tallentaaksesi kalan!' : ''}>
        {likeState.userLike ? (
          <Star
            className={likeState.userLike ? 'text-yellow-400' : ''}
            fill={likeState.userLike ? 'currentColor' : 'none'}
          />
        ) : (
          <Star />
        )}
      </Button>
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
            <p className="mb-4 text-lg font-medium">
              Kirjaudu sisään tallentaaksesi kalan! 🐟
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="rounded bg-blue-600 px-4 py-2 text-white"
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                Kirjaudu sisään
              </button>

              <button
                className="rounded bg-gray-300 px-4 py-2"
                onClick={() => setShowLoginPrompt(false)}
              >
                Peruuta
              </button>
            </div>
          </div>
        </div>
      )}

      <span className="text-sm font-medium text-gray-700">
        {likeState.count}
      </span>
    </div>
  );
};

export default Likes;
