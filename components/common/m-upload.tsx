import { useS3Upload } from "next-s3-upload";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Spinner } from "@nextui-org/spinner";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useStore } from "@/store";
import ImageNextFall from "../image-fallback/ImageNextFall";

const MUpload = observer(() => {
  const { FileInput, openFileDialog } = useS3Upload();
  const { token } = useStore();

  const store = useLocalObservable(() => ({
    autoObservable: true,
    imageUrl: "",
    loading: false,
  }));

  const handleFileChange = async (file: File) => {
    if (!file) {
      alert("No file selected");
      return;
    }

    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        return toast.error("File size exceeds limit, please upload a file smaller than 1MB");
      }
    }
    try {
      store.loading = true;
      token.setData({ createForm: { ...token.createForm, image: "" } });
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      try {
        const ipfsUrl = await uploadRequest.json();
        token.setData({ createForm: { ...token.createForm, image: ipfsUrl || "" } });
        store.loading = false;
      } catch (error) {
        toast.error("Failed to uploaded, please refresh page and try again");
        store.loading = false;
      }
    } catch (error) {
      toast.error("Failed to uploaded, please refresh page and try again");
      store.loading = false;
    }
  };

  return (
    <div className="w-full h-[10rem] border border-dashed border-[#004766]" onClick={openFileDialog}>
      <FileInput onChange={handleFileChange} accept="image/*" />
      {store.loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner color="primary" />
        </div>
      ) : token.createForm?.image ? (
        <div className="w-full h-full cursor-pointer flex items-center gap-8 p-2">
          <ImageNextFall className="w-[144px] h-[144px] overflow-hidden" alt="" src={token.createForm?.image} />
          <div className="flex items-center gap-4 mb-4 text-primary text-base font-semibold">
            <Icon icon="fa6-solid:upload" width="1.2rem" height="1.2rem" /> Change
          </div>
        </div>
      ) : (
        <div className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
          <div className="flex items-center gap-4 mb-4 text-primary text-base font-semibold">
            <Icon icon="fa6-solid:upload" width="1.2rem" height="1.2rem" /> Upload Image
          </div>
          <div className="text-xs font-semibold">JPEG/PNG/WEBP/GIF Less Than 1MB</div>
        </div>
      )}
    </div>
  );
});

export default MUpload;
