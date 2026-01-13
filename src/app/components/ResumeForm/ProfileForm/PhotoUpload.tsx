"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result as string));
      reader.addEventListener("error", reject);
      reader.readAsDataURL(blob);
    }, "image/jpeg");
  });
}

export const PhotoUpload = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImageSrc(reader.result as string);
          setIsModalOpen(true);
        });
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        dispatch(changeProfile({ field: "photo", value: croppedImage }));
        setIsModalOpen(false);
        setImageSrc("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      } catch (e) {
        console.error(e);
      }
    }
  }, [imageSrc, croppedAreaPixels, dispatch]);

  const handleRemove = useCallback(() => {
    dispatch(changeProfile({ field: "photo", value: "" }));
    dispatch(changeProfile({ field: "photoShape", value: "circle" }));
  }, [dispatch]);

  const handleShapeChange = useCallback(
    (shape: "circle" | "square") => {
      dispatch(changeProfile({ field: "photoShape", value: shape }));
    },
    [dispatch]
  );

  return (
    <>
      <div className="col-span-full flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Photo</label>
        {profile.photo ? (
          <div className="flex items-center gap-2">
            <div
              className={`h-16 w-16 overflow-hidden ${
                (profile.photoShape ?? "circle") === "circle" ? "rounded-full" : "rounded"
              } border-2 border-gray-300`}
            >
              <img
                src={profile.photo}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setImageSrc(profile.photo);
                setIsModalOpen(true);
              }}
              className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-red-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <PhotoIcon className="h-5 w-5" />
              <span>+picture</span>
            </div>
          </label>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Crop Photo
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setImageSrc("");
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCroppedAreaPixels(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {!imageSrc && (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Click to upload image
                      </span>
                    </div>
                  </label>
                </div>
              )}
              {imageSrc && (
                <>
                  <div className="relative w-full" style={{ height: "400px" }}>
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape={(profile.photoShape ?? "circle") === "circle" ? "round" : "rect"}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="mt-2">
                    <label className="cursor-pointer inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <span className="text-sm text-blue-600 hover:text-blue-800 underline">
                        Change image
                      </span>
                    </label>
                  </div>
                </>
              )}
              <div className="mt-4 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Shape:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleShapeChange("circle")}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      (profile.photoShape ?? "circle") === "circle"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Circle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShapeChange("square")}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      (profile.photoShape ?? "circle") === "square"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Square
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setImageSrc("");
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCroppedAreaPixels(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
