// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from '@sanity/client';

const config = {
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bl0d60x6',
  useCdn: process.env.NODE_ENV === 'production',
  token:
    process.env.SANITY_API_TOKEN ||
    'skk8OFWW0JxGksWBnTHGmQPdFHNGPc6liqH3bdmnBioj3KwJzLdmNTmGiiuCHnYuhr9YAK6um9jMi7Ehji9nOwLCbSJHFYui4OZrF54olmhdaI2C7z7Fos2jsYVZ5yoreZftaITXK0Sz9BsWMtwgHCD4RyURXLNi2ngDdgBCRj56rc5WW5cu',
};

const client = sanityClient(config);

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = JSON.parse(
    req.body
  );

  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `Couldn't submit comment`, err });
  }

  res.status(200).json({ message: 'Comment Submitted' });
}
