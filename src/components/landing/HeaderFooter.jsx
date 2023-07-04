import React from 'react';

const imageSrc = 'rapunzel-lantern-light.png';

const imageArray = Array.from({ length: 300 }, (_, index) => ({
    id: index,
    src: imageSrc
  }));

const HeaderFooter = () => {
  // Calculate the exponential distribution: adjust the exponent to modify density
  const calculateExponentialPosition = (index, length, exponent) => {
    return Math.pow((index / length), exponent) * 20;
  };

  return (
    <div className="section">
      {imageArray.map(({ id, src }) => (
        <img
          key={id}
          src={src}
          alt="multiple instances of the image"  
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${calculateExponentialPosition(id, imageArray.length, 3)}%`,
            width: '30px',
            height: '50px'
          }}
        />
      ))}
    </div>
  );
}

export default HeaderFooter;