export interface OnboardingData {
  currentStep: number;
  completed: boolean;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  image: string;
}