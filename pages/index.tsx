import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/Header';
import { sanityClient, urlFor } from '../sanity';
import { Post } from '../typings';

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  console.log(posts);

  return (
    <div className='max-x-7xl mx-auto'>
      <Head>
        <title>Medium 2.0</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0'>
        <div className='px-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'>
            <span className='underline decoration-black decoration-4 pr-3'>
              Travel
            </span>
            is the only thing you buy that makes you richer
          </h1>
          <h2>
            Do not follow where the path may lead. Go
            instead where there is no path and leave a trail
          </h2>
        </div>

        <img
          className='hidden md:inline-flex h-60 lg:h-full p-3'
          src='/images/logo-large.png'
          alt='logo'
        />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/post/${post.slug.current}`}
          >
            <div className=' border rounded-lg group cursor-pointer overflow-hidden'>
              <img
                className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-out'
                src={urlFor(post.mainImage).url()!}
                alt=''
              />
              <div className='flex justify-between p-5'>
                <div>
                  <p className='text-lg font-bold'>
                    {post.title}
                  </p>
                  <p className='text-xs'>
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className='h-12 w-12 rounded-full object-cover'
                  src={urlFor(post.author.image).url()}
                  alt=''
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type=="post"]{
    _id,
    title,
    author ->{
    name, image
  },
  description, mainImage,
  slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
