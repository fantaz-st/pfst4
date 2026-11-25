"use client";

import { openConsentSettings } from "@/lib/personal";

// The footer's "Kolačići" link: reopens the cookie settings.
export default function CookieSettingsButton({ className, children }) {
  return (
    <button type="button" className={className} onClick={openConsentSettings}>
      {children}
    </button>
  );
}
