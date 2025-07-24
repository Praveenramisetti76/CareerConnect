export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );
}
