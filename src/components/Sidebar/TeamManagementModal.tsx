import React, { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useUser } from "@/context/UserContext";
import {  roleIcons } from "../roleIcons";

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Employee {
  _id: string;
  roleName: string;
  salary: number;
  quantity: number;
}

const TeamManagementModal = ({ isOpen, onClose }: TeamManagementModalProps) => {
  const { user, setUser } = useUser();
  const [team, setTeam] = useState<Employee[]>([]);
  const [maxEmployees, setMaxEmployees] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    if (user?.employeesAvailable?.[0]?.availableEmployes) {
      const availableEmployees = user.employeesAvailable[0].availableEmployes;
      const newTeam = availableEmployees.map((emp) => {
        const existingMember = user.teamMembers.find((tm) => tm.roleName === emp.roleName);
        return {
          _id: emp._id,
          roleName: emp.roleName,
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

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("User is not authenticated. Please log in.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/editTeam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          teamData: team.reduce((acc, emp) => {
            acc[emp.roleName] = emp.quantity;
            return acc;
          }, {} as Record<string, number>),
          gameId: user?.gameId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const updatedUserData = await response.json();
      setUser(updatedUserData); 
      onClose();
    } catch (error) {
      console.error("❌ Error updating team:", error);
      alert("Failed to update team. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-xl font-semibold">Team Management</h2>

        {totalCount >= maxEmployees && (
          <p className="mb-4 text-sm text-red-500">
            You have reached the maximum team limit ({maxEmployees} employees)
          </p>
        )}

        <p className="mb-4 text-sm text-gray-600">Hire, fire, and manage</p>

        <div className="space-y-4">
          {team.map((member, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-gray-100 p-2">
                  {roleIcons[member.roleName] || <span>No Icon</span>}
                </div>
                <div>
                  <p className="text-sm font-medium">{member.roleName}</p>
                  {member.roleName === "ceo" && (
                    <p className="text-xs text-gray-500">Can replace any other role</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <button
                  className={`mr-2 text-gray-500 ${
                    member.roleName === "ceo" || member.quantity <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-gray-700"
                  }`}
                  onClick={() => decreaseCount(member.roleName)}
                  disabled={member.roleName === "ceo" || member.quantity <= 0}
                >
                  <Minus size={16} />
                </button>

                <span className="text-blue-500">{member.quantity}</span>

                <button
                  className={`ml-2 text-gray-500 ${
                    member.roleName === "ceo" || totalCount >= maxEmployees
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-gray-700"
                  }`}
                  onClick={() => increaseCount(member.roleName)}
                  disabled={member.roleName === "ceo" || totalCount >= maxEmployees}
                >
                  <Plus size={16} />
                </button>

                <span className="ml-4 text-sm font-medium">${member.salary}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full rounded-md bg-green-400 py-3 text-white hover:bg-green-500" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="w-full rounded-md border border-gray-300 py-3 text-gray-700 hover:bg-gray-50" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamManagementModal;
