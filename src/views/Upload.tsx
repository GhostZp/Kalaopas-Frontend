import {useRef, useState} from 'react';
import useForm from '../hooks/formHooks';
import {useFile, useMedia} from '../hooks/apiHooks';
import {Button} from '../components/ui/button';

const Upload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const {postFile} = useFile();
  const {postMedia} = useMedia();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const initValues = {
    fish_name: '',
    description: '',
    source: '',
    recipe: '',
    sustainability: 'red',
  };

  const doUpload = async () => {
    const token = localStorage.getItem('token');
    if (!file || !token) {
      console.log('doUpload file or token falsy');
      return;
    }
    setUploading(true);
    try {
      const uploadResponse = await postFile(file, token);
      console.log('file upload response', uploadResponse);
      const mediaResponse = await postMedia(uploadResponse, inputs, token);
      console.log('postMedia response', mediaResponse);
      // reset form (or redirect to home view)
      resetForm();
    } catch (error) {
      console.log((error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const {handleInputChange, handleSubmit, inputs, setInputs} = useForm(
    doUpload,
    initValues,
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.files);
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const resetForm = () => {
    setInputs(initValues);
    setFile(null);
    console.log(fileRef.current?.value);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  return (
    <>
      <h1 className="rounded bg-linear-to-b from-blue-500 to-blue-700 px-3 py-2 text-xl font-bold text-white shadow-sm text-center">Julkaise kala mediaa</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full p-3 overflow-hidden bg-gray-200 border border-gray-400 rounded-md mx-auto mt-4 flex max-w-2xl flex-col gap-4 shadow"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="title">
            Kalan Nimi
          </label>
          <input
            className="rounded border border-gray-400 bg-gray-100 p-3 text-sm text-gray-700 shadow-inner px-3 py-2 transition outline-none focus:ring-2 focus:ring-blue-500"
            name="fish_name"
            type="text"
            id="title"
            onChange={handleInputChange}
            value={inputs.fish_name}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="description">
            Kuvaus
          </label>
          <textarea
            className="rounded border border-gray-400 bg-gray-100 p-3 text-sm text-gray-700 shadow-inner px-3 py-2 transition outline-none focus:ring-2 focus:ring-blue-500"
            name="description"
            rows={5}
            id="description"
            onChange={handleInputChange}
            value={inputs.description}
          ></textarea>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="source">
            Lähde (Link)
          </label>
          <input
            className="rounded border border-gray-400 bg-gray-100 p-3 text-sm text-gray-700 shadow-inner px-3 py-2 transition outline-none focus:ring-2 focus:ring-blue-500"
            name="source"
            type="url"
            id="source"
            onChange={handleInputChange}
            value={inputs.source}
            placeholder="https://example.com"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="recipe">
            Resepti (Link)
          </label>
          <input
            className="rounded border border-gray-400 bg-gray-100 p-3 text-sm text-gray-700 shadow-inner px-3 py-2 transition outline-none focus:ring-2 focus:ring-blue-500"
            name="recipe"
            type="url"
            id="recipe"
            onChange={handleInputChange}
            value={inputs.recipe}
            placeholder="https://example.com"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="sustainability">
            Elinvoimaisuus
          </label>
          <select
            className="rounded border border-gray-400 bg-gray-100 p-3 text-sm text-gray-700 shadow-inner px-3 py-2 transition outline-none focus:ring-2 focus:ring-blue-500"
            name="sustainability"
            id="sustainability"
            onChange={handleInputChange}
            value={inputs.sustainability}
          >
            <option value="green">Vihreä - Elinvoimainen</option>
            <option value="yellow">Keltainen - Varoitus</option>
            <option value="red">Punainen - Vältä</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="file">
            Media tiedosto
          </label>
          <input
            className="text-gray-700 file:bg-linear-to-b file:from-blue-400 file:to-blue-600 file:text-white hover:file:from-blue-500 hover:file:to-blue-700 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:font-semibold file:shadow"
            name="file"
            type="file"
            id="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
            ref={fileRef}
          />
        </div>
        <img
          className="mx-auto h-48 w-48 rounded border border-gray-400 object-cover"
          src={
            file
              ? URL.createObjectURL(file)
              : 'https://placehold.co/320x240?text=valitse+kuva'
          }
          alt="preview"
          width="200"
        />
        <Button
          className="w-full border border-blue-700 bg-linear-to-b from-blue-400 to-blue-600 text-white shadow hover:from-blue-500 hover:to-blue-700 font-semibold"
          type="submit"
          disabled={file && inputs.fish_name.length > 3 ? false : true}
        >
          Julkaise
        </Button>
      </form>
      <div className="mx-auto mt-4 w-full max-w-2xl">
        <Button
          variant="outline"
          className="w-full border border-gray-400 bg-gray-100 text-gray-700 shadow hover:bg-gray-200 font-semibold"
          onClick={resetForm}
        >
          Tyhjennä lomake
        </Button>
      </div>

      {uploading && (
        <p className="text-gray-700 mt-3 text-center font-semibold">
          Julkaisu käynnissä...
        </p>
      )}
    </>
  );
};

export default Upload;
