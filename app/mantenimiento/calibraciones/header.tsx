interface HeaderProps {
  title: string;
  path: string;
  subpath: string;
}

export const Header = (props: HeaderProps) => {
  return (
    <header className="w-full">
      <p className="flex font-bold w-full justify-end">
        {props.path} &ensp;
        <span className="text-blue-500">&gt;&ensp;{props.subpath}</span>
      </p>
      <h1 className="font-semibold text-blue-900/90 text-3xl w-full mb-6">
        {props.title}
      </h1>
    </header>
  );
};
