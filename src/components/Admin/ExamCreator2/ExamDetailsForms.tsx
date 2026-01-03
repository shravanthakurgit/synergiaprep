import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

// Extend the form values to include an optional "year" field.
interface ExamDetailsFormValues extends ExamDetails {
  year: string; // now required in the form state
}

export function ExamDetailsForm({
  ExamDetails,
  setCurrentStep,
  setExamDetails,
}: {
  ExamDetails: ExamDetails;
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
  setExamDetails: React.Dispatch<React.SetStateAction<ExamDetails>>;
}) {
  // Merge in default values for "year" and totalDurationInSeconds to ensure controlled inputs.
  const form = useForm<ExamDetailsFormValues>({
    defaultValues: {
      ...ExamDetails,
      year: "", // ensures the "year" field is controlled
      totalDurationInSeconds:
        ExamDetails.totalDurationInSeconds !== undefined
          ? ExamDetails.totalDurationInSeconds
          : 0, // provide a default value for the number input
    },
  });

  const examTypes = ["PYQ", "MOCK", "PRACTICE", "QUIZ", "BRAINSTORM"].map(
    (type, idx) => ({ id: idx, name: type })
  );

  const [examCategories, setExamCategories] = useState<
    { examPattern: string; description: string; id: string; name: string }[]
  >([]);

  const [isSubmit, setIsSubmit] = useState(false);

  // Watch examTypeId so we can conditionally render the Year input field
  const examTypeId = form.watch("examTypeId");
  const currentExamType = examTypes.find(
    (type) => type.id.toString() === examTypeId
  );

  function onSubmit(data: ExamDetailsFormValues) {
    setIsSubmit(true);
    const selectedExamType = examTypes.find(
      (type) => type.id === Number(data.examTypeId)
    );
    const selectedExamCategory = examCategories.find(
      (cat) => cat.id === data.examCategoryId
    );

    // If exam type is PYQ and a year is provided, append the year to the title
    let finalTitle = data.title;
    if (selectedExamType?.name === "PYQ" && data.year.trim()) {
      finalTitle = `${data.title} Year: ${data.year}`;
    }

    setExamDetails((prev) => ({
      ...prev,
      ...data,
      title: finalTitle,
      instruction: data.instruction,
      examType: selectedExamType?.name || "",
      examCategory: selectedExamCategory?.name || "",
    }));

    setCurrentStep("section");
  }

  useEffect(() => {
    form.reset({
      ...ExamDetails,
      year: "", // ensure year is reset as empty string
      totalDurationInSeconds:
        ExamDetails.totalDurationInSeconds !== undefined
          ? ExamDetails.totalDurationInSeconds
          : 0,
    });
  }, [ExamDetails, form]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [responseCategories] = await Promise.all([
          fetch("/api/v1/exam-categories"),
        ]);

        const [categoriesData] = await Promise.all([responseCategories.json()]);

        setExamCategories(
          categoriesData.data
            ? categoriesData.data
            : [
                {
                  examPattern: "NA",
                  description: "NA",
                  id: "NA",
                  name: "NA",
                },
              ]
        );
      
      } catch (error) {
        console.error("Error fetching exam details:", error);
        alert(
          "There was an issue fetching the exam details. Please try again."
        );
      }

      setIsSubmit(false)
    }
    fetchData();
  }, []);

  function handleCategoryChange(value: string) {
    const category = examCategories.find((cat) => cat.id === value);
    if (category) {
      setExamDetails((prev) => ({
        ...prev,
        examCategoryId: value,
        examCategory: category.name,
        instruction: `Pattern: ${category.examPattern}`,
        description: `${category.description} \nPattern: ${category.examPattern}`,
      }));
      form.setValue("examCategoryId", value);
    }
  }

  function handleExamTypeChange(value: string) {
    const examType = examTypes.find((type) => type.id === Number(value));
    if (examType) {
      setExamDetails((prev) => ({
        ...prev,
        examTypeId: value,
        examType: examType.name,
      }));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
        rules={{ required: "Title is required" }}
          control={form.control}
          name="title" 
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Title"
                  {...field}
                  onChange={(e) =>
                    setExamDetails((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <FormField
          rules={{ required: "Category is required" }}
            control={form.control}
            name="examCategoryId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Category *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCategoryChange(value);
                  }}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Exam Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {examCategories.map((examCategory) => (
                      <SelectItem key={examCategory.id} value={examCategory.id}>
                        {examCategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            rules={{ required: "Exam Type is required" }}
            name="examTypeId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Exam Type *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleExamTypeChange(value);
                  }}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue  placeholder="Select Exam Type " />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {examTypes.map((examType) => (
                      <SelectItem
                        key={examType.id}
                        value={examType.id.toString()}
                      >
                        {examType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Conditionally render the Year input if the selected exam type is PYQ */}
        {currentExamType?.name === "PYQ" && (
          <FormField

            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="text"  placeholder="Enter Year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
           rules={{
    required: "Exam duration is required",
    min: { value: 1, message: "Duration must be at least 1 second" },
  }}
          name="totalDurationInSeconds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Duration *</FormLabel>
              <FormControl >
                <Input
                  type="number"
                  placeholder="Exam Duration (in seconds)"
                  {...field}
                  value={field.value !== undefined ? field.value : ""}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{isSubmit ? "Submitting..." : "Submit"}</Button>
      </form>
    </Form>
  );
}
