interface KeywordProps {
  word: string;
  index: number;
  active: number;
  setActive: (i: number) => void;
  onMouseLeave: () => void;
  color: string;
  resolvedUnderlineColor: string;
}

export function Keyword({
  word,
  index,
  active,
  setActive,
  onMouseLeave,
  color,
}: KeywordProps) {
  const isActive = index === active;

  return (
    <span
      onMouseEnter={() => setActive(index)}
      onMouseLeave={onMouseLeave}
      className={`relative inline-block cursor-pointer transition-all duration-300 font-futura font-bold ${color} ${
        isActive ? 'opacity-100' : 'opacity-70 hover:opacity-90'
      }`}
    >
      {word}
      <span
        className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full transition-all duration-300 ${
          isActive ? 'bg-waygent-blue scale-x-100' : 'bg-waygent-blue scale-x-0'
        }`}
      />
    </span>
  );
}
