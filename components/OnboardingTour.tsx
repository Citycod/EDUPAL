'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

export default function OnboardingTour() {
    const [run, setRun] = useState(false);

    useEffect(() => {
        // Check if the user has seen the tour already
        const hasSeenTour = localStorage.getItem('edupal_has_seen_tour');
        if (!hasSeenTour) {
            setRun(true);
        }
    }, []);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        
        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('edupal_has_seen_tour', 'true');
        }
    };

    const steps: Step[] = [
        {
            target: '#tour-welcome',
            content: 'Welcome to EduPal! Let me give you a quick 30-second tour of your new academic dashboard.',
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '#tour-search',
            content: 'Looking for past questions? Just type your course code here (e.g. MTH 101) to find them instantly.',
            placement: 'bottom'
        },
        {
            target: '#tour-streak',
            content: 'Keep coming back daily to build your study streak! Your streak goes up every day you log in.',
            placement: 'bottom'
        },
        {
            target: '#tour-coach',
            content: 'Stuck on a topic? Chat with your AI Study Coach right here for instant explanations and study guides.',
            placement: 'top'
        },
        {
            target: '#tour-upload',
            content: 'Help your peers by uploading materials you have. You earn download credits and points for every upload!',
            placement: 'left'
        },
        {
            target: '#tour-nav-library',
            content: 'Tap the Library tab to browse and download all verified past questions and study materials for any course.',
            placement: 'top'
        },
        {
            target: '#tour-nav-ranks',
            content: 'Check the Ranks to see the top contributors in your school. You earn points by uploading materials!',
            placement: 'top'
        },
        {
            target: '#tour-nav-community',
            content: 'Join the Community forum to ask questions, discuss topics, and connect with other students.',
            placement: 'top'
        }
    ];

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: '#13ec6a', // EduPal Primary Green
                    textColor: '#slate-900',
                    zIndex: 10000,
                },
                tooltip: {
                    borderRadius: '24px',
                    padding: '24px',
                },
                buttonNext: {
                    borderRadius: '12px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '12px',
                    padding: '12px 24px'
                },
                buttonBack: {
                    color: '#64748b'
                },
                buttonSkip: {
                    color: '#94a3b8'
                }
            }}
        />
    );
}
