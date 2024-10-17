"use server";
import { MainForm } from "@/components/form/main-form";

function PageTest() {
  return (
    <MainForm
      message_button={"test"}
      dataForm={[
        {
          id: 0,
          type: "INPUT",
          name: "Title",
          placeholder: "Title",
          require: true,
        },
        {
          id: 1,
          type: "INPUT",
          name: "Subtitle",
          placeholder: "Subtitle",
          require: true,
        },
        {
          id: 2,
          type: "MEDIA",
          name: "Image",
          placeholder: "Featured Image",
          require: true,
        },
        {
          id: 3,
          type: "DINAMIC",
          name: "Text",
          placeholder: "Content",
          require: true,
        },

        {
          id: 4,
          type: "TEXTAREA",
          name: "Preview",
          placeholder: "Preview Summary",
          require: true,
        },
      ]}
      functionForm={console.log("active")}
    />
  );
}
export default PageTest;
