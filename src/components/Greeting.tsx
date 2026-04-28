// TEMP Greeting & dummylogin example

import {useState} from 'react';
import {Button} from './ui/button';

const UserGreeting = () => {
  return <p>Terve kirjautunut käyttäjä!</p>;
};

const GuestGreeting = () => {
  return <p>Terve vieras!</p>;
};

const Greeting = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
      {!isLoggedIn && (
        <Button
          onClick={() => {
            setIsLoggedIn(true);
          }}
        >
          Login
        </Button>
      )}
      {/* toinen tapa, toggle-nappula (huom. jsx:n sisällä oleva kommentti)*/}
      <Button
        onClick={() => {
          // kommentit toimii normaalisti koodin sisällä
          setIsLoggedIn(!isLoggedIn);
        }}
      >
        {isLoggedIn ? 'Log out' : 'Login'}
      </Button>
    </>
  );
};

export default Greeting;
