import { Metadata } from 'next';
import PlatformPage from '@/app/platform/components/PlatformPage';

export const metadata: Metadata = {
  title: 'Learning Platform | Course Modules',
  description: 'Access your course modules and track your learning progress',
};

export default function Platform() {
  return (
    <>
      <PlatformPage />
    </>
  );
} 