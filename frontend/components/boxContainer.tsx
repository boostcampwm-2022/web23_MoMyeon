import React, { PropsWithChildren } from "react";
interface Shape {
  width: string;
  height: string;
  overflow?: boolean;
}
function BoxContainer({
  children,
  width,
  height,
  overflow,
}: PropsWithChildren & Shape) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width,
        height,
        paddingBlock: "2rem",
        paddingInline: "2rem",
        border: "1px solid #D0D0D0",
        borderRadius: "20px",
        marginTop: "4rem",
        overflowY: overflow ? "scroll" : "hidden",
      }}
    >
      {children}
    </div>
  );
}

export default BoxContainer;
