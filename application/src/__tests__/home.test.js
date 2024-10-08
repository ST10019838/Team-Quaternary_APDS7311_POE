import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Home from '../app/page.tsx'; // Adjust the path as necessary

describe('Home Page', () => {
  it('checks for relevant text', () => {
    const { getByText } = render(<Home />);
    expect(getByText('This is home')).toBeInTheDocument();
  });
});
