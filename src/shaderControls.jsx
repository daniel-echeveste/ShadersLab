export default function ShaderControls({ nextShader, prevShader }) {
  return (
    <div className="fixed inset-0 flex justify-between items-center px-10 pointer-events-none">
      <button
        onClick={prevShader}
        className="pointer-events-auto p-2 bg-black/50 text-white rounded-full cursor-pointer"
      >
        ◀️
      </button>
      <button
        onClick={nextShader}
        className="pointer-events-auto p-2 bg-black/50 text-white rounded-full cursor-pointer"
      >
        ▶️
      </button>
    </div>
  );
}