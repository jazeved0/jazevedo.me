import React from "react";
import styled from "@emotion/styled";
import {
  IconDefinition,
  IconName,
  IconPrefix,
  library,
} from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTwitch,
  faDocker,
  faReact,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faFileCode,
  faDownload,
  faHome,
  faChevronLeft,
  faInfoCircle,
  faExternalLinkAlt,
  faArchive,
  faMap,
  faFilePdf,
  faFilePowerpoint,
  faBoxes,
  faBook,
  faDatabase,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

import { csOverleaf, csGatsby } from "./custom-icons";

const icons: IconDefinition[] = [
  faGithub,
  faLinkedin,
  faEnvelope,
  faFileCode,
  faDownload,
  faHome,
  faChevronLeft,
  faInfoCircle,
  faExternalLinkAlt,
  faArchive,
  faMap,
  faFilePdf,
  faTwitch,
  faFilePowerpoint,
  faBoxes,
  faBook,
  csOverleaf,
  faDatabase,
  faDocker,
  faReact,
  csGatsby,
  faSun,
  faMoon,
];

library.add(...icons);
const prefixLookup = icons.reduce((map, icon) => {
  map.set(icon.iconName, icon.prefix);
  return map;
}, new Map<IconName, IconPrefix>());

const resolveClass = (name: IconName): [IconPrefix, IconName] => {
  return [prefixLookup.get(name) ?? "fas", name];
};

const Styled = {
  Wrapper: styled.span`
    display: inline-block;
    height: 1em;
    width: 1em;
  `,
  Icon: styled(FontAwesomeIcon)`
    /* The following styles normally get injected by the library at runtime,
    but to make things work better if JS is disabled, we duplicate them here */
    &.svg-inline--fa {
      display: inline-block;
      font-size: inherit;
      height: 1em;
      overflow: visible;
      vertical-align: -0.125em;
      overflow: visible;
    }

    &.svg-inline--fa.fa-w-16 {
      width: 1em;
    }
  `,
};

export type IconProps = {
  className?: string;
  style?: React.CSSProperties;
  // Accept more than an IconName so that custom icons can be used
  name: IconName | string;
};

/**
 * Renders a FontAwesome icon from a predetermined set of icons
 */
export default function Icon({
  className,
  style,
  name,
}: IconProps): React.ReactElement {
  return (
    <Styled.Wrapper className={className} style={style}>
      <Styled.Icon icon={resolveClass(name as IconName)} />
    </Styled.Wrapper>
  );
}
