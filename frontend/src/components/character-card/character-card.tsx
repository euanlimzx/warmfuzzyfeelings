import { Ripple } from "@/components/magicui/ripple";

export function CharacterCard() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-blue-300">
      <div className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white">
        <DictionaryCard />
      </div>
      <Ripple />
    </div>
  );
}

export default function DictionaryCard() {
  return (
    <div className="flex justify-center p-6 text-black">
      <div className="relative w-full max-w-md">
        {/* Neo-brutalist decorative elements */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-300 rotate-12 border-2 border-black"></div>
        <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-black"></div>

        {/* Main card */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Word and pronunciation */}
          <div className="mb-4 border-b-4 border-black pb-2">
            <h1 className="font-mono text-4xl font-black lowercase">denise</h1>
          </div>

          {/* Definition */}
          <div className="font-mono text-base leading-relaxed tracking-wide">
            <p className="mb-2">
              <span className="font-bold">1.</span> an architectural style of
              the mid-20th century characterized by massive, monolithic, and
              blocky forms in raw concrete and bold, rugged design
            </p>
            <p className="mb-2">
              <span className="font-bold">2.</span> a design aesthetic
              characterized by intentional roughness, visible and unrefined
              textures, and an emphasis on raw materials
            </p>
          </div>

          {/* Neo-brutalist stamp */}
          <div className="absolute -rotate-12 top-2 right-2">
            <div className="border-2 h-10 w-10 border-black bg-yellow-300 text-white text-xs font-bold py-1 px-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
