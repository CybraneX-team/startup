"use client"
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import DealModal from "./dealModel";
import { translateTaskName } from "@/utils/taskTranslator";

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
  const { t, language } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = useState(title);
  const [translatedDescription, setTranslatedDescription] = useState(description);
  const [translatedBenefits, setTranslatedBenefits] = useState<string[]>(Array.isArray(benefits) ? benefits : [benefits]);
  const [translatedLimitations, setTranslatedLimitations] = useState<string[]>(Array.isArray(limitations) ? limitations : [limitations]);
  const [isTranslating, setIsTranslating] = useState(false);

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

  // Translate mentor card content when language changes
  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedTitle(title);
        setTranslatedDescription(description);
        setTranslatedBenefits(Array.isArray(benefits) ? benefits : [benefits]);
        setTranslatedLimitations(Array.isArray(limitations) ? limitations : [limitations]);
        setIsTranslating(false);
        return;
      }

      setIsTranslating(true);
      try {
        const benefitsArray = Array.isArray(benefits) ? benefits : [benefits];
        const limitationsArray = Array.isArray(limitations) ? limitations : [limitations];

        const [titleTx, descTx, benefitsTx, limitationsTx] = await Promise.all([
          translateTaskName(title, language as any),
          translateTaskName(description, language as any),
          Promise.all(benefitsArray.map(b => translateTaskName(b, language as any))),
          Promise.all(limitationsArray.map(l => translateTaskName(l, language as any))),
        ]);

        setTranslatedTitle(titleTx);
        setTranslatedDescription(descTx);
        setTranslatedBenefits(benefitsTx);
        setTranslatedLimitations(limitationsTx);
      } catch (error) {
        console.warn('Failed to translate mentor content:', error);
        setTranslatedTitle(title);
        setTranslatedDescription(description);
        setTranslatedBenefits(Array.isArray(benefits) ? benefits : [benefits]);
        setTranslatedLimitations(Array.isArray(limitations) ? limitations : [limitations]);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [title, description, benefits, limitations, language]);

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
      <div className="w-full sm:w-[320px] flex-shrink-0 rounded-xl bg-[#161618] dark:bg-[#161618] p-5 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className={`h-16 w-16 rounded-full ${getAvatarColor(title)} flex items-center justify-center flex-shrink-0`}>
            <span className="text-xl font-semibold text-white">
              {getInitials(title)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
              {isTranslating ? t("common.loading") : translatedTitle}
            </h3>
          </div>
        </div>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          {isTranslating ? t("common.loading") : translatedDescription}
        </p>

        <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-white">{t("modals.mentors.conditions")}</span>
            <span className="text-blue-500">{conditions}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-white flex items-center">
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
              {t("modals.mentors.benefits")}
            </span>
          </div>
          {isTranslating ? (
            <p className="text-sm text-blue-500">{t("common.loading")}</p>
          ) : (
            translatedBenefits.map((benefit, idx) => (
              <p key={idx} className="text-sm text-blue-500 pl-4">
                • {benefit}
              </p>
            ))
          )}
          <div className="flex justify-between mt-2">
            <span className="text-gray-600 dark:text-white flex items-center">
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
              {t("modals.mentors.limitations")}
            </span>
          </div>
          {isTranslating ? (
            <p className="text-sm text-blue-500">{t("common.loading")}</p>
          ) : (
            translatedLimitations.map((limitation, idx) => (
              <p key={idx} className="text-sm text-blue-500 pl-4">
                • {limitation}
              </p>
            ))
          )}
        </div>

        <div className="mt-auto pt-6 text-right">
          {isSigned ? (
            <span className="rounded-full border border-green-600 px-4 py-2 text-sm font-semibold text-green-600">
              {t("modals.mentors.signed")}
            </span>
          ) : (
            <button
              onClick={() => setShowDealModal(true)}
              className="rounded-full bg-gradient-to-b from-[#F5D0FE] via-[#E9D5FF] to-[#DDD6FE] px-6 py-2.5 text-sm font-semibold text-gray-800 shadow-md hover:from-[#FCE7F3] hover:via-[#F3E8FF] hover:to-[#E9D5FF] transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-100"
            >
              Sign
            </button>
          )}
        </div>
      </div>

      <DealModal
        isOpen={showDealModal}
        onClose={() => setShowDealModal(false)}
        mentorName={translatedTitle}
        conditions={conditions.toString()}
        benefits={translatedBenefits}
        limitations={translatedLimitations}
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
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

    // Handle modal open/close animations
    useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
        setTimeout(() => setIsAnimating(true), 10);
      } else {
        setIsAnimating(false);
        const timer = setTimeout(() => setShouldRender(false), 300);
        return () => clearTimeout(timer);
      }
    }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center">
        {/* Full screen backdrop */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
        ></div>

        {/* Modal Container */}
        <div className={`relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-screen-xl max-h-[90vh] rounded-2xl bg-[#1B1B1D96] shadow-lg backdrop-blur-sm bg-opacity-70 border border-white/10 overflow-y-auto overflow-x-hidden mx-4 transition-all duration-300 ${
            isAnimating 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-4'
          }`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="p-4 sm:p-6 sticky top-0 z-40 rounded-2xl">
            <h2 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-white inline">
              {t("modals.mentors.title")}{" "}
            </h2>
          </div>

          {/* Cards */}
          <div className="sm:overflow-x-auto overflow-y-auto">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6 lg:w-80 sm:min-w-full items-stretch">
              {mentorsArray.map((mentor, index) => (
                <MentorCard
                  key={index}
                  title={mentor.mentorName}
                  description={mentor.mentorDescription}
                  conditions={mentor.share}
                  benefits={mentor.skillDescription.benefit}
                  limitations={mentor.skillDescription.limitation}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorsModal;