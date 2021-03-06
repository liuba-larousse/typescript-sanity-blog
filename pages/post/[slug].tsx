import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { Post } from '../../typings';
import { GetStaticProps } from 'next/types';

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  // const onSubmit: SubmitHandler<IFormInput>
  const onSubmit: SubmitHandler<IFormInput> = async (
    data
  ) => {
    console.log('data after submit', data);
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log('data', data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log('err', err);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Header />

      <img
        className='w-full h-40 object-cover'
        src={urlFor(post.mainImage).url()!}
        alt=''
      />
      <article className='max-w-3xl mx-auto p-5'>
        <h1 className='text-3xl mt-10 mb-3'>
          {post.title}
        </h1>
        <h2 className='tsxt-xl font-light text-gray-500'>
          {post.description}
        </h2>
        <div className='flex items-center space-x-2 my-5'>
          <img
            className='h-12 w-12 rounded-full object-cover'
            src={urlFor(post.author.image).url()}
            alt=''
          />
          <p className='font-light text-sm'>
            Blog post by
            <span className='text-green-600 px-1'>
              {post.author.name}
            </span>
            - Published at
            <span className='px-1'>
              {new Date(post._createdAt).toLocaleString()}
            </span>
          </p>
        </div>
        <div>
          <PortableText
            className=''
            dataset={'production'}
            projectId={'bl0d60x6'}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1
                  className='text-2xl font-bold my-5'
                  {...props}
                />
              ),
              h2: (props: any) => (
                <h2
                  className='text-xl font-bold my-5'
                  {...props}
                />
              ),
              p: (props: any) => (
                <p className='my-5' {...props} />
              ),

              li: ({ children }: any) => (
                <li className='ml-4 list-disc'>
                  {children}
                </li>
              ),
              link: ({ href, children }: any) => (
                <a
                  href={href}
                  className='text-blue-500 hover:underline'
                >
                  {children}
                </a>
              ),
              figure: ({ children }: any) => (
                <figure className='my-5'>{children}</figure>
              ),
            }}
          />
        </div>
      </article>

      <hr className='max-w-lg my-5 mx-auto border-yellow-500' />

      {submitted ? (
        <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
          <h3 className='text-3xl font-bold'>
            Thank you for submitting your comment
          </h3>
          <p>
            Once it has been approved, it will apear below
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col p-5  max-w-2xl mx-auto mb-10'
        >
          <h3 className='text-sm text-yellow-500'>
            Enjoyed the article?
          </h3>
          <h4 className='text-3xl font-bold'>
            Leave the comment below!
          </h4>
          <hr className='py-3 mt-2' />

          <input
            {...register('_id')}
            type='hidden'
            name='_id'
            value={post._id}
          />

          <label className='flex flex-col mb-5 '>
            <span className='text-grey-700'>Name</span>
            <input
              {...register('name', { required: true })}
              className='shadow border rounded py-2 px-3 form-input mt-1 block-w-full  focus:outline-none focus:ring focus:ring-yellow-500'
              placeholder='Lila Lola'
              type='text'
            />
          </label>
          <label className='flex flex-col mb-5'>
            <span className='text-grey-700'>Email</span>
            <input
              {...register('email', { required: true })}
              className='shadow border rounded py-2 px-3 form-input mt-1 block-w-full focus:outline-none  focus:ring focus:ring-yellow-500'
              placeholder='Lila Lola'
              type='text'
            />
          </label>
          <label className='flex flex-col mb-5'>
            <span className='text-grey-700'>Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className='shadow border rounded-py-2 px-3 form-textarea mt-1 block-w-full focus:outline-none focus:ring focus:ring-yellow-500'
              placeholder='Lila Lola'
              rows={8}
            />
          </label>
          {/* errors */}
          <div className='flex flex-col p-5'>
            {errors.name && (
              <span className='text-red-500'>
                The name field is required
              </span>
            )}
            {errors.comment && (
              <span className='text-red-500'>
                The comment field is required
              </span>
            )}
            {errors.email && (
              <span className='text-red-500'>
                The email field is required
              </span>
            )}
          </div>

          <input
            className='shadow bg-yellow-500 hover:bg-yellow-400 py-2 px-4 rounded cursor-pointer focus:shadow-outline text-white font-bold'
            type='submit'
          />
        </form>
      )}

      {/* Comments */}
      <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-md shadow-yellow-500 space-y-2'>
        <h3 className='text-4xl'> Comments</h3>
        <hr className='pb-2' />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className='text-yelloow-500'></span>
              {comment.name} : {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type=="post"]{
    _id,
  slug{
    current
  }
  }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}) => {
  const query = `
    *[_type=="post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author ->{
        name,
        image
      },
      "comments":*[
        _type == "comment" &&
        post._ref == ^._id &&
        approved == true],
      description,
      mainImage,
      slug,
      body
      }
    `;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
  revalidate: 60; //after 60 seconds it will update the page
};
