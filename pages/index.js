import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const people = [
  { id: 1, name: 'Tony Stark', unavailable: false },
  { id: 2, name: 'himself', unavailable: false },
  { id: 3, name: 'Neo (The Matrix 1999)', unavailable: false },
  { id: 4, name: 'Buzz Lightyear', unavailable: false },
  { id: 5, name: 'Spider-Man', unavailable: false },
  { id: 6, name: 'Maverick (Top Gun)', unavailable: false },
];

const styleOfList = [
  { id: 1, name: 'a comic book character', unavailable: false },
  { id: 2, name: 'a computer animated Pixar character', unavailable: false },
  { id: 3, name: 'a renaissance portrait', unavailable: false },
  { id: 4, name: 'an anime character', unavailable: false },
  { id: 5, name: 'a cartoon drawing', unavailable: false },
  { id: 6, name: 'a studio portrait', unavailable: false },
];

const artistInspirations = [
  {
    id: 1,
    name: 'Greg Rutkowski, Syd Mead, James Gilleard',
    unavailable: false,
  },
  {
    id: 2,
    name: 'Vincent Van Gogh, Pablo Picasso, Paul Cezanne',
    unavailable: false,
  },
  {
    id: 3,
    name: 'Leonardo Da Vinci, Michelangelo Buonarroti',
    unavailable: false,
  },
  {
    id: 4,
    name: 'Jack Kirby, Stan Lee, Jim Lee, John Byrne',
    unavailable: false,
  },
  { id: 5, name: 'Stanley Artgerm Lau', unavailable: false },
];

const mediums = [
  { id: 1, name: 'cell-shaded illustration, low detail', unavailable: false },
  { id: 2, name: 'hyper realistic, highly detailed', unavailable: false },
  {
    id: 3,
    name: 'oil painting on canvas, dynamic textures',
    unavailable: false,
  },
  { id: 4, name: 'pastel art, muted colors', unavailable: false },
];

const vibes = [
  { id: 1, name: 'cyberpunk, metallic, futuristic', unavailable: false },
  { id: 2, name: 'warm colors, dynamic, studio lighting', unavailable: false },
  { id: 3, name: 'travelling in space', unavailable: false },
];

const initialEnvironment =
  'background bokeh, abstract, colorful, busy cityscape';

const initialDescriptors = '4k, UHD, intricate, elegant, artstation';

const maxRetries = 20;

