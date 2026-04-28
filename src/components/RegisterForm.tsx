import {useEffect, useState} from 'react';
import {useUser} from '../hooks/apiHooks';
import useForm from '../hooks/formHooks';
import type {RegisterCredentials} from '../types/LocalTypes';
import {Button} from './ui/button';

const RegisterForm = () => {
  const {postRegister, getUsernameAvailable, getEmailAvailable} = useUser();
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(true);
  const [emailAvailable, setEmailAvailable] = useState<boolean>(true);
  const [registerError, setRegisterError] = useState<string>('');

  const initValues: RegisterCredentials = {
    username: '',
    password: '',
    email: '',
  };
  const doRegister = async () => {
    try {
      // eslint-disable-next-line react-hooks/immutability
      const userResponse = await getUsernameAvailable(inputs.username);
      // check also useEffects below!
      setUsernameAvailable(userResponse.available);
      const emailResponse = await getEmailAvailable(inputs.email);
      setEmailAvailable(emailResponse.available);
      if (userResponse.available && emailResponse.available) {
        const result = await postRegister(inputs as RegisterCredentials);
        console.log('post registration result', result);
      }
    } catch (error) {
      console.log((error as Error).message);
      setRegisterError((error as Error).message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doRegister,
    initValues,
  );

  // option: check username & email availibilities based on state updates using useEffects
  useEffect(() => {
    const checkUsername = async () => {
      if (inputs.username.length > 2) {
        try {
          const userResponse = await getUsernameAvailable(inputs.username);
          setUsernameAvailable(userResponse.available);
        } catch (error) {
          console.log((error as Error).message);
        }
      }
    };
    checkUsername();
  }, [inputs.username, getUsernameAvailable]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const email = inputs.email;

      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      if (!isValidEmail) {
        setEmailAvailable(true); // reset UI state
        return;
      }

      getEmailAvailable(email)
        .then((res) => setEmailAvailable(res.available))
        .catch((err) => console.log(err.message));
    }, 400);

    return () => clearTimeout(timeout);
  }, [inputs.email, getEmailAvailable]);

  return (
    <>
      <h2 className="mx-auto mt-4 max-w-md rounded bg-linear-to-b from-blue-600 to-blue-800 px-3 py-2 text-center text-xl font-bold text-white shadow-sm">
        Register
      </h2>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-4 flex w-full max-w-md flex-col gap-4 overflow-hidden rounded-md border border-gray-400 bg-gray-200 p-3 shadow"
      >
        <div className="flex flex-col gap-1 text-gray-700">
          <label className="text-sm font-semibold" htmlFor="loginusername">
            Käyttäjätunnus
          </label>
          <input
            className="rounded border border-gray-400 bg-gray-100 p-3 px-3 py-2 text-sm text-gray-700 shadow-inner transition outline-none focus:ring-2 focus:ring-blue-500"
            name="username"
            type="text"
            id="loginusername"
            onChange={handleInputChange}
            autoComplete="username"
          />
          {!usernameAvailable && (
            <p className="text-sm text-red-700">
              Käyttäjätunnus ei ole käytettävissä
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 text-gray-700">
          <label className="text-sm font-semibold" htmlFor="email">
            Sähköposti
          </label>
          <input
            className="rounded border border-gray-400 bg-gray-100 p-3 px-3 py-2 text-sm text-gray-700 shadow-inner transition outline-none focus:ring-2 focus:ring-blue-500"
            name="email"
            type="text"
            id="email"
            onChange={handleInputChange}
            autoComplete="email"
          />
          {!emailAvailable && (
            <p className="text-sm text-red-700">
              Sähköposti ei ole käytettävissä
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 text-gray-700">
          <label className="text-sm font-semibold" htmlFor="password">
            Salasana
          </label>
          <input
            className="rounded border border-gray-400 bg-gray-100 p-3 px-3 py-2 text-sm text-gray-700 shadow-inner transition outline-none focus:ring-2 focus:ring-blue-500"
            name="password"
            type="password"
            id="password"
            onChange={handleInputChange}
          />
          {registerError && (
            <p className="text-sm text-red-700">{registerError}</p>
          )}
        </div>
        <Button
          className="mt-2 w-full border border-blue-700 bg-linear-to-b from-blue-400 to-blue-600 font-semibold text-white shadow hover:from-blue-500 hover:to-blue-700"
          type="submit" 
        >
          Rekisteröidy
        </Button>
      </form>
    </>
  );
};

export default RegisterForm;
