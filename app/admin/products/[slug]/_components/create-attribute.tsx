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
import { createProductAttributeAction } from "../actions";
import { attributesSchema } from "../types";

type FormValues = z.infer<typeof attributesSchema>;

export function CreateAttribute({ productId }: { productId: string }) {
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
					<DialogTitle>Create Product Attribute</DialogTitle>
					<DialogDescription>
						Attribute for product like color, material etc.
					</DialogDescription>
				</DialogHeader>
				<CreateMetadataForm
					productId={productId}
					onSucess={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}

const CreateMetadataForm = ({
	productId,
	onSucess,
}: {
	productId: string;
	onSucess: () => void;
}) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(attributesSchema),
		defaultValues: {
			productId,
			name: "",
			value: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const res = await createProductAttributeAction(data);
		if (res?.error) {
			toast.error(res.error);
		}
		toast.success("Attribute created successfully");
		onSucess();
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Material" />
							</FormControl>
							<FormDescription>
								This is the name of the attribute. It should be descriptive and
								concise.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="value"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Value</FormLabel>
							<Input {...field} placeholder="This is made of glass" />
							<FormDescription>
								Value of the attribute. It should provide more details about the
								attribute and its purpose.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogFooter>
					<Button type="submit" loading={form.formState.isSubmitting}>
						Create Attribute
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
};
