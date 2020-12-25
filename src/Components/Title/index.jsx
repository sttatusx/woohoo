import styles from "./Title.module.css"

function Title({ tag: Tag = "h2", title, summary }) {
  return (
    <>
    <Tag className={styles.Title}>{title}</Tag>
    <span className={styles.Summary}>{summary}</span>
    </>
  )
}

export default Title;