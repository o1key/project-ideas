import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cropper, { Area } from "react-easy-crop";
import { useAppDispatch } from "../../hooks";
import { useSelector } from "react-redux";
import { TUserState } from "../../types/user";
import { useState } from "react";
import { IPhoto } from "./ProfilePicture";
import toast from "react-hot-toast";
import { userActions } from "../../store/reducers/userReducers";
import { updateProfilePicture } from "../../services/user";
import getCroppedImg from "../../services/crop";

function CropEasy({
  photo,
  setOpenCrop,
}: {
  photo: IPhoto;
  setOpenCrop: (value: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const userState = useSelector((state: TUserState) => state.user);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setzoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      token,
      formData,
    }: {
      token: string;
      formData: FormData;
    }) => {
      return updateProfilePicture({
        token: token,
        formData: formData,
      });
    },
    onSuccess: (data) => {
      dispatch(userActions.setUserInfo(data));
      setOpenCrop(false);
      localStorage.setItem("account", JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile Photo is updated");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropImage = async () => {
    try {
      const croppedImg =
        photo?.url &&
        croppedAreaPixels &&
        ((await getCroppedImg(photo?.url, croppedAreaPixels)) as any);

      const file = new File([croppedImg?.file], `${photo?.file?.name}`, {
        type: photo?.file?.type,
      });

      const formData = new FormData();
      formData.append("profilePicture", file);

      mutate({ token: userState.userInfo.token, formData: formData });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="fixed z-[1000] inset-0 bg-black/50 flex justify-center p-5 overflow-auto">
      <div className="bg-white h-fit w-full sm:max-w-[350px] p-5 rounded-lg">
        <h2 className="font-semibold text-dark-hard mb-2">Crop Image</h2>
        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
          <Cropper
            image={photo?.url}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onZoomChange={setzoom}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div>
          <label
            htmlFor="zoomRage"
            className="block mt-2 mb-0.5 text-sm font-medium text-gray-900"
          >
            Zoom: {`${Math.round(zoom * 100)}%`}
          </label>
          <input
            type="range"
            id="zoomRange"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setzoom(Number(e.target.value))}
            className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
          />
        </div>
        <div className="flex justify-between gap-2 flex-wrap">
          <button
            disabled={isPending}
            onClick={() => setOpenCrop(false)}
            className="px-5 py-2.5 rounded-lg text-red-500 border border-red-500 text-sm disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={handleCropImage}
            className="px-5 py-2.5 rounded-lg text-white bg-blue-500 text-sm disabled:opacity-70"
          >
            Crop & Upload
          </button>
        </div>
      </div>
    </div>
  );
}
export default CropEasy;
