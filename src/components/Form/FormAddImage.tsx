/* eslint-disable import/no-extraneous-dependencies */
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

type NewImage = {
  url: string;
  title: string;
  description: string;
};

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        // lessThan10MB: v => {
        //   return v.size / (1024 * 1024) > 10
        //     ? 'O arquivo deve ser menor que 10MB'
        //     : false;
        // },
        // acceptedFormats: v => {
        //   return v.type.match(/jpg|jpeg|png|gif/)
        //     ? 'Somente são aceitos arquivos PNG, JPEG e GIF'
        //     : false;
        // },
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: 'Mínimo de 2 caracteres',
      maxLength: 'Máximo de 20 caracteres',
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: 'Máximo de 65 caracteres',
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (newImage: NewImage) => api.post('/api/images', newImage),
    {
      onSuccess() {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      await mutation.mutateAsync({
        url: imageUrl,
        title: String(data.title),
        description: String(data.description),
      });

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setImageUrl('');
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
