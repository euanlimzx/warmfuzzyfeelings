const decorativeElements = [
  // Hearts
  <svg
    key="heart1"
    width="20"
    height="18"
    viewBox="0 0 20 18"
    className="text-red-400"
  >
    <path
      d="M10 17.5C10 17.5 2 12 2 6.5C2 4 4 2 6.5 2C8 2 9.5 3 10 4C10.5 3 12 2 13.5 2C16 2 18 4 18 6.5C18 12 10 17.5 10 17.5Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>,

  // Stars
  <svg
    key="star1"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    className="text-yellow-500"
  >
    <path
      d="M9 1L11 7H17L12.5 11L14.5 17L9 13L3.5 17L5.5 11L1 7H7L9 1Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>,

  // Simple flower
  <svg
    key="flower1"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className="text-pink-400"
  >
    <circle cx="8" cy="8" r="2" fill="currentColor" />
    <circle cx="8" cy="4" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="8" cy="12" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="4" cy="8" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="12" cy="8" r="2" fill="currentColor" opacity="0.7" />
  </svg>,

  // Arrow
  <svg
    key="arrow1"
    width="24"
    height="12"
    viewBox="0 0 24 12"
    className="text-blue-500"
  >
    <path
      d="M2 6H20M20 6L16 2M20 6L16 10"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>,

  // Squiggly line
  <svg
    key="squiggle1"
    width="30"
    height="8"
    viewBox="0 0 30 8"
    className="text-green-500"
  >
    <path
      d="M2 4C6 2 10 6 14 4C18 2 22 6 26 4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>,

  // Musical note
  <svg
    key="note1"
    width="12"
    height="18"
    viewBox="0 0 12 18"
    className="text-purple-500"
  >
    <path
      d="M8 2V14C8 15.5 6.5 17 5 17C3.5 17 2 15.5 2 14C2 12.5 3.5 11 5 11C6 11 7 11.5 8 12V2L11 1V8L8 9"
      fill="currentColor"
    />
  </svg>,

  // Simple sun
  <svg
    key="sun1"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    className="text-orange-400"
  >
    <circle cx="10" cy="10" r="4" fill="currentColor" />
    <path
      d="M10 2V4M10 16V18M18 10H16M4 10H2M15.5 4.5L14 6M6 14L4.5 15.5M15.5 15.5L14 14M6 6L4.5 4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>,

  // Simple cloud
  <svg
    key="cloud1"
    width="24"
    height="16"
    viewBox="0 0 24 16"
    className="text-blue-300"
  >
    <path
      d="M6 14C3 14 1 12 1 9C1 6 3 4 6 4C7 2 9 1 11 1C14 1 16 3 16 6C18 6 20 8 20 10C20 12 18 14 16 14H6Z"
      fill="currentColor"
    />
  </svg>,
  // Leaf
  <svg
    key="leaf1"
    width="18"
    height="20"
    viewBox="0 0 18 20"
    className="text-green-500"
  >
    <path
      d="M2 18C2 18 6 14 9 10C12 6 16 2 16 2C16 2 14 6 12 9C10 12 6 16 2 18Z"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M2 18C4 16 6 14 8 12"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
  </svg>,

  // Diamond
  <svg
    key="diamond1"
    width="16"
    height="20"
    viewBox="0 0 16 20"
    className="text-cyan-400"
  >
    <path
      d="M8 2L12 6H4L8 2ZM4 6L8 18L12 6H4Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>,

  // Sparkle
  <svg
    key="sparkle1"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className="text-yellow-400"
  >
    <path
      d="M8 1L9 5L13 4L10 8L14 9L10 10L11 14L8 11L5 14L6 10L2 9L6 8L3 4L7 5L8 1Z"
      fill="currentColor"
    />
  </svg>,

  // Lightning bolt
  <svg
    key="lightning1"
    width="12"
    height="20"
    viewBox="0 0 12 20"
    className="text-yellow-500"
  >
    <path d="M7 1L2 9H6L5 19L10 11H6L7 1Z" fill="currentColor" />
  </svg>,

  // Crescent moon
  <svg
    key="moon1"
    width="16"
    height="18"
    viewBox="0 0 16 18"
    className="text-indigo-400"
  >
    <path
      d="M6 2C4 4 4 8 4 9C4 12 6 16 10 16C12 16 14 15 14 13C12 14 9 13 8 10C7 7 6 4 6 2Z"
      fill="currentColor"
    />
  </svg>,

  // Feather
  <svg
    key="feather1"
    width="8"
    height="24"
    viewBox="0 0 8 24"
    className="text-gray-500"
  >
    <path
      d="M4 2C4 2 2 4 2 8C2 12 3 16 4 20C5 16 6 12 6 8C6 4 4 2 4 2Z"
      fill="currentColor"
      opacity="0.7"
    />
    <path
      d="M2 8C3 8 4 8 4 8M4 8C5 8 6 8 6 8M2 10C3 10 4 10 4 10M4 10C5 10 6 10 6 10M2 12C3 12 4 12 4 12M4 12C5 12 6 12 6 12"
      stroke="currentColor"
      strokeWidth="0.5"
    />
  </svg>,

  // Constellation (3 connected stars)
  <svg
    key="constellation1"
    width="28"
    height="20"
    viewBox="0 0 28 20"
    className="text-blue-400"
  >
    <circle cx="4" cy="16" r="2" fill="currentColor" />
    <circle cx="14" cy="4" r="2" fill="currentColor" />
    <circle cx="24" cy="12" r="2" fill="currentColor" />
    <path
      d="M4 16L14 4L24 12"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.5"
    />
  </svg>,

  // Wave pattern
  <svg
    key="wave1"
    width="32"
    height="10"
    viewBox="0 0 32 10"
    className="text-blue-500"
  >
    <path
      d="M2 5C6 2 10 8 14 5C18 2 22 8 26 5C28 4 30 5 30 5"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>,

  // Mandala-inspired circle
  <svg
    key="mandala1"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    className="text-violet-500"
  >
    <circle
      cx="10"
      cy="10"
      r="8"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <circle cx="10" cy="10" r="4" fill="currentColor" opacity="0.6" />
    <circle cx="10" cy="2" r="1.5" fill="currentColor" />
    <circle cx="10" cy="18" r="1.5" fill="currentColor" />
    <circle cx="2" cy="10" r="1.5" fill="currentColor" />
    <circle cx="18" cy="10" r="1.5" fill="currentColor" />
  </svg>,

  // Paper plane
  <svg
    key="plane1"
    width="20"
    height="16"
    viewBox="0 0 20 16"
    className="text-sky-500"
  >
    <path
      d="M2 8L18 2L12 8L18 14L2 8ZM12 8L8 12"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,

  // Shooting star
  <svg
    key="shootingstar1"
    width="24"
    height="14"
    viewBox="0 0 24 14"
    className="text-yellow-400"
  >
    <path d="M20 4L22 6L20 8L18 6L20 4Z" fill="currentColor" />
    <path
      d="M18 6L12 8M16 4L8 6M14 8L4 10"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.7"
    />
  </svg>,
];

const getRandomDecorations = (count = 2) => {
  const shuffled = [...decorativeElements].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const DecorativeFiller = () => {
  return (
    <div className="flex-1 w-full flex items-center justify-center relative min-h-[60px]">
      <div className="flex items-center justify-center gap-5 opacity-60">
        {getRandomDecorations(Math.floor(Math.random() * 3) + 2).map(
          (element, idx) => (
            <div
              key={idx}
              className="transform"
              style={{
                transform: `rotate(${(Math.random() - 0.5) * 30}deg) scale(${
                  1 + Math.random() * 0.5
                })`,
              }}
            >
              {element}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DecorativeFiller;
