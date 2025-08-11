import { keepPreviousData, useQuery } from "@tanstack/react-query"
import css from "./App.module.css"
import NoteList from "../NoteList/NoteList"
import { useDebounce, useDebouncedCallback } from "use-debounce"
import { useEffect, useState } from "react"
import { fetchNotes } from "../../services/noteService"
import Modal from "../Modal/Modal"
import Pagination from "../Pagination/Pagination"
import SearchBox from "../SearchBox/SearchBox"
import { Loading } from "notiflix/build/notiflix-loading-aio"
import NoteForm from "../NoteForm/NoteForm"
import { Toaster } from "react-hot-toast"

export default function App() {
	const [query, setQuery] = useState<string>("")
	const [debouncedQuery] = useDebounce(query, 300)
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [page, setPage] = useState<number>(1)
	const {
		data: notes,
		isSuccess,
		isLoading,
	} = useQuery({
		queryKey: ["notes", debouncedQuery, page],
		queryFn: () => fetchNotes(debouncedQuery, page),
		placeholderData: keepPreviousData,
	})
	const totalPages = notes?.totalPages ?? 1
	const onQueryChange = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setPage(1)
			setQuery(e.target.value)
		},
		300
	)
	const handleClose = () => {
		setIsModalOpen(false)
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
				<NoteList query={debouncedQuery} page={page} notes={notes.notes} />
			)}
			{isModalOpen && (
				<Modal onClose={handleClose}>
					<NoteForm
						query={debouncedQuery}
						page={page}
						onSubmit={handleClose}
						onCancel={handleClose}
					/>
				</Modal>
			)}
		</div>
	)
}
