import { ButtonProps } from "../Button";

export const schema = `
  type Button @dontInfer {
    href: String!
    icon: String
    text: String
    variant: String
  }
`;

export interface ButtonFragment {
  href: string;
  icon?: string | null;
  text?: string | null;
  variant?: ButtonProps["variant"];
}
