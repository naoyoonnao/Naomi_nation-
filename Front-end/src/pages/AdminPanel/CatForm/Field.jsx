export default function Field({ label, children }) {
    return (
      <label className="field">
        {label && <span>{label}</span>}
        {children}
      </label>
    );
  }
  