import useForm from '../hooks/formHooks';
import type {Credentials} from '../types/LocalTypes';
import {useUserContext} from '../hooks/ContextHooks';
import {Button} from './ui/button';

const LoginForm = () => {
  const initValues: Credentials = {
    username: '',
    password: '',
  };
  const {handleLogin} = useUserContext();

  const doLogin = async () => {
    try {
      // eslint-disable-next-line react-hooks/immutability
      handleLogin(inputs as Credentials);
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doLogin,
    initValues,
  );

  return (
    <>
      <h2 className="rounded bg-linear-to-b from-blue-600 to-blue-800 px-3 py-2 text-xl font-bold text-white shadow-sm text-center max-w-md mx-auto mt-4">Login</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full p-3 overflow-hidden bg-gray-200 border border-gray-400 rounded-md mx-auto mt-4 mb-8 flex max-w-md flex-col gap-4 shadow"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700" htmlFor="loginusername">
            Käyttäjätunnus
          </label>
          <input
            className="rounded border border-gray-400 bg-gray-100 p-3 text-sm text-gray-700 shadow-inner px-3 py-2 transition outline-none focus:ring-2 focus:ring-blue-500"
            name="username"
            type="text"
            id="loginusername"
            onChange={handleInputChange}
            autoComplete="username"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700" htmlFor="loginpassword">
            Salasana
          </label>
          <input
            className="rounded border border-gray-400 bg-gray-100 p-3 text-sm text-gray-700 shadow-inner px-3 py-2 transition outline-none focus:ring-2 focus:ring-blue-500"
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <Button className="mt-2 w-full border border-blue-700 bg-linear-to-b from-blue-400 to-blue-600 text-white shadow hover:from-blue-500 hover:to-blue-700 font-semibold" type="submit">
          Kirjaudu
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
