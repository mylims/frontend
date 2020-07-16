import React from 'react';
import { adjustColor, colorLum } from '../utils/color';

interface Props {
  children: React.ReactNode;
  color: string;
}

const Tag = ({ children, color }: Props) => {
  const [darkColor, lightColor] =
    colorLum(color) > 0.5
      ? [adjustColor(color, -120), color]
      : [color, adjustColor(color, 120)];
  const style = {
    color: darkColor,
    backgroundColor: lightColor,
    borderColor: darkColor,
  };
  return (
    <span
      style={style}
      className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full"
    >
      {children}
    </span>
  );
};

export default Tag;
