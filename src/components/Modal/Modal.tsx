import { createPortal } from "react-dom"
import css from "./Modal.module.css"
import { useEffect } from "react"
import NoteForm, { type InitialValues } from "../NoteForm/NoteForm"
import type { FormikHelpers } from "formik"

interface ModalProps {
	onClose: () => void
	onSubmit: (
		values: InitialValues,
		actions: FormikHelpers<InitialValues>
	) => void
}

export default function Modal({ onClose, onSubmit }: ModalProps) {
	const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose()
			}
		}
		document.addEventListener("keydown", handleKeyDown)
		document.body.style.overflow = "hidden"

		return () => {
			document.body.style.overflow = ""
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [onClose])

	return createPortal(
		<div
			className={css.backdrop}
			role="dialog"
			aria-modal="true"
			onClick={handleBackdrop}>
			<div className={css.modal}>
				<NoteForm onClose={onClose} onSubmit={onSubmit} />
			</div>
		</div>,
		document.body
	)
}
