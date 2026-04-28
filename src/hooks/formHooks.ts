import React, {useState} from 'react';

const useForm = (callback: () => void, initState: Record<string, string>) => {
  const [inputs, setInputs] = useState(initState);

  const handleSubmit = (event: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    callback();
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const {name, value} = event.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    handleSubmit,
    handleInputChange,
    inputs,
    setInputs,
  };
};

export default useForm;
