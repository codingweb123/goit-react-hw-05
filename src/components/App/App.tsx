import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query"
import css from "./App.module.css"
import NoteList from "../NoteList/NoteList"
import { useDebouncedCallback } from "use-debounce"
import { useEffect, useState } from "react"
import { createNote, deleteNote, fetchNotes } from "../../services/noteService"
import Modal from "../Modal/Modal"
import Pagination from "../Pagination/Pagination"
import SearchBox from "../SearchBox/SearchBox"
import type { InitialValues } from "../NoteForm/NoteForm"
import type { FormikHelpers } from "formik"
import toast, { Toaster } from "react-hot-toast"
import { Loading } from "notiflix/build/notiflix-loading-aio"

export default function App() {
	const [query, setQuery] = useState<string>("")
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [page, setPage] = useState<number>(1)
	const queryClient = useQueryClient()
	const {
		data: notes,
		isSuccess,
		isLoading,
	} = useQuery({
		queryKey: ["notes", query, page],
		queryFn: () => fetchNotes(query, page),
		placeholderData: keepPreviousData,
	})
	const noteCreation = useMutation({
		mutationFn: async ({ title, content, tag }: InitialValues) => {
			const data = await createNote(title, content, tag)
			return data
		},
		onSuccess: () => {
			Loading.remove()
			toast.success("Note has been successfully created!")
			queryClient.invalidateQueries({ queryKey: ["notes", query, page] })
		},
		onError: () => {
			Loading.remove()
			toast.error("Error occured while creating note!")
		},
	})
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
	const totalPages = notes?.totalPages ?? 1
	const onQueryChange = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
		300
	)
	const formSubmit = (
		values: InitialValues,
		actions: FormikHelpers<InitialValues>
	) => {
		Loading.hourglass()
		noteCreation.mutate(values)
		setIsModalOpen(false)
		actions.resetForm()
	}
	const onDelete = (id: string) => {
		Loading.hourglass()
		noteDeletion.mutate(id)
	}

	useEffect(() => {
		if (isLoading) {
			Loading.hourglass()
		} else {
			Loading.remove()
		}
	}, [isLoading])

	return (
		<div className={css.app}>
			<Toaster />
			<header className={css.toolbar}>
				<SearchBox onChange={onQueryChange} />
				{totalPages > 1 && (
					<Pagination totalPages={totalPages} page={page} setPage={setPage} />
				)}
				<button className={css.button} onClick={() => setIsModalOpen(true)}>
					Create note +
				</button>
			</header>
			{isSuccess && notes && (
				<NoteList notes={notes.notes} onDelete={onDelete} />
			)}
			{isModalOpen && (
				<Modal onClose={() => setIsModalOpen(false)} onSubmit={formSubmit} />
			)}
		</div>
	)
}
