import { Link, type LinkProps, useLocation } from "react-router-dom";

export type NavLinkProps = LinkProps;

export function Navlink(props: NavLinkProps) {
  const { pathname } = useLocation();

  const isActive = () => {
    const to = props.to?.toString() || "";

    if (to === "" || to === "/") {
      return pathname === "/" || pathname === "";
    }

    return pathname === `/${to}` || pathname.includes(to);
  };

  const active = isActive();

  return (
    <Link
      data-current={active}
      style={
        active
          ? {
              color: "black",
              backgroundColor: "#f3f4f6",
              fontWeight: "bold",
            }
          : {}
      }
      {...props}
    />
  );
}
