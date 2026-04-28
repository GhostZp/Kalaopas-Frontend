import type {MediaItem} from 'hybrid-types/DBTypes';
import {useLocation, useNavigate} from 'react-router';
import {Button} from '../components/ui/button';

const Single = () => {
  const navigate = useNavigate();
  const {state} = useLocation();

  const item = state.item as MediaItem;

  return (
    <dialog open>
      {item && (
        <>
          <Button onClick={() => navigate(-1)}>Takaisin</Button>
          <h2>{item.fish_name}</h2>

          {item.media_type.split('/')[0] === 'image' && (
            <img src={item.filename} alt={item.description || item.fish_name} />
          )}
          {item.media_type.split('/')[0] === 'video' && (
            <video src={item.filename} controls />
          )}

          <p>{item.description}</p>

          {item.source && (
            <p>
              <strong>Lähde:</strong>{' '}
              <a href={item.source} target="_blank" rel="noopener noreferrer">
                {item.source}
              </a>
            </p>
          )}

          {item.recipe && (
            <div>
              <strong>Resepti:</strong>
              <p>{item.recipe}</p>
            </div>
          )}

          <p>
            Ladattu {new Date(item.created_at).toLocaleString('en-fi')} käyttäjän
            id: {item.user_id}
          </p>
        </>
      )}
    </dialog>
  );
};

export default Single;
