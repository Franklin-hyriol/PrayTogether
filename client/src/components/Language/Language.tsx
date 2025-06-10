function Language() {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-xl font-bold">Language</h2>
      <select defaultValue="Pick a color" className="select">
        <option>English</option>
        <option>French</option>
      </select>
    </div>
  );
}

export default Language;
