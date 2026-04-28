// import {Navigate} from 'react-router';
import {useUserContext} from '../hooks/ContextHooks';

const Logout = () => {
  const {handleLogout} = useUserContext();
  handleLogout();

  return (
    <>
      <p>Uloskirjautminen</p>
      {/*
      // declarative
      <Navigate to={'/'} />
      */}
    </>
  );
};

export default Logout;
