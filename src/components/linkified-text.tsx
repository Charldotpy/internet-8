'use client';

import React from 'react';

type LinkifiedTextProps = {
  text: string;
};

// This regex looks for URLs, including those without a protocol and with paths.
// e.g. http://a.com, www.a.com, a.com, a.com/path
const urlRegex = /(\bhttps?:\/\/[^\s]+|\bwww\.[^\s]+|\b[a-zA-Z0-9-]+\.[a-zA-Z]{2,63}(\/[^\s]*)?)/g;


export default function LinkifiedText({ text }: LinkifiedTextProps) {
  if (!text) {
    return <>{text}</>;
  }

  const parts = text.split(urlRegex).filter(Boolean);

  return (
    <>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <span
              key={i}
              className="text-blue-600 dark:text-blue-400"
            >
              {part}
            </span>
          );
        }
        return part;
      })}
    </>
  );
}
