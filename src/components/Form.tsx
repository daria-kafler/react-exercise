import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Button, TextField, Select } from "@cruk/cruk-react-components";
import { Dispatch, SetStateAction } from "react";
import { NasaSearchParams } from "../types";

export const formSchema = z.object({
  keywords: z.string()
  .min(2,"Keywords must have at least 2 characters.")  
  .max(50,"Keywords must have at most 50 characters."),
  mediaType: z.enum(["audio", "video", "image"], {
      errorMap: () => ({ message: "Please select a media type."})
  }),
  yearStart: z.string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      "Please enter a valid number."
    )
    .refine(
      (val) => !val || parseInt(val) >= 1900,
      "Year start must be after 1900."
    )
    .refine(
      (val) => !val || parseInt(val) <= new Date().getFullYear(),
      "Year start must not be in the future."
    )
});

export type FormValues = z.infer<typeof formSchema>;

export const initialData = {
  keywords: "",
  mediaType: "",
  yearStart: "",
} as unknown as FormValues;

export function Form({
  setValues,
}: {
  setValues: Dispatch<SetStateAction<NasaSearchParams | undefined>>;
}) {
  const formProps = useForm<FormValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "firstError",
    shouldFocusError: true,
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = formProps;

  const onSubmit: SubmitHandler<FormValues> = async (
    data,
    e,
  ): Promise<void> => {
    setValues({
      keywords: data.keywords,
      yearStart: data.yearStart ? parseInt(data.yearStart) : 1900,
      mediaType: data.mediaType,
    });
    };
    
  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Box marginBottom="m">
          <TextField
            {...register("keywords")}
            errorMessage={errors.keywords?.message}
            label="Keywords"
            required
          />
        </Box>
        {/* MEDIA TYPE */}
        <Box marginBottom="m">
          <Select
            {...register("mediaType")}
            errorMessage={errors.mediaType?.message}
            label="Media type"
            required
          >
            <option value="audio">audio</option>
            <option value="video">video</option>
            <option value="image">image</option>
          </Select>
        </Box>
        {/* YEAR START */}
        <Box marginBottom="m">
          <TextField
            {...register("yearStart")}
            errorMessage={errors.yearStart?.message}
            label="Year start"
            required={false}
          />
        </Box>
        <Box marginBottom="m">
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </>
  );
}
