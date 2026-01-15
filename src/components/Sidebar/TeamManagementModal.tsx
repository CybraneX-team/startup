import React, { useEffect, useState, useMemo } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { UserData } from '../../context/interface.types'

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Employee {
  _id: string;
  roleName: string;
  salary: number;
  quantity: number;
  skinnedRolename: string;
}

// SVG Icons
const DeveloperIcon = () => (
  <svg width="150" height="80" viewBox="0 0 40 33" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.6532 25.4091C12.6532 19.1666 17.4767 14.1061 23.4267 14.1061H28.4903C34.4404 14.1061 39.2638 19.1666 39.2638 25.4091C39.2638 27.2818 37.8168 28.8 36.0318 28.8H15.8853C14.1002 28.8 12.6532 27.2818 12.6532 25.4091Z" fill="url(#paint0_linear_6544_117)" />
  <path d="M31.5608 5.87755C31.5608 9.12363 29.0525 11.7551 25.9585 11.7551C22.8645 11.7551 20.3563 9.12363 20.3563 5.87755C20.3563 2.63147 22.8645 0 25.9585 0C29.0525 0 31.5608 2.63147 31.5608 5.87755Z" fill="url(#paint1_linear_6544_117)" />
  <foreignObject x="-5.4" y="10.3695" width="34.8" height="27.6635">
    <div xmlns="http://www.w3.org/1999/xhtml" style={{ backdropFilter: "blur(2.7px)", clipPath: "url(#bgblur_0_6544_117_clip_path)", height: "100%", width: "100%" }}></div>
  </foreignObject>
  <path data-figma-bg-blur-radius="5.4" d="M23.9004 15.8691V30.6328C23.9004 31.6822 23.0493 32.5332 22 32.5332H2C0.950659 32.5332 0.0996094 31.6822 0.0996094 30.6328V15.8691H23.9004Z" fill="url(#paint2_linear_6544_117)" fillOpacity="0.3" stroke="url(#paint3_linear_6544_117)" strokeWidth="0.2" />
  <foreignObject x="-5.4" y="5.89175" width="34.8" height="14.5166">
    <div xmlns="http://www.w3.org/1999/xhtml" style={{ backdropFilter: "blur(2.7px)", clipPath: "url(#bgblur_1_6544_117_clip_path)", height: "100%", width: "100%" }}></div>
  </foreignObject>
  <path data-figma-bg-blur-radius="5.4" d="M2 11.3914H22C23.0493 11.3914 23.9004 12.2424 23.9004 13.2917V14.908H0.0996094V13.2917C0.0996094 12.2424 0.950659 11.3914 2 11.3914Z" fill="url(#paint4_linear_6544_117)" fillOpacity="0.3" stroke="url(#paint5_linear_6544_117)" strokeWidth="0.2" />
  <path d="M14.7499 21.3147L16.9293 23.4941C17.3199 23.8846 17.3199 24.5178 16.9293 24.9083L14.7499 27.0877" stroke="white" strokeWidth="0.8" strokeLinejoin="round" />
  <path d="M9.24994 21.3147L7.07055 23.4941C6.68003 23.8846 6.68003 24.5178 7.07055 24.9083L9.24994 27.0877" stroke="white" strokeWidth="0.8" strokeLinejoin="round" />
  <line x1="13.1864" y1="20.3141" x2="10.8326" y2="28.3141" stroke="white" strokeWidth="0.8" />
  <circle cx="2.5" cy="13.1499" r="0.5" fill="#FF5555" />
  <circle cx="4.09998" cy="13.1499" r="0.5" fill="#FFD555" />
  <circle cx="5.70001" cy="13.1499" r="0.5" fill="#55FF5B" />
  <defs>
    <clipPath id="bgblur_0_6544_117_clip_path" transform="translate(5.4 -10.3695)">
      <path d="M23.9004 15.8691V30.6328C23.9004 31.6822 23.0493 32.5332 22 32.5332H2C0.950659 32.5332 0.0996094 31.6822 0.0996094 30.6328V15.8691H23.9004Z" />
    </clipPath>
    <clipPath id="bgblur_1_6544_117_clip_path" transform="translate(5.4 -5.89175)">
      <path d="M2 11.3914H22C23.0493 11.3914 23.9004 12.2424 23.9004 13.2917V14.908H0.0996094V13.2917C0.0996094 12.2424 0.950659 11.3914 2 11.3914Z" />
    </clipPath>
    <linearGradient id="paint0_linear_6544_117" x1="20.6027" y1="3.18226" x2="34.7263" y2="29.4924" gradientUnits="userSpaceOnUse">
      <stop stopColor="#9FFFD9" />
      <stop offset="0.375" stopColor="#BEA6FF" />
      <stop offset="1" stopColor="#0088FF" />
    </linearGradient>
    <linearGradient id="paint1_linear_6544_117" x1="20.6027" y1="3.18226" x2="34.7263" y2="29.4924" gradientUnits="userSpaceOnUse">
      <stop stopColor="#9FFFD9" />
      <stop offset="0.375" stopColor="#BEA6FF" />
      <stop offset="1" stopColor="#0088FF" />
    </linearGradient>
    <linearGradient id="paint2_linear_6544_117" x1="1.41638" y1="11.3583" x2="23.6624" y2="32.6331" gradientUnits="userSpaceOnUse">
      <stop stopColor="#79FFD7" />
      <stop offset="0.275735" stopColor="#D8DBFF" />
      <stop offset="1" stopColor="#78D4FF" />
    </linearGradient>
    <linearGradient id="paint3_linear_6544_117" x1="0" y1="24.2013" x2="24" y2="24.2013" gradientUnits="userSpaceOnUse">
      <stop stopColor="white" />
      <stop offset="1" stopColor="#B7ECFF" />
    </linearGradient>
    <linearGradient id="paint4_linear_6544_117" x1="0" y1="13.15" x2="24" y2="13.15" gradientUnits="userSpaceOnUse">
      <stop stopColor="#79FFD7" />
      <stop offset="1" stopColor="#78D4FF" />
    </linearGradient>
    <linearGradient id="paint5_linear_6544_117" x1="0" y1="13.15" x2="24" y2="13.15" gradientUnits="userSpaceOnUse">
      <stop stopColor="white" />
      <stop offset="1" stopColor="#B7ECFF" />
    </linearGradient>
  </defs>
</svg>
);

const CEOIcon = () => (
  <svg width="170" height="100" viewBox="0 0 50 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: "-15px" }}>
    <g filter="url(#filter0_d_6544_111)">
      <path d="M11.5 36.9091C11.5 30.6666 16.3235 25.6061 22.2735 25.6061H27.3371C33.2872 25.6061 38.1106 30.6666 38.1106 36.9091C38.1106 38.7818 36.6636 40.3 34.8786 40.3H14.7321C12.947 40.3 11.5 38.7818 11.5 36.9091Z" fill="url(#paint0_linear_6544_111)" />
      <path d="M30.4076 17.3776C30.4076 20.6236 27.8993 23.2551 24.8053 23.2551C21.7113 23.2551 19.2031 20.6236 19.2031 17.3776C19.2031 14.1315 21.7113 11.5 24.8053 11.5C27.8993 11.5 30.4076 14.1315 30.4076 17.3776Z" fill="url(#paint1_linear_6544_111)" />
    </g>
    <foreignObject x="3.29834" y="31.9058" width="43.0139" height="16.7883">
      <div style={{ backdropFilter: 'blur(2px)', clipPath: 'url(#bgblur_0_6544_111_clip_path)', height: '100%', width: '100%' }}></div>
    </foreignObject>
    <rect data-figma-bg-blur-radius="4" x="7.39834" y="36.0058" width="34.8139" height="8.58833" rx="0.9" fill="url(#paint2_linear_6544_111)" fillOpacity="0.3" stroke="url(#paint3_linear_6544_111)" strokeWidth="0.2" />
    <g filter="url(#filter2_d_6544_111)">
      <path d="M24.6179 37.7364C24.6825 37.5629 24.928 37.5629 24.9927 37.7364L25.5143 39.1363C25.5424 39.2117 25.6129 39.2629 25.6932 39.2663L27.1858 39.3298C27.3708 39.3376 27.4467 39.5711 27.3016 39.6863L26.1314 40.6149C26.0684 40.6649 26.0415 40.7478 26.063 40.8252L26.4639 42.2643C26.5136 42.4428 26.315 42.5871 26.1607 42.4847L24.9159 41.6587C24.8489 41.6142 24.7617 41.6142 24.6947 41.6587L23.4499 42.4847C23.2956 42.5871 23.097 42.4428 23.1467 42.2643L23.5476 40.8252C23.5691 40.7478 23.5422 40.6649 23.4792 40.6149L22.309 39.6863C22.1639 39.5711 22.2398 39.3376 22.4248 39.3298L23.9174 39.2663C23.9977 39.2629 24.0682 39.2117 24.0963 39.1363L24.6179 37.7364Z" fill="white" />
    </g>
    <g filter="url(#filter3_d_6544_111)">
      <path d="M33.68 39.2809C33.7447 39.1073 33.9902 39.1073 34.0548 39.2809L34.3133 39.9745C34.3413 40.0498 34.4118 40.101 34.4922 40.1045L35.2317 40.1359C35.4168 40.1438 35.4926 40.3772 35.3475 40.4924L34.7677 40.9525C34.7047 41.0025 34.6778 41.0854 34.6994 41.1628L34.898 41.8759C34.9477 42.0543 34.7491 42.1986 34.5948 42.0962L33.978 41.6869C33.911 41.6425 33.8239 41.6425 33.7568 41.6869L33.1401 42.0962C32.9857 42.1986 32.7871 42.0543 32.8368 41.8759L33.0355 41.1628C33.057 41.0854 33.0301 41.0025 32.9671 40.9525L32.3873 40.4924C32.2422 40.3772 32.3181 40.1438 32.5031 40.1359L33.2427 40.1045C33.323 40.101 33.3935 40.0498 33.4216 39.9745L33.68 39.2809Z" fill="white" />
    </g>
    <g filter="url(#filter4_d_6544_111)">
      <path d="M15.5557 39.2809C15.6204 39.1073 15.8659 39.1073 15.9306 39.2809L16.189 39.9745C16.2171 40.0498 16.2876 40.101 16.3679 40.1045L17.1074 40.1359C17.2925 40.1438 17.3684 40.3772 17.2233 40.4924L16.6435 40.9525C16.5805 41.0025 16.5535 41.0854 16.5751 41.1628L16.7737 41.8759C16.8235 42.0543 16.6248 42.1986 16.4705 42.0962L15.8537 41.6869C15.7867 41.6425 15.6996 41.6425 15.6326 41.6869L15.0158 42.0962C14.8615 42.1986 14.6629 42.0543 14.7126 41.8759L14.9112 41.1628C14.9328 41.0854 14.9059 41.0025 14.8429 40.9525L14.263 40.4924C14.118 40.3772 14.1938 40.1438 14.3789 40.1359L15.1184 40.1045C15.1988 40.101 15.2692 40.0498 15.2973 39.9745L15.5557 39.2809Z" fill="white" />
    </g>
    <defs>
      <filter id="filter0_d_6544_111" x="0" y="0" width="49.6107" height="51.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation="5.75" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.80625 0 0 0 0 0.354166 0 0 0 0.06 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6544_111" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6544_111" result="shape" />
      </filter>
      <clipPath id="bgblur_0_6544_111_clip_path" transform="translate(-3.29834 -31.9058)">
        <rect x="7.39834" y="36.0058" width="34.8139" height="8.58833" rx="0.9" />
      </clipPath>
      <filter id="filter2_d_6544_111" x="18.233" y="33.6062" width="13.1447" height="12.9126" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6544_111" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6544_111" result="shape" />
      </filter>
      <filter id="filter3_d_6544_111" x="28.3113" y="35.1506" width="11.1122" height="10.9797" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6544_111" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6544_111" result="shape" />
      </filter>
      <filter id="filter4_d_6544_111" x="10.1871" y="35.1506" width="11.1122" height="10.9797" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6544_111" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6544_111" result="shape" />
      </filter>
      <linearGradient id="paint0_linear_6544_111" x1="19.4495" y1="14.6823" x2="33.5731" y2="40.9924" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF948" />
        <stop offset="0.451923" stopColor="#FFC131" />
        <stop offset="1" stopColor="#FFE600" />
      </linearGradient>
      <linearGradient id="paint1_linear_6544_111" x1="19.4495" y1="14.6823" x2="33.5731" y2="40.9924" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF948" />
        <stop offset="0.451923" stopColor="#FFC131" />
        <stop offset="1" stopColor="#FFE600" />
      </linearGradient>
      <linearGradient id="paint2_linear_6544_111" x1="9.36472" y1="33.6069" x2="16.9727" y2="53.975" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFA179" />
        <stop offset="0.275735" stopColor="#FFEED8" />
        <stop offset="1" stopColor="#FFE136" />
      </linearGradient>
      <linearGradient id="paint3_linear_6544_111" x1="7.29834" y1="40.2999" x2="42.3123" y2="40.2999" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0.5" />
        <stop offset="1" stopColor="#FFDF5E" />
      </linearGradient>
    </defs>
  </svg>
);

const SalesIcon = () => (
  <svg width="150" height="80" viewBox="0 0 39 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.1377 25.4091C12.1377 19.1666 16.9612 14.1061 22.9112 14.1061H27.9748C33.9249 14.1061 38.7483 19.1666 38.7483 25.4091C38.7483 27.2818 37.3013 28.8 35.5163 28.8H15.3698C13.5847 28.8 12.1377 27.2818 12.1377 25.4091Z" fill="url(#paint0_linear_6544_103)" />
    <path d="M31.0453 5.87755C31.0453 9.12363 28.537 11.7551 25.443 11.7551C22.349 11.7551 19.8408 9.12363 19.8408 5.87755C19.8408 2.63147 22.349 0 25.443 0C28.537 0 31.0453 2.63147 31.0453 5.87755Z" fill="url(#paint1_linear_6544_103)" />
    <foreignObject x="-6" y="7.73315" width="38.886" height="30.8999">
      <div style={{ backdropFilter: "blur(3px)", clipPath: "url(#bgblur_0_6544_103_clip_path)", height: "100%", width: "100%" }}></div>
    </foreignObject>
    <rect data-figma-bg-blur-radius="6" x="0.1" y="13.8332" width="26.686" height="18.6999" rx="4.9" fill="url(#paint2_linear_6544_103)" fillOpacity="0.2" stroke="url(#paint3_linear_6544_103)" strokeWidth="0.2" />
    <g filter="url(#filter1_d_6544_103)">
      <path d="M16.3083 18.0409C16.8187 17.7938 17.4329 18.0206 17.6606 18.5399L18.8259 21.1981C18.9222 21.418 18.9359 21.6659 18.865 21.8953L16.6166 29.1688C16.4538 29.6955 15.895 29.9918 15.3679 29.8303L11.2241 28.56C10.6952 28.398 10.3983 27.8372 10.5614 27.3087L12.7904 20.0981C12.8724 19.8334 13.061 19.6146 13.3103 19.4938L16.3083 18.0409ZM16.3445 19.247C16.0383 19.3814 15.8989 19.7383 16.033 20.0446C16.1673 20.351 16.5246 20.491 16.831 20.3569C17.1375 20.2226 17.2773 19.8645 17.143 19.558C17.0085 19.2517 16.6509 19.1127 16.3445 19.247Z" fill="url(#paint4_linear_6544_103)" />
    </g>
    <g filter="url(#filter2_dd_6544_103)">
      <path d="M16.9593 18.0373C17.5259 18.016 17.9974 18.4703 17.9974 19.0373V21.9397C17.9974 22.1798 17.9104 22.4123 17.7533 22.594L12.7738 28.3528C12.4132 28.7698 11.7825 28.8167 11.3646 28.4573L8.07946 25.6301C7.66018 25.2693 7.61334 24.6365 7.97497 24.218L12.9115 18.509C13.0928 18.2995 13.3534 18.1748 13.6302 18.1643L16.9593 18.0373ZM16.5082 19.1565C16.1738 19.1567 15.9028 19.4275 15.9027 19.762C15.9027 20.0965 16.1737 20.3682 16.5082 20.3684C16.8428 20.3684 17.1146 20.0966 17.1146 19.762C17.1145 19.4274 16.8427 19.1565 16.5082 19.1565Z" fill="url(#paint5_linear_6544_103)" />
    </g>
    <path d="M11.594 24.6866L14.5587 21.241L14.7794 21.431L11.8147 24.8765L11.594 24.6866ZM14.4122 22.914C14.5134 22.7637 14.539 22.6014 14.489 22.4272C14.439 22.2531 14.3306 22.0942 14.1637 21.9506C14.0417 21.8456 13.9179 21.7734 13.7924 21.7341C13.6678 21.6957 13.5502 21.6889 13.4396 21.714C13.3299 21.7399 13.2373 21.7968 13.1616 21.8847C13.0983 21.9583 13.0614 22.0366 13.0508 22.1197C13.0419 22.2026 13.0502 22.2855 13.0757 22.3683C13.102 22.4503 13.136 22.5287 13.1778 22.6037C13.2202 22.6777 13.2613 22.7435 13.3008 22.8009L13.5159 23.1172C13.5715 23.1978 13.629 23.2925 13.6883 23.4014C13.7486 23.511 13.7944 23.6293 13.8257 23.7562C13.8588 23.883 13.8635 24.0136 13.84 24.1479C13.8165 24.2823 13.7492 24.4141 13.638 24.5433C13.5099 24.6923 13.355 24.7933 13.1735 24.8463C12.9929 24.9002 12.7976 24.8985 12.5877 24.8412C12.3786 24.7847 12.1682 24.6653 11.9565 24.4831C11.7591 24.3133 11.6155 24.1343 11.5259 23.9463C11.4371 23.7591 11.4005 23.573 11.416 23.388C11.4324 23.2038 11.5001 23.0317 11.619 22.8717L11.9636 23.1682C11.883 23.28 11.8439 23.3962 11.8462 23.5169C11.8502 23.6375 11.885 23.7549 11.9507 23.8692C12.018 23.9833 12.1064 24.0875 12.2159 24.1816C12.3433 24.2913 12.4754 24.3691 12.6124 24.415C12.75 24.4601 12.8805 24.4709 13.0038 24.4474C13.1279 24.423 13.2332 24.3605 13.3196 24.26C13.3984 24.1685 13.4369 24.072 13.4352 23.9706C13.4334 23.8691 13.4063 23.7646 13.3537 23.6569C13.3011 23.5492 13.238 23.4402 13.1642 23.3299L12.9085 22.9412C12.7464 22.6939 12.6519 22.4589 12.6252 22.2359C12.5984 22.013 12.6649 21.8087 12.8247 21.6229C12.9575 21.4686 13.115 21.3699 13.2973 21.3269C13.4812 21.2837 13.6715 21.2912 13.8681 21.3495C14.0663 21.4077 14.2534 21.5124 14.4292 21.6637C14.6069 21.8166 14.7374 21.9843 14.8208 22.1669C14.9049 22.3486 14.9403 22.529 14.9268 22.7079C14.9143 22.8876 14.8504 23.049 14.7353 23.1919L14.4122 22.914Z" fill="white" />
    <defs>
      <clipPath id="bgblur_0_6544_103_clip_path" transform="translate(6 -7.73315)">
        <rect x="0.1" y="13.8332" width="26.686" height="18.6999" rx="4.9" />
      </clipPath>
      <filter id="filter1_d_6544_103" x="6.51666" y="13.9409" width="16.393" height="19.9333" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.347756 0 0 0 0 0.869551 0 0 0 0.21 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6544_103" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6544_103" result="shape" />
      </filter>
      <filter id="filter2_dd_6544_103" x="3.73163" y="14.0366" width="18.2658" height="20.6624" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.347756 0 0 0 0 0.869551 0 0 0 0.21 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6544_103" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.56 0" />
        <feBlend mode="normal" in2="effect1_dropShadow_6544_103" result="effect2_dropShadow_6544_103" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6544_103" result="shape" />
      </filter>
      <linearGradient id="paint0_linear_6544_103" x1="20.0872" y1="3.18226" x2="34.2108" y2="29.4924" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FA9FFF" />
        <stop offset="0.375" stopColor="#FFB7CF" />
        <stop offset="1" stopColor="#FF0088" />
      </linearGradient>
      <linearGradient id="paint1_linear_6544_103" x1="20.0872" y1="3.18226" x2="34.2108" y2="29.4924" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FA9FFF" />
        <stop offset="0.375" stopColor="#FFB7CF" />
        <stop offset="1" stopColor="#FF0088" />
      </linearGradient>
      <linearGradient id="paint2_linear_6544_103" x1="26.886" y1="16.0163" x2="-0.513409" y2="28.851" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD7E6" />
        <stop offset="0.5" stopColor="#FF9AA2" />
        <stop offset="1" stopColor="#FF9AD7" />
      </linearGradient>
      <linearGradient id="paint3_linear_6544_103" x1="28.8624" y1="16.7355" x2="-1.22768e-06" y2="32.6331" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0.5" />
        <stop offset="1" stopColor="#FF8BC9" />
      </linearGradient>
      <linearGradient id="paint4_linear_6544_103" x1="12.5578" y1="19.6843" x2="16.8387" y2="29.4495" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBA0FF" />
        <stop offset="1" stopColor="#DD1CFF" />
      </linearGradient>
      <linearGradient id="paint5_linear_6544_103" x1="12.8645" y1="18.0366" x2="12.8645" y2="28.699" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBA0FF" />
        <stop offset="1" stopColor="#FF1C93" />
      </linearGradient>
    </defs>
  </svg>
);

const getRoleIcon = (roleName: string) => {
  const role = roleName.toLowerCase();
  if (role === "dev") return <DeveloperIcon />;
  if (role === "ceo") return <CEOIcon />;
  if (role === "sales") return <SalesIcon />;
  return null;
};

const TeamManagementModal = ({ isOpen, onClose }: TeamManagementModalProps) => {
  const { user, setUser, setUserState } = useUser();
  const { t } = useLanguage();
  const [team, setTeam] = useState<Employee[]>([]);
  const [maxEmployees, setMaxEmployees] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    if (user?.employeesAvailable?.[0]?.availableEmployes) {
      const availableEmployees = user.employeesAvailable[0].availableEmployes;
      const aiSkinnedEmployees = user.aiSkinnedEmployees;
      console.log("aiSkinnedEmployees", aiSkinnedEmployees) 
      const newTeam = availableEmployees.map((emp, idx) => {
        const existingMember = user.teamMembers.find((tm) => tm.roleName === emp.roleName);
        return {
          _id: emp._id,
          roleName: emp.roleName,
          skinnedRolename: aiSkinnedEmployees && aiSkinnedEmployees.length > idx && aiSkinnedEmployees[idx]?.roleName ? aiSkinnedEmployees[idx].roleName : "",
          salary: emp.salary,
          quantity: existingMember ? existingMember.quantity : 0, 
        };
      });

      setTeam(newTeam);
      setMaxEmployees(user.employeesAvailable[0].maximum_allowed_employess || 0);
      setTotalCount(newTeam.reduce((sum, emp) => sum + emp.quantity, 0));
    }
  }, [user]);

  const increaseCount = (roleName: string) => {
    if (totalCount < maxEmployees) {
      setTeam((prevTeam) =>
        prevTeam.map((emp) =>
          emp.roleName === roleName ? { ...emp, quantity: emp.quantity + 1 } : emp
        )
      );
      setTotalCount((prev) => prev + 1);
    }
  };

  const decreaseCount = (roleName: string) => {
    setTeam((prevTeam) =>
      prevTeam.map((emp) =>
        emp.roleName === roleName ? { ...emp, quantity: Math.max(emp.quantity - 1, 0) } : emp
      )
    );
    setTotalCount((prev) => Math.max(prev - 1, 0));
  };

  const totalCost = useMemo(() => {
    return team.reduce((sum, emp) => sum + (emp.salary * emp.quantity), 0);
  }, [team]);

  const handleConfirm = () => {
    const newTeamMembers = team.map((emp) => ({
      _id: emp._id,
      roleName: emp.roleName,
      quantity: emp.quantity,
      salary: emp.salary,
    }));
  
    if (!user) return;
  
    const updatedUser: UserData = {
      ...user,
      teamMembers: newTeamMembers,
    };
  
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    setUserState(updatedUser);
  
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center mx-7 lg:mx-0">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div
        className="relative w-full max-w-4xl rounded-2xl bg-[#1B1B1D96] border border-white/10 p-6 shadow-lg backdrop-blur-sm bg-opacity-70"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{t("modals.teamManagement.title")}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Team Cards */}
        <div className="flex gap-4 mb-6 flex-wrap sm:flex-nowrap">
          {team.map((member, index) => {
            const roleName = user?.aiSkinnedEmployees && user?.aiSkinnedEmployees[index]?.actualName
              ? user.aiSkinnedEmployees[index].actualName
              : member.roleName;
            
            return (
              <div
                key={index}
                className="flex-1 min-w-[80px] rounded-xl bg-[#161618] p-4 flex flex-col"
              >
                <div className="flex w-full">
                  {/* Price on left */}
                  <div className="text-grey font-light text-md mb-0 mr-2 flex items-start absolute">
                    ${member.salary}
                  </div>
                  {/* Everything else centered */}
                  <div className="flex-1 flex flex-col items-center mt-10">
                    {/* Icon */}
                    <div className="mb-3 py-14 flex items-center justify-center h-16">
                      {getRoleIcon(member.roleName)}
                    </div>
                    {/* Role Name */}
                    <div className="text-white text-xl font-medium mb-4 capitalize">
                      {roleName}
                    </div>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-auto">
                      <button
                        className={`w-10 h-10 rounded-md flex items-center justify-center text-white transition-colors ${
                          member.roleName === "ceo" || member.quantity <= 0
                            ? "opacity-50 cursor-not-allowed bg-gray-600"
                            : "bg-[#1C2E5B] hover:bg-[#2A3F5F]"
                        }`}
                        onClick={() => decreaseCount(member.roleName)}
                        disabled={member.roleName === "ceo" || member.quantity <= 0}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-white font-semibold text-xl min-w-[24px] text-center">
                        {member.quantity}
                      </span>
                      <button
                        className={`w-10 h-10 rounded-md flex items-center justify-center text-white transition-colors ${
                          member.roleName === "ceo" || totalCount >= maxEmployees
                            ? "opacity-50 cursor-not-allowed bg-gray-600"
                            : "bg-[#1C2E5B] hover:bg-[#2A3F5F]"
                        }`}
                        onClick={() => increaseCount(member.roleName)}
                        disabled={member.roleName === "ceo" || totalCount >= maxEmployees}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center space-x-96">
          {/* Total Cost Button */}
          <button
            className="flex-1 rounded-3xl bg-[#24303F] hover:bg-[#2A3F5F] py-3 px-4 text-white font-medium transition-colors"
            disabled
          >
            +${totalCost}
          </button>
          
          {/* Confirm Button */}
          <button
            className="flex-1 rounded-3xl bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 py-3 px-4 text-white font-medium transition-all"
            onClick={handleConfirm}
          >
            {t("modals.teamManagement.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamManagementModal;
