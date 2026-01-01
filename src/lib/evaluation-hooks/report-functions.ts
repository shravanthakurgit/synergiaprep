import { evaluate } from "./evaluate";

const baseUrl = "";
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function submitAttempt(userId : string,examId : string,userSubmissionId : string,timeTaken : number): Promise<unknown> {
    try {
        console.log("user submission id : ",userSubmissionId)
        const responseUs = await fetch(`${baseUrl}/api/v1/user-submissions/${userSubmissionId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        if(!responseUs.ok){
            throw await responseUs.json();
        }

        const userSubmission = await responseUs.json();
        
        
        const responseExam = await fetch(`${baseUrl}/api/v1/exams/${examId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        if(!responseExam.ok){
            throw await responseExam.json();
        }
        
        const exam = await responseExam.json();
        
        const evaluationResult = evaluate(userSubmission.data,exam.data);

        const responseSa = await fetch(`${baseUrl}/api/v1/reports/exams/${examId}/submit-attempt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({userId,userSubmissionId,...evaluationResult.result,timeTaken}),
        })
        
        if(!responseSa.ok){
            throw await responseSa.json();
        }

        const submitAttempt = await responseSa.json();

        return submitAttempt;
    
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

export async function generateReport(userId : string,examId : string) : Promise<unknown>{
    try {
        
        const responseGr = await fetch(`${baseUrl}/api/v1/reports/exams/${examId}/generate-report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({userId}),
        })

        if(!responseGr.ok){
            throw await responseGr.json();
        }

        const generateReport = await responseGr.json();

        return generateReport;

    } catch (error) {
        console.error(error);
        return error;
    }
}

// user-submission --> db save -> post --> user-submission-id,exam-id,user-id
// submit attempt
// generate report