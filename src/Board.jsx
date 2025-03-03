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
              <FieldFiveBankRobbery />
            </div>
            <div className="board-cell row-start-5 col-start-4">
              <FieldSixShoppingCenter />
            </div>
            <div className="board-cell row-start-5 col-start-3">
              <FieldSevenLucky />
            </div>
            <div className="board-cell row-start-5 col-start-2">
              <FieldEightSmoking />
            </div>
            <div className="board-cell row-start-5 rounded-bl-xl !p-0">
              <img
                className="rounded-bl-xl"
                src="./src/HQ Pictures/10. Mező.png"
                alt="10. Mező"
              />
            </div>
            <div className="board-cell row-start-4 rotated-tile-container">
              <div className="rotated-tile-left">
                <FieldTenMovieTheater />
              </div>
            </div>
            <div className="board-cell row-start-3 overflow-hidden">
              <img
                className="h-full w-full object-cover"
                src="./src/HQ Pictures/12. Mező.png"
                alt="10. Mező"
              />
            </div>
            <div className="board-cell row-start-2 rotated-tile-container">
              <div className="rotated-tile-left">
                <FieldTwelveCasino />
              </div>
            </div>
            <div className="board-cell rounded-tl-xl !p-0">
              <img
                className="rounded-tl-xl"
                src="./src/HQ Pictures/14. Mező.png"
                alt="14. Mező"
              />
            </div>
            <div className="board-cell">
              <FieldFourteenBobTheBuilder />
            </div>
            <div className="board-cell">
              <FieldFifteenCarShop />
            </div>
            <div className="board-cell">
              <FieldSixteenCarTravel />
            </div>
            <div className="board-cell">
              <FieldSeventeenLucky />
            </div>
            <div className="board-cell">
              <FieldEighteenNorthStation />
            </div>
            <div className="board-cell">
              <FieldNineteenAbidas />
            </div>
            <div className="board-cell">
              <FieldTwentyIdea />
            </div>
            <div className="board-cell">
              <FieldTwentyOneBank />
            </div>
            <div className="board-cell">
              <FieldTwentyTwoABC />
            </div>
            <div className="board-cell rounded-tr-xl !p-0">
              <img
                className="rounded-tr-xl"
                src="./src/HQ Pictures/24. Mező.png"
                alt="24. Mező"
              />
            </div>
            <div className="board-cell rotated-tile-container">
              <div className="rotated-tile-right">
                <FieldTwentyFourInsurance />
              </div>
            </div>
            <div className="board-cell row-start-3 col-start-11 rotate-180 overflow-hidden">
              <img
                className="h-full w-full object-cover "
                src="./src/HQ Pictures/26. Mező.png"
                alt="10. Mező"
              />
            </div>
            <div
              className="board-cell row-start-4 col-start-11 rotated-tile-container"
              ref={lastFieldRef}
            >
              <div className="rotated-tile-right">
                <FieldTwentySixRollAgain />
              </div>
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
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/mandatory.png"
          alt="Madnatory field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#bc354a] pt-3 px-1">
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
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/lucky.png"
          alt="Lucky field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#a0ecff] pt-3 px-1">
        <span className="font-semibold">Szerencsemező</span>
      </div>
    </div>
  );
}

function FieldTwoTrash() {
  return (
    <div className="field-grid-bottom text-center text-black bg-white">
      <div className="py-1 bg-[#52ae47] font-semibold">2.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/2.png"
          alt="Trash field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#52ae47] pt-3 px-1">
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
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/3.png"
          alt="Electronics field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#cac9c9] pt-3 px-1">
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
      <div className="py-1 bg-[#fac65c] font-semibold">4.</div>
      <div>
        <img
          className="w-full h-full object-cover"
          src="./src/Pictures/CroppedFieldPics/4.png"
          alt="South station field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#fac65c] pt-3 px-1">
        <span className="font-semibold">Déli pályaudvar</span>
        <br />
        Használatával kockázatmentesen utazhatsz.
        <br />
        Árak a menüben.
      </div>
    </div>
  );
}

