import { Link, type LinkProps, useLocation } from "react-router-dom";

export type NavLinkProps = LinkProps;

export function Navlink(props: NavLinkProps) {
  const { pathname } = useLocation();

  const isActive = () => {
    const to = props.to?.toString() || "";

    // Para a rota /app (Dashboard), só ativa se o pathname for exatamente /app
    if (to === "/app") {
      return pathname === "/app";
    }

    // Para outras rotas, verifica se o pathname começa com a rota
    return pathname.startsWith(to);
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
