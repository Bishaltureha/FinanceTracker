import * as React from 'react';
import Svg, {
  G,
  Path,
  Mask,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from 'react-native-svg';
const Logo = props => (
  <Svg
    width={141}
    height={30}
    viewBox="0 0 141 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#a)">
      <Path fill="#59a69f" d="M0 0h141v29.457H0z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.848 1.472 6.24 7.351a6.886 6.886 0 1 0 5.821 12.482l.215-.1 2.133-5.927-4.237 1.976a2.416 2.416 0 0 1-3.21-1.17l-.018-.035a2.416 2.416 0 0 1 1.186-3.175L16.715 7.4z"
        fill="url(#b)"
      />
      <Path
        d="M17.799 10.135c4.065-2.196 8.618-.674 10.225 2.773a6.887 6.887 0 0 1-3.33 9.152l-13.681 6.436 2.133-5.927 9.658-4.56a2.416 2.416 0 0 0 1.2-3.139l-.015-.036-.017-.036a2.416 2.416 0 0 0-3.21-1.169l-5.311 2.533 2.133-5.927z"
        fill="url(#c)"
      />
      <Mask
        id="d"
        style={{
          maskType: 'luminance',
        }}
        maskUnits="userSpaceOnUse"
        x={11}
        y={9}
        width={18}
        height={20}>
        <Path
          d="M17.799 10.135c4.065-2.196 8.618-.674 10.225 2.773a6.887 6.887 0 0 1-3.33 9.152l-13.681 6.436 2.133-5.927 9.658-4.56a2.416 2.416 0 0 0 1.2-3.139l-.015-.036-.017-.036a2.416 2.416 0 0 0-3.21-1.169l-5.311 2.533 2.133-5.927z"
          fill="#59a69f"
        />
      </Mask>
      <G mask="url(#d)" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M53.287 10.595V8.273H42.584l-.104.001c-2.425.048-4.374 1.754-4.374 3.852 0 2.128 2.005 3.853 4.478 3.853h7.422l.074.002c1.033.033 1.858.764 1.858 1.66 0 .918-.865 1.662-1.932 1.662h-10.55v2.323h10.55l.105-.001c2.509-.048 4.526-1.813 4.526-3.984 0-2.2-2.074-3.984-4.63-3.984h-7.423l-.073-.001c-.949-.033-1.706-.705-1.706-1.53 0-.845.797-1.53 1.78-1.53zm35.085-2.322v2.322H82.3v11.16h-2.7v-11.16h-6.073V8.273zm18.218 2.322V8.273H92.42v2.322h5.398v11.16h2.699v-11.16zm22.265-2.322h2.699v11.03H141v2.323h-12.145zm-16.869 0 5.327 6.164 5.502-6.164 3.341.045-7.503 8.412.037 4.888-2.655.015-.038-5.053-7.383-8.262z"
        fill="#141B31"
      />
      <Path
        fill="#141B31"
        d="M57.266 8.273h12.063v2.129H57.266zm0 5.677h12.063v2.129H57.266zm0 5.677h12.063v2.129H57.266z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={-0.882}
        y1={9.478}
        x2={3.962}
        y2={23.301}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#2FC5DB" />
        <Stop offset={1} stopColor="#00D080" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={25.687}
        y1={30.109}
        x2={29.587}
        y2={4.877}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#3F4BEE" />
        <Stop offset={1} stopColor="#00CBF2" />
      </LinearGradient>
      <ClipPath id="a">
        <Path fill="#59a69f" d="M0 0h141v29.457H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default Logo;