function FieldFiveBankRobbery() {
  return (
    <div className="grid h-full grid-rows-[13%_87%] text-center text-black bg-white">
      <div className="py-1 bg-[#21abe3] font-semibold">5.</div>
      <div>
        <img
          className="w-full h-full object-cover"
          src="./src/Pictures/CroppedFieldPics/5.png"
          alt="Bank robbery field picture"
        />
      </div>
    </div>
  );
}

function FieldSixShoppingCenter() {
  return (
    <div className="field-grid-bottom text-center text-black bg-[#f2f2f1]">
      <div className="py-1 bg-[#f8d91a] font-semibold">6.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/6.png"
          alt="Shopping center field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#f8d91a] pt-3 px-1">
        <span className="font-semibold">Áruház</span>
        <br />
        Árak a megjelenő ablakban
      </div>
    </div>
  );
}

function FieldSevenLucky() {
  return (
    <div className="field-grid-bottom text-center text-black bg-white">
      <div className="py-1 bg-[#a0ecff] font-semibold">7.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/lucky.png"
          alt="Lucky field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#a0ecff] pt-3 px-1">
        <span className="font-semibold">Szerencsemező</span>
      </div>
    </div>
  );
}

function FieldEightSmoking() {
  return (
    <div className="field-grid-bottom text-center text-black bg-[#f2f2f1]">
      <div className="py-1 bg-[#c6c6c6] font-semibold">8.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/8.png"
          alt="Smoking field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#c6c6c6] pt-3 px-1">
        A dohányzás bármilyen formája káros az egészségre. Hogy ezt jól az
        eszedbe vésd,
        <span className="font-semibold"> fizess 1 500 Ft-ot</span>
      </div>
    </div>
  );
}

function FieldTenMovieTheater() {
  return (
    <div className="field-grid-bottom text-center text-black bg-white">
      <div className="py-1 bg-[#fefce5] font-semibold">10.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/10.png"
          alt="Movie theater field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#fefce5] pt-3 px-1">
        Moziba mentél.
        <br />
        <span className="font-semibold">Fizess 5 000 Ft-ot</span>
      </div>
    </div>
  );
}

function FieldTwelveCasino() {
  return (
    <div className="field-grid-bottom text-center text-white bg-white">
      <div className="py-1 bg-[#921914] font-semibold">12.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/12.png"
          alt="Casino field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#921914] pt-3 px-1">
        <span className="font-semibold">Kaszinó</span>
        <br />
        Részletek a megjelenő ablakban.
      </div>
    </div>
  );
}

function FieldFourteenBobTheBuilder() {
  return (
    <div className="field-grid-bottom text-center text-white bg-white">
      <div className="py-1 bg-[#e7a402] font-semibold">14.</div>
      <div>
        <img
          className="pt-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/14.png"
          alt="Bob the Builder field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#e7a402] pt-3 px-1">
        <span className="font-semibold">Lakásépítés</span>
        <br />
        Ezen a mezőn tudod megvásárolni a lakásodat.
        <br />
        Részletek a megjelenő ablakban.
      </div>
    </div>
  );
}

function FieldFifteenCarShop() {
  return (
    <div className="field-grid-bottom text-center text-white bg-[#e7e6e6]">
      <div className="py-1 bg-[#c21f34] font-semibold">15.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/15.png"
          alt="Car shop field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#c21f34] pt-3 px-1">
        <span className="font-semibold">Autószalon</span>
        <br />
        Ha még nincs autód, akkor itt megveheted.
      </div>
    </div>
  );
}

function FieldSixteenCarTravel() {
  return (
    <div className="field-grid-bottom text-center text-white bg-[#dadbda]">
      <div className="py-1 bg-black font-semibold">16.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/16.png"
          alt="Car travel field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-black pt-3 px-1">
        Ha van autód, akkor erre a mezőre lépve
        <span className="font-semibold"> átutazhatsz 10 mezőt.</span>
      </div>
    </div>
  );
}

