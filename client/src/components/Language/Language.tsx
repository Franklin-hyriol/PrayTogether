type LanguageProps = {
  language: string;
  onLanguageChange: (lang: string) => void;
};

function Language({ language, onLanguageChange }: LanguageProps) {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-xl font-bold">Language</h2>
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
