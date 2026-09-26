"use client";

import * as React from "react";
import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Label } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/images";
import {
  deleteVehicleImageAction,
  reorderVehicleImageAction,
  setCoverImageAction,
  uploadVehicleImagesAction,
  type ImageActionState,
} from "@/lib/actions/vehicle-images";

export interface ManagedImage {
  id: string;
  storage_path: string;
  display_order: number;
  is_cover: boolean;
}

const initialState: ImageActionState = {};
const MAX_FILES = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Vehicle photograph manager.
 *
 * - Drag-and-drop or file-picker selection with local previews before upload.
 * - Client-side pre-checks (count / size / type) mirror the authoritative
 *   server-side magic-byte validation; the server remains the deciding party.
 * - Cover selection, reordering and removal are explicit server actions.
 */
export function ImageManager({
  vehicleId,
  images,
  editable,
}: {
  vehicleId: string;
  images: ManagedImage[];
  editable: boolean;
}) {
  const [state, formAction] = useActionState(uploadVehicleImagesAction, initialState);
  const [selected, setSelected] = React.useState<File[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const previews = React.useMemo(
    () => selected.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [selected]
  );

  // Revoke object URLs when the selection changes or the component unmounts.
  React.useEffect(() => {
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setLocalError(null);

    const incoming = Array.from(fileList);
    if (selected.length + incoming.length > MAX_FILES) {
      setLocalError(`You can upload at most ${MAX_FILES} photographs at a time.`);
      return;
    }
    const tooBig = incoming.find((file) => file.size > 5 * 1024 * 1024);
    if (tooBig) {
      setLocalError(`"${tooBig.name}" is larger than the 5 MB limit.`);
      return;
    }
    const wrongType = incoming.find((file) => !ALLOWED_TYPES.includes(file.type));
    if (wrongType) {
      setLocalError(
        `"${wrongType.name}" is not a supported image. Use JPEG, PNG, WebP or AVIF. The server also verifies the real file content.`
      );
      return;
    }

    setSelected((current) => [...current, ...incoming]);
  }

  return (
    <div className="space-y-6">
      {!editable ? (
        <Alert tone="warning" title="Uploads disabled in demonstration mode">
          Photograph upload requires a connected Supabase project with the{" "}
          <code className="text-gold-200">vehicle-images</code> storage bucket. See the README for
          the setup steps.
        </Alert>
      ) : null}

      {images.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <ImageTile
              key={image.id}
              image={image}
              index={index}
              total={images.length}
              vehicleId={vehicleId}
              editable={editable}
            />
          ))}
        </ul>
      ) : (
        <p className="rounded-md border border-dashed border-graphite-600 px-4 py-6 text-center text-sm text-ink-400">
          No photographs yet. Upload the first image and it will become the cover.
        </p>
      )}

      {editable ? (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="vehicleId" value={vehicleId} />
          <UploadZone
            dragging={dragging}
            setDragging={setDragging}
            addFiles={addFiles}
            inputRef={inputRef}
          />

          {localError ? <Alert tone="error">{localError}</Alert> : null}
          {state.error ? <Alert tone="error">{state.error}</Alert> : null}
          {state.message ? <Alert tone="success">{state.message}</Alert> : null}
          {state.rejected && state.rejected.length > 0 ? (
            <Alert tone="warning" title="Some files were not uploaded">
              <ul className="list-inside list-disc space-y-1">
                {state.rejected.map((item) => (
                  <li key={`${item.name}-${item.reason}`}>
                    {item.name}: {item.reason}
                  </li>
                ))}
              </ul>
            </Alert>
          ) : null}

          <PreviewStrip previews={previews} setSelected={setSelected} />

          <div className="flex flex-wrap items-center gap-3">
            <UploadButton disabled={selected.length === 0} />
            <Button
              variant="ghost"
              onClick={() => {
                setSelected([]);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              Clear selection
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}


function UploadZone({
  dragging,
  setDragging,
  addFiles,
  inputRef,
}: {
  dragging: boolean;
  setDragging: (value: boolean) => void;
  addFiles: (files: FileList | null) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
      }}
      className={cn(
        "rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
        dragging ? "border-gold-400 bg-gold-500/5" : "border-graphite-600"
      )}
    >
      <UploadCloud aria-hidden className="mx-auto size-6 text-ink-500" />
      <Label htmlFor="images" className="mt-3 block cursor-pointer text-ink-200">
        <span className="text-sm font-medium text-gold-200 underline">Choose photographs</span> or
        drag and drop
      </Label>
      <p className="mt-1 text-xs text-ink-500">
        JPEG, PNG, WebP or AVIF · up to 5 MB each · maximum {MAX_FILES} files per upload
      </p>
      <input
        ref={inputRef}
        id="images"
        name="images"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={(e) => addFiles(e.target.files)}
        className="sr-only"
      />
    </div>
  );
}


function PreviewStrip({
  previews,
  setSelected,
}: {
  previews: Array<{ file: File; url: string }>;
  setSelected: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  if (previews.length === 0) return null;

  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-widest text-ink-500">
        Preview ({previews.length} selected)
      </p>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {previews.map((preview) => (
          <li
            key={preview.url}
            className="relative aspect-square overflow-hidden rounded-md border border-graphite-700"
          >
            <Image
              src={preview.url}
              alt={`Selected file preview: ${preview.file.name}`}
              fill
              unoptimized
              sizes="160px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => setSelected((current) => current.filter((f) => f !== preview.file))}
              aria-label={`Remove ${preview.file.name} from the upload`}
              className="absolute right-1 top-1 rounded-sm bg-graphite-950/85 p-1 text-ink-100 hover:text-danger"
            >
              <Trash2 aria-hidden className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UploadButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <>
      <Button type="submit" disabled={disabled || pending}>
        {pending ? <Loader2 aria-hidden className="animate-spin" /> : <UploadCloud aria-hidden />}
        {pending ? "Uploading…" : "Upload photographs"}
      </Button>
      {pending ? (
        <span role="status" className="text-xs text-ink-400">
          Validating and uploading images…
        </span>
      ) : null}
    </>
  );
}


function ImageTile({
  image,
  index,
  total,
  vehicleId,
  editable,
}: {
  image: ManagedImage;
  index: number;
  total: number;
  vehicleId: string;
  editable: boolean;
}) {
  return (
    <li
      className={cn(
        "overflow-hidden rounded-lg border bg-graphite-850",
        image.is_cover ? "border-gold-400" : "border-graphite-700"
      )}
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={resolveImageUrl(image.storage_path)}
          alt={`Vehicle photograph ${index + 1}${image.is_cover ? " (cover image)" : ""}`}
          fill
          sizes="240px"
          className="object-cover"
        />
        {image.is_cover ? (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-sm bg-gold-400 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-graphite-950">
            <Star aria-hidden className="size-3" />
            Cover
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-1 p-2">
        <span className="text-xs text-ink-500">#{index + 1}</span>
        <div className="flex items-center gap-1">
          <form action={reorderVehicleImageAction}>
            <input type="hidden" name="imageId" value={image.id} />
            <input type="hidden" name="vehicleId" value={vehicleId} />
            <input type="hidden" name="direction" value="up" />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!editable || index === 0}
              aria-label={`Move photograph ${index + 1} earlier`}
              className="px-2"
            >
              <ArrowUp aria-hidden />
            </Button>
          </form>
          <form action={reorderVehicleImageAction}>
            <input type="hidden" name="imageId" value={image.id} />
            <input type="hidden" name="vehicleId" value={vehicleId} />
            <input type="hidden" name="direction" value="down" />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!editable || index === total - 1}
              aria-label={`Move photograph ${index + 1} later`}
              className="px-2"
            >
              <ArrowDown aria-hidden />
            </Button>
          </form>
          {!image.is_cover ? (
            <form action={setCoverImageAction}>
              <input type="hidden" name="imageId" value={image.id} />
              <input type="hidden" name="vehicleId" value={vehicleId} />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                disabled={!editable}
                aria-label={`Make photograph ${index + 1} the cover image`}
                className="px-2"
              >
                <Star aria-hidden />
              </Button>
            </form>
          ) : null}
          <form action={deleteVehicleImageAction}>
            <input type="hidden" name="imageId" value={image.id} />
            <input type="hidden" name="vehicleId" value={vehicleId} />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!editable}
              aria-label={`Delete photograph ${index + 1}`}
              className="px-2 text-danger"
            >
              <Trash2 aria-hidden />
            </Button>
          </form>
        </div>
      </div>
    </li>
  );
}

