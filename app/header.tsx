import { User } from './user';

export default function Header() {
  return (
    <header className="flex h-16 items-center gap-6 px-6">
      <span className="">SIRCA</span>
      <User />
    </header>
  );
}
