interface GlassContainerProps extends React.PropsWithChildren {
  disableHover?: boolean;
}

export default function GlassContainer({
  children,
  disableHover = false,
}: GlassContainerProps) {
  return (
    // add inline-block here to let div shrink to the size of its children
    <div className="inline-block rounded-lg bg-[#3d3464]">
      <div
        className={`cursor-pointer rounded-lg border-b border-[#4d4474] p-4 transition-colors ${disableHover ? "" : "hover:bg-[#4d4474]"}`}
      >
        {children}
      </div>
    </div>
  );
}
