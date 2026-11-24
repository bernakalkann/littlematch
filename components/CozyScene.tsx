export function CozyScene() {
  return (
    <div className="cozy-scene" aria-hidden="true">
      <div className="sunset-haze" />
      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />
      <div className="cloud cloud-three" />

      <div className="tree-crown tree-crown-a" />
      <div className="tree-crown tree-crown-b" />
      <div className="tree-crown tree-crown-c" />
      <div className="tree-trunk" />
      <div className="treehouse">
        <span className="treehouse-roof" />
        <span className="treehouse-window" />
        <span className="treehouse-lamp" />
      </div>

      <div className="light-string">
        {Array.from({ length: 8 }).map((_, index) => (
          <span className="bulb" key={index} />
        ))}
      </div>

      <div className="distant-hill hill-one" />
      <div className="distant-hill hill-two" />
      <div className="sea" />
      <div className="lighthouse">
        <span />
      </div>
      <div className="grass-bank" />

      <div className="mascot-stage">
        <svg
          className="mascot-illustration"
          viewBox="0 0 680 430"
          role="presentation"
        >
          <defs>
            <filter id="softWobble">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012"
                numOctaves="2"
                seed="7"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="2.8"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          <g filter="url(#softWobble)" stroke="#5a3d2e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
            <g className="record-player">
              <path fill="#b87542" d="M35 318c0-19 15-34 34-34h170c19 0 34 15 34 34v61H35z" />
              <ellipse fill="#3f342d" cx="143" cy="315" rx="79" ry="25" />
              <ellipse fill="#d8994f" cx="143" cy="315" rx="42" ry="12" />
              <circle fill="#f6d9a2" cx="143" cy="315" r="8" />
              <path d="M212 301c29-15 40-1 33 29" fill="none" />
            </g>

            <g className="dog-character">
              <path fill="#e7c095" d="M210 292c-15-70-2-156 57-194 43-28 118-11 143 43 29 62 14 142-28 186-39 42-149 32-172-35z" />
              <path fill="#8b694c" d="M238 115c-46 15-56 79-35 126 13 30 38 45 56 27 21-21 11-58 15-91 3-25 15-51-36-62z" />
              <path fill="#8b694c" d="M390 127c47 16 57 77 34 119-15 27-42 41-56 20-18-27-3-57-8-89-4-24-10-38 30-50z" />
              <path d="M285 190c10 8 21 8 31 0M339 190c10 8 21 8 31 0" fill="none" />
              <path d="M319 213c7 8 17 8 24 0m-12-2v12" fill="none" />
              <path fill="#bc6e42" d="M220 270c44-35 142-33 190 10l-30 102H247z" />
              <path d="M274 286c20 18 36 29 57 30 22 0 44-12 65-33" fill="none" stroke="#824b31" strokeWidth="6" />
              <path fill="#54463e" d="M196 129c7-45 42-74 82-72 21 1 38 7 55 19-35 18-62 48-76 84z" />
              <path fill="#54463e" d="M374 78c37 14 62 48 63 87l-45-3c-10-37-24-61-52-80z" />
              <path fill="none" d="M271 58c-30 8-55 31-64 61m181-35c31 15 49 43 51 76" stroke="#54463e" strokeWidth="16" />
            </g>

            <g className="cat-character">
              <path fill="#efc282" d="M420 301c-9-68-5-147 29-190l25-43 27 32c30-12 64-10 91 3l31-33 18 50c26 39 31 109 19 175-11 58-63 94-115 94-55 0-98-34-105-88z" />
              <path d="M476 182c11 10 24 10 35 0m55 0c11 10 24 10 35 0" fill="none" />
              <path d="M529 208c8 7 18 7 26 0m-13-3v15" fill="none" />
              <path d="M462 221l-24 7m28 10l-25 12m153-28l26 8m-29 10l25 14" fill="none" strokeWidth="5" />
              <path fill="#73805b" d="M415 290c55-24 161-22 220 7l-11 94H428z" />
              <path d="M451 318c38 23 108 22 146-3" fill="none" stroke="#596044" strokeWidth="6" />
              <path fill="#f8e5c6" d="M520 249h55l-6 60c-1 13-41 13-43 0z" />
              <path fill="#b75c43" d="M535 260c9-8 19-3 19 6 0-9 11-14 20-6 10 11-3 25-20 35-17-10-29-24-19-35z" strokeWidth="4" />
              <path d="M548 244c-5-14 2-23 10-31" fill="none" strokeWidth="4" />
            </g>

            <g className="books">
              <path fill="#a95e46" d="M346 366h105v25H346z" />
              <path fill="#d79a57" d="M329 392h123v24H329z" />
            </g>
          </g>
        </svg>
      </div>

      <div className="flower-field">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} className={"tiny-flower flower-" + (index + 1)}>✿</span>
        ))}
      </div>
    </div>
  );
}
