const LocationSearch = ({ value, onChange, onSubmit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form className="location-search" onSubmit={handleSubmit}>
      <label htmlFor="location-search">Where do you want to stay?</label>

      <div className="location-search-controls">
        <input
          id="location-search"
          type="search"
          className="input-field"
          placeholder="Enter a location"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />

        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </div>
    </form>
  );
};

export default LocationSearch;