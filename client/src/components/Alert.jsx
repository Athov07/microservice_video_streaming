export default function Alert({ type = "error", message }) {
  const baseStyle = "p-2 mb-3 rounded text-sm text-center";

  const styles = {
    error: "bg-red-100 text-red-600 border border-red-400",
    success: "bg-green-100 text-green-600 border border-green-400",
  };

  return (
    <div className={`${baseStyle} ${styles[type]}`}>
      {message}
    </div>
  );
}