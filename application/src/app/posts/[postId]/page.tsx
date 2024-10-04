export default function PostsPage({ params }: { params: { postId: string } }) {
  const url = `https://localhost:5000/${params.postId}`;

  return (
    <>
      <h1>
        Hello, your post Id is {params.postId} and your url is: {url}
      </h1>
    </>
  );
}
