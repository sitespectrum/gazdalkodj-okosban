export function Menu({ onClose }) {
  return (
    <>
      <div className="ss-hero-container">
        <div className="ss-hero">
          <img src="/src/Logos/ss.png" className="ss-logo" />
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center gap-12">
        <h1 className="text-8xl bg-black/30 px-12 py-8 font-semibold text-white rounded-3xl">
          Gazdálkodj Okosban
        </h1>
        <button
          className="text-5xl bg-white text-black rounded-3xl py-4 px-8 w-fit font-medium"
          onClick={() => onClose()}
        >
          Kezdés
        </button>
      </div>
    </>
  );
}
