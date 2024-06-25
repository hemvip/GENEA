import styles from "./styles.module.css"
import cn from "clsx"

const Loading = ({ color = "#000", className }) => {
  return (
    <span className={cn(styles.loading, className)}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  )
}

export default Loading
