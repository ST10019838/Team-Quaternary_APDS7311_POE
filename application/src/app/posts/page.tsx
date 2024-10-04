'use client';

import Post from '@/models/Post';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// axios.defaults.baseURL =

export default function PostsPage() {
  // Queries
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/api/posts');
      return data;
    },
  });

  if (isLoading) return <h1>Loading...</h1>;

  if (isError) return <h1>Error: {error.message}</h1>;

  console.log(data);

  return (
    <>
      <h1>Hello, Please Post!</h1>
    </>
  );
}
