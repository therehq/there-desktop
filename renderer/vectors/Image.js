import React from 'react'

export default props => (
  <svg width={19} height={15} viewBox="0 0 101 82" {...props}>
    <g transform="translate(2778 -1316)">
      <mask id="image-a">
        <use
          fill="#fff"
          xlinkHref="#image-path0_fill"
          transform="translate(-2778 1316)"
        />
      </mask>
      <g mask="url(#image-a)">
        <use
          xlinkHref="#image-path1_stroke_2x"
          transform="translate(-2778 1316)"
          fill="white"
        />
      </g>
    </g>
    <use
      xlinkHref="#image-path2_fill"
      transform="translate(13 21)"
      fill="white"
    />
    <use
      xlinkHref="#image-path3_fill"
      transform="translate(69 15)"
      fill="white"
    />
    <defs>
      <path id="image-path0_fill" d="M0 0h101v82H0V0z" />
      <path
        id="image-path1_stroke_2x"
        d="M0 0v-6h-6v6h6zm101 0h6v-6h-6v6zm0 82v6h6v-6h-6zM0 82h-6v6h6v-6zM0 6h101V-6H0V6zm95-6v82h12V0H95zm6 76H0v12h101V76zM6 82V0H-6v82H6z"
      />
      <path
        id="image-path2_fill"
        d="M76 48H0L22.8 0l18.4 28.2 15.9-8.4L76 48z"
      />
      <path
        id="image-path3_fill"
        d="M17 8.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z"
      />
    </defs>
  </svg>
)
