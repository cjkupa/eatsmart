import { Analytics } from '@vercel/analytics/react';
import EatSmart from './EatSmart';

export default function App() {
  return (
    <>
      <EatSmart />
      <Analytics />
    </>
  );
}
