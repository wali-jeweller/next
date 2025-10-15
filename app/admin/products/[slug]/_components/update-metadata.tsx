"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProductMetaDataAction } from "../actions";
import { metadataSchema } from "../types";

type FormValues = z.infer<typeof metadataSchema>;
type Props = {
	id: string;
	title?: string;
	description?: string;
};

export function UpdateMetadata(data: Props) {
	const [open, setOpen] = React.useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreVertical />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Product Metadata</DialogTitle>
					<DialogDescription>Metadata for SEO</DialogDescription>
				</DialogHeader>
				<CreateMetadataForm {...data} onSucess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

const CreateMetadataForm = ({
	id,
	title,
	description,
	onSucess,
}: Props & { onSucess: () => void }) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(metadataSchema),
		defaultValues: {
			id,
			title,
			description,
		},
	});

	const onSubmit = async (data: FormValues) => {
		try {
			await updateProductMetaDataAction(data);
			toast.success("Metadata updated successfully");
			onSucess();
		} catch (error) {
			toast.error("Error updating metadata");
			console.error(error);
		}
	};
	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>
									This is the title of the metadata. It should be descriptive
									and concise.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<Input {...field} />
								<FormDescription>
									Description of the metadata. It should provide more details
									about the metadata and its purpose.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<DialogFooter>
						<Button type="submit" loading={form.formState.isSubmitting}>
							Update Metadata
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</div>
	);
};
