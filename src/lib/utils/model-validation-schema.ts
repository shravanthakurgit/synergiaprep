import {
  CourseLevel,
  DifficultyLevel,
  ExamType,
  RoleType,
} from "@prisma/client";
import { z } from "zod";

// ************************************* Enums *********************************** //

export const RoleTypeValidationSchema = z.enum(
  Object.values(RoleType) as [keyof typeof RoleType]
);
export const DifficultyLevelValidationSchema = z.enum(
  Object.values(DifficultyLevel) as [keyof typeof DifficultyLevel]
);
export const ExamTypeValidationSchema = z.enum(
  Object.values(ExamType) as [keyof typeof ExamType]
);
export const CourseLevelValidationSchema = z.enum(
  Object.values(CourseLevel) as [keyof typeof CourseLevel]
);

// ************************************* Superadmin Validation *********************************** //

export const TargetUserChangeValidationSchema = z.object({
  targetUserRole: RoleTypeValidationSchema,
});

// ************************************* User Validation *********************************** //

export const UserUpdateValidationSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character").optional(),
  email: z.string().email("Invalid email format").optional(),
  image: z.string().url("Invalid image URL").nullable().optional(),
  ph_no: z.union([
    z.number()
      .int("Phone number must be an integer")
      .min(1000000000, "Phone number must be at least 10 digits")
      .max(999999999999999, "Phone number cannot exceed 15 digits"),
    z.null(),
  ]).optional(),
});

// ************************************* Subject , Chapter *********************************** //

export const SubjectCreateValidationSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
  })
  .strict();

export const SubjectUpdateValidationSchema =
  SubjectCreateValidationSchema.partial();

export const ChapterCreateValidationSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    subjectId: z.string(),
  })
  .strict();

export const ChapterUpdateValidationSchema =
  ChapterCreateValidationSchema.partial();

export const SubjectCreateWithChaptersValidationSchema = z.array(
  z.object({
    name: z.string(),
    description: z.string(),
    chapters: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    ),
  })
);

// ************************************* Exam category, type, and section config *********************************** //

export const ExamCategoryCreateValidationSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    eligibility: z.string().optional(),
    cutoffs: z.string().optional(),
    examPattern: z.string().optional(),
    subjectIds: z.array(z.string()),
  })
  .strict();

export const ExamCategoryUpdateValidationSchema =
  ExamCategoryCreateValidationSchema.partial();

export const SectionConfigCreateValidationSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    examCategoryId: z.string(),
    fullMarks: z.number().positive("Full Marks should be positive"),
    negativeMarks: z
      .number()
      .nonpositive("Negative Marks should be non-positive"),
    zeroMarks: z.number().default(0),
    partialMarks: z.array(z.number()).optional(),
  })
  .strict();

export const SectionConfigUpdateValidationSchema =
  SectionConfigCreateValidationSchema.partial();

// ************************************* Question, Option, Answer Explanation *********************************** //

export const OptionCreateValidationSchema = z
  .object({
    text: z.string().optional(),
    imageUrl: z.string().optional().nullable(),
    isCorrect: z.boolean(),
    questionId: z.string(),
  })
  .strict();

export const OptionUpdateValidationSchema =
  OptionCreateValidationSchema.partial();

export const AnswerExplanationFieldCreateValidationSchema = z
  .object({
    text: z.string().optional(),
    value: z.string().optional(),
    explanation: z.string().optional(),
    imageUrl: z.string().optional().nullable(),
    questionId: z.string(),
  })
  .strict();

export const AnswerExplanationFieldUpdateValidationSchema =
  AnswerExplanationFieldCreateValidationSchema.partial();

export const QuestionCreateValidationSchema = z
  .object({
    text: z.string().optional(),
    imageUrl: z.string().optional().nullable(),
    difficultyLevel: DifficultyLevelValidationSchema,
    examSectionId: z.string().optional(),
    chapterId: z.string(),
    options: z.array(
      OptionCreateValidationSchema.extend({
        questionId: z.string().optional(),
      })
    ),
    answerExplanationField: AnswerExplanationFieldCreateValidationSchema.extend(
      {
        questionId: z.string().optional(),
      }
    ),
  })
  .strict();

export const QuestionUpdateValidationSchema =
  QuestionCreateValidationSchema.partial();

// ************************************* Exam Section *********************************** //

const BaseExamSectionSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    isAllQuestionsMandatory: z.boolean().optional(),
    numberOfQuestionsToAttempt: z.number().positive().optional(),
    sectionConfigId: z.string(),
    examId: z.string(),
    subjectId: z.string().optional(),
    questions: z.array(
      QuestionCreateValidationSchema.extend({
        examSectionId: z.string().optional(),
      })
    ),
  })
  .strict();

