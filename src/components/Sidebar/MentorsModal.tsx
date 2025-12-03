"use client"
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import DealModal from "./dealModel";

interface MentorCardProps {
  title: string;
  description: string;
  conditions: string;
  benefits: string[];
  limitations: string[];
  isSelected?: boolean;
}

const MentorCard: React.FC<MentorCardProps> = ({
  title,
  description,
  conditions,
  benefits,
  limitations,
}) => {
  const [showDealModal, setShowDealModal] = useState(false);
  const {user, setUser, setUserState, setnotificationMessages, notificationMessages } = useUser()
  const { t } = useLanguage();

  const getInitials = (name: string) => {
    const parts = name?.split(" ").filter(Boolean) || [];
    if (parts.length === 0) return "M";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-red-500",
    ];
    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  async function signMentor(mentorName : string) {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hireMentor`,{
      method : "POST", 
      credentials: "include",
      body: JSON.stringify({
        mentorName : mentorName,
        gameId : user?.gameId
      }),
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("userToken")}`,
      }
    })

    if(request.ok){
      const response = await request.json()
      setUser(response) 
      setUserState(response)
      setnotificationMessages([...notificationMessages, ...response.message])
      setShowDealModal(false);
    }else {
      console.error(
        `Request failed with status ${request.status}: ${request.statusText}`,
      );
    }
  } 
  const isSigned = user?.myMentors.some((elem) => elem.mentorName === title);

  return (
    <>
      <div
        onClick={() => {
          if (!isSigned) setShowDealModal(true);
        }}
        className="min-w-[310px] lg:min-w-[350px] cursor-pointer 
        flex-none rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg transition dark:bg-[#24303F]"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className={`h-14 w-14 rounded-full ${getAvatarColor(title)} flex items-center justify-center flex-shrink-0`}>
            <span className="text-lg font-semibold text-white">
              {getInitials(title)}
            </span>
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-white flex-1">{title}</h3>
        </div>

        <p className="mb-6 text-sm w-70 lg:w-90 text-gray-600 dark:text-white">{description}</p>

        <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-white">{t("modals.mentors.conditions")}</span>
          <span className="text-sm font-medium text-blue-500">{conditions}%</span>
        </div>

        <div className="mb-3">
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-white">{t("modals.mentors.benefits")}</h4>
          <ul>
            <li className="flex items-start gap-2 text-sm text-blue-500">
              <span className="mt-1 h-2 w-2 flex-none rounded-full bg-blue-500"></span>
              {benefits}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-white">{t("modals.mentors.limitations")}</h4>
          <ul>
            <li className="flex items-start gap-2 text-sm text-blue-500">
              <span className="mt-1 h-2 w-2 flex-none rounded-full bg-blue-500"></span>
              {limitations}
            </li>
          </ul>
        </div>
        <div className="mt-4 text-right">
                  {user?.myMentors.some(
                    (element) => element.mentorName === title,
                  ) ? (
                    <span className="rounded border border-green-600 px-2 py-1 font-semibold text-green-600">
                      {t("modals.mentors.signed")}
                    </span> 
                  ): null
                }
          </div>
      </div>

      <DealModal
        isOpen={showDealModal}
        onClose={() => setShowDealModal(false)}
        mentorName={title}
        conditions={conditions.toString()}
        benefits={[benefits]}        // 👈 string → string[]
        limitations={[limitations]}  
        onSign={() => {
          signMentor(title)
        }}
      />
    </>
  );
};

// export default MentorCard;

interface MentorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MentorsModal: React.FC<MentorsModalProps> = ({ isOpen, onClose }) => {
  const {user} = useUser()
  const { t } = useLanguage();
  const [mentorsArray, setmentorsArray] = useState<any[]>([]);
  
    useEffect(() => {
      
      if (user) {
        const mentorsAvailable = user.mentorsAvailable || [];
        const myMentors = user.myMentors || [];
  
        const hasMatchingNames = myMentors.some((investmentMade) =>
          mentorsAvailable.some(
            (available) => available.name === investmentMade.name,
          ),
        );
  
        if (hasMatchingNames) {
          setmentorsArray([...mentorsAvailable, ...myMentors]);
        } else {
          setmentorsArray([...mentorsAvailable, ...myMentors]);
        }
      }
    }, [user]);
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-[99999] flex items-center justify-center">

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm " onClick={onClose}></div>
      
<div className="relative w-full max-w-4xl mx-4 sm:mx-auto my-6 rounded-xl bg-white p-6 shadow-lg dark:bg-boxdark max-h-[95vh] overflow-y-auto">
      {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#C5C7D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Modal header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-medium text-gray-800 dark:text-white">{t("modals.mentors.title")}</h2>
            <span className="text-2xl font-medium text-green-500">{user?.mentorsAvailable.length || 0}</span>
          </div>
          <p className="mt-2 text-sm  text-gray-600 dark:text-white">
            {t("modals.mentors.description")}
          </p>
         
        </div>
        
        {/* Scrollable cards container */}
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex flex-col lg:flex-row gap-4 ">
            {mentorsArray.map((mentor, index) => (
              <MentorCard
                key={index}
                title={mentor.mentorName}
                description={mentor.mentorDescription}
                conditions={mentor.share}
                benefits={mentor.skillDescription.benefit}
                limitations={mentor.skillDescription.limitation}
                // isSelected={index === 3} // For demo purposes, making the Developer Friend selected
              />
            ))}
          </div>
        </div>
        
        {/* Progress indicator */}
        {/* <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
          <div className="h-full w-3/4 rounded-full bg-blue-500"></div>
        </div> */}
      </div>
    </div>
  );
};

export default MentorsModal;