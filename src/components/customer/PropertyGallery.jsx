const PropertyGallery = ({ images = [], propertyName = "Property" }) => {
  const validImages = images.filter(Boolean);

  if (validImages.length === 0) {
    validImages.push("/images/default-property.jpg");
  }

  return (
    <div className="property-gallery">
      {validImages.map((image, index) => (
        <img
          key={`${image}-${index}`}
          src={image}
          alt={`${propertyName} ${index + 1}`}
          onError={(event) => {
            event.currentTarget.src = "/images/default-property.jpg";
          }}
        />
      ))}
    </div>
  );
};

export default PropertyGallery;