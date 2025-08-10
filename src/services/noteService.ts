import axios from "axios"
import type { Note } from "../types/note"
axios.defaults.baseURL = "https://notehub-public.goit.study/api/"
axios.defaults.headers["Authorization"] = `Bearer ${
	import.meta.env.VITE_NOTEHUB_TOKEN
}`

type Tags = "Work" | "Personal" | "Meeting" | "Shopping" | "Todo" | undefined
type SortBy = "created" | "updated" | undefined

interface FetchNotes {
	notes: Note[]
	totalPages: number
}

interface Error {
	message: string
	error?: string
}

export const fetchNotes = async (
	search: string,
	page: number = 1,
	perPage: number = 10,
	tag?: Tags,
	sortBy?: SortBy
) => {
	const { data } = await axios<FetchNotes>("notes", {
		params: {
			search,
			page,
			perPage,
			tag,
			sortBy,
		},
	})
	return data
}

export const createNote = async (
	title: string,
	content: string,
	tag: string
) => {
	const { data } = await axios.post<Note | Error>("notes", {
		title,
		content,
		tag,
	})
	return data
}

export const deleteNote = async (id: string) => {
	const { data } = await axios.delete<Note | Error>(`notes/${id}`)
	return data
}
