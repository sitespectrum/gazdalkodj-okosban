import React, { useEffect, useRef } from "react";

export function Board({ children }) {
  const bigTileSize = "15rem";
  const aspectRatio = "16 / 9";

  const firstFieldRef = useRef(null);
  const lastFieldRef = useRef(null);

  useEffect(() => {
    const debugSizing = true;
    const threshold = 0.0001;

    const getDifference = () => {
      if (!firstFieldRef.current || !lastFieldRef.current) {
        return;
      }

      const firstFieldSize =
        firstFieldRef.current.getBoundingClientRect().width;
      const lastFieldSize = lastFieldRef.current.getBoundingClientRect().height;

      return firstFieldSize - lastFieldSize;
    };

    const handleResize = async () => {
      if (!firstFieldRef.current || !lastFieldRef.current) {
        return;
      }

      if (
        firstFieldRef.current.getBoundingClientRect().height /
          firstFieldRef.current.getBoundingClientRect().width >
        3
      ) {
        const currentSize = parseFloat(
          document.documentElement.style.fontSize || "16"
        );
        const newSize = currentSize / 2;
        document.documentElement.style.fontSize = `${newSize}px`;
        if (debugSizing) {
          console.log(
            "[sizing] initial font size is too big, halved it to",
            newSize
          );
        }
      }

      for (let i = 0; i < 10; i++) {
        // if positive, we need to zoom out
        // if negative, we need to zoom in
        const difference = getDifference();

        if (Math.abs(difference) < threshold) {
          if (debugSizing) {
            console.log(
              "[sizing] difference is less than threshold:",
              difference
            );
          }
          break;
        }

        const step = difference / 32;

        const currentSize = parseFloat(
          document.documentElement.style.fontSize || "16"
        );
        const newSize = currentSize - step;

        if (debugSizing) {
          console.log("[sizing] iteration", i, {
            difference,
            step,
            currentSize,
            newSize,
          });
        }
        document.documentElement.style.fontSize = `${newSize}px`;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            <div
              ref={firstFieldRef}
              className="board-cell row-start-5 col-start-10"
            >
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
            <div className="board-cell row-start-5 col-start-5">
              Bank robbery
            </div>
            <div className="board-cell row-start-5 col-start-4">
              Elza and idea
            </div>
            <div className="board-cell row-start-5 col-start-3">lucky 2</div>
            <div className="board-cell row-start-5 col-start-2">smoking</div>
            <div className="board-cell row-start-5 rounded-bl-xl !p-0">
              <img
                className="rounded-bl-xl"
                src="./src/HQ Pictures/10. Mező.png"
                alt="10. Mező"
              />
            </div>
            <div className="board-cell row-start-4">movie theater</div>
            <div className="board-cell row-start-3 overflow-hidden">
              <img
                className="h-full w-full object-cover"
                src="./src/HQ Pictures/12. Mező.png"
                alt="10. Mező"
              />
            </div>
            <div className="board-cell row-start-2">casino</div>
            <div className="board-cell rounded-tl-xl !p-0">
              <img
                className="rounded-tl-xl"
                src="./src/HQ Pictures/14. Mező.png"
                alt="14. Mező"
              />
            </div>
            <div className="board-cell">bob the builder</div>
            <div className="board-cell">car shop</div>
            <div className="board-cell">car travel</div>
            <div className="board-cell">lucky 3</div>
            <div className="board-cell">north station</div>
            <div className="board-cell">abidas</div>
            <div className="board-cell">idea</div>
            <div className="board-cell">bank 4</div>
            <div className="board-cell">abc</div>
            <div className="board-cell rounded-tr-xl !p-0">
              <img
                className="rounded-tr-xl"
                src="./src/HQ Pictures/24. Mező.png"
                alt="24. Mező"
              />
            </div>
            <div className="board-cell row-start-2 col-start-11">insurance</div>
            <div className="board-cell row-start-3 col-start-11 rotate-180 overflow-hidden">
              <img
                className="h-full w-full object-cover "
                src="./src/HQ Pictures/26. Mező.png"
                alt="10. Mező"
              />
            </div>
            <div
              className="board-cell row-start-4 col-start-11"
              ref={lastFieldRef}
            >
              roll again
            </div>
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
