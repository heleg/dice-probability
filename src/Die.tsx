interface DieProps {
  children: number;
}

const Die = ({ children }: DieProps) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon
      points="50,5 90,30 90,70 50,95 10,70 10,30"
      fill="#a2d2ff"
      stroke="#023047"
      strokeWidth="4"
    />

    <text
      x="50"
      y="64"
      fontSize="40"
      fill="#023047"
      textAnchor="middle"
    >
      {children}
    </text>
  </svg>
);

export default Die;
