const BrandEyeToggle = ({ theme, onClick }) => (
  <button className="brand-eye" onClick={onClick} title="Toggle theme">
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
      {theme === "light" ? (
        <>
          <path d="M2 16 C 8 6, 24 6, 30 16 C 24 26, 8 26, 2 16 Z" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="16" r="6" fill="currentColor" />
          <circle cx="16" cy="16" r="1.5" fill="var(--color-background)" />
        </>
      ) : (
        <>
          <path d="M2 16 C 8 22, 24 22, 30 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="9" y1="21" x2="8" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="23" x2="16" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="23" y1="21" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  </button>
);

export default BrandEyeToggle;