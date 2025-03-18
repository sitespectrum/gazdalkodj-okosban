export function TimeTravel() {
  return (
    <div className="absolute inset-0 bg-black time-travel ">
      <div className="w-full h-full bg-dot-white/20 flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        <div className="border-12 backdrop-blur-md border-white rounded-full p-6">
          <div className="size-70 rounded-full  relative">
            <div className="bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center w-3 h-full hour-hand absolute"></div>
            <div className="bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center w-3 h-full minute-hand absolute"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
