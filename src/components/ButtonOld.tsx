type ButtonType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  variant?: 'basic' | 'danger' | 'warning';
};

const ButtonOld = ({
  value,
  variant = 'basic',
  className = '',
  ...props
}: ButtonType) => {
  const baseClasses =
    'block w-full p-2 text-center transition-all duration-500 ease-in-out';
  let bgClasses = '';
  switch (variant) {
    case 'danger':
      bgClasses = 'bg-red-500 hover:bg-red-700';
      break;
    case 'warning':
      bgClasses = 'bg-yellow-500 hover:bg-yellow-700';
      break;
    default:
      bgClasses = 'bg-stone-500 hover:bg-stone-700';
      break;
  }
  return (
    <button {...props} className={`${baseClasses} ${bgClasses} ${className}`}>
      {value}
    </button>
  );
};

export default ButtonOld;
