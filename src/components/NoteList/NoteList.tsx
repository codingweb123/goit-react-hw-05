import css from "./NoteList.module.css"
import type { Note } from "../../types/note"
import { deleteNote } from "../../services/noteService"
import { Loading } from "notiflix"
import toast from "react-hot-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface NoteListProps {
	query: string
	page: number
	notes: Note[]
}

export default function NoteList({ query, page, notes }: NoteListProps) {
	const queryClient = useQueryClient()
	const noteDeletion = useMutation({
		mutationFn: async (id: string) => {
			const data = await deleteNote(id)
			return data
		},
		onSuccess: () => {
			Loading.remove()
			toast.success("Note has been successfully deleted!")
			queryClient.invalidateQueries({ queryKey: ["notes", query, page] })
		},
		onError: () => {
			Loading.remove()
			toast.error("Error occured while deleting note!")
		},
	})
	const onDelete = (id: string) => {
		Loading.hourglass()
		noteDeletion.mutate(id)
	}
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
