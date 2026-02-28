export default function Button({
  children,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`bg-primary text-white py-2 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}