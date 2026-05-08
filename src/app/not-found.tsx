"use client";

import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const basePath = window.location.pathname.startsWith("/Haphuonganh4123")
      ? "/Haphuonganh4123/"
      : "/";

    window.location.replace(basePath);
  }, []);

  return (
    <main className="route-fallback">
      <span>NX</span>
      <p>Đang chuyển về màn đăng nhập...</p>
    </main>
  );
}
