/* eslint-disable import/no-extraneous-dependencies */
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE

  const [imgUrl, setImgUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function handleModalClose(): void {
    setImgUrl('');
    setIsOpen(false);
  }

  function viewImage(img: string): void {
    setImgUrl(img);
    setIsOpen(true);
  }

  console.log(cards);

  // TODO FUNCTION HANDLE VIEW IMAGE
  return (
    <>
      <SimpleGrid columns={3} spacing={5}>
        {cards.length &&
          cards.map(card => (
            <Card key={card.id} data={card} viewImage={viewImage} />
          ))}
      </SimpleGrid>

      <ModalViewImage
        imgUrl={imgUrl}
        isOpen={isOpen}
        onClose={handleModalClose}
      />
    </>
  );
}
