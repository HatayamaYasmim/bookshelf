import { Loader, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import { getBooks } from './services/books';

function App() {
  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Text c="red">Error loading books</Text>;
  }

  return (
    <div>
      {books.map((book) => (
        <div key={book.id}>
          {book.title} - {book.author.name}
        </div>
      ))}
    </div>
  );
}

export default App;