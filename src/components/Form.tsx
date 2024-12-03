"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, Select } from "@cruk/cruk-react-components";
import { Dispatch, SetStateAction, useState } from "react";
import { NasaSearchParams } from "../types";

/**
 * Zod schema for form validation.
 * Defines validation rules for search form fields:
 * - keywords: 2-50 characters
 * - mediaType: must be audio, video, or image
 * - yearStart: optional, must be valid year between 1900 and current year
 */
export const formSchema = z.object({
  keywords: z
    .string()
    .min(2, "Keywords must have at least 2 characters.")
    .max(50, "Keywords must have at most 50 characters."),
  mediaType: z.enum(["audio", "video", "image"], {
    errorMap: () => ({ message: "Please select a media type." }),
  }),
  yearStart: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), "Please enter a valid number.")
    .refine(
      (val) => !val || parseInt(val) >= 1900,
      "Year start must be after 1900.",
    )
    .refine(
      (val) => !val || parseInt(val) <= new Date().getFullYear(),
      "Year start must not be in the future.",
    ),
});

/** Type inference from the Zod schema for form values */
export type FormValues = z.infer<typeof formSchema>;

/** Initial form state with empty values */
export const initialData = {
  keywords: "",
  mediaType: "",
  yearStart: "",
} as unknown as FormValues;

/**
 * Search form component for NASA media library.
 * Features:
 * - Form validation using Zod
 * - Interface minimised after submission
 * - Real-time field validation
 * - Error messaging
 *
 * @param {Object} props - Component props
 * @param {Function} props.setValues - Callback to update search parameters
 */
export function Form({
  setValues,
}: {
  setValues: Dispatch<SetStateAction<NasaSearchParams | undefined>>;
}) {
  // State for minimised/expanded form view
  const [isminimised, setIsminimised] = useState(false);

  // Initialise form with react-hook-form
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
    watch,
  } = formProps;

  // Watch form values for minimised view
  const currentKeywords = watch("keywords");

  /**
   * Form submission handler
   * Converts form data to search parameters and minimises the form
   */
  const onSubmit: SubmitHandler<FormValues> = async (
    data,
    e,
  ): Promise<void> => {
    setValues({
      keywords: data.keywords,
      yearStart: data.yearStart ? parseInt(data.yearStart) : 1900,
      mediaType: data.mediaType,
    });
    setIsminimised(true);
  };

  // Render minimised form view
  if (isminimised) {
    return (
      <Box
        onClick={() => setIsminimised(false)}
        style={{ cursor: "pointer" }}
        data-testid="minimised-form"
      >
        <Box>
          <Box>
            <TextField label="" placeholder={currentKeywords}></TextField>
          </Box>
          <Button
            appearance="secondary"
            onClick={(e) => {
              e.stopPropagation();
              setIsminimised(false);
            }}
          >
            Change search
          </Button>
        </Box>
      </Box>
    );
  }
  // Render expanded form view
  return (
    <Box marginBottom="l" data-testid="expanded-form">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Box marginBottom="m">
          <TextField
            {...register("keywords")}
            errorMessage={errors.keywords?.message}
            isInvalidVisible={true}
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
            isInvalidVisible={true}
            label="Year start"
            required={false}
          />
        </Box>
        <Box marginBottom="m">
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </Box>
  );
}
