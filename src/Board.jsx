export function Board({ children }) {
  const bigTileSize = "15rem";
  const aspectRatio = "16 / 9";

  return (
    <div className="w-screen h-screen flex flex-col justify-center">
      <div
        className="w-[inherit] max-w-full max-h-full flex justify-center"
        style={{
          aspectRatio: aspectRatio,
        }}
      >
        <div
          className="h-[inherit] max-w-full max-h-full p-6"
          style={{
            aspectRatio: aspectRatio,
          }}
        >
          <div
            className="board relative"
            style={{
              "--big-size": bigTileSize,
            }}
          >
            <div className="board-cell row-start-5 col-start-11 rounded-br-xl">
              <img
                className="rounded-br-xl"
                src="./src/HQ Pictures/Start.png"
                alt="Start"
              />
            </div>
            <div className="board-cell row-start-5 col-start-10">
              <MandatoryField />
            </div>
            <div className="board-cell row-start-5 col-start-9">
              <FieldOneLucky />
            </div>
            <div className="board-cell row-start-5 col-start-8">
              <FieldTwoTrash />
            </div>
            <div className="board-cell row-start-5 col-start-7">
              <FieldThreeElectronics />
            </div>
            <div className="board-cell row-start-5 col-start-6">
              <FieldFourSouthStation />
            </div>
            <div className="board-cell row-start-5 col-start-5">5</div>
            <div className="board-cell row-start-5 col-start-4">6</div>
            <div className="board-cell row-start-5 col-start-3">7</div>
            <div className="board-cell row-start-5 col-start-2">8</div>
            <div className="board-cell row-start-5 rounded-bl-xl !p-0">
              <img
                className="rounded-bl-xl"
                src="./src/HQ Pictures/10. Mező.png"
                alt="10. Mező"
              />
            </div>
            <div className="board-cell row-start-4">10</div>
            <div className="board-cell row-start-3 overflow-hidden">
              <img
                className="h-full w-full object-cover"
                src="./src/HQ Pictures/12. Mező.png"
                alt="10. Mező"
              />
            </div>
            <div className="board-cell row-start-2">12</div>
            <div className="board-cell rounded-tl-xl !p-0">
              <img
                className="rounded-tl-xl"
                src="./src/HQ Pictures/14. Mező.png"
                alt="14. Mező"
              />
            </div>
            <div className="board-cell">14</div>
            <div className="board-cell">15</div>
            <div className="board-cell">16</div>
            <div className="board-cell">17</div>
            <div className="board-cell">18</div>
            <div className="board-cell">19</div>
            <div className="board-cell">20</div>
            <div className="board-cell">21</div>
            <div className="board-cell">22</div>
            <div className="board-cell rounded-tr-xl !p-0">
              <img
                className="rounded-tr-xl"
                src="./src/HQ Pictures/24. Mező.png"
                alt="24. Mező"
              />
            </div>
            <div className="board-cell row-start-2 col-start-11">24</div>
            <div className="board-cell row-start-3 col-start-11 rotate-180 overflow-hidden">
              <img
                className="h-full w-full object-cover "
                src="./src/HQ Pictures/26. Mező.png"
                alt="10. Mező"
              />
            </div>
            <div className="board-cell row-start-4 col-start-11">26</div>
            <div className="row-start-2 row-end-5 col-start-2 col-end-11">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MandatoryField() {
  return (
    <div className="field-grid-bottom text-center text-white bg-white">
      <div className="py-1 bg-[#bc354a] font-semibold">Kötelező mező</div>
      <div></div>
      <div className="text-[0.65rem] text-center bg-[#bc354a] pt-4 px-1">
        Ha még nincs ingatlanod, fizess lakbért.
        <br />
        <span className="font-semibold">Körönként 70 000 Ft</span>
      </div>
    </div>
  );
}

function FieldOneLucky() {
  return (
    <div className="field-grid-bottom text-center text-black bg-white">
      <div className="py-1 bg-[#a0ecff] font-semibold">1.</div>
      <div></div>
      <div className="text-[0.65rem] text-center bg-[#a0ecff] pt-4 px-1">
        <span className="font-semibold">Szerencsemező</span>
      </div>
    </div>
  );
}

function FieldTwoTrash() {
  return (
    <div className="field-grid-bottom text-center text-black bg-white">
      <div className="py-1 bg-[#52ae47] font-semibold">2.</div>
      <div></div>
      <div className="text-[0.65rem] text-center bg-[#52ae47] pt-4 px-1">
        Szemeteltél.
        <br />
        <span className="font-semibold">Fizess 1 500 Ft-ot</span>
      </div>
    </div>
  );
}

function FieldThreeElectronics() {
  return (
    <div className="field-grid-bottom text-center text-black bg-white">
      <div className="py-1 bg-[#cac9c9] font-semibold">3.</div>
      <div></div>
      <div className="text-[0.65rem] text-center bg-[#cac9c9] pt-4 px-1">
        <span className="font-semibold">Műszaki bolt</span>
        <br />
        Árak a megjelenő ablakban
      </div>
    </div>
  );
}

function FieldFourSouthStation() {
  return (
    <div className="field-grid-bottom text-center text-black bg-white">
      <div className="py-1 bg-[#a0ecff] font-semibold">4.</div>
      <div></div>
      <div className="text-[0.65rem] text-center bg-[#a0ecff] pt-4 px-1">
        <span className="font-semibold">Déli pályaudvar</span>
        <br />
        Használatával kockázatmentesen utazhatsz.
        <br />
        Árak a menüben.
      </div>
    </div>
  );
}
