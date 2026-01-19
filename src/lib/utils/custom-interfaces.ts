import { AnswerExplanationField, Chapter, ChapterToExam, Course, CourseToExamCategory, Exam, ExamCategory, ExamSection, Option, Question, SectionConfig, Subject, SubjectToExamCategory } from '@prisma/client';


// for any api response transformation
// this following includes db response interfaces
// for any "select" in db use 'Pick' or conversely 'Omit' for omitted attributes
// for any "include" in db use 'extends' from common type (present in prisma client) and then inside add additional relational attributes


export interface ReducedSubject extends Pick<Subject,'name'> {}
export interface ExtendedChapter extends Pick<Chapter,'id' | 'name' | 'subjectId'> {}


export interface ExtendedSubjectToExamCategory extends SubjectToExamCategory {
    subject : Subject;
}

export interface ExtendedExamCategory extends ExamCategory {
    subjectToExamCategories: ExtendedSubjectToExamCategory[];
}

export type ReducedExamCategory = Pick<ExamCategory, 'id' | 'name'>;

export interface ExtendedChapterToExam extends Pick<ChapterToExam,'id'> {
    chapter : (ExtendedChapter & {
        subject : ReducedSubject;
    })
}

export interface SubjectWithChapters {
    name : string;
    chapters: ({name : string})[];
}



export interface ExtendedQuestion extends Question {
    options : (Option)[];
    answerExplanationField : AnswerExplanationField | null;
}

export interface ExtendedExamSection extends ExamSection {
    subject : ReducedSubject | null;
    sectionConfig : SectionConfig;
    questions : ExtendedQuestion[];
}

export interface ReducedSectionConfig extends Pick<SectionConfig,'fullMarks'>{}

export interface ExtendedExamSectionWithReducedSectionConfig extends ExamSection {
    sectionConfig : ReducedSectionConfig;
    questions : ExtendedQuestion[];
}



export interface ExtendedExam extends Exam {
    examSections : ExtendedExamSection[];
    chapterToExams : ExtendedChapterToExam[];
    examCategory : ReducedExamCategory | null;
}


export interface PartialExam extends Pick<Exam,'id' | 'title' | 'totalDurationInSeconds' | 'totalQuestions' | 'totalMarks'> {
    chapterToExams : ExtendedChapterToExam[];
}


