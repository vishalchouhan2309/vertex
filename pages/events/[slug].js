import React from 'react';
import samplePoster from '../../public/sample-poster.jpg';
import Image from 'next/image';
import { prisma } from '@/prisma/client';
import Link from 'next/link';
import moment from 'moment/moment';
import { FiCalendar } from 'react-icons/fi';
import { TbCoinRupee, TbTrophy } from 'react-icons/tb';
import parse from 'html-react-parser';
import Navbar from '@/Components/Navbar';
import Head from 'next/head';
import { BsFillRocketTakeoffFill } from 'react-icons/bs';
import MainLayout from '@/Components/MainLayout';

function EventPage({ eventData }) {
  console.log(eventData);
  return (
    <>
      <Head>
        <title>{eventData.name}</title>
        <meta name='title' content={`${eventData.name}`} />
        <meta name='description' content={`${eventData.summary}`} />

        <meta property='og:type' content='website' />
        <meta
          property='og:url'
          content={'https://vertechx.mvjce.edu.in/' + eventData.slug}
        />
        <meta property='og:title' content={`${eventData.name}`} />
        <meta property='og:description' content={`${eventData.summary}`} />
        <meta property='og:image' content={eventData.poster} />
      </Head>
      <MainLayout>
        <div className='w-full  bg-no-repeat items-center bg-cover md:px-32 mt-24 flex flex-col  dark:text-white min-h-screen h-full gap-8 p-2 md:p-6'>
          <div className='flex flex-col md:flex-row-reverse justify-between gap-4 md:gap-36 w-[95%] md:w-[100%] items-start h-max bg-black bg-opacity-10 backdrop-blur-lg border border-gray-700 rounded-lg p-4 md:p-10'>
            <div className='basis-1/3 bg-blue-500 rounded-lg h-max'>
              <Image
                className='object-cover rounded-lg'
                alt='poster'
                width={600}
                height={600}
                src={eventData.poster}
              />
            </div>
            <div className='basis-2/3  flex flex-col gap-2 justify-between items-start min-h-full h-max'>
              <div className='flex flex-col h-max'>
                <h1 className=' text-4xl md:text-6xl font-semibold'>
                  {eventData.name}
                </h1>
                <h3 className=' text-xl md:text-2xl font-normal text-slate-400'>
                  <Link
                    href={`/events?initialDepartment=${eventData.departmentId}`}
                  >
                    {eventData.department.name}
                  </Link>
                </h3>
                <div className='text-xl md:text-2xl mt-6 flex flex-row gap-2 items-center'>
                  <FiCalendar className='text-purple-500' />
                  <span>
                    {moment(eventData.date).format('MMMM Do YYYY, h:mm A')}
                  </span>
                </div>
                <p className='text-xl md:text-2xl mt-6 '>{eventData.summary}</p>
              </div>

              <div className='flex-col w-full gap-6 mt-6 h-full flex'>
                <div className='text-xl md:text-2xl  flex flex-row gap-2 items-center'>
                  <TbCoinRupee className='text-purple-500' size={30} />
                  <span>Registration Fee : </span>
                  <span>{eventData.registrationFee + ' '}INR</span>
                </div>
                <div className='text-xl md:text-2xl  flex flex-row gap-2 items-center'>
                  <TbTrophy className='text-purple-500' size={30} />
                  <span>Prize Money : </span>
                  <span>{eventData.prizeMoney + ' '}INR</span>
                </div>
                <Link legacyBehavior={true} href={eventData.formLink}>
                  <a
                    target='_blank'
                    ref
                    className='w-full md:w-2/5 flex flex-row justify-center gap-3 items-center rounded-md text-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300 hover:scale-105 cursor-pointer py-2 px-4'
                  >
                    <BsFillRocketTakeoffFill />
                    Register Now
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-between gap-4 w-[95%] md:w-full items-start bg-black bg-opacity-40 backdrop-blur-md border border-gray-700 rounded-lg p-8 md:p-10 mb-6'>
            <h3 className=' text-2xl md:text-3xl font-normal text-slate-100'>
              Event Overview
            </h3>
            <div className='prose prose-neutral dark:prose-invert prose-xl'>
              {parse(eventData.content)}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}

export default EventPage;

export async function getStaticPaths() {
  const eventSlugs = await prisma.event.findMany({
    select: {
      slug: true,
    },
  });
  console.log('Loaded Slugs: ', eventSlugs);
  const paths = eventSlugs.map((event) => {
    return {
      params: {
        slug: event.slug,
      },
    };
  });
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const event = await prisma.event.findUnique({
    where: {
      slug: slug,
    },
    include: {
      department: true,
    },
  });
  if (!event) {
    return {
      notFound: true,
    };
  }
  console.log('Loaded Event: ', event.name);
  return {
    props: {
      eventData: event,
    },
    revalidate: 60,
  };
}
