import { useState } from 'react';
import { Header, Form, Button, Label, Input } from './Searchbar.styled';

export default function Searchbar({ onSubmit }) {
  const [query, setQuery] = useState('');

  const onChange = event => {
    setQuery(event.currentTarget.value);
  };

  const onSubmitForm = event => {
    event.preventDefault();

    if (!query.trim()) {
      return alert('Please add correct data!');
    }

    onSubmit(query);
    setQuery('');
  };

  return (
    <Header>
      <Form onSubmit={onSubmitForm}>
        <Button type="submit" style={{ marginRight: '10px' }}>
          <Label>search</Label>
        </Button>

        <Input
          type="text"
          autoComplete="off"
          autoFocus
          value={query}
          placeholder="Search images and photos"
          onChange={onChange}
        />
      </Form>
    </Header>
  );
}
