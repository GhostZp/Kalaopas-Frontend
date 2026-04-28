import type {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useUserContext} from '../hooks/ContextHooks';
import {Button} from './ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

interface MediaRowProps {
  item: MediaItemWithOwner;
  setSelectedItem: (item: MediaItemWithOwner | undefined) => void;
  onDelete?: (media_id: number) => Promise<void>;
}

const MediaRow = (props: MediaRowProps) => {
  const {item, setSelectedItem, onDelete} = props;
  const {user} = useUserContext();

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      await onDelete(item.media_id);
    } catch (err) {
      console.error('deletion failed', err);
    }
  };

  const sustainabilityStyles = {
    green: {
      color: 'bg-green-500',
      label: 'Paras valinta',
    },
    yellow: {
      color: 'bg-yellow-400 text-black',
      label: 'Harkitse',
    },
    red: {
      color: 'bg-red-500',
      label: 'Vältä',
    },
  };

  return (
    <Card className="w-full overflow-hidden border border-gray-400 bg-gray-200 p-3">
      {' '}
      <div className="relative">
        <img
          className="h-72 w-full cursor-pointer rounded border-b border-gray-400 object-cover"
          src={item.thumbnail}
          alt={item.fish_name}
          onClick={() => setSelectedItem(item)}
        />

        <div
          className={`absolute top-2 right-2 rounded-full px-3 py-1 text-xs font-semibold text-white shadow ${
            sustainabilityStyles[item.sustainability].color
          }`}
        >
          {sustainabilityStyles[item.sustainability].label}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="rounded bg-linear-to-b from-blue-500 to-blue-700 px-3 py-2 text-xl font-bold text-white shadow-sm">
          {' '}
          {item.fish_name}
        </CardTitle>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span
            className={`h-3 w-3 rounded-full ${
              sustainabilityStyles[item.sustainability].color
            }`}
          />
          <span className="text-gray-700">
            {sustainabilityStyles[item.sustainability].label}
          </span>
        </div>
        <CardDescription className="line-clamp-3 rounded border border-gray-400 bg-gray-100 p-3 text-sm text-gray-700 shadow-inner">
          {' '}
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full border border-blue-700 bg-linear-to-b from-blue-400 to-blue-600 text-white shadow hover:from-blue-500 hover:to-blue-700"
          onClick={() => {
            setSelectedItem(item);
          }}
        >
          Avaa
        </Button>
        {user &&
          (user.user_id === item.user_id || user?.level_name === 'Admin') && (
            <>
              <Button
                variant="destructive"
                className="w-full border border-red-700 bg-linear-to-b from-red-400 to-red-600 text-white shadow hover:from-red-500 hover:to-red-700"
                onClick={handleDelete}
              >
                Poista
              </Button>
            </>
          )}
      </CardFooter>
    </Card>
  );
};

export default MediaRow;
