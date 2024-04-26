import { User } from './user';

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between gap-6">
      <span className="w-64 text-center font-bold text-2xl">SIRCA</span>
      <User />
    </header>
  );
}
