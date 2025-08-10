import { Formik, Form, ErrorMessage, type FormikHelpers, Field } from "formik"
import css from "./NoteForm.module.css"
import * as Yup from "yup"

interface NoteFormProps {
	onSubmit: (
		values: InitialValues,
		actions: FormikHelpers<InitialValues>
	) => void
	onClose: () => void
}

const formTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const

export interface InitialValues {
	title: string
	content: string
	tag: (typeof formTags)[number]
}

const formScheme = Yup.object().shape({
	title: Yup.string()
		.min(3, "Title must be at least 3 characters")
		.max(50, "Title must be less or equal to 50 characters")
		.required("Title is required"),
	content: Yup.string().max(
		500,
		"Content must be less or equal to 500 characters"
	),
	tag: Yup.string().oneOf(formTags),
})

const initialValues: InitialValues = {
	title: "",
	content: "",
	tag: "Todo",
}

export default function NoteForm({ onSubmit, onClose }: NoteFormProps) {
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			validationSchema={formScheme}>
			<Form className={css.form}>
				<div className={css.formGroup}>
					<label htmlFor="title">Title</label>
					<Field type="text" name="title" id="title" className={css.input} />
					<ErrorMessage name="title" component="span" className={css.error} />
				</div>

				<div className={css.formGroup}>
					<label htmlFor="content">Content</label>
					<Field
						as="textarea"
						name="content"
						id="content"
						rows={8}
						className={css.textarea}
					/>
					<ErrorMessage name="content" component="span" className={css.error} />
				</div>

				<div className={css.formGroup}>
					<label htmlFor="tag">Tag</label>
					<Field as="select" name="tag" id="tag" className={css.select}>
						{formTags.map(tag => (
							<option key={tag} value={tag}>
								{tag}
							</option>
						))}
					</Field>
					<ErrorMessage name="tag" component="span" className={css.error} />
				</div>

				<div className={css.actions}>
					<button type="button" className={css.cancelButton} onClick={onClose}>
						Cancel
					</button>
					<button type="submit" className={css.submitButton}>
						Create note
					</button>
				</div>
			</Form>
		</Formik>
	)
}