export const ExamSectionCreateValidationSchema =
  BaseExamSectionSchema.superRefine((data, ctx) => {
    if (
      data.isAllQuestionsMandatory === false &&
      (data.numberOfQuestionsToAttempt == null ||
        data.numberOfQuestionsToAttempt <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "numberOfQuestionsToAttempt is required when isAllQuestionsMandatory is false",
        path: ["numberOfQuestionsToAttempt"],
      });
    }
  });

export const ExamSectionUpdateValidationSchema =
  BaseExamSectionSchema.partial().superRefine((data, ctx) => {
    if (
      data.isAllQuestionsMandatory === false &&
      (data.numberOfQuestionsToAttempt == null ||
        data.numberOfQuestionsToAttempt <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "numberOfQuestionsToAttempt is required when isAllQuestionsMandatory is false",
        path: ["numberOfQuestionsToAttempt"],
      });
    }
  });

// ************************************* Exam *********************************** //

const BaseExamValidationSchema = z
  .object({
    title: z.string().min(1),
    accessType: z.enum(["FREE", "PAID"]),
    instructions: z.string().optional(),
    description: z.string().optional(),
    isDraft: z.boolean().optional(),
    examType: ExamTypeValidationSchema,

    examCategoryId: z.string(),
    courseId: z.string().optional(), // <-- Add this
    totalDurationInSeconds: z.number().int().positive().optional(),
    examSections: z.array(
      BaseExamSectionSchema.extend({
        examId: z.string().optional(),
      })
    ),
  })
  .strict();


export const ExamCreateValidationSchema = BaseExamValidationSchema.superRefine(
  (data, ctx) => {
    data.examSections.forEach((section, index) => {
      if (
        section.isAllQuestionsMandatory === false &&
        (section.numberOfQuestionsToAttempt == null ||
          section.numberOfQuestionsToAttempt <= 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "numberOfQuestionsToAttempt is required when isAllQuestionsMandatory is false",
          path: ["examSections", index, "numberOfQuestionsToAttempt"],
        });
      }
    });
  }
);

export const ExamUpdateValidationSchema =
  BaseExamValidationSchema.partial().superRefine((data, ctx) => {
    data.examSections?.forEach((section, index) => {
      if (
        section.isAllQuestionsMandatory === false &&
        (section.numberOfQuestionsToAttempt == null ||
          section.numberOfQuestionsToAttempt <= 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "numberOfQuestionsToAttempt is required when isAllQuestionsMandatory is false",
          path: ["examSections", index, "numberOfQuestionsToAttempt"],
        });
      }
    });
  });

export const PracticeExamCreateValidationSchema = z
  .object({
    userId: z.string(),
    chapterId: z.string(),
    examCategoryId: z.string(),
    sectionConfigId: z.string(),
  })
  .strict();

// ************************************* User Submission *********************************** //

export const UserSubmissionCreateValidationSchema = z
  .object({
    userId: z.string().min(1, "userId is required"),
    examId: z.string().min(1, "examId is required"),
    userAnswerPerQuestions: z
      .array(
        z.object({
          value: z.string().optional(),
          isAttempted: z.boolean(),
          questionId: z.string().min(1, "questionId is required"),
          chosenOptions: z
            .array(
              z.object({ optionId: z.string().min(1, "optionId is required") })
            )
            .optional(),
        })
      )
      .min(1, "At least one userAnswerPerQuestion is required"),
  })
  .strict();

/********************************ANALYSIS *************************************** */

export const GenerateReportInputValidationSchema = z
  .object({
    userId: z.string(),
    userSubmissionId: z.string(),
  })
  .strict();

export const SubmitAttemptInputValidationSchema = z
  .object({
    userId: z.string(),
    userSubmissionId: z.string(),
    score: z.number(),
    accuracy: z.number(),
    attemptedQuestions: z.number().int(),
    correctAnswers: z.number().int(),
    incorrectAnswers: z.number().int(),
    timeTaken: z.number().int(),
  })
  .strict();

/************************ COURSE ************************** */

export const CourseCreateValidationSchema = z
  .object({
    title: z.string(),
    subtitle: z.string(),
    thumbnailUrl: z.string().optional().nullable(),
    description: z.string().optional(),
    price: z.number(),
    discount: z.number(),
    level: CourseLevelValidationSchema,
    examCategoryIds: z.array(z.string()),
    examIds: z.array(z.string()),
  })
  .strict();

export const CourseUpdateValidationSchema =
  CourseCreateValidationSchema.partial();

export const EnrollmentValidationSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  totalAmount: z.number(),
});