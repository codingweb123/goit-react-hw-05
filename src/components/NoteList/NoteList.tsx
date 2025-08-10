import css from "./NoteList.module.css"
import type { Note } from "../../types/note"

interface NoteListProps {
	notes: Note[]
	onDelete: (id: string) => void
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
	return (
		<ul className={css.list}>
			{notes.map(({ id, title, content, tag }) => {
				return (
					<li key={id} className={css.listItem}>
						<h2 className={css.title}>{title}</h2>
						<p className={css.content}>{content}</p>
						<div className={css.footer}>
							<span className={css.tag}>{tag}</span>
							<button className={css.button} onClick={() => onDelete(id)}>
								Delete
							</button>
						</div>
					</li>
				)
			})}
		</ul>
	)
}
