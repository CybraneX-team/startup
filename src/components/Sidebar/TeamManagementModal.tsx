import React, { useState } from "react";
import { Edit, Minus, Plus } from "lucide-react";

const TeamManagementModal = ({ isOpen, onClose }) => {
  const [team, setTeam] = useState([
    { role: "CEO", count: 1, salary: "$1,000", canReplace: true },
    { role: "Developer", count: 1, salary: "$1,200", canReplace: false },
    { role: "Sales", count: 1, salary: "$1,200", canReplace: false },
  ]);

  const increaseCount = (index) => {
    const updatedTeam = [...team];
    updatedTeam[index].count += 1;
    setTeam(updatedTeam);
  };

  const decreaseCount = (index) => {
    const updatedTeam = [...team];
    if (updatedTeam[index].count > 1 || !updatedTeam[index].canReplace) {
      updatedTeam[index].count -= 1;
      setTeam(updatedTeam);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop with click-away functionality */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-xl font-semibold">Team Management</h2>
        <p className="mb-4 text-sm text-red-500">
          You have reached maximum team limit (3 employees)
        </p>
        <p className="mb-4 text-sm text-gray-600">Hire, fire, manage</p>

        {/* Team Members List */}
        <div className="space-y-4">
          {team.map((member, index) => (
            <div key={index} className="flex items-center justify-between">
              {/* Role Icon and Name */}
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-gray-100 p-2">
                  {member.role === "CEO" ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  ) : member.role === "Developer" ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{member.role}</p>
                  {member.role === "CEO" && (
                    <p className="text-xs text-gray-500">
                      can replace any other role
                    </p>
                  )}
                </div>
              </div>

              {/* Count and Salary */}
              <div className="flex items-center">
                {/* Plus/Minus Controls for all roles including CEO */}
                {/* {member.count > 1 && (
                  <span className="text-red-500 mr-2">
                    -1
                  </span>
                )} */}
                <button
                  className={`mr-2 text-gray-500 hover:text-gray-700 ${member.count <= 1 && member.canReplace ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={() => decreaseCount(index)}
                  disabled={member.count <= 1 && member.canReplace}
                >
                  <Minus size={16} />
                </button>
                <span className="text-blue-500">{member.count}</span>
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => increaseCount(index)}
                >
                  <Plus size={16} />
                </button>
                {/* {index === 1 && member.count < 2 && ( // Special case for Developer to match screenshot
                  <span className="text-green-500 ml-2">
                    +1
                  </span>
                )} */}
                <span className="ml-4 text-sm font-medium">
                  {member.salary}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            className="w-full rounded-md bg-green-400 py-3 text-white hover:bg-green-500"
            onClick={onClose}
          >
            Confirm
          </button>
          <button
            className="w-full rounded-md border border-gray-300 py-3 text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamManagementModal;
