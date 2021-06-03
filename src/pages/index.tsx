/* eslint-disable import/no-extraneous-dependencies */
import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    ({ pageParam = 0 }) => api.get(`/api/images?after=${pageParam}`),
    {
      getNextPageParam: (lastPage, pages) => lastPage.data,
    }
  );

  const formattedData = useMemo(() => {
    if (data) {
      const cards = [];
      data.pages.forEach(page => {
        page.data.data.forEach(register => {
          cards.push({
            title: register.title,
            description: register.description,
            url: register.url,
            ts: register.ts,
            id: register.id,
          });
        });
      });

      return cards;
    }
    return [];
  }, [data]);

  // TODO RENDER LOADING SCREEN

  // TODO RENDER ERROR SCREEN

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}
