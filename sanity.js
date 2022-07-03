import {
  createCurrentUserHook,
  createClient,
} from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url';

export const config = {
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bl0d60x6',
  apiVersion: '2021-03-25',

  useCdn: process.env.NODE_ENV === 'production',
};

export const sanityClient = createClient(config);
console.log(sanityClient);

export const urlFor = (source) =>
  createImageUrlBuilder(config).image(source);

export const useCurrentUser = createCurrentUserHook(config);
