const SmallGridIcon = ({ color, ...props }) => (
  <svg
    width={16}
    height={16}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <mask id='a' fill='#fff'>
      <rect x={2} y={2} width={5.333} height={5.333} rx={0.667} />
    </mask>
    <rect
      x={2}
      y={2}
      width={5.333}
      height={5.333}
      rx={0.667}
      stroke={color}
      strokeWidth={3}
      mask='url(#a)'
    />
    <mask id='b' fill='#fff'>
      <rect x={2} y={8.667} width={5.333} height={5.333} rx={0.667} />
    </mask>
    <rect
      x={2}
      y={8.667}
      width={5.333}
      height={5.333}
      rx={0.667}
      stroke={color}
      strokeWidth={3}
      mask='url(#b)'
    />
    <mask id='c' fill='#fff'>
      <rect x={8.666} y={2} width={5.333} height={5.333} rx={0.667} />
    </mask>
    <rect
      x={8.666}
      y={2}
      width={5.333}
      height={5.333}
      rx={0.667}
      stroke={color}
      strokeWidth={3}
      mask='url(#c)'
    />
    <mask id='d' fill='#fff'>
      <rect x={8.666} y={8.667} width={5.333} height={5.333} rx={0.667} />
    </mask>
    <rect
      x={8.666}
      y={8.667}
      width={5.333}
      height={5.333}
      rx={0.667}
      stroke={color}
      strokeWidth={3}
      mask='url(#d)'
    />
  </svg>
)

export default SmallGridIcon
