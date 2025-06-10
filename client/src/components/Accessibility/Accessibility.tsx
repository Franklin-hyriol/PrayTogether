function Accessibility() {
  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">Accessibility</h2>

      <div className="space-y-6">
        {/* Text size */}
        <div className="flex items-center justify-between">
          <span>Text size</span>
          <div className="join">
            <button className="btn btn-sm text-sm join-item btn-outline">A</button>
            <button className="btn btn-sm text-base join-item btn-outline">A</button>
            <button className="btn btn-sm text-xl join-item btn-outline btn-active border-blue-500 text-blue-600">
              A
            </button>
          </div>
        </div>

        {/* High contrast */}
        <div className="flex items-center justify-between">
          <span>High contrast</span>
          <input type="checkbox" className="toggle toggle-md" />
        </div>

        <div className="flex items-center justify-between">
          <span>Notification sound</span>
          <input type="checkbox" className="toggle toggle-md" />
        </div>

        {/* Dyslexic font */}
        <div className="flex items-center justify-between">
          <span>Dyslexic font</span>
          <input type="checkbox" className="toggle toggle-md" />
        </div>
      </div>
    </div>
  );
}

export default Accessibility;
