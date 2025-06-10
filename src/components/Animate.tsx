export function AnimatedText({ text }: { text: string }) {
  return (
    <h1 className={`text-4xl sm:text-7xl font-bold  flex flex-wrap justify-center`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block animate-slide-up"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

export function AnimatedTextSmall({ text }: { text: string }) {
  return (
    <h1 className={`text-lg sm:text-xl font-semibold flex flex-wrap justify-center`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block animate-slide-up"
          style={{ animationDelay: `${i * 0.015}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

