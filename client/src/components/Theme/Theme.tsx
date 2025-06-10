function Theme() {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Theme</h2>

      <div className="flex space-x-4 mb-6">
        {/* Light button active */}
        <button className="btn btn-active btn-outline flex items-center space-x-2">
          <span>☀️</span>
          <span>Light</span>
        </button>

        {/* Dark button inactive */}
        <button className="btn btn-outline flex items-center space-x-2">
          <span>🌙</span>
          <span>Dark</span>
        </button>
      </div>

      <div className="p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Theme preview</h3>
        <p className="mb-4 text-gray-600">This is what your interface will look like.</p>
        <button className="btn btn-primary">Example button</button>
      </div>
    </div>
  );
}

export default Theme;
