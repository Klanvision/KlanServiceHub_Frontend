import React from 'react';

export const Image = React.forwardRef(
  ({ src, alt, fill, className = '', style, width, height, priority, loading, decoding = 'async', ...props }, ref) => {
    const fillStyle = fill
      ? {
          position: 'absolute',
          height: '100%',
          width: '100%',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          objectFit: 'cover',
          ...style,
        }
      : { ...style };

    const computedLoading = priority ? 'eager' : (loading || 'lazy');

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || ''}
        className={className}
        style={fillStyle}
        width={width}
        height={height}
        loading={computedLoading}
        decoding={decoding}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';
export default Image;

