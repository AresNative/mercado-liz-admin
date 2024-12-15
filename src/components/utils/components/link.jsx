import { Link } from "@nextui-org/react"

export const LinkInput = (props) => {
  const { cuestion } = props;
  return (
    <Link className="ml-auto" color="secondary" isExternal={cuestion.isExternal} showAnchorIcon href={cuestion.href}>
        {cuestion.placeholder}
    </Link>
  )
}