function FieldSeventeenLucky() {
  return (
    <div className="field-grid-bottom text-center text-black bg-white">
      <div className="py-1 bg-[#a0ecff] font-semibold">17.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/lucky.png"
          alt="Lucky field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#a0ecff] pt-3 px-1">
        <span className="font-semibold">Szerencsemező</span>
      </div>
    </div>
  );
}

function FieldEighteenNorthStation() {
  return (
    <div className="field-grid-bottom text-center text-black bg-white">
      <div className="py-1 bg-[#fac65c] font-semibold">18.</div>
      <div>
        <img
          className="w-full h-full object-cover"
          src="./src/Pictures/CroppedFieldPics/18.png"
          alt="North station field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#fac65c] pt-3 px-1">
        <span className="font-semibold">Északi pályaudvar</span>
        <br />
        Használatával kockázatmentesen utazhatsz.
        <br />
        Árak a menüben.
      </div>
    </div>
  );
}

function FieldNineteenAbidas() {
  return (
    <div className="field-grid-bottom text-center text-white bg-white">
      <div className="py-1 bg-black font-semibold">19.</div>
      <div>
        <img
          className="p-6 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/19.png"
          alt="Abidas field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-black pt-3 px-1">
        Mivel adsz a megjelenésedre, ruhákat vásárolsz.
        <br />
        <span className="font-semibold">Fizess 15 000 Ft-ot</span>
      </div>
    </div>
  );
}

function FieldTwentyIdea() {
  return (
    <div className="field-grid-bottom text-center text-black bg-[#e7e6e6]">
      <div className="py-1 bg-[#c6c6c6] font-semibold">20.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/20.png"
          alt="Furniture shop field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#c6c6c6] pt-3 px-1">
        <span className="font-semibold">Bútorbolt</span>
        <br />
        Árak a megjelenő ablakban.
      </div>
    </div>
  );
}

function FieldTwentyOneBank() {
  return (
    <div className="field-grid-bottom text-center text-black bg-[#030405]">
      <div className="py-1 bg-[#f9eb1b] font-semibold">21.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/21.png"
          alt="Bank field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#f9eb1b] pt-3 px-1">
        Terveid megvalósításához választhatsz kedvező kölcsöneint közül.
      </div>
    </div>
  );
}

function FieldTwentyTwoABC() {
  return (
    <div className="field-grid-bottom text-center text-white bg-white">
      <div className="py-1 bg-[#e61e28] font-semibold">22.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/22.png"
          alt="Food shop field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#e61e28] pt-3 px-1">
        Élelmiszert vásároltál.
        <br />
        <span className="font-semibold">Fizess 10 000 Ft-ot</span>
      </div>
    </div>
  );
}

function FieldTwentyFourInsurance() {
  return (
    <div className="field-grid-bottom text-center text-white bg-[#6a4c91]">
      <div className="py-1 bg-[#7a70b2] font-semibold">24.</div>
      <div>
        <img
          className="p-5 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/24.png"
          alt="Insurance field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#7a70b2] pt-3 px-2">
        Biztosítások árai a megjelenő ablakban.
      </div>
    </div>
  );
}

function FieldTwentySixRollAgain() {
  return (
    <div className="field-grid-bottom text-center text-white bg-white">
      <div className="py-1 bg-[#737373] font-semibold">26.</div>
      <div>
        <img
          className="p-2 w-full h-full object-contain"
          src="./src/Pictures/CroppedFieldPics/26.png"
          alt="Roll again field picture"
        />
      </div>
      <div className="text-[0.65rem] text-center bg-[#737373] pt-3 px-1">
        <span className="font-semibold">Dobhatsz mégegyszer</span>
      </div>
    </div>
  );
}
