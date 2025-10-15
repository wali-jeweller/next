"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
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
import { updateProductAttributeAction } from "../actions";
import { attributesSchema } from "../types";

type AttributeWithRank = {
	name: string;
	value: string;
	rank: number;
};

type FormValues = z.infer<typeof attributesSchema>;

const AttributesForm = ({
	productId,
	attributeIndex,
	attribute,
	onSuccess,
}: {
	productId: string;
	attributeIndex: number;
	attribute: AttributeWithRank;
	onSuccess: () => void;
}) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(attributesSchema),
		defaultValues: {
			productId,
			name: attribute?.name || "",
			value: attribute?.value || "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const res = await updateProductAttributeAction({
			attributeIndex,
			...data,
		});
		if (res?.error) {
			toast.error(res.error);
		} else {
			toast.success("Attribute updated successfully");
		}
		onSuccess();
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
						Update Attribute
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
};

export { AttributesForm };
