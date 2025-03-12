import { Card, CardBody, Chip, Link } from "@heroui/react";

function ComputerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="3rem"
      height="3rem"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="8" x="5" y="2" rx="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6 18h2" />
      <path d="M12 18h6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="3rem"
      height="3rem"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export default function Index() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-dot-white/20 relative flex-col gap-4 p-8">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <h1 className="text-6xl z-10 pb-1 font-bold text-center mb-12 bg-gradient-to-b from-white from-35% to-neutral-500 bg-clip-text text-transparent">
        Gazdálkodj Okosban
      </h1>

      <Card
        as={Link}
        isBlurred
        shadow="lg"
        className="w-full max-w-md border-1 border-pink-500/50 z-10"
        href="/online-games"
      >
        <CardBody className="flex flex-row gap-4 bg-gradient-to-br from-indigo-500/20 to-pink-500/20">
          <div className="size-20 h-full min-h-20 bg-pink-500/15 border-1 border-pink-500/50 shadow-md shadow-pink-500/20 rounded-lg text-pink-500 flex items-center justify-center">
            <GlobeIcon />
          </div>
          <div className="flex-1 flex flex-col gap-1 justify-center">
            <span className="text-lg font-bold flex items-center gap-2">
              Online játék
              <Chip
                classNames={{
                  base: "bg-linear-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                  content:
                    "drop-shadow-xs shadow-black text-white font-semibold",
                }}
                variant="shadow"
                size="sm"
              >
                Újdonság
              </Chip>
            </span>
            <span className="text-sm text-default-500">
              A világhálón keresztül bárhol és bármikor játszhatsz akárkivel.
            </span>
          </div>
        </CardBody>
      </Card>

      <Card
        as={Link}
        isBlurred
        shadow="lg"
        className="w-full max-w-md border-1 border-default-100 z-10"
        href="/local-games"
      >
        <CardBody className="flex flex-row gap-4">
          <div className="size-20 h-full min-h-20 bg-blue-500/15 border-1 border-blue-500/50 shadow-md shadow-blue-500/20 rounded-lg text-blue-500 flex items-center justify-center">
            <ComputerIcon />
          </div>
          <div className="flex-1 flex flex-col gap-1 justify-center">
            <span className="text-lg font-bold">Helyi játék</span>
            <span className="text-sm text-default-500">
              Játszhatsz a barátokkal, családdal, vagy másokkal egy
              számítógépen.
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
