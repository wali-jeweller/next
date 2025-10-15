"use client";

import { Copy, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ZoomableImage } from "@/components/zoomable-image";
import { deleteProductImageAction } from "../actions";

type ProductImage = {
	url: string;
	rank: number;
	alt?: string;
};

export function ImageItem({
	image,
	productId,
	children,
}: {
	image: ProductImage;
	productId: string;
	children?: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);

	const handleDelete = async () => {
		try {
			await deleteProductImageAction({
				imageUrl: image.url,
				productId,
			});
			toast.success("Image deleted successfully");
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete image");
		}
		setOpen(false);
	};
	return (
		<div className="group relative aspect-square">
			<DropdownMenu>
				<div className="relative h-full w-full overflow-hidden rounded-lg border-2 hover:ring">
					<ZoomableImage
						src={image.url}
						alt={image.alt || "Product image"}
						fill
						className="cursor-default object-cover"
						unoptimized
					/>
					<div className="absolute top-0 left-0">{children}</div>
					<DropdownMenuTrigger className="absolute top-0 right-0" asChild>
						<Button variant="ghost" size="icon" className="p-1">
							<MoreHorizontal className="text-black" />
						</Button>
					</DropdownMenuTrigger>
				</div>
				<DropdownMenuContent>
					<DropdownMenuItem
						onSelect={() => {
							navigator.clipboard.writeText(image.url);
							toast.success("Image URL copied");
						}}
					>
						<Copy />
						Copy Image URL
					</DropdownMenuItem>
					<DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
						<Trash2 />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. Do you want to delete this image?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete}>
							<Trash2 />
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