const Home = () => {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);
  const [selectedStyleOf, setSelectedStyleOf] = useState(styleOfList[0]);
  const [selectedArtistInspiration, setSelectedArtistInspiration] = useState(
    artistInspirations[0]
  );
  const [selectedMedium, setSelectedMedium] = useState(mediums[0]);
  const [selectedVibe, setSelectedVibe] = useState(vibes[0]);
  const [environment, setEnvironment] = useState(initialEnvironment);
  const [descriptors, setDescriptors] = useState(initialDescriptors);
  const [img, setImg] = useState('');
  const [retry, setRetry] = useState(0);
  const [retryError, setRetryError] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('');
  const fullPrompt = `Depict Nate as ${selectedPerson.name} in the style of ${selectedStyleOf.name}, artistically inspired by ${selectedArtistInspiration.name}, using ${selectedMedium.name}, ${selectedVibe.name}, with ${environment}, with ${descriptors}`;

  const generateAction = async () => {
    console.log('Generating...');
    if (isGenerating && retry === 0) return;

    setIsGenerating(true);

    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input: fullPrompt }),
    });

    const data = await response.json();

    // If model still loading, drop that retry time
    if (response.status === 503) {
      setRetry(data.estimated_time);
      setRetryError('The Nate machine is warming up... please wait a moment.');
      return;
    }

    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      setIsGenerating(false);
      return;
    }

    setRetryError('');
    setFinalPrompt(fullPrompt);
    setImg(data.image);
    setIsGenerating(false);
  };

  useEffect(() => {
    const sleep = (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };

    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(
          `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
        );
        setRetryCount(maxRetries);
        return;
      }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);

  return (
    <div className='w-full min-h-screen flex items-center justify-start md:justify-center bg-gradient-to-tr from-black to-indigo-800'>
      <Head>
        <title>Supernate Generator | buildspace</title>
      </Head>
      <div className='my-16 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-16'>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col gap-4'>
            <h1 className='text-white text-4xl md:text-7xl font-bold tracking-tight'>
              SuperNate Generator
            </h1>
            <h2 className='text-xl text-gray-100'>
              What would Nate look like if he was a superhero depicted in
              various artistic styles?
            </h2>
          </div>
          <div className='w-full h-px bg-white' />
          <div className='flex flex-wrap'>
            <span className='text-xl text-gray-300'>Depict Nate as</span>
            <Listbox
              value={selectedPerson}
              onChange={setSelectedPerson}
              as='div'
              className='relative'
            >
              <Listbox.Button className='flex items-center mx-4 text-xl text-left text-orange-300'>
                {selectedPerson.name}
                <ChevronDownIcon className='w-5 h-5 ml-2' />
              </Listbox.Button>
              <Listbox.Options className='w-full z-10 absolute top-10 py-2 bg-white rounded-xl'>
                {people.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className='text-black'
                    value={person}
                    disabled={person.unavailable}
                  >
                    <button
                      className={`px-4 py-1 w-full flex justify-between text-left ${
                        selectedPerson.name === person.name
                          ? 'font-bold bg-gray-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {person.name}
                      {selectedPerson.name === person.name && (
                        <CheckIcon className='w-5 h-5 mr-2' />
                      )}
                    </button>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
            <span className='text-xl text-gray-300'>in the style of </span>
            <Listbox
              value={selectedStyleOf}
              onChange={setSelectedStyleOf}
              as='div'
              className='relative'
            >
              <Listbox.Button className='flex items-center mx-4 text-xl text-left text-orange-300'>
                {selectedStyleOf.name}
                <ChevronDownIcon className='w-5 h-5 ml-2' />
              </Listbox.Button>
              <Listbox.Options className='w-full z-10 absolute top-10 py-2 bg-white rounded-xl'>
                {styleOfList.map((styleOf) => (
                  <Listbox.Option
                    key={styleOf.id}
                    className='text-black'
                    value={styleOf}
                    disabled={styleOf.unavailable}
                  >
                    <button
                      className={`px-4 py-1 w-full flex justify-between text-left ${
                        selectedStyleOf.name === styleOf.name
                          ? 'font-bold bg-gray-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {styleOf.name}
                      {selectedStyleOf.name === styleOf.name && (
                        <CheckIcon className='w-5 h-5 mr-2' />
                      )}
                    </button>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Listbox
              value={selectedArtistInspiration}
              onChange={setSelectedArtistInspiration}
              as='div'
              className='relative'
            >
              <div className='flex flex-col gap-2'>
                <Listbox.Label className='text-xl text-gray-100'>
                  Artist Inspiration
                </Listbox.Label>
                <Listbox.Button className='p-4 w-full flex justify-between items-center bg-gray-900 text-base md:text-xl text-white text-left rounded-xl border-gray-500 border'>
                  {selectedArtistInspiration.name}
                  <ChevronDownIcon className='w-5 h-5 ml-2' />
                </Listbox.Button>
              </div>
              <Listbox.Options className='w-full z-10 absolute top-10 py-2 bg-white rounded-xl'>
                {artistInspirations.map((artistInspiration) => (
                  <Listbox.Option
                    key={artistInspiration.id}
                    className='text-black'
                    value={artistInspiration}
                    disabled={artistInspiration.unavailable}
                  >
                    <button
                      className={`px-4 py-1 w-full flex justify-between text-left ${
                        selectedArtistInspiration.name ===
                        artistInspiration.name
                          ? 'font-bold bg-gray-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {artistInspiration.name}
                      {selectedArtistInspiration.name ===
                        artistInspiration.name && (
                        <CheckIcon className='w-5 h-5 mr-2' />
                      )}
                    </button>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
            <Listbox
              value={selectedMedium}
              onChange={setSelectedMedium}
              as='div'
              className='relative'
            >
              <div className='flex flex-col gap-2'>
                <Listbox.Label className='text-xl text-gray-100'>
                  Medium
                </Listbox.Label>
                <Listbox.Button className='p-4 w-full flex justify-between items-center bg-gray-900 text-base md:text-xl text-white text-left rounded-xl border-gray-500 border'>
                  {selectedMedium.name}
                  <ChevronDownIcon className='w-5 h-5 ml-2' />
                </Listbox.Button>
              </div>
              <Listbox.Options className='w-full z-10 absolute top-10 py-2 bg-white rounded-xl'>
                {mediums.map((medium) => (
                  <Listbox.Option
                    key={medium.id}
                    className='text-black'
                    value={medium}
                    disabled={medium.unavailable}
                  >
                    <button
                      className={`px-4 py-1 w-full flex justify-between text-left ${
                        selectedMedium.name === medium.name
                          ? 'font-bold bg-gray-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {medium.name}
                      {selectedMedium.name === medium.name && (
                        <CheckIcon className='w-5 h-5 mr-2' />
                      )}
                    </button>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
            <Listbox
              value={selectedVibe}
              onChange={setSelectedVibe}
              as='div'
              className='relative'
            >
              <div className='flex flex-col gap-2'>
                <Listbox.Label className='text-xl text-gray-100'>
                  Vibe
                </Listbox.Label>
                <Listbox.Button className='p-4 w-full flex justify-between items-center bg-gray-900 text-base md:text-xl text-white text-left rounded-xl border-gray-500 border'>
                  {selectedVibe.name}
                  <ChevronDownIcon className='w-5 h-5 ml-2' />
                </Listbox.Button>
              </div>
              <Listbox.Options className='w-full z-10 absolute top-10 py-2 bg-white rounded-xl'>
                {vibes.map((vibe) => (
                  <Listbox.Option
                    key={vibe.id}
                    className='text-black'
                    value={vibe}
                    disabled={vibe.unavailable}
                  >
                    <button
                      className={`px-4 py-1 w-full flex justify-between text-left ${
                        selectedVibe.name === vibe.name
                          ? 'font-bold bg-gray-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {vibe.name}
                      {selectedVibe.name === vibe.name && (
                        <CheckIcon className='w-5 h-5 mr-2' />
                      )}
                    </button>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-2'>
              <label className='text-xl text-gray-100'>Environment</label>
              <textarea
                className='p-4 w-full bg-gray-900 text-base md:text-xl text-left text-white rounded-xl border-gray-500 border'
                value={environment}
                onChange={(event) => setEnvironment(event.target.value)}
                rows={4}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-xl text-gray-100'>Descriptors</label>
              <textarea
                className='p-4 w-full bg-gray-900 text-base md:text-xl text-left text-white rounded-xl border-gray-500 border'
                value={descriptors}
                onChange={(event) => setDescriptors(event.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className='w-full h-px bg-white' />
          <div className='flex flex-col gap-4'>
            <div className='text-lg text-gray-200'>Full prompt</div>
            <div className='text-base text-gray-200'>{fullPrompt}</div>
          </div>
          <div className='flex flex-col gap-4'>
            {retryError ? (
              <div className='p-2 bg-red-500 rounded-lg text-white'>
                {retryError}
              </div>
            ) : (
              ''
            )}
            <div className='flex flex-row justify-end'>
              <button
                className={`px-8 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white ${
                  isGenerating ? 'loading' : 'hover:bg-gray-100'
                }`}
                onClick={generateAction}
              >
                <div className='generate'>
                  {isGenerating ? (
                    <span className='loader'></span>
                  ) : (
                    <p>Generate</p>
                  )}
                </div>
              </button>
            </div>
          </div>
          <div className='hidden md:flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-gray-100'>
              About this project
            </h2>
            <h2 className='max-w-lg text-base text-gray-300'>
              This project is built with Stable Diffusion for ML image
              diffusion, Dreambooth for training implementation and Hugging
              Face for hosting the pre-trained models. It is password-protected
              to prevent malicious use.
            </h2>
          </div>
        </div>
        {img && (
          <div className='flex flex-col items-center gap-2'>
            <Image
              className='rounded-lg'
              src={img}
              width={512}
              height={512}
              alt={finalPrompt}
            />
            <p className='text-white'>{finalPrompt}</p>
          </div>
        )}
        <div className='flex md:hidden flex-col gap-4'>
          <h2 className='text-xl font-bold text-gray-100'>
            About this project
          </h2>
          <h2 className='max-w-lg text-base text-gray-300'>
            This project is built with Stable Diffusion for ML image diffusion,
            Dreambooth for training implementation and Hugging Face for hosting
            the pre-trained models. It is password-protected to prevent
            malicious use.
          </h2>
        </div>
      </div>
      <div className='badge-container grow'>
        <a
          href='https://buildspace.so/builds/ai-avatar'
          target='_blank'
          rel='noreferrer'
        >
          <div className='badge'>
            <Image src={buildspaceLogo} alt='buildspace logo' />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
