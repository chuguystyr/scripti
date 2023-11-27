'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Schedule from '@/components/Schedule';
import TaskCard from '@/components/TaskCard';
import SetTask from '@/components/SetTask';

type HomeData = {
    name: string;
    done: number;
    schedule: {
        [key: string]: {
            course: string;
            type: string;
            teacher: string;
            link: string;
            room: string;
            lecturesLink: string;
            practicesLink: string;
            teacherLectures: string;
            teacherPractices: string;
          };
    },
    tasks: Array<{
        title: string;
        date: string;
        course: string;
        status: string;
        description: string;
        id: string;
    }>
}
const Home = ({data, quote}: {data: HomeData, quote:{text: string, author: string}}) => {
    const [time, setTime] = useState('');
    const dayMonth = new Date().toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' });
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB', { timeStyle: 'short' })), 1000);
        return function cleanup() {
            clearInterval(timer);
        }
    });
    const  {name, schedule, tasks, done} = data;
    const statistics = {
        inProgress: tasks.filter(task => task.status === 'in progress').length ?? 0,
        waiting: tasks.filter(task => task.status === 'new').length ?? 0,
        done: done ?? 0
    }
    const [newTaskClicked, setNewTaskClicked] = useState(false);
    return (
            
                <main className='flex flex-col md:flex-row gap-5 md:gap-10'>
                {newTaskClicked && <SetTask close={setNewTaskClicked}/>}
                    <section id='left' className='md:w-1/2'>
                        <section className='flex flex-col md:flex-row justify-between' id='greeting'>
                            <div className='card h-[15vh] w-fit'>
                                <h2>Hello, {name}</h2>
                                <p>{dayMonth} | {time}</p>
                            </div>
                            <div className='card h-[15vh] md:w-[55%] overflow-clip hover:h-fit hover:cursor-pointer'>
                                <p>{quote.text} <span className='block text-end font-semibold'>{quote.author}</span></p>
                            </div>
                        </section>
                        <section className='card mt-10 md:w-[44.7vw]' id='schedule'>
                            {
                            schedule ? <Schedule {...schedule} />
                            : <p className='text-center'>You don't have any classes set today. Happy weekend!
                            <br/>
                            If you need to add schedule please click <Link className='font-semibold hover:underline underline-offset-4' href='/protected/setSchedule'>here</Link></p>
                            }
                        </section>
                    </section>
                    <section id='right' className='md:w-1/2'>
                        <section id='statistics' className='flex md:flex-row gap-5 md:gap-10'>
                            {
                                <>
                                <p className='card text-center w-1/3 md:h-[15vh] md:w-[15vw]'>New <br/>{statistics.waiting}</p>
                                <p className='card text-center w-1/3 md:h-[15vh] md:w-[15vw]'>In progress <br/>{statistics.inProgress}</p>
                                <p className='card text-center w-1/3 md:h-[15vh] md:w-[15vw]'>Done <br/>{statistics.done}</p>
                                </>
                            }
                        </section>
                        <section className='mt-10 h-[55vh] flex flex-wrap gap-3' id='tasks'>
                            {tasks && tasks.length === 0 && <p className='card h-fit block mx-auto text-center'>Doddy is free!<br/>
                            If you need to add a task please click <button className='font-semibold hover:underline underline-offset-4' onClick={() => setNewTaskClicked(true)}>here</button></p>}
                            {tasks && tasks.length !== 0 && tasks.map((task, index) => <TaskCard key={index} {...task} />)}
                        </section>
                    </section>
                </main>
    );
}
export default Home;