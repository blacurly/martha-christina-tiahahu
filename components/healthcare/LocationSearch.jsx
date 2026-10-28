
"use client";

import { LoaderCircle, MapPin, Navigation } from "lucide-react";

export default function LocationSearch({
  location,
  setLocation,
  onUseLocation,
  loading,
  error,
  coordinates,
}) {
  return (
    <div className="locationSection">
      <label className="fieldLabel" htmlFor="healthcare-location">
        Lokasi pencarian
      </label>

      <button
        type="button"
        className="locationButton"
        onClick={onUseLocation}
        disabled={loading}
      >
        {loading ? (
          <LoaderCircle size={18} className="spin" />
        ) : (
          <Navigation size={18} />
        )}
        {loading ? "Mencari lokasi..." : "Gunakan lokasi saya"}
      </button>

      <div className="orDivider">
        <span />
        atau cari manual
        <span />
      </div>

      <div className="locationInputWrap">
        <MapPin size={18} />
        <input
          id="healthcare-location"
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Kota atau wilayah"
        />
      </div>

      {coordinates && (
        <p className="successMessage">
          Lokasi perangkat berhasil diperoleh.
        </p>
      )}

      {error && (
        <p className="errorMessage" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}