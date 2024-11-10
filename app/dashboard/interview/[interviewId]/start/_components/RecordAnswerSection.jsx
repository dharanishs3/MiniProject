"use client"
import useSpeechToText from 'react-hook-speech-to-text';
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModal';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';


function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
    const [userAnswer,setUserAnswer]=useState('');
    const {user}=useUser();
    const [loading,setLoading]=useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=>{
        results.map((result)=>(
            setUserAnswer(prevAns=>prevAns+result?.transcript)
        ))
      },[results])

       useEffect(()=>{
        if(!isRecording&&userAnswer.length>10){
            UpdateUserAnswer();
        }
        if(userAnswer?.length<10){
            setLoading(false);
            // toast('Error while saving your answer,Please record again')
            return ;
        }
       },[userAnswer])

      const StartStopRecording=async()=>{
        if(isRecording){  
            stopSpeechToText()
        }
        else{
            startSpeechToText();
        }
      }

      const UpdateUserAnswer=async()=>{
        console.log(userAnswer)
        setLoading(true);
        const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+
            ", User Answer:"+userAnswer+"Depends on question and user answer for given interview question "+
            " please give us rating for answer and feedback as area of improvement if any "+
            " in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

            const result=await chatSession.sendMessage(feedbackPrompt);
            const mockJsonResp=(result.response.text()).replace('```json','').replace('```','');
            console.log(mockJsonResp);
            const JsonFeedbackResp=JSON.parse(mockJsonResp);

            const resp=await db.insert(UserAnswer)
            .values({
                mockIdRef:interviewData?.mockId,
                question:mockInterviewQuestion[activeQuestionIndex]?.question,
                correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns:userAnswer,
                feedback:JsonFeedbackResp?.feedback,
                rating:JsonFeedbackResp?.rating,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-yyyy')

            })

            if(resp){
                toast('User Answer recorded successfully')
                setUserAnswer('');
                setResults([]);
            }
            setResults([]);
            setLoading(false);

      }

  return (
    <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col justify-center mt-20 items-center bg-black rounded-lg p-5'>
            <Image src={'/webcam.png'} width={200} height={200} 
            className='absolute'/>
            <Webcam
            mirrored={true}
            style={{
                height:300,
                width:'100%',
                zIndex:10,
            }}
            />
        </div>
        <Button  disabled={loading}
        variant="outline" className="my-10"
        onClick={StartStopRecording}
        >
            {isRecording?
            <h2 className='flex justify-center items-center text-red-600 gap-2'>
                <StopCircle/> Stop Recording....
            </h2>
            :
            <h2 className='flex justify-center items-center gap-2'><Mic/>Record Answer</h2>}</Button>
        
    </div>
  )
}

export default RecordAnswerSection