import { Option, Subject, SubjectToExamCategory } from "@prisma/client";
import { ExtendedChapterToExam, ExtendedExam, ExtendedExamCategory, ExtendedExamSection, ExtendedQuestion, ExtendedSubjectToExamCategory, PartialExam, SubjectWithChapters } from "./custom-interfaces";


export const transformExamCategoryResponse = (response: ExtendedExamCategory | null) => {
    if (!response) {
        return null;
    }
    const { subjectToExamCategories, ...rest } = response;

    return {
        ...rest,
        subjects: subjectToExamCategories.map((subject: ExtendedSubjectToExamCategory) => ({
            id: subject.subjectId,
            name: subject.subject?.name || '',
            description: subject.subject?.description || ''
        }))
    };
};


const getChaptersWithinSubjectsFromChapterToExam = (chapterToExams: ExtendedChapterToExam[]) : SubjectWithChapters[] => {

   // Create a map to group chapters by subject
  const subjectMap = new Map<string, SubjectWithChapters>();

  chapterToExams.forEach((chapterToExam) => {
    const { chapter } = chapterToExam;
    const { subjectId, subject } = chapter;

    // If the subject is not already in the map, add it
    if (!subjectMap.has(subjectId)) {
      subjectMap.set(subjectId, {
        name : subject.name,
        chapters: [],
      });
    }

    // Add the chapter to the subject's chapters array
    subjectMap.get(subjectId)!.chapters.push({
      name: chapter.name,
    });
  });

  // Convert the map to an array of subjects
  return Array.from(subjectMap.values());
}


const getAllSectionDataFromExamSection = (section: ExtendedExamSection) => {
    const {
        examId,
        subjectId,
        sectionConfigId,
        sectionConfig,
        questions,
        ...restSection
    } = section;

    // Remove examCategoryId from sectionConfig
    const { examCategoryId: _, ...restSectionConfig } = sectionConfig;

    // Transform questions
    const transformedQuestions = questions.map((question: ExtendedQuestion) => {
        const {
            examSectionId,
            options,
            answerExplanationField,
            ...restQuestion
        } = question;

        // Transform options
        const transformedOptions = options.map((option: Option) => {
            const { questionId, ...restOption } = option;
            return restOption;
        });

        // Transform answerExplanationField
        const { questionId: __, ...restAnswerExplanationField } = answerExplanationField || {};

        return {
            ...restQuestion,
            options: transformedOptions,
            answerExplanationField: restAnswerExplanationField,
        }
    });

    return {
        ...restSection,
        sectionConfig: restSectionConfig,
        questions: transformedQuestions,
    };

}

export const transformGetAllForEachExamResponse = (response: PartialExam) => {
    const {
        chapterToExams,
        ...rest
    } = response;

    // 2. Chapters array with field name and id, replacing chapterToExam
    const subjects = getChaptersWithinSubjectsFromChapterToExam(chapterToExams);

    return {
        ...rest,
        subjects,
    };
}

export const transformExamResponse = (response: ExtendedExam) => {
    const {
        examCategoryId,
        examSections,
        chapterToExams,
        ...rest
    } = response;

    // Handle null examCategory
    const examCategory = response.examCategory ? {
        id: response.examCategory.id,
        name: response.examCategory.name
    } : null;

    const subjects = getChaptersWithinSubjectsFromChapterToExam(chapterToExams);
    const transformedExamSections = examSections.map(getAllSectionDataFromExamSection);

    return {
        ...rest,
        examCategory, // Include examCategory in the response
        subjects,
        examSections: transformedExamSections,
    };
};

interface CourseInput {
    id: string;
    title: string;
    subtitle: string;
    thumbnailUrl: string;
    description: string | null;
    price: number;
    discount : number;
    level: string;
    courseCategories: { examCategory: { id : string, name: string } }[];
    courseExams: { exam: { id : string, title: string | null } }[];
    enrollments: { id: string }[];
}

export const transformCourseResponse = (course : CourseInput) => {
    return ({
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        thumbnailUrl : course.thumbnailUrl,
        description: course.description,
        price: course.price,
        discount : course.discount,
        level: course.level,
        examCategories: course.courseCategories.map(cat => ({
            id : cat.examCategory.id,
            name: cat.examCategory.name
        })),
        exams: course.courseExams.map(exam => ({
            id : exam.exam.id,
            title: exam.exam.title
        })),
        enrollmentCount: course.enrollments.length
    });
};