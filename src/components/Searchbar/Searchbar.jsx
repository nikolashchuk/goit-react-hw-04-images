import { Component } from 'react';
import { Header, Form, Button, Label, Input } from './Searchbar.styled';

export default class Searchbar extends Component {
  state = {
    query: '',
  };

  onChange = event => {
    this.setState({ query: event.currentTarget.value });
  };

  onSubmit = event => {
    event.preventDefault();

    const { onSubmit } = this.props;
    const { query } = this.state;

    if (!query.trim()) {
      return alert('Please add correct data!');
    }

    onSubmit(query);
  };

  render() {
    const { query } = this.state;

    return (
      <Header>
        <Form onSubmit={this.onSubmit}>
          <Button type="submit" style={{ marginRight: '10px' }}>
            <Label>search</Label>
          </Button>

          <Input
            type="text"
            autoComplete="off"
            autoFocus
            value={query}
            placeholder="Search images and photos"
            onChange={this.onChange}
          />
        </Form>
      </Header>
    );
  }
}
