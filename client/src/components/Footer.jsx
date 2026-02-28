import React from "react";

export default function Footer() {
  return (
    <footer className="sticky bottom-0 bg-white shadow-[0_-4px_6px_rgba(0,0,0,0.15)] p-4 text-center text-gray-500">
      {new Date().getFullYear()} Authentication. All rights reserved.
    </footer>
  );
}