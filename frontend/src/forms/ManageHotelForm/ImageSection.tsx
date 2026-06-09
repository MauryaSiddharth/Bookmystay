import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";

const ImageSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-800">Images</h2>

      <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 flex flex-col gap-4">
        <input
          type="file"
          multiple
          accept="image/*"
          className="
            w-full
            text-gray-700
            font-normal
            file:mr-4
            file:py-2
            file:px-4
            file:rounded-md
            file:border-0
            file:text-sm
            file:font-semibold
            file:bg-blue-50
            file:text-blue-800
            hover:file:bg-blue-100
            cursor-pointer
          "
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const files = imageFiles || [];

              if (files.length === 0) {
                return "At least one image should be added";
              }

              if (files.length > 6) {
                return "Total number of images cannot be more than 6";
              }

              return true;
            },
          })}
        />

        <p className="text-sm text-gray-500">
          Upload up to 6 images (JPEG, PNG, WEBP).
        </p>
      </div>

      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-semibold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImageSection;