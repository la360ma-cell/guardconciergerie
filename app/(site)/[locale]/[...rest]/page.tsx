import { notFound } from 'next/navigation';

// Attrape toute URL inconnue sous le segment localisé et rend le 404 stylé.
export default function CatchAllPage() {
  notFound();
}
