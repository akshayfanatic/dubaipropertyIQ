import { notFound } from 'next/navigation';
import React from 'react';

const TestRoute = () => {
  notFound();
  return <div>TestRoute</div>;
};

export default TestRoute;
