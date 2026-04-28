import type {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import Likes from './Likes';
import {Button} from './ui/button';
import {X} from 'lucide-react';

// Utility function to decode HTML entities
function decodeHtmlEntities(str: string) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

const sustainabilityStyles = {
  green: {
    color: 'bg-green-500',
    label: 'Paras valinta',
    text: 'Paras valinta. Tämä laji on kestävästi pyydetty tai kasvatettu.',
  },
  yellow: {
    color: 'bg-yellow-400 text-black',
    label: 'Harkitse',
    text: 'Harkitse käyttöä. Tämä laji ei ole täysin kestävästi pyydetty tai kasvatettu.',
  },
  red: {
    color: 'bg-red-500',
    label: 'Vältä',
    text: 'Vältä tätä lajia. Tämä laji ei ole kestävästi pyydetty tai kasvatettu.',
  },
};

const SingleView = (props: {
  item: MediaItemWithOwner | undefined;
  setSelectedItem: (item: MediaItemWithOwner | undefined) => void;
}) => {
  const {item, setSelectedItem} = props;

  if (!item) return null;


  const decodedSource = item.source ? decodeHtmlEntities(item.source) : '';
  const decodedRecipe = item.recipe ? decodeHtmlEntities(item.recipe) : '';

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex h-full w-full items-start justify-center overflow-y-auto bg-black/60 p-4 pt-12 md:pt-4"
    >
      <article className="relative h-fit w-full max-w-4xl rounded-lg border border-gray-400 bg-gray-200 shadow-xl">
        <Button
          className="absolute top-3 right-3 z-20 border border-gray-400 bg-gray-300 hover:bg-gray-400"
          onClick={() => setSelectedItem(undefined)}
          variant={'secondary'}
        >
          <X />
        </Button>

        <div className="relative">
          {item.media_type.split('/')[0] === 'image' && (
            <img
              className="max-h-[60vh] w-full rounded border border-gray-400 object-contain shadow-sm"
              src={item.filename}
              alt={item.description || item.fish_name}
            />
          )}
          {item.media_type.split('/')[0] === 'video' && (
            <video
              className="max-h-[60vh] w-full rounded border border-gray-400 object-contain shadow-sm"
              src={item.filename}
              controls
            />
          )}

          <div
            className={`absolute top-3 left-3 z-10 rounded-full px-4 py-1 text-sm font-semibold text-white shadow ${
              sustainabilityStyles[item.sustainability].color
            }`}
          >
            {sustainabilityStyles[item.sustainability].label}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <h3 className="rounded border border-blue-800 bg-linear-to-b from-blue-400 to-blue-700 px-3 py-2 text-center text-xl font-bold text-white shadow">
            {item.fish_name}
          </h3>

          <div
            className={`mt-3 rounded border p-3 text-sm shadow-sm ${
              item.sustainability === 'green'
                ? 'border-green-300 bg-green-50 text-green-800'
                : item.sustainability === 'yellow'
                  ? 'border-yellow-300 bg-yellow-50 text-yellow-800'
                  : 'border-red-300 bg-red-50 text-red-800'
            }`}
          >
            <p className="font-semibold">
              {sustainabilityStyles[item.sustainability].label}
            </p>
            <p>{sustainabilityStyles[item.sustainability].text}</p>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <Likes item={item} />
          </div>

          <div className="mt-3 rounded border border-gray-400 bg-white p-3 text-sm shadow-sm">
            {item.description}
          </div>

          {/* Source Link */}
          {decodedSource && (
            <div className="mt-3 rounded border border-gray-400 bg-blue-50 p-3 text-sm shadow-sm">
              <p className="font-semibold text-blue-800">Lähde</p>
              <a
                href={decodedSource}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-blue-600 underline"
              >
                {decodedSource}
              </a>
            </div>
          )}

          {/* Recipe Link */}
          {decodedRecipe && (
            <div className="mt-3 rounded border border-gray-400 bg-green-50 p-3 text-sm shadow-sm">
              <p className="font-semibold text-green-800">Resepti</p>
              <a
                href={decodedRecipe}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-green-600 underline"
              >
                {decodedRecipe}
              </a>
            </div>
          )}
        </div>
      </article>
    </dialog>
  );
};

export default SingleView;
