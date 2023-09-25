'use client';

import * as z from 'zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { useStoreModal } from '@/hooks/use-store-modal';
import { Modal } from '@/components/ui/modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(1),
});

export function StoreModal() {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      setLoading(true);
      const response = await axios.post('/api/stores', values);
      // console.log(response.data);
      // toast.success('Store created..');
      // axios 에 post하고 돌아오면 stuck이 되는 경우가 많다 그래서
      // window.location.assign으로 페이지를 refresh하고 response.data.id
      // redirect하는 효과를 얻는다. window를 쓰는 이유가 refresh이다.
      // 예를 들어, 만약 response.data.id의 값이 123이라면,
      // window.location.assign('/123')이 호출되어 사용자는 /123 URL로 이동하게 됩니다.
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title='Create store'
      description='Add a new store to manage products and categories.'
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className='py-2 pb-4 space-y-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='E-Commerce'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center justify-end w-full pt-6 space-x-2'>
              <Button
                disabled={loading}
                variant='outline'
                onClick={storeModal.onClose}
              >
                Cancel
              </Button>
              <Button disabled={loading} type='submit'>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
