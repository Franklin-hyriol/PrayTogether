type LanguageProps = {
  language: string;
  onLanguageChange: (lang: string) => void;
};

function Language({ language, onLanguageChange }: LanguageProps) {
  return (
    <div className="mb-8 w-full rounded-xl bg-base-300 sm:p-6 p-4 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Language <small className="text-xs">(Coming soon 😊)</small></h2>
      <select
        className="select"
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        <option value="en">English</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
}

export default Language;
