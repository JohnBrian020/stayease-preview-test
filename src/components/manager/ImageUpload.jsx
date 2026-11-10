const ImageUpload = ({ value, onChange, error }) => {
  const fallbackImage = "/images/default-property.jpg";

  return (
    <div className="image-upload-field">
      <label htmlFor="property-image">Property Image URL</label>

      <input
        id="property-image"
        type="url"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://example.com/property.jpg"
      />

      {error && <p className="field-error">{error}</p>}

      <div className="image-preview">
        <img
          src={value || fallbackImage}
          alt="Property preview"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      <p className="field-help">
        Enter a publicly accessible image URL to preview your property.
      </p>
    </div>
  );
};

export default ImageUpload